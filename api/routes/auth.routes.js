import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateUserRegistration, validateUserLogin } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);

export default router;