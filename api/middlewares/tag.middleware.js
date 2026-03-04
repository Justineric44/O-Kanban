import Joi from "joi";
import { checkBody } from "../utils/common.util.js";

// Ce middleware va valider les données de création d'une carte
export function validateTagCreation(req, res, next) {
    const createTagSchema = Joi.object({
        name: Joi.string().required(),
        color: Joi.string().length(7).pattern(/^#[0-9A-Fa-f]{6}$/),
    });
    checkBody(createTagSchema, req.body, res, next);
}

// Ce middleware va valider les données de mise à jour d'une carte
export function validateTagUpdate(req, res, next) {
    const updateTagSchema = Joi.object({
        name: Joi.string(),
        color: Joi.string().length(7).pattern(/^#[0-9A-Fa-f]{6}$/),
    });
    checkBody(updateTagSchema, req.body, res, next);
}