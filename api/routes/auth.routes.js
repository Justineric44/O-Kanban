import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateUserRegistration } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", loginUser);

export default router;