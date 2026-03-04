import express from "express";
import { getAll, getById, create, update, deleteById } from '../controllers/card.controller.js';
import { validateCardCreation, validateCardUpdate } from '../middlewares/card.middleware.js';
import { validateId } from '../middlewares/common.middleware.js';
import { isAllowed } from "../middlewares/auth.middleware.js";

// Ce routeur va gérer les routes liées aux cartes
const router = express.Router();

// Routes pour les cartes
router.get('/', getAll);
router.get('/:id', validateId, getById);
router.post('/', isAllowed('admin'), validateCardCreation, create);
router.patch('/:id', validateId, validateCardUpdate, update);
router.delete('/:id', validateId, deleteById);

export default router;
