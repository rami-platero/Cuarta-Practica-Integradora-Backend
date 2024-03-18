import Product from "../models/product.model.js";

class ProductService {
  static createProduct = async (body) => {
    return await Product.create({
      title: body.title,
      category: body.category,
      code: body.code,
      description: body.description,
      price: body.price,
      status: body.status,
      stock: body.stock,
      thumbnails: body.thumbnails,
    });
  };

  static updateProduct = async (upFields, id) => {
    return await Product.findByIdAndUpdate(id, { ...upFields }, { new: true });
  };

  static deleteProduct = async (id) => {
    return await Product.deleteOne({ _id: id });
  };

  static getAllProducts = async () => {
    return await Product.find();
  };

  static getProductById = async (id) => {
    return await Product.findById(id);
  };

  static getProducts = async ({ limit, page, query, sort }) => {
    return await Product.paginate(
      { title: { $regex: query, $options: "i" } },
      {
        limit: Number(limit),
        page: Number(page),
        sort: {
          price: sort,
        },
        lean: true,
      }
    );
  };
}

export default ProductService;
