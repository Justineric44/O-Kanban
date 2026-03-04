import Joi from "joi";
import { checkBody } from "../utils/common.util.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/index.js";

// Ce middleware va valider les données d'inscription de l'utilisateur
export function validateUserRegistration(req, res, next) {
    const userRegistrationSchema = Joi.object({
        username: Joi.string().max(100).required(),
        // @TODO Rajouter des regex pour valider la complexité du MDP (ou utilise joi-password)
        password: Joi.string().min(8).max(30).required()
    });
    checkBody(userRegistrationSchema, req.body, res, next);
}
// Ce middleware va valider les données de connexion de l'utilisateur
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

export function isAllowed(requiredRole) {
    return async (req, res, next) => {
        // Récupérer l'utilisateur connecté
        const user = await User.findByPk(req.user.user_id, { include: "role" });
        // Vérifier que l'utilisateur existe
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
        }

        // Vérifier le rôle : admin ou rôle requis
        if (user.role.name !== "admin" && user.role.name !== requiredRole) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Access denied" });
        }

        // 🔒 Filtrage dynamique des champs autorisés pour PATCH
        // Seules les requêtes PATCH sur les routes /cards et /lists sont concernées
        if (req.method === "PATCH") {
                // Si la route concerne les cartes, on autorise uniquement les champs position et list_id
            if (req.path.startsWith("/cards")) {
                // On définit les champs autorisés pour la mise à jour des cartes
                const allowedFields = ["position", "list_id"];
                // On filtre les champs de req.body pour ne garder que ceux autorisés
                req.body = Object.fromEntries(
                    // Object.entries transforme l'objet req.body en tableau de paires [clé, valeur]
                    Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
                );
            }
            // Si la route concerne les listes, on autorise uniquement le champ position
            if (req.path.startsWith("/lists")) {
                // On définit les champs autorisés pour la mise à jour des listes
                const allowedFields = ["position"];
                // On filtre les champs de req.body pour ne garder que ceux autorisés
                req.body = Object.fromEntries(
                    // Object.entries transforme l'objet req.body en tableau de paires [clé, valeur]
                    Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
                );
            }
        }

        next();
    };
}