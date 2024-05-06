import Message from "../models/message.model.js";

class MessageService {
  static getAllMessages = async () => {
    return await Message.find({}).lean(true)
  };

  static createMessage = async (body) => {
    return await Message.create({ message: body.message, user: body.user });
  };
}

export default MessageService;
