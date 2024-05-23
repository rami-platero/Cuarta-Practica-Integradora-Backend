import winston from "winston";
import { config } from "./variables.config.js";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warn: "yellow",
    info: "green",
    http: "cyan",
    debug: "white",
  },
};

winston.addColors(customLevelsOptions.colors);

export const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

export const prodLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "./errors.log", level: "info" }),
  ],
});

export const setupLogger = (req, _res, next) => {
    if (config.environment === "production") {
        req.logger = prodLogger
    } else {
        req.logger = devLogger
    }
  return next();
};
