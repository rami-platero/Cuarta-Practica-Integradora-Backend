import { AppError } from "../../../helpers/AppError.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ProductService from "./product.service.js";

class CartService {
  static createCart = async () => {
    return await Cart.create({ products: [] });
  };

  static getAllCarts = async () => {
    return await Cart.find();
  };

  static getCartByID = async (cid) => {
    return await Cart.findById(cid).populate("products.product").lean(true);
  };

  static addProductToCart = async ({ cid, pid }) => {
    const foundCart = await Cart.findById(cid).populate("products.product");
    if (!foundCart) {
      throw new AppError(404, {
        message: "A cart with the specified ID does not exist.",
      });
    }

    const foundProduct = await ProductService.getProductById(pid);
    if (!foundProduct) {
      throw new AppError(404, {
        message: "A product with the specified ID does not exist.",
      });
    }

    const productInCart = foundCart.products.some((p) => {
      return p.product == pid;
    });

    if (
      productInCart &&
      productInCart.product.stock < productInCart.quantity + 1
    ) {
      throw new AppError(400, {message: "The quantity you're trying to add exceeds the available stock for this product."})
    }

    if (!productInCart && foundProduct.stock === 0){
      throw new AppError(400, {message: "This product is out of stock!"})
    }

    if (!productInCart) {
        return await Cart.findByIdAndUpdate(
          cid,
          {
            $push: {
              products: {
                quantity: 1,
                product: pid,
              },
            },
          },
          { new: true }
        );
      } else {
        return await Cart.findOneAndUpdate(
          { _id: cid, "products.product": pid },
          {
            $inc: {
              "products.$.quantity": 1,
            },
          },
          { new: true }
        );
      }
  };

  static removeProductFromCart = async ({ cid, pid }) => {
    const foundCart = await Cart.findById(cid);
    if (!foundCart) {
      throw new AppError(404, {
        message: "A cart with the specified ID does not exist.",
      });
    }

    const result = await Cart.updateOne(
      { _id: cid },
      {
        $pull: {
          products: {
            product: pid,
          },
        },
      }
    );

    if (result.modifiedCount > 0) {
      return result;
    } else {
      throw new AppError(404, {
        message: "A product with the specified ID does not exist in the cart.",
      });
    }
  };

  static clearCart = async (cid) => {
    const result = await Cart.updateOne(
      { _id: cid },
      {
        $set: {
          products: [],
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new AppError(404, {
        message: "A cart with the specified ID does not exist.",
      });
    } else {
      return result;
    }
  };

  static updateProductQuantity = async ({ cid, pid }, newQuantity) => {
    const result = await Cart.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      {
        $set: {
          "products.$.quantity": newQuantity,
        },
      },
      { new: true }
    );

    if (!result) {
      throw new AppError(404, {
        message: "Cart or Product in the cart does not exist.",
      });
    }

    return result;
  };

  static updateCartProductsArray = async (cid, products) => {
    const foundCart = await Cart.findById(cid);
    if (!foundCart) {
      throw new AppError(404, {
        message: "A cart with the specified ID does not exist.",
      });
    }

    for (const p of products) {
      const foundProduct = await Product.findById(p.product);

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

    return await Cart.findOneAndUpdate(
      { _id: cid },
      {
        $set: {
          products,
        },
      },
      { new: true }
    );
  };
}

export default CartService;
