import { config } from "../config/variables.config.js";

export const addHttpLogger = (req, _res, next) => {
  try {
    if (config.environment === "development") {
      req.logger.http(
        `${req.method} at ${
          req.url
        } - on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`
      );
    }

    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
