import { Router } from "express";
import {
  validateGetCartById,
  validateGetProducts,
} from "../middlewares/validate.js";
import { passportCall } from "../middlewares/passport.js";
import {
  cartsService,
  messageService,
  productService,
  userService,
} from "../services/service.js";
import jwt from "jsonwebtoken";
import { config } from "../config/variables.config.js";

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
    products,
  });
});

router.get("/chat", async (_req, res) => {
  const messages = await messageService.getAllMessages();
  return res.render("chat", {
    messages,
  });
});

router.get(
  "/products",
  validateGetProducts,
  passportCall("jwt"),
  async (req, res) => {
    const { limit, page, query, sort } = req.query;
    // @ts-ignore
    const queryString = req._parsedOriginalUrl.query;

    const result = await productService.getProducts({
      limit,
      page,
      query,
      sort,
    });
    return res.render("products", {
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      queries: queryString,
      user: req.user,
    });
  }
);

router.get("/carts/:cid", validateGetCartById, async (req, res) => {
  const { cid } = req.params;

  const foundCart = await cartsService.getCartByID(cid);
  return res.render("cart", {
    cart: foundCart,
  });
});

router.get("/login", passportCall("jwt"), async (req, res) => {
  if (req.user) {
    return res.redirect("/products");
  }
  return res.render("login");
});

router.get("/register", passportCall("jwt"), async (req, res) => {
  if (req.user) {
    return res.redirect("/products");
  }
  return res.render("register");
});

router.get("/forgot-password", passportCall("jwt"), (req, res) => {
  if (req.user) {
    return res.redirect("/products");
  }
  return res.render("forgot-password");
});

router.get("/reset-password", (req, res) => {
  try {
    const token = req.query.token;

    let errorType = null;

    const decoded = jwt.verify(token, config.JWT_SECRET_KEY, (err,decoded) => {
      if (err) {
        switch (err.name) {
          case "JsonWebTokenError":
            errorType = "INVALID";
            break;
          case "TokenExpiredError":
            errorType = "EXPIRED";
            break;
          default:
            errorType = "ERROR";
            break;
        }
      } 
      return decoded
    });

    return res.render("reset-password", { decoded, errorType, token });
  } catch (error) {
    console.log(error);
  }
});

router.get("/users", passportCall("jwt"), async (req,res) => {
  if(!req.user){
    return res.redirect("/")
  }
  const users = await userService.getAllUsers()
  return res.render("users", {users})
})

export default router;
