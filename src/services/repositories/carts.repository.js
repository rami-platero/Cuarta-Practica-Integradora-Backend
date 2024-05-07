import { AppError } from "../../helpers/AppError.js";

export default class CartsRepository {
  constructor(dao, productService) {
    this.dao = dao;
    this.productService = productService;
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

  addProductToCart = async ({ cid, pid }) => {
    /**
     * @type {import('../../../types/types.js').Cart | null}
     */
    const foundCart = await this.dao.findById(cid);
    if (!foundCart) {
      throw new AppError(404, {
        message: "A cart with the specified ID does not exist.",
      });
    }

    const foundProduct = await this.productService.getProductById(pid);
    if (!foundProduct) {
      throw new AppError(404, {
        message: "A product with the specified ID does not exist.",
      });
    }

    const productInCart = foundCart.products.find((p) => {
      return p.product == pid;
    });

    if (!productInCart) {
      if (foundProduct.stock === 0) {
        throw new AppError(400, { message: "This product is out of stock!" });
      }

      return await this.dao.addItem(cid, pid);
    } else {
      if (
        "stock" in productInCart.product &&
        productInCart.product.stock < productInCart.quantity + 1
      ) {
        throw new AppError(400, {
          message:
            "The quantity you're trying to add exceeds the available stock for this product.",
        });
      }

      return await this.dao.increaseItemQuantity(cid, pid);
    }
  };

  removeProductFromCart = async ({ cid, pid }) => {
    const foundCart = await this.dao.findById(cid);
    if (!foundCart) {
      throw new AppError(404, {
        message: "A cart with the specified ID does not exist.",
      });
    }

    const result = this.dao.removeItem(cid, pid);

    if (result.modifiedCount > 0) {
      return result;
    } else {
      throw new AppError(404, {
        message: "A product with the specified ID does not exist in the cart.",
      });
    }
  };

  clearCart = async (cid) => {
    const result = this.dao.clearCart(cid);

    if (result.matchedCount === 0) {
      throw new AppError(404, {
        message: "A cart with the specified ID does not exist.",
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
      throw new AppError(404, {
        message: "Cart or Product in the cart does not exist.",
      });
    }

    return result;
  };

  updateCartProductsArray = async (cid, products) => {
    const foundCart = await this.dao.findById(cid);
    if (!foundCart) {
      throw new AppError(404, {
        message: "A cart with the specified ID does not exist.",
      });
    }

    for (const p of products) {
      const foundProduct = await this.productService.getProductById(p.product);

      if (!foundProduct) {
        throw new AppError(404, {
          message: `Can't add product with ID: ${p.product} because it doesn't exist.`,
        });
      }

      if (foundProduct.stock === 0) {
        throw new AppError(400, {
          message: `Product with ID: ${foundProduct._id} can't be added to the cart because it's out of stock!`,
        });
      }

      if (foundProduct.stock < p.quantity) {
        throw new AppError(400, {
          message: `Product with ID: ${foundProduct._id} can't be added to the cart because there are only ${foundProduct.stock} units available, and you are trying to add ${p.quantity} units`,
        });
      }
    }

    return await this.dao.findOneAndUpdateProducts(cid);
  };
}
