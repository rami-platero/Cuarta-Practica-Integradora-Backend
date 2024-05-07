import Message from "../models/message.model.js";

export default class MessageMongo {
    findAll = async () => {
        return await Message.find().lean(true)
    }
    create = async ({message,user}) => {
        return await Message.create({ message, user });
    }
}