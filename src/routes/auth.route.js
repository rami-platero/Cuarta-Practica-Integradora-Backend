import { Router } from "express";
import {
  Login,
  Logout,
  Register,
  addDocuments,
  changeRole,
  forgotPassword,
  getAllUsers,
  getCurrentUser,
  loginWithGitHub,
  removeInactiveUsers,
  resetPassword,
  updateProfilePicture,
} from "../controllers/user.controller.js";
import passport from "passport";
import {
  validateRegisterUser,
  validateResetPassword,
} from "../middlewares/validate.js";
import { passportCall } from "../middlewares/passport.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authJwt.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/logout", passportCall("jwt"), Logout);
router.post("/register", validateRegisterUser, Register);
router.post("/login", Login);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  loginWithGitHub
);

router.get("/current", passportCall("jwt"), getCurrentUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);
router.post(
  "/premium/:uid",
  passportCall("jwt"),
  isAuthorized(["admin"]),
  changeRole
);
router.post(
  "/:uid/documents",
  upload.fields([
    { name: "identificacion", maxCount: 1 },
    { name: "comprobanteDomicilio", maxCount: 1 },
    { name: "comprobanteEstado", maxCount: 1 },
  ]),
  addDocuments
);
router.post(
  "/:uid/profile-picture",
  upload.single("profilePicture"),
  passportCall("jwt"),
  updateProfilePicture
);
router
  .route("/users")
  .delete(
    passportCall("jwt"),
    isAuthenticated,
    isAuthorized,
    removeInactiveUsers
  )
  .get(passportCall("jwt"), isAuthenticated, isAuthorized, getAllUsers);

export default router;
