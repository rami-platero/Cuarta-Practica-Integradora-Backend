import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../../helpers/AppError.js";
import fs from "fs";
import { config } from "../../../config.js";
import ProductManager from "./product.manager.js";

class CartManager {
  constructor() {
    this.path = config.cartsPath;
  }

  readCart = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const cart = JSON.parse(data);
      return cart;
    } else {
      return [];
    }
  };

  createCart = async () => {
    const newCart = {
      id: uuidv4(),
      products: [],
    };

    const cart = await this.readCart();
    cart.push(newCart);

    const json = JSON.stringify(cart, null, 2);
    await fs.promises.writeFile(this.path, json);
  };

  getCartById = async (id) => {
    const carts = await this.readCart();
    const foundCart = carts.find((cart) => {
      return cart.id === id;
    });
    return foundCart;
  };

  addProductToCart = async ({ cid, pid }) => {
    if (isNaN(pid)) {
      throw new AppError(400, { message: "Product ID must be a number." });
    }

    const carts = await this.readCart();
    const foundCart = carts.find((cart) => {
      return cart.id === cid;
    });
    if (!foundCart) {
      throw new AppError(404, {
        message: "A cart with the specified ID does not exist.",
      });
    }

    const productManager = new ProductManager();
    const foundProduct = await productManager.getProductById(pid);
    if (!foundProduct) {
      throw new AppError(404, {
        message: "A product with the specified ID does not exist.",
      });
    }

    const productInCart = foundCart.products.some((p) => {
      return p.id === Number(pid);
    });

    if (!productInCart) {
      const newProduct = {
        id: Number(pid),
        quantity: 1,
      };

      foundCart.products.push(newProduct);
    } else {
      foundCart.products = foundCart.products.map((p) => {
        if (p.id === Number(pid)) {
          return { ...p, quantity: p.quantity + 1 };
        }
        return p;
      });
    }

    const udpatedCarts = carts.map((cart) => {
      if (cart.id === foundCart.id) {
        return foundCart;
      }
      return cart;
    });
    const json = JSON.stringify(udpatedCarts, null, 2);
    await fs.promises.writeFile(this.path, json);
  };
}

export default CartManager;
