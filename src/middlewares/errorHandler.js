import { AppError } from "../helpers/AppError.js";
import { EErrors } from "../services/errors/enums.js";

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    let statusCode = 400;
    switch (error.code) {
      case EErrors.NOT_FOUND:
        statusCode = 400;
        break;

      case EErrors.UNAUTHORIZED:
        statusCode = 401;
        break;

      case EErrors.UNAUTHENTICATED:
        statusCode = 401;
        break;

      case EErrors.STOCK_ERROR:
        statusCode = 400;
        break;

      case EErrors.DUPLICATED:
        statusCode = 409;
        break;

      case EErrors.EXTERNAL:
        statusCode = 500;
        break;

      case EErrors.INVALID_CREDENTIALS:
        statusCode = 401;
        break;

      default:
        return res
          .status(500)
          .json({ status: "error", error: "Unhandled Error." });
    }
    return res
      .status(statusCode)
      .json({
        error: error.name,
        message: error.message,
        cause: error.cause,
        status: "error",
      });
  }
  return res.status(500).json({ error });
};
