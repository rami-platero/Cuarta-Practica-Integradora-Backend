import { Router } from "express";
import { Logout } from "../controllers/user.controller.js";
import passport from "passport";

const router = Router();

router.post("/logout", Logout);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (_req, res) => {
    return res.send({ status: "sucess", message: "user registered" });
  }
);
router.get("/failregister", async (_req, res) => {
  return res.send({ error: "Failed" });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    req.session.user = req.user;
    return res.status(200).send({ status: "success", user: req.user });
  }
);

router.get("/faillogin", (_req, res) => {
  return res.send({ error: "failed login" });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res, next) => {
    try {
      // @ts-ignore
      req.session.user = req.user;
      return res.redirect("/products");
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
