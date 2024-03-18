import { z } from "zod";
import {
  createBodyProductSchema,
  paginateProductsSchema,
  productIDSchema,
  updateBodyProductSchema,
} from "../schemas/product.schema.js";
import { messageSchema } from "../schemas/message.schema.js";
import {
  cartProductsSchema,
  cartIDSchema,
  updateProductQuantitySchema,
  validateCartProductsArraySchema,
} from "../schemas/carts.schema.js";

export const validate =
  (bodySchema, paramsSchema, queryParamsSchema) => async (req, res, next) => {
    try {
      if (bodySchema) {
        const body = await bodySchema.parseAsync(req.body);
        req.body = body;
      }
      if (paramsSchema) {
        const params = await paramsSchema.parseAsync(req.params);
        req.params = params;
      }
      if (queryParamsSchema) {
        const queryParams = await queryParamsSchema.parseAsync(req.query);
        req.query = queryParams;
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
export const validateGetProductById = validate(undefined, productIDSchema);
export const validateCreateMessage = validate(messageSchema);
export const validateAddProductToCart = validate(undefined, cartProductsSchema);
export const validateRemoveProductFromCart = validate(
  undefined,
  cartProductsSchema
);
export const validateUpdateProductQuantity = validate(
  updateProductQuantitySchema,
  cartProductsSchema
);
export const validateClearCart = validate(undefined, cartIDSchema);
export const validateGetCartById = validate(undefined, cartIDSchema);
export const validateGetProducts = validate(
  undefined,
  undefined,
  paginateProductsSchema
);
export const validateUpdateCartProductsArray = validate(validateCartProductsArraySchema, cartIDSchema)
