import { AppError } from "../helpers/AppError.js";
import { EErrors } from "../services/errors/enums.js";

export const isAuthorized = (role) => (req, _res, next) => {
  try {
    if (!req.user || req.user.role !== role)
      throw new AppError({
        name: "Authorization error.",
        message: "You do not have permission to access this resource.",
        code: EErrors.UNAUTHORIZED,
        cause: "You are not authorized to perform this action.",
      });
    return next();
  } catch (error) {
    return next(error);
  }
};

export const isAuthenticated = (req, _res, next) => {
  try {
    if (!req.user)
      throw new AppError({
        name: "Authentication error.",
        message: "You do not have permission to access this resource.",
        code: EErrors.UNAUTHENTICATED,
        cause: "You must be authenticated to perform this action.",
      })
    return next();
  } catch (error) {
    return next(error);
  }
};
