import z from "zod";
import mongoose from "mongoose";

const product = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
  code: z.string({
    required_error: "Code is required",
    invalid_type_error: "Code must be a string",
  }),
  stock: z.number({
    required_error: "Stock is required",
    invalid_type_error: "Stock must be a number",
  }),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }),
  category: z.string({
    required_error: "Category is required",
    invalid_type_error: "Category must be a string",
  }),
  status: z
    .boolean({
      invalid_type_error: "Status must be a boolean",
    })
    .optional()
    .default(true),
  owner: z.string().email().optional().default("admin")
});

const productFormData = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
  code: z.string({
    required_error: "Code is required",
    invalid_type_error: "Code must be a string",
  }),
  stock: z
    .string({
      required_error: "Stock is required",
    })
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), {
      message: "Stock must be a number",
    }),
  price: z
    .string({
      required_error: "Price is required",
    })
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), {
      message: "Price must be a number",
    }),
  category: z.string({
    required_error: "Category is required",
    invalid_type_error: "Category must be a string",
  }),
  status: z
    .string({
      required_error: "Status is required",
      invalid_type_error: "Status must be a boolean",
    })
    .default("true")
    .refine((val) => {
      return val === "true" || val === "false"
    }, {
      message: "Price must be a boolean",
    })
    .transform((val) => {
      if (val.toLowerCase() === 'true') return true;
      if (val.toLowerCase() === 'false') return false;
    })
    .optional(),
  owner: z.string().optional().default("admin"),
});

export const createBodyProductSchema = productFormData

export const updateBodyProductSchema = product
  .extend({
    status: z.boolean(),
  })
  .partial()
  .strict();

export const productIDSchema = z.object({
  pid: z
    .string({
      required_error: "ID is required.",
    })
    .refine((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }, "You entered an invalid ID type."),
});

export const paginateProductsSchema = z.object({
  limit: z
    .any()
    .optional()
    .refine(
      (value) => {
        return !isNaN(value);
      },
      {
        message: "Limit must be a number.",
      }
    )
    .default(5),
  sort: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z
    .any()
    .optional()
    .refine(
      (value) => {
        return !isNaN(value);
      },
      {
        message: "Page must be a number.",
      }
    )
    .default(1),
  query: z
    .any()
    .optional()
    .default(""),
});
