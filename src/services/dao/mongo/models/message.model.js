import { Schema, model } from "mongoose";

const schema = new Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String, 
        required: true
    }
})

const Message = model("messages", schema)
export default Message