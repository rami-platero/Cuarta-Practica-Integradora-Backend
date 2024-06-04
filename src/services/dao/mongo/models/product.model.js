import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: false,
    default: true,
  },
  thumbnails: [{ type: String }],
  owner: {
    type: String,
    default: "admin"
  }
});

schema.plugin(mongoosePaginate);

const Product = model("products", schema);
export default Product