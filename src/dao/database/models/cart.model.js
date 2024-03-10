import { Schema, model } from "mongoose";

const schema = new Schema({
  products: [
    {
      quantity: Number,
      product: { type: Schema.Types.ObjectId, ref: "products" },
    },
  ],
});

export default model("Cart", schema);
