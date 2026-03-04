import express from "express";
import { registerUser, loginUser, getConnectedUser } from "../controllers/auth.controller.js";
import { validateUserRegistration, validateUserLogin, authenticate, isAllowed } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);

router.get("/me", authenticate, isAllowed('admin'), getConnectedUser);

export default router;