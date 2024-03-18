import { Schema, model } from "mongoose";

const schema = new Schema({
  products: [
    {
      quantity: Number,
      product: { type: Schema.Types.ObjectId, ref: "products" },
    },
  ],
});

const Cart = model("carts", schema);
export default Cart
