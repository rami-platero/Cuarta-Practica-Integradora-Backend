import { config } from "../config/variables.config.js";
import jwt from "jsonwebtoken";

export const generateJWToken = (user) => {
  return jwt.sign({ user }, config.JWT_SECRET_KEY, { expiresIn: "120s" });
};
