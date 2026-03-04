import express from "express";
import { registerUser, loginUser, getConnectedUser } from "../controllers/auth.controller.js";
import { validateUserRegistration, validateUserLogin, authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);

router.get("/me", authenticate, getConnectedUser);

export default router;