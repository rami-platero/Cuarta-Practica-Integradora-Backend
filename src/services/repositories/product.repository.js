import { AppError } from "../../helpers/AppError.js";
import { generateProduct } from "../../utils/faker.js";
import { EErrors } from "../errors/enums.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createProduct = async (body, thumbnails) => {
    return await this.dao.create({
      title: body.title,
      category: body.category,
      code: body.code,
      description: body.description,
      price: body.price,
      status: body.status,
      stock: body.stock,
      thumbnails: thumbnails,
      owner: body.owner
    });
  };

  updateProduct = async (upFields, id) => {
    return await this.dao.findByIdAndUpdate(id, upFields);
  };

  updateProductStock = async (id, newStock) => {
    return await this.dao.updateStock(id, newStock);
  };

  deleteProduct = async (id, user) => {
    const foundProduct = await this.dao.findById(id);
    if (!foundProduct) {
      throw new AppError({
        name: "Delete product error.",
        message: "Error while trying to delete product.",
        code: EErrors.NOT_FOUND,
        cause: `The product you are trying to delete does not exist!`,
      });
    }
    if (user.role !== "admin" && foundProduct.owner !== user.email) {
      throw new AppError({
        name: "Delete product error.",
        message: "Error while trying to delete product.",
        code: EErrors.UNAUTHORIZED,
        cause: `You are not authorized to delete this product.`,
      });
    }
    return await this.dao.deleteOneById(id);
  };

  getAllProducts = async () => {
    return await this.dao.findAll();
  };

  getProductById = async (id) => {
    return await this.dao.findById(id);
  };

  getProducts = async ({ limit, page = 1, query, sort }) => {
    // @ts-ignore
    return await this.dao.getPaginated(
      { title: { $regex: query, $options: "i" } },
      {
        limit,
        page,
        sort,
      }
    );
  };

  getMockingProducts = async (amount = 100) => {
    const mockingproducts = [];
    for (let i = 0; i < amount; i++) {
      const generatedProduct = generateProduct();
      mockingproducts.push(generatedProduct);
    }
    return mockingproducts;
  };
}
