import { Router } from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/messages.controller.js";
import { validateCreateMessage } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/authJwt.js";
import { passportCall } from "../middlewares/passport.js";

const router = Router();

router.get("/", getMessages);
router.post(
  "/",
  validateCreateMessage,
  passportCall("jwt"),
  isAuthenticated,
  createMessage
);

export default router;
