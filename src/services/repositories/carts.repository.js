import { AppError } from "../../helpers/AppError.js";
import { EErrors } from "../errors/enums.js";

export default class CartsRepository {
  constructor(dao, productService, ticketService) {
    this.dao = dao;
    this.productService = productService;
    this.ticketService = ticketService;
  }

  createCart = async () => {
    return await this.dao.create();
  };

  getAllCarts = async () => {
    return await this.dao.findAll();
  };

  getCartByID = async (cid) => {
    return await this.dao.findById(cid);
  };

  addProductToCart = async ({ cid, pid, userEmail }) => {
    const foundCart = await this.dao.findById(cid);
    if (!foundCart) {
      throw new AppError({
        name: "Product addition error.",
        message: "Error while trying to add product to cart.",
        code: EErrors.NOT_FOUND,
        cause: "A cart with the specified ID does not exist.",
      });
    }

    const foundProduct = await this.productService.getProductById(pid);
    if (!foundProduct) {
      throw new AppError({
        name: "Product addition error.",
        message: "Error while trying to add product to cart.",
        code: EErrors.NOT_FOUND,
        cause: "A product with the specified ID does not exist.",
      });
    }

    if(userEmail === foundProduct.owner){
      throw new AppError({
        name: "Product addition error.",
        message: "Error while trying to add product to cart.",
        code: EErrors.UNAUTHORIZED,
        cause: "You can't add your own products to the cart!",
      });
    }

    const productInCart = foundCart.products.find((p) => {
      return p.product._id.toString() == pid;
    });

    if (!productInCart) {
      if (foundProduct.stock === 0) {
        throw new AppError({
          name: "Product addition error.",
          message: "Error while trying to add product to cart.",
          code: EErrors.STOCK_ERROR,
          cause: "This product is out of stock!",
        });
      }

      return await this.dao.addItem(cid, pid);
    } else {
      if (
        "stock" in productInCart.product &&
        productInCart.product.stock < productInCart.quantity + 1
      ) {
        throw new AppError({
          name: "Product addition error.",
          message: "Error while trying to add product to cart.",
          code: EErrors.STOCK_ERROR,
          cause: "The quantity you're trying to add exceeds the available stock for this product.",
        });
      }
      return await this.dao.increaseItemQuantity(cid, pid);
    }
  };

  removeProductFromCart = async ({ cid, pid }) => {
    const foundCart = await this.dao.findById(cid);
    if (!foundCart) {
      throw new AppError({
        name: "Cart product removal error.",
        message: "Error while trying to remove product from cart.",
        code: EErrors.NOT_FOUND,
        cause: "A cart with the specified ID does not exist.",
      });
    }

    const result = this.dao.removeItem(cid, pid);

    if (result.modifiedCount > 0) {
      return result;
    } else {
      throw new AppError({
        name: "Cart product removal error.",
        message: "Error while trying to remove product from cart.",
        code: EErrors.NOT_FOUND,
        cause: "A product with the specified ID does not exist.",
      });
    }
  };

  clearCart = async (cid) => {
    const result = this.dao.clearCart(cid);

    if (result.matchedCount === 0) {
      throw new AppError({
        name: "Clear cart error.",
        message: "Error while trying to clear cart.",
        code: EErrors.NOT_FOUND,
        cause: "A cart with the specified ID does not exist.",
      });
    } else {
      return result;
    }
  };

  updateProductQuantity = async ({ cid, pid }, newQuantity) => {
    const result = await this.dao.findOneAndUpdateQuantity(
      { cid, pid },
      newQuantity
    );

    if (!result) {
      throw new AppError({
        name: "Product quantity update error.",
        message: "Error while trying to update cart product quantity.",
        code: EErrors.NOT_FOUND,
        cause: "A Cart or Product with the specified ID does not exist.",
      });
    }

    return result;
  };

  updateCartProductsArray = async (cid, products) => {
    const foundCart = await this.dao.findById(cid);
    if (!foundCart) {
      throw new AppError({
        name: "Cart update error.",
        message: "Error while trying to update cart.",
        code: EErrors.NOT_FOUND,
        cause: "A cart with the specified ID does not exist.",
      });
    }

    for (const p of products) {
      const foundProduct = await this.productService.getProductById(p.product);

      if (!foundProduct) {
        throw new AppError({
          name: "Cart update error.",
          message: "Error while trying to update cart.",
          code: EErrors.NOT_FOUND,
          cause: `A product with the ID: ${p.product} does not exist.`,
        });
      }

      if (foundProduct.stock === 0) {
        throw new AppError({
          name: "Cart update error.",
          message: "Error while trying to update cart.",
          code: EErrors.STOCK_ERROR,
          cause: `Product with ID: ${foundProduct._id} can't be added to the cart because it's out of stock!`,
        });
      }

      if (foundProduct.stock < p.quantity) {
        throw new AppError({
          name: "Cart update error.",
          message: "Error while trying to update cart.",
          code: EErrors.STOCK_ERROR,
          cause: `Product with ID: ${foundProduct._id} can't be added to the cart because there are only ${foundProduct.stock} units available, and you are trying to add ${p.quantity} units`,
        });
      }
    }

    return await this.dao.findOneAndUpdateProducts(cid);
  };

  purchaseItems = async (cid, purchaserEmail) => {
    const foundCart = await this.dao.findById(cid);
    if (!foundCart) {
      throw new AppError({
        name: "Checkout error.",
        message: "Error while trying to purchase items.",
        code: EErrors.NOT_FOUND,
        cause: `A cart with the specified ID does not exist.`,
      });
    }

    let total = 0;
    const outOfStockItemsIds = [];

    for (const cartItem of foundCart.products) {
      const foundProduct = await this.productService.getProductById
      (
        cartItem.product._id
      );
      if (foundProduct.stock >= cartItem.quantity) {
        total += cartItem.quantity * foundProduct.price 

        const newStock = foundProduct.stock - cartItem.quantity;
        await this.productService.updateProductStock(
          foundProduct._id,
          newStock
        );
        await this.dao.removeItem(foundCart._id, foundProduct._id);
      } else {
        outOfStockItemsIds.push(cartItem.product._id);
      }
    }

    if (outOfStockItemsIds.length === foundCart.products.length) {
      throw new AppError({
        name: "Checkout error.",
        message: "Error while trying to purchase items.",
        code: EErrors.NOT_FOUND,
        cause: `All of the items in your cart are out of stock.`,
      });
    }
    return await this.ticketService.create(total, purchaserEmail);
  };
}
