import { AppError } from "../helpers/AppError.js";

export const isAuthorized = (role) => (req, _res, next) => {
  try {
    if (!req.user || req.user.role !== role)
      throw new AppError(
        401,
        JSON.stringify({ message: "You are not authorized." })
      );
    return next();
  } catch (error) {
    return next(error);
  }
};

export const isAuthenticated =  (req, _res, next) => {
    try {
      if (!req.user)
        throw new AppError(
          401,
          JSON.stringify({ message: "You are not authenticated." })
        );
      return next();
    } catch (error) {
      return next(error);
    }
  };