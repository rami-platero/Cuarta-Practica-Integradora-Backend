import { z } from "zod";
import {
  createBodyProductSchema,
  productIDSchema,
  updateBodyProductSchema,
} from "../schemas/product.schema.js";
import { messageSchema } from "../schemas/message.schema.js";
import { addProductToCartSchema } from "../schemas/carts.schema.js";

export const validate =
  (bodySchema, paramsSchema) => async (req, res, next) => {
    try {
      if (bodySchema) {
        const body = await bodySchema.parseAsync(req.body);
        req.body = body;
      }
      if (paramsSchema) {
        const params = await paramsSchema.parseAsync(req.params);
        req.params = params;
      }
      return next();
    } catch (error) {
      let err = error;
      if (err instanceof z.ZodError) {
        err = err.issues.map((e) => ({
          path: [...e.path],
          message: e.message,
        }));
      }
      return res.status(409).json({
        status: "failed",
        error: err,
      });
    }
  };

export const validateCreateProduct = validate(createBodyProductSchema);
export const validateUpdateProduct = validate(
  updateBodyProductSchema,
  productIDSchema
);
export const validateDeleteProduct = validate(undefined, productIDSchema);
export const validateGetProductById = validate(undefined, productIDSchema)
export const validateCreateMessage = validate(messageSchema)
export const validateAddProductToCart = validate(undefined, addProductToCartSchema)
