import { Router } from "express";
import { validateCreateProduct, validateDeleteProduct, validateGetProductById, validateGetProducts, validateUpdateProduct } from "../middlewares/validate.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";

const router = Router();

router.get("/", validateGetProducts, getProducts);
router.get("/:pid", validateGetProductById, getProductById);
router.post("/", validateCreateProduct, createProduct);
router.put("/:pid", validateUpdateProduct, updateProduct);
router.delete("/:pid", validateDeleteProduct, deleteProduct);

export default router;
