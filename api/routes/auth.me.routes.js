import express from "express";
//importer le controller d'authentification pour pouvoir utiliser les fonctions de ce controller dans les routes d'authentification
import { getMe } from "../controllers/auth.controller.js";


const router = express.Router();
router.get("/", getMe);
export default router;







