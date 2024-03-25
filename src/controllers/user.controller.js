import UserService from "../dao/database/services/user.service.js";

export const Register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const newUser = await UserService.register({
      email,
      username,
      password,
    });

    req.session.user = newUser;

    return res.status(201).json({ status: "success", user: newUser });
  } catch (error) {
    return next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const loggedUser = await UserService.login({ email, password });

    req.session.user = loggedUser;
    return res.status(200).json({ status: "success", user: loggedUser });
  } catch (error) {
    return next(error);
  }
};

export const Logout = async (req, res, next) => {
  try {
    req.session.destroy();
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    return next(error);
  }
};
