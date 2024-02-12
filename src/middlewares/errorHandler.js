import { AppError } from "../helpers/AppError.js";

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    console.log(error);
    return res.status(error.statusCode).json(JSON.parse(error.message));
  }
  return res.status(500).json({ error });
};
