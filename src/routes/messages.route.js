import { Router } from "express";
import { createMessage, getMessages } from "../controllers/messages.controller.js";
import { validateCreateMessage } from "../middlewares/validate.js";

const route = Router()

route.get("/", getMessages)
route.post("/", validateCreateMessage, createMessage)

export default route