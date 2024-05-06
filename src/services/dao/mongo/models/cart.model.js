import { Schema, model } from "mongoose";

const schema = new Schema({
  products: [
    {
      quantity: {
        type: String,
        required: true
      },
      product: { type: Schema.Types.ObjectId, ref: "products" },
    },
  ],
});

const Cart = model("carts", schema);
export default Cart
