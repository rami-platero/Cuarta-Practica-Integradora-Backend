import express from "express";
import morgan from "morgan";
import productsRoute from "./routes/products.route.js";
import cartsRoute from './routes/carts.route.js'
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.set("PORT", 8080);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.json())

app.use("/api/products", productsRoute)
app.use("/api/carts", cartsRoute)

app.use(errorHandler)

app.listen(app.get("PORT"), () =>
  console.log("Server running on port", app.get("PORT"))
);
