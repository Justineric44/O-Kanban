import express from "express";
//importer le controller d'authentification pour pouvoir utiliser les fonctions de ce controller dans les routes d'authentification
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateUserRegistration, validateUserLogin } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);

export default router;