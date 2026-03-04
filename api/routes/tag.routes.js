import express from "express";
import { getAll, getById, create, update, deleteById, getCardsByTagId } from '../controllers/tag.controller.js';
import { validateTagCreation, validateTagUpdate } from '../middlewares/tag.middleware.js';
import { validateId } from '../middlewares/common.middleware.js';
import { isAllowed } from "../middlewares/auth.middleware.js";

// Ce routeur va gérer les routes liées aux tags
const router = express.Router();

// Routes pour les tags
router.get('/', getAll);
router.get('/:id', validateId, getById);
router.post('/', isAllowed('admin'), validateTagCreation, create);
router.patch('/:id', validateId, validateTagUpdate, update);
router.delete('/:id', validateId, deleteById);
router.get('/:id/cards', validateId, getCardsByTagId);

export default router;