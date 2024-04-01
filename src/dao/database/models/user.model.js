import { Schema, model } from "mongoose";

const schema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String || null,
    },
    role: {
        type: String,
        required: true,
        default: "user"
    }
})

const User = model("users", schema)
export default User