import { UserDTO } from "../services/dto/user.dto.js";
import { userService } from "../services/service.js";
import { generateJWToken } from "../utils/jwt.js";

export const Register = async (req, res, next) => {
  try {
    const { lastName, firstName, age, email, password } = req.body;

    const newUser = await userService.register({
      email,
      firstName,
      lastName,
      age,
      password,
    });

    const tokenUser = {
      name: newUser.username,
      age: newUser.age,
      email: newUser.email,
      role: newUser.role,
      cart: newUser.cart
    };

    const accessToken = generateJWToken(tokenUser);

    res.cookie("jwtCookieToken", accessToken, {
      maxAge: 120000,
      httpOnly: true,
    });

    return res.status(201).json({ status: "success", user: newUser });
  } catch (error) {
    return next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userService.login({ email, password });

    const tokenUser = {
      name: user.username,
      age: user.age,
      email: user.email,
      role: user.role,
      cart: user.cart
    };

    const accessToken = generateJWToken(tokenUser);

    res.cookie("jwtCookieToken", accessToken, {
      maxAge: 120000,
      httpOnly: true,
    });

    return res.status(200).json({ status: "success", user });
  } catch (error) {
    return next(error);
  }
};

export const Logout = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(204);
    }
    await userService.updateLastConnection(req.user._id);
    res.clearCookie("jwtCookieToken");
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    return next(error);
  }
};

export const loginWithGitHub = async (req, res, next) => {
  try {
    const tokenUser = {
      name: req.user.username,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart
    };

    const accessToken = generateJWToken(tokenUser);

    res.cookie("jwtCookieToken", accessToken, {
      maxAge: 120000,
      httpOnly: true,
    });

    return res.redirect("/products");
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = (req, res, next) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await userService.forgotPassword(email);

    return res
      .status(200)
      .json({ status: "success", message: "Sent a recovery link to", email });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    await userService.resetPassword({ token, password });

    return res.status(200).json({
      status: "success",
      message: "Password has been reset successfully!",
    });
  } catch (error) {
    return next(error);
  }
};

export const changeRole = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const newRole = await userService.changeRole(uid);

    return res.status(200).json({
      status: "success",
      message: `Successfully changed user role to ${newRole}`,
    });
  } catch (error) {
    return next(error);
  }
};

export const addDocuments = async (req, res, next) => {
  try {
    const { uid } = req.params;
    await userService.updateDocuments(uid, req.files);
    return res.status(201).json({
      status: "success",
      message: "Successfully updated user's documents.",
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProfilePicture = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await userService.updateProfilePicture(_id, req.file["profilePicture"]);
    return res.status(201).json({
      status: "success",
      message: "Successfully updated user's profile picture.",
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllUsers = async (_req, res, next) => {
  try {
    const users = await userService.getAllUsers().map(user => new UserDTO(user))
    return res.status(200).json({ status: "success", payload: users });
  } catch (error) {
    return next(error);
  }
};

export const removeInactiveUsers = async (_req,res,next) => {
  try {
    await userService.removeInactiveUsers()
    return res.sendStatus(204)
  } catch (error) {
    return next(error)
  }
}