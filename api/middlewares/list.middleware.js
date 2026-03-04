import Joi from "joi";
import { checkBody } from "../utils/common.util.js";

// Ce middleware va valider les données de création d'une carte
export function validateListCreation(req, res, next) {
  const createListSchema = Joi.object({
    title: Joi.string().required(),
    position: Joi.number().required()
  });
  checkBody(createListSchema, req.body, res, next);
}

// Ce middleware va valider les données de mise à jour d'une carte
export function validateListUpdate(req, res, next) {
    const updateListSchema = Joi.object({
        title: Joi.string(),
        position: Joi.number()
    });
    checkBody(updateListSchema, req.body, res, next);
}