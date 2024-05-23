import { AppError } from "../helpers/AppError.js";
import { EErrors } from "../services/errors/enums.js";

const errorStatusCodes = {
  [EErrors.NOT_FOUND]: 400,
  [EErrors.UNAUTHORIZED]: 401,
  [EErrors.UNAUTHENTICATED]: 401,
  [EErrors.STOCK_ERROR]: 400,
  [EErrors.DUPLICATED]: 409,
  [EErrors.EXTERNAL]: 500,
  [EErrors.INVALID_CREDENTIALS]: 401,
};

export const errorHandler = (error, req, res, _next) => {
  
  req.logger.error(
    `${req.method} at ${
      req.url
    } - on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`
  );

  if (error instanceof AppError) {
    const statusCode = errorStatusCodes[error.code] || 500;
    if (statusCode === 500) {
      return res
        .status(500)
        .json({ status: "error", error: "Unhandled Error." });
    }
    return res.status(statusCode).json({
      error: error.name,
      message: error.message,
      cause: error.cause,
      status: "error",
    });
  }
  return res.status(500).json({ error });
};
