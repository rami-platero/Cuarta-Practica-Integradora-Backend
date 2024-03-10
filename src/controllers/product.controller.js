import app from "../app.js";
import ProductService from "../dao/database/services/product.service.js";
import { AppError } from "../helpers/AppError.js";

export const getAllProducts = async (_req, res, next) => {
  try {
    /* const { limit } = req.query;
  
      if (limit && (isNaN(limit) || Number(limit) < 0)) {
        throw new AppError(400, { message: "Invalid limit query." });
      } */

    const products = await ProductService.getAllProducts();

    /* if (!limit) {
        return res.status(200).json({ products });
      } */

    /* const limitedProducts = products.slice(0, Number(limit)); */
    return res.status(200).send(products);
  } catch (error) {
    return next();
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const foundProduct = await ProductService.getProductById(req.params.pid);

    if (!foundProduct) {
      throw new AppError(404, { message: "Product not found" });
    }

    return res.status(200).json({ product: foundProduct });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const io = app.get("io");

    const newProduct = await ProductService.createProduct(req.body);

    io.emit("add_product", newProduct);

    return res
      .status(201)
      .json({ message: "Product added successfully.", payload: newProduct });
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await ProductService.updateProduct(
      req.body,
      req.params.pid
    );

    return res.status(200).json({
      message: "Product updated successfully.",
      payload: updatedProduct,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const io = app.get("io");

    await ProductService.deleteProduct(req.params.pid);
    io.emit("delete_product", req.params.pid);
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
