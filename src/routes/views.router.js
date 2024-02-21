import { Router } from "express";
import ProductManager from "../../ProductManager.js";

const route = Router();
const productManager = new ProductManager();

route.get("/", async (_req, res) => {
  const products = await productManager.readProducts();

  return res.render("home", { products });
});

route.get("/realTimeProducts", async (_req, res) => {
  const products = await productManager.readProducts();

  return res.render("realTimeProducts", { products });
});

export default route;
