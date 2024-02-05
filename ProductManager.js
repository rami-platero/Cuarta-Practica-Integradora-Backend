import fs from 'fs'

class ProductManager {
  id;

  constructor() {
    this.path = "./products.json";
    this.updateId();
  }

  updateId = () => {
    const products = this.readProducts();
    if (!products.length) {
      this.id = 0;
    } else {
      const maxId = products[products.length - 1].id;
      this.id = maxId + 1;
    }
  };

  validateAddProduct = (product) => {
    const { title, description, price, thumbnail, code, stock } = product;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw Error("Error: Some fields are empty.");
    }

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof thumbnail !== "string" ||
      typeof code !== "string" ||
      typeof price !== "number" ||
      typeof stock !== "number"
    ) {
      throw Error("Error: Some fields have an invalid type.");
    }
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

  addProduct = (product) => {
    try {
      this.validateAddProduct(product);

      const products = this.readProducts();

      const foundProduct = products.find((p) => p.code === product.code);

      if (foundProduct) {
        throw Error(
          "Error: Code provided is already in use."
        );
      }

      products.push({ ...product, id: this.id++ });

      const json = JSON.stringify(products, null, 2);
      fs.writeFileSync(this.path, json);
    } catch (error) {
      if ("message" in error) {
        console.error(error.message);
      }
    }
  };

  getProductById = async (id) => {
      const products = await this.readProducts();
      const foundProduct = products.find(
        (product) => product.id === Number(id)
      );
      return foundProduct
  };

  validateUpdateProduct = (id, upFields) => {
    if (isNaN(id)) {
      throw Error("Invalid or missing product ID");
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
      throw Error(
        "You must provide at least one field to update the product."
      );
    }

    for (const key of keys) {
      if (!Object.keys(allowedFields).includes(key)) {
        throw Error("You entered an invalid field.");
      }

      if (typeof upFields[key] !== allowedFields[key]) {
        throw Error(`${key} must be a ${allowedFields[key]}`);
      }
    }
  };

  updateProduct = (id, fields) => {
    try {
      this.validateUpdateProduct(id, fields);

      const products = this.readProducts();
      const foundProduct = products.find((p) => p.id === id);
      if (!foundProduct) {
        throw Error("No product found with the specified ID.");
      }
      if (Object.keys(fields).includes("code")) {
        const productWithSameCode = products.find(
          (p) => p.code === fields["code"]
        );
        if (productWithSameCode && productWithSameCode.id !== id) {
          throw Error(
            "You can't update the code field because you are entering a code that is already in use."
          );
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

      fs.writeFileSync(this.path, json);
    } catch (error) {
      if ("message" in error) {
        console.error("Update Error:",error.message);
      }
    }
  };

  deleteProduct = (id) => {
    try {
      if (isNaN(id)) {
        throw Error("Invalid type or missing ID.");
      }

      const products = this.readProducts();
      const foundProduct = products.find((p) => p.id === id);
      if (!foundProduct) {
        throw Error("No product found to delete with the specified ID.");
      }

      const updatedProducts = products.filter((p) => {
        return p.id !== id;
      });

      const json = JSON.stringify(updatedProducts, null, 2);
      fs.writeFileSync(this.path, json);
    } catch (error) {
      if ("message" in error) {
        console.error("Delete Error:",error.message);
      }
    }
  };
}

export default ProductManager

