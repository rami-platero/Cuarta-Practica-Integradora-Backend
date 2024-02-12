import { Router } from "express";
import CartManager from "../../CartManager.js";

const route = Router();
const cartManager = new CartManager()

route.post("/", async (_req, res, next) => {
  try {
    await cartManager.createCart()

    return res.status(200).json({message: "Created cart successfully."})
  } catch (error) {
    return next(error);
  }
});

route.get("/", async (_req,res,next) => {
  try {
    const carts = await cartManager.readCart()

    return res.status(200).json(carts)
  } catch (error) {
    return next(error)
  }
})

export default route;
