import Joi from "joi";
import { checkBody } from "../utils/common.util.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/index.js";


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

// Ce middleware va verifier si il y a un token dans la requete
// Et si le token est valide
export function authenticate(req, res, next) {
    // Ici, on recupere le token si il existe
    const authHeader = req.headers.authorization;

    // Si le token n'existe pas ou qu'il ne commence pas par Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Authorization token missing or invalid" });
    }

    // On separer notre chaine de caractere sur espace, et on garde la partie apres.
    // On recupere uniquement le token
    const token = authHeader.split(" ")[1];

    try {
        // JWT verifie que le token est valide et qu'il n'est pas expiré
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Ici, on ajoute a la requete l'id de l'utilisateur connecté
        //@TODO Verifier que l'user_id correspond a un utilisateur existant
        req.user = decoded;
        next();
    } catch (error) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Invalid or expired token" });
    }
}

// On utilise cette syntaxe en poupée russe pour
// Permettre de passer un parametre a notre middleware
export function isAllowed(requiredRole) {
    return async (req, res, next) => {
        // On va recuperer le role de l'utilisateur connecté.
        const user = await User.findByPk(req.user.user_id, {
            include: "role"
        });

        if(!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
        }
        // On va comparer ce role avec le role attendu
        // Si on est admin, on a forcement le droit
        if(user.role.name === "admin" || user.role.name === requiredRole) {
            return next();
        }

        return res.status(StatusCodes.FORBIDDEN).json({ error: "Access denied" });

        // Si on n'a pas le role demandé
        /*if(user.role.name !== requiredRole) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Access denied" });
        }
        next();*/


    }
}