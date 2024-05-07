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
      name: user.username,
      age: newUser.age,
      email: newUser.email,
      role: newUser.role
    }

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
      role: user.role
    }

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

export const Logout = async (_req, res, next) => {
  try {
    res.clearCookie("jwtCookieToken")
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    return next(error);
  }
};

export const loginWithGitHub = async (req,res,next) => {
  try {

    const tokenUser = {
      name: req.user.username,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role
    }

    const accessToken = generateJWToken(tokenUser);

    res.cookie("jwtCookieToken", accessToken, {
      maxAge: 120000,
      httpOnly: true,
    });

    return res.redirect("/products");
  } catch (error) {
    return next(error)
  }
}

export const getCurrentUser = (req,res,next) => {
  try {
    return res.status(200).json({user: req.user})
  } catch (error) {
    return next(error)
  }
}