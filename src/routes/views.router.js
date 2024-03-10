import { Router } from "express";
import MessageService from "../dao/database/services/message.service.js";
import ProductService from "../dao/database/services/product.service.js";

const route = Router();

route.get("/", async (_req, res) => {
  const products = await ProductService.getAllProducts();
  return res.render("home", {
    products: products.map((p) => {
      return p.toJSON();
    }),
  });
});

route.get("/realTimeProducts", async (_req, res) => {
  const products = await ProductService.getAllProducts();
  return res.render("realTimeProducts", {
    products: products.map((p) => {
      return p.toJSON();
    }),
  });
});

route.get("/chat", async (_req, res) => {
  const messages = await MessageService.getAllMessages();
  return res.render("chat", {
    messages: messages.map((m) => {
      return m.toJSON();
    }),
  });
});

export default route;
