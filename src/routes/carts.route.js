import { Router } from "express";
import {
  addProductToCart,
  clearCart,
  createCart,
  getAllCarts,
  getCartByID,
  removeProductFromCart,
  updateCartProductsArray,
  updateProductQuantity,
} from "../controllers/carts.controller.js";
import {
  validateAddProductToCart,
  validateClearCart,
  validateGetCartById,
  validateRemoveProductFromCart,
  validateUpdateCartProductsArray,
  validateUpdateProductQuantity,
} from "../middlewares/validate.js";

const router = Router();

router.route("/").get(getAllCarts).post(createCart);
router
  .route("/:cid/products/:pid")
  .post(validateAddProductToCart, addProductToCart)
  .delete(validateRemoveProductFromCart, removeProductFromCart)
  .put(validateUpdateProductQuantity, updateProductQuantity);
router
  .route("/:cid")
  .put(validateUpdateCartProductsArray, updateCartProductsArray)
  .delete(validateClearCart, clearCart)
  .get(validateGetCartById, getCartByID);

export default router;
