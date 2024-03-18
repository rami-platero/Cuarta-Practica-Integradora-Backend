import mongoose from "mongoose";
import { z } from "zod";

const cartID = z
  .string({
    required_error: "Cart ID is required.",
  })
  .refine((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }, "You entered an invalid cart ID type.");

export const cartProductsSchema = z.object({
  pid: z
    .string({
      required_error: "Product ID is required.",
    })
    .refine((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }, "You entered an invalid product ID type."),
  cid: cartID,
});

export const cartIDSchema = z.object({
  cid: cartID,
});

export const updateProductQuantitySchema = z.object({
  quantity: z.number({
    required_error: "You must enter a quantity to update a product.",
  }),
});

export const validateCartProductsArraySchema = z.array(
  z.object({
    quantity: z.number({
      required_error: "Quantity is required for every cart product.",
      invalid_type_error: "Quantity must be a number.",
    }),
    product: z
      .string({
        required_error: "Product ID is required.",
      })
      .refine((value) => {
        return mongoose.Types.ObjectId.isValid(value);
      }, "You entered an invalid product ID type."),
  })
);
