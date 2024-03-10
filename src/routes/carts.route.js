import { Router } from "express";
import { addProductToCart, createCart, getAllCarts } from "../controllers/carts.controller.js";
import { validateAddProductToCart } from "../middlewares/validate.js";

const route = Router();

route.post("/", createCart);
route.get("/", getAllCarts);
route.post("/:cid/product/:pid", validateAddProductToCart, addProductToCart);

export default route;
