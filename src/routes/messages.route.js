import { Router } from "express";
import { createMessage, getMessages } from "../controllers/messages.controller.js";
import { validateCreateMessage } from "../middlewares/validate.js";

const router = Router()

router.get("/", getMessages)
router.post("/", validateCreateMessage, createMessage)

export default router