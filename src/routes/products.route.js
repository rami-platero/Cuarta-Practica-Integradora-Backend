import { Router } from "express";
import ProductManager from "../../ProductManager.js";
import { AppError } from "../helpers/AppError.js";
import app from '../app.js'

const route = Router();
const productManager = new ProductManager();

route.get("/", async (req, res, next) => {
  try {
    const { limit } = req.query;

    if (limit && (isNaN(limit) || Number(limit) < 0)) {
        throw new AppError(400,{ message: "Invalid limit query." });
    }

    const products = await productManager.readProducts();

    if (!limit) {
      return res.status(200).json({ products });
    }

    const limitedProducts = products.slice(0, Number(limit));
    return res.status(200).json({ products: limitedProducts });
  } catch (error) {
    return next();
  }
});

route.get("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;

    if (!pid || isNaN(pid)) {
      throw new AppError(400,{ message: "Invalid or missing ID." });
    }

    const foundProduct = await productManager.getProductById(pid);

    if (!foundProduct) {
      throw new AppError(404,{ message: "Product not found" });
    }

    return res.status(200).json({ product: foundProduct });
  } catch (error) {
    return next(error);
  }
});

route.post("/", async (req, res, next) => {
  try {
    const io = app.get("io")
    const body = req.body;

    const newProduct = await productManager.addProduct(body);

    io.emit("add_product", newProduct)

    return res.status(200).json({ message: "Product added successfully." });
  } catch (error) {
    return next(error);
  }
});

route.put("/:pid", async (req, res, next) => {
  try {
    const body = req.body;
    const { pid } = req.params;

    await productManager.updateProduct(pid, body);

    return res.status(200).json({ message: "Product updated successfully." });
  } catch (error) {
    return next(error);
  }
});

route.delete("/:pid", async (req, res, next) => {
  try {
    const io = app.get("io")
    const {pid} = req.params

    await productManager.deleteProduct(pid)
    io.emit("delete_product", pid)
    return res.sendStatus(204)
  } catch (error) {
    return next(error);
  }
});

export default route;
