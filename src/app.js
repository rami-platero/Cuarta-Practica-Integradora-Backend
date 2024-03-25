import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import productsRoute from "./routes/products.route.js";
import cartsRoute from "./routes/carts.route.js";
import messagesRoute from "./routes/messages.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import viewsRoute from "./routes/views.route.js";
import authRoute from './routes/auth.route.js'
import __dirname from "./utils.js";
import { swaggerDocs } from "./utils/swagger.js";
import handlebars from "express-handlebars";
import { connectDB } from "./dao/database/db.js";
import hbsHelpers from "./helpers/handlebars.helpers.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "./config.js";

const app = express();

app.set("PORT", 8080);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.MONGODB_URI,
      mongoOptions: {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 15,
    }),
    secret: "adadasda",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(morgan("dev"));

const hbs = handlebars.create({
  helpers: hbsHelpers,
});

app.engine("handlebars", hbs.engine);
app.set("views", `${__dirname}/views`);

app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));

app.use("/", viewsRoute);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/auth", authRoute);

app.use(errorHandler);

const httpServer = app.listen(app.get("PORT"), () => {
  console.log("Server running on port", app.get("PORT"));
  swaggerDocs(app, app.get("PORT"));
});
connectDB();
const io = new Server(httpServer);
app.set("io", io);

io.on("connection", (socket) => {
  console.log("connected", socket.id);
});

export default app;
