import express from "express";
import morgan from "morgan";
import productsRoute from "./routes/products.route.js";
import cartsRoute from "./routes/carts.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import handlebars from 'express-handlebars'

const app = express();

app.set("PORT", 8080);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));

app.use("/", viewsRouter);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);

app.use(errorHandler);

const httpServer = app.listen(app.get("PORT"), () =>
  console.log("Server running on port", app.get("PORT"))
);
const io = new Server(httpServer);
app.set("io", io);

io.on("connection", (socket) => {
  console.log("connected", socket.id);
})

export default app
