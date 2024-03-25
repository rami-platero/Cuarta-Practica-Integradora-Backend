import { AppError } from "../../../helpers/AppError.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

class UserService {
  static register = async ({ username, email, password: pass }) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pass, salt);

      const { password, ...newUser } = (
        await User.create({ email, password: hashedPassword, username })
      ).toObject();

      return newUser;
    } catch (err) {
      if (err.code === 11000 && "email" in err.keyPattern) {
        throw new AppError(400, { message: "Email is already in use!" });
      }
      throw new Error(err);
    }
  };

  static login = async ({ email, password: pass }) => {
    if (email === "adminCoder@coder.com" && pass === "adminCod3r123") {
      return {
        email,
        username: "Coderhouse",
        role: "admin",
      };
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      throw new AppError(404, { message: "User not found!" });
    }

    const matches = bcrypt.compare(foundUser.password, pass);
    if (!matches) {
      throw new AppError(401, { message: "Credentials don't match!" });
    }

    const { password, ...loggedUser } = foundUser.toObject();
    return loggedUser;
  };
}

export default UserService;
