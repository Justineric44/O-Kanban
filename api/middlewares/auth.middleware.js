import Joi from "joi";
import { checkBody } from "../utils/common.util.js";

export function validateUserRegistration(req, res, next) {
    const userRegistrationSchema = Joi.object({
        username: Joi.string().max(100).required(),
        // @TODO Rajouter des regex pour valider la complexité du MDP (ou utilise joi-password)
        password: Joi.string().min(8).max(30).required()
    });
    checkBody(userRegistrationSchema, req.body, res, next);
}

export function validateUserLogin(req, res, next) {
    const userLoginSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    checkBody(userLoginSchema, req.body, res, next);
}