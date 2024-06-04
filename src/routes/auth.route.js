import { Router } from "express";
import { Login, Logout, Register, changeRole, forgotPassword, getCurrentUser, loginWithGitHub, resetPassword } from "../controllers/user.controller.js";
import passport from "passport";
import { validateRegisterUser, validateResetPassword } from "../middlewares/validate.js";
import { passportCall } from "../middlewares/passport.js";
import { isAuthorized } from "../middlewares/authJwt.js";

const router = Router();

router.post("/logout", Logout);
router.post("/register", validateRegisterUser, Register)
router.post("/login", Login)

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  loginWithGitHub
);

router.get("/current", passportCall("jwt"), getCurrentUser)

router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", validateResetPassword, resetPassword)
router.post("/premium/:uid", passportCall("jwt"), isAuthorized(["admin"]), changeRole)

export default router;
