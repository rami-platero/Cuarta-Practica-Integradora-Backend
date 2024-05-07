import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const schema = new Schema({
  code: {
    type: String,
    required: true,
    default: uuidv4()
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now()
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: { type: String, required: true },
});

const Ticket = model("tickets", schema);

export default Ticket;
