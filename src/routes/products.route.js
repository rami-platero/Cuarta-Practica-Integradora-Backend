import { Router } from "express";
import { validateCreateProduct, validateDeleteProduct, validateGetProductById, validateUpdateProduct } from "../middlewares/validate.js";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";

const route = Router();

route.get("/", getAllProducts);
route.get("/:pid", validateGetProductById, getProductById);
route.post("/", validateCreateProduct, createProduct);
route.put("/:pid", validateUpdateProduct, updateProduct);
route.delete("/:pid", validateDeleteProduct, deleteProduct);

export default route;
