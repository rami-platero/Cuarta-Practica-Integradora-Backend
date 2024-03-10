import mongoose from "mongoose";
import { z } from "zod";

export const addProductToCartSchema = z.object({
  pid: z
    .string({
      required_error: "Product ID is required.",
    })
    .refine((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }, "You entered an invalid product ID type."),
  cid: z
    .string({
      required_error: "Cart ID is required.",
    })
    .refine((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }, "You entered an invalid cart ID type."),
});
