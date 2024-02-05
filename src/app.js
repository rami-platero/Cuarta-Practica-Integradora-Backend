import express from "express";
import morgan from "morgan";
import ProductManager from "../ProductManager.js";

const app = express();

app.set("PORT", 8080);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/products", (req, res) => {
  try {
    const { limit } = req.query;

    if (limit && (isNaN(limit) || (Number(limit) < 0))) {
      return res.status(400).json({ message: "Invalid limit query." });
    }

    const productManager = new ProductManager();
    const products = productManager.readProducts();

    if (!limit) {
      return res.status(200).json({ products });
    }

    const limitedProducts = products.slice(0, Number(limit));
    return res.status(200).json({ products: limitedProducts });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error.", error });
  }
});

app.get("/products/:pid", (req, res) => {
  try {
    const {pid} = req.params

    if(!pid || isNaN(pid)){
        return res.status(400).json({message: "Invalid or missing ID."})
    }

    const productManager = new ProductManager()
    const foundProduct = productManager.getProductById(pid)

    if(!foundProduct){
        return res.status(404).json({message: "Product not found"})
    }

    return res.status(200).json({product: foundProduct})

  } catch (error) {
    return res.status(500).json({ message: "Internal server error.", error });
  }
});

app.listen(app.get("PORT"), () =>
  console.log("Server running on port", app.get("PORT"))
);
