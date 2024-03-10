import { AppError } from "../../../helpers/AppError.js";
import Cart from "../models/cart.model.js";
import ProductService from "./product.service.js";

class CartService {
  static createCart = async () => {
    return await Cart.create({ products: [] });
  };

  static getAllCarts = async () => {
    return await Cart.find();
  };

  static addProductToCart = async ({ cid, pid }) => {
    const foundCart = await Cart.findById(cid);
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
}

export default CartService;
