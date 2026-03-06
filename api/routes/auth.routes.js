import express from "express";
import { registerUser, loginUser, getUser } from "../controllers/auth.controller.js";
import { validateUserCreation, validateUserLoggin, authenticate, isAllowed } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', validateUserCreation, registerUser);
router.post('/login', validateUserLoggin, loginUser);
router.get('/me', authenticate, getUser)

export default router;
