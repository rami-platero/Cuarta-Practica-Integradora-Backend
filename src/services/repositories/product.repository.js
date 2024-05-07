export default class ProductRepository {

  constructor(dao) {
    this.dao = dao;
  }

  createProduct = async (body) => {
    return await this.dao.create({
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

  updateProduct = async (upFields, id) => {
    return await this.dao.findByIdAndUpdate(id, upFields);
  };

  deleteProduct = async (id) => {
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
        sort
      }
    );
  };
}