import { Router } from "express";
import {
  validateGetCartById,
  validateGetProducts,
} from "../middlewares/validate.js";
import { passportCall } from "../middlewares/passport.js";
import { cartsService, messageService, productService } from "../services/service.js";

const router = Router();

router.get("/", async (_req, res) => {
  const products = await productService.getAllProducts();
  return res.render("home", {
    products,
  });
});

router.get("/realTimeProducts", async (_req, res) => {
  const products = await productService.getAllProducts();
  return res.render("realTimeProducts", {
    products
  });
});

router.get("/chat", async (_req, res) => {
  const messages = await messageService.getAllMessages();
  return res.render("chat", {
    messages,
  });
});

router.get("/products", validateGetProducts, passportCall('jwt'), async (req, res) => {
  const { limit, page, query, sort } = req.query;
  // @ts-ignore
  const queryString = req._parsedOriginalUrl.query;

  const result = await productService.getProducts({ limit, page, query, sort });
  console.log(req.user);
  return res.render("products", {
    products: result.docs,
    totalPages: result.totalPages,
    page: result.page,
    queries: queryString,
    user: req.user
  });
});

router.get("/carts/:cid", validateGetCartById, async (req, res) => {
  const { cid } = req.params;

  const foundCart = await cartsService.getCartByID(cid);
  return res.render("cart", {
    cart: foundCart,
  });
});

router.get("/login", passportCall('jwt'), async (req,res) => {
  if(req.user){
    return res.redirect("/products")
  }
  return res.render("login")
})

router.get("/register", passportCall('jwt'), async (req,res) => {
  if(req.user){
    return res.redirect("/products")
  }
  return res.render("register")
})

export default router;
