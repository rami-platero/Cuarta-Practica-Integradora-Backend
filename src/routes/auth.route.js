import { Router } from "express";
import { Login, Logout, Register } from "../controllers/user.controller.js";

const router = Router()

router.post("/register", Register)
router.post("/login", Login)
router.post("/logout", Logout)

export default router