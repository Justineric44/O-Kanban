import express from "express";
import { registerUser, loginUser, getConnectedUser } from "../controllers/auth.controller.js";
import { validateUserRegistration, validateUserLogin, authenticate } from "../middlewares/auth.middleware.js";

// Ce routeur va gérer les routes d'authentification
const router = express.Router();
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);
// Cette route va permettre de récupérer les informations de l'utilisateur connecté
router.get("/me", authenticate, getConnectedUser);

export default router;