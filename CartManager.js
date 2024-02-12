import { v4 as uuidv4 } from "uuid";
import { AppError } from "./src/helpers/AppError.js";
import fs from 'fs'

class CartManager {
  constructor() {
    this.path = "./carts.json";
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

    const cart = await this.readCart()
    cart.push(newCart)

    const json = JSON.stringify(cart, null, 2);
    await fs.promises.writeFile(this.path,json)
  };


}

export default CartManager
