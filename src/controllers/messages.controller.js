import app from "../app.js";
import { messageService } from "../services/service.js";

export const getMessages = async (_req, res, next) => {
  try {
    const messages = await messageService.getAllMessages();

    return res.status(200).send(messages);
  } catch (error) {
    return next(error);
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const newMessage = await messageService.createMessage(req.body);

    const io = app.get("io");
    io.emit("new_message", newMessage);

    return res.status(201).send(newMessage);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
