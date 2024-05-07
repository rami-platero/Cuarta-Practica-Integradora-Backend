import User from "../models/user.model.js"

export default class UserMongo {
    create = async (data) => {
        return await User.create(data).toObject();
    }
    findOne = async (data) => {
        return await User.findOne(data, {}, {lean: true})
    }
}