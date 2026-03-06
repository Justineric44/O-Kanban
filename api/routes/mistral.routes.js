import express from "express";
import { createPrompt, createSpellCheck, createTranslate } from "../controllers/mistral.controller.js";
import { isAllowed } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/prompt', createPrompt);
router.post('/spellcheck', isAllowed("admin"), createSpellCheck);
router.post('/translate', isAllowed("admin"), createTranslate);


export default router;
