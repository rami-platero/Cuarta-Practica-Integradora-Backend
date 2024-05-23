import { Router } from "express";
import { config } from "../config/variables.config.js";

const router = Router();

const DEV_LOGGERS = ["fatal","error", "warn", "info", "http", "debug"]
const PROD_LOGGERS = ["fatal","error", "warn", "info"]

router.get('/loggerTest', (req,res,next) => {
    try {
        if (config.environment === "production") {
    
          PROD_LOGGERS.forEach(type => {
            req.logger[type](
                `${req.method} at ${
                  req.url
                } - on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`
              )
          });
        } else {

          DEV_LOGGERS.forEach(type => {
            req.logger[type](
                `${req.method} at ${
                  req.url
                } - on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`
              )
          });
        }

        return res.status(200).json({status: "success", message: "All loggers tested!"})
      } catch (error) {
        return next(error);
      }
})

export default router 