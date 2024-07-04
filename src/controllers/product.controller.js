import app from "../app.js";
import { AppError } from "../helpers/AppError.js";
import { productService } from "../services/service.js";

export const getAllProducts = async (_req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).send(products);
  } catch (error) {
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { limit, sort, page, query } = req.query;

    const products = await productService.getProducts({
      limit,
      sort,
      page,
      query,
    });

    const { docs, ...result } = products;

    return res
      .status(200)
      .json({ status: "success", payload: docs, ...result });
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const foundProduct = await productService.getProductById(req.params.pid);

    if (!foundProduct) {
      throw new AppError({
        name: "Product retrieval error.",
        message: "Error trying to find Product.",
        code: EErrors.NOT_FOUND,
        cause: "A product with the specified ID does not exist.",
      });
    }

    return res.status(200).json({ product: foundProduct });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const io = app.get("io");

    const files = req.files.filter((f)=>{
      return f.fieldname === 'thumbnails' 
    })
    const thumbnails = !files.length? [] : files.map((file)=>{
      return file.path.split("public")[1].replace(/\\/g, "/")
    }) 

    const newProduct = await productService.createProduct(req.body, thumbnails);

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
    const updatedProduct = await productService.updateProduct(
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

    const user = req.user

    await productService.deleteProduct(req.params.pid, user);
    io.emit("delete_product", req.params.pid);
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

export const getMockingProducts = async (req, res, next) => {
  try {
    const mockingProducts = await productService.getMockingProducts();
    return res
      .status(200)
      .json({ status: "success", payload: mockingProducts });
  } catch (error) {
    return next(error);
  }
};
