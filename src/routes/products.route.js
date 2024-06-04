import { Router } from "express";
import { validateCreateProduct, validateDeleteProduct, validateGetProductById, validateGetProducts, validateUpdateProduct } from "../middlewares/validate.js";
import { createProduct, deleteProduct, getMockingProducts, getProductById, getProducts, updateProduct } from "../controllers/product.controller.js";
import { isAuthorized } from "../middlewares/authJwt.js";
import { passportCall } from "../middlewares/passport.js";

const router = Router();

router.get("/", validateGetProducts, getProducts);
router.get("/mockingproducts", getMockingProducts)
router.get("/:pid", validateGetProductById, getProductById);
router.post("/", validateCreateProduct, passportCall("jwt"), isAuthorized(["admin", "premium"]), createProduct);
router.put("/:pid", validateUpdateProduct, passportCall("jwt"), isAuthorized(["admin", "premium"]),updateProduct);
router.delete("/:pid", validateDeleteProduct, passportCall("jwt"), isAuthorized(["admin", "premium"]),deleteProduct);

export default router;
