import { Schema, model } from "mongoose";

const schema = new Schema({
    user: {
        type: String,
        reuqired: true
    },
    message: {
        type: String, 
        required: true
    }
})

export default model("Message", schema)