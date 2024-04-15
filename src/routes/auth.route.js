import { Router } from "express";
import { Login, Logout, Register, loginWithGitHub } from "../controllers/user.controller.js";
import passport from "passport";
import { validateRegisterUser } from "../middlewares/validate.js";

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

export default router;
