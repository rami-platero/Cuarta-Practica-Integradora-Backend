import fs from "fs";
import { AppError } from "./src/helpers/AppError.js";
import { config } from "./src/config.js";

class ProductManager {
  id;

  constructor() {
    this.path = config.productsPath;
    this.updateId();
  }

  updateId = async () => {
    const products = await this.readProducts();
    if (!products.length) {
      this.id = 0;
    } else {
      const maxId = products[products.length - 1].id;
      this.id = maxId + 1;
    }
  };

  validateAddProduct = (product) => {
    const { thumbnails } = product;

    const allowedFields = {
      title: {
        type: "string",
        required: true,
      },
      description: {
        type: "string",
        required: true,
      },
      code: {
        type: "string",
        required: true,
      },
      stock: {
        type: "number",
        required: true,
      },
      price: {
        type: "number",
        required: true,
      },
      category: {
        type: "string",
        required: true,
      },
      status: {
        type: "boolean",
        required: false,
        default: true,
      },
    };

    const keys = Object.keys(product);

    for (const key of keys) {
      if (key === "thumbnails") {
        continue;
      }
      if (!Object.keys(allowedFields).includes(key)) {
        throw new AppError(400, { message: `${key} is not a valid field.` });
      }

      if (typeof product[key] !== allowedFields[key].type) {
        throw new AppError(400, {
          message: `${key} must be a ${allowedFields[key].type}`,
        });
      }
    }

    const allowedKeys = Object.keys(allowedFields);

    for (const key of allowedKeys) {
      if (!keys.includes(key) && allowedFields[key].required) {
        throw new AppError(400, { message: "Some fields are empty." });
      } else if (!keys.includes(key) && !allowedFields[key].required) {
        product[key] = allowedFields[key].default;
      }
    }

    if (thumbnails) {
      if (!Array.isArray(thumbnails)) {
        throw new AppError(400, {
          message: "Invalid type for the 'thumbnails' field.",
        });
      }

      if (!thumbnails.every((item) => typeof item === "string")) {
        throw new AppError(400, {
          message: "Invalid type for the 'thumbnails' field.",
        });
      }
    }

    return product;
  };

  readProducts = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } else {
      return [];
    }
  };

  getProducts = () => {
    const products = this.readProducts();
    console.log(products);
  };

  addProduct = async (body) => {
    const product = this.validateAddProduct(body);

    const products = await this.readProducts();
    const foundProduct = products.find((p) => p.code === product.code);
    if (foundProduct) {
      throw new AppError(409, { message: "Code provided is already in use." });
    }

    products.push({ ...product, id: this.id++ });

    const json = JSON.stringify(products, null, 2);
    await fs.promises.writeFile(this.path, json);
  };

  getProductById = async (id) => {
    const products = await this.readProducts();
    const foundProduct = products.find((product) => product.id === Number(id));
    return foundProduct;
  };

  validateUpdateProduct = (id, upFields) => {
    if (isNaN(id)) {
      throw new AppError(400, { message: "Invalid or missing product ID" });
    }

    const allowedFields = {
      title: "string",
      description: "string",
      code: "string",
      thumbnail: "string",
      stock: "number",
      price: "number",
    };

    const keys = Object.keys(upFields);

    if (!keys.length) {
      throw new AppError(400, {
        message: "You must provide at least one field to update the product.",
      });
    }

    for (const key of keys) {
      if (!Object.keys(allowedFields).includes(key)) {
        throw new AppError(400, { message: "You entered an invalid field." });
      }

      if (typeof upFields[key] !== allowedFields[key]) {
        throw new AppError(400, {
          message: `${key} must be a ${allowedFields[key]}`,
        });
      }
    }
  };

  updateProduct = async (id, fields) => {
    this.validateUpdateProduct(id, fields);

    const products = await this.readProducts();
    console.log(products);
    const foundProduct = products.find((p) => p.id === Number(id));
    if (!foundProduct) {
      throw new AppError(404, {
        message: "No product found with the specified ID.",
      });
    }
    if (Object.keys(fields).includes("code")) {
      const productWithSameCode = products.find(
        (p) => p.code === fields["code"]
      );
      if (productWithSameCode && productWithSameCode.id !== Number(id)) {
        throw new AppError(409, {
          message:
            "You can't update the code field because you are entering a code that is already in use.",
        });
      }
    }

    const updatedProducts = products.map((p) => {
      if (p.id === foundProduct.id) {
        return { ...p, ...fields };
      } else {
        return p;
      }
    });
    const json = JSON.stringify(updatedProducts, null, 2);

    await fs.promises.writeFile(this.path, json);
  };

  deleteProduct = async (id) => {
    if (isNaN(id)) {
      throw new AppError(400, { message: "Invalid type or missing ID." });
    }

    const products = await this.readProducts();
    const foundProduct = products.find((p) => p.id === Number(id));
    if (!foundProduct) {
      throw new AppError(404, {
        message: "No product found to delete with the specified ID.",
      });
    }

    const updatedProducts = products.filter((p) => {
      return p.id !== Number(id);
    });

    const json = JSON.stringify(updatedProducts, null, 2);
    await fs.promises.writeFile(this.path, json);
  };
}

export default ProductManager;
