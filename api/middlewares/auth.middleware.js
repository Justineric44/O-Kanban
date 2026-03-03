import Joi from "joi";
import { checkBody } from "../utils/common.util.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import "dotenv/config";


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

// Ce middleware va verifier si il y a un token dans la requete et si il est valide, sinon il retourne une erreur 401 Unauthorized
// Et si le token est valide  (ce qui sera fait dans le service d'authentification)
export function authenticate(req, res, next) {
    // Ici, on recupere le token si il existe dans le header Authorization de la requete
    const authHeader = req.headers.authorization;

    // Si le token n'existe pas ou qu'il ne commence pas par Bearer, on retourne une erreur 401 Unauthorized avec un message d'erreur   
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Authorization token missing or invalid" });
    }
    // On sépare le token du mot "Bearer" et on stocke uniquement le token dans req.token pour pouvoir l'utiliser dans les routes protégées
    const token = authHeader.split(" ")[1];
    try {
        // On vérifie la validité du token en utilisant la méthode verify de jsonwebtoken et en passant le token et la clé secrète (qui doit être stockée dans une variable d'environnement)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // ici on ajoute à la requete, l'id de l'utlisateur connecté, son username et son role (si besoin) pour pouvoir les utiliser dans les routes protégées
        req.user = decoded;
        // On passe au middleware suivant ou à la route protégée
        next();
    } catch (error) {
        // Si le token n'est pas valide, on retourne une erreur 401 Unauthorized avec un message d'erreur
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Invalid or expiredtoken" });
        
    }
}

