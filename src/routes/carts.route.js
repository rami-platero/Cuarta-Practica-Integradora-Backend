import { Router } from "express";
import {
  addProductToCart,
  clearCart,
  createCart,
  getAllCarts,
  getCartByID,
  purchaseItems,
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
import { passportCall } from "../middlewares/passport.js";
import { isAuthenticated } from "../middlewares/authJwt.js";

const router = Router();

router.route("/").get(getAllCarts).post(createCart);
router
  .route("/:cid/products/:pid")
  .post(validateAddProductToCart, passportCall('jwt'), isAuthenticated, addProductToCart)
  .delete(validateRemoveProductFromCart, removeProductFromCart)
  .put(validateUpdateProductQuantity, updateProductQuantity);
router
  .route("/:cid")
  .put(validateUpdateCartProductsArray, updateCartProductsArray)
  .delete(validateClearCart, clearCart)
  .get(validateGetCartById, getCartByID);
router.post("/:cid/purchase", purchaseItems)  

export default router;
