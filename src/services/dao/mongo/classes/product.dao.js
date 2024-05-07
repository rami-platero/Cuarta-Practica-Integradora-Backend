import Product from "../models/product.model.js";

export default class ProductMongo {
  create = async (data) => {
    return await Product.create(data);
  };
  findAll = async () => {
    return await Product.find().lean(true);
  };
  findById = async (id) => {
    return await Product.findById(id, {}, {lean: true})
  };
  getPaginated = async (query, opts) => {
    return await Product.paginate({...query}, {
      limit: Number(opts.limit),
      page: Number(opts.page),
      sort: {
        price: opts.sort,
      },
      lean: true,
    });
  };
  findByIdAndUpdate = async (id, upFields) => {
    return await Product.findByIdAndUpdate(id, { ...upFields }, { new: true })
      .lean(true)
      .toObject();
  };
  deleteOneById = async (id) => {
    return await Product.deleteOne({ _id: id });
  };
}
