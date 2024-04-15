import { Schema, model } from "mongoose";

const schema = new Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: true,
  },
  cart: { type: Schema.Types.ObjectId, ref: "carts"},
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String || null,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: "user",
  },
});

const User = model("users", schema);
export default User;
