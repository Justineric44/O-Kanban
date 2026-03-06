import Joi from "joi";
import { User } from "../models/index.js";
import { checkBody } from "../utils/common.util.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import "dotenv/config";

export function validateUserCreation(req, res, next) {
  const createUserSchema = Joi.object({
    username: Joi.string().max(255).required(),
    // TODO Rajouter des regex pour valider la complexité du MDP (ou utiliser joi-password)
    password: Joi.string().min(8).required(),
  });
  checkBody(createUserSchema, req.body, res, next);
}

export function validateUserLoggin(req, res, next) {
  const logginUserSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  checkBody(logginUserSchema, req.body, res, next);
}

// Ce middleware va vérifier si il y a un token dans la requête et si il est valide
export function authenticate(req, res, next) {
  // Ici, on récupère le token si il existe
  const authHeader = req.headers.authorization;
  // Si le token n'existe pas ou ne commence pas par Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // On renvoit un message d'erreur
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authorization token missing or invalid" });
  }
  // On sépare notre chaine de caractères sur espace et on garde la partie après (le token)
  const token = authHeader.split(" ")[1];

  try {
    // jwt vérifie que le token est valide et qu'il n'est pas expiré
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ici on ajoute à la requête l'id de l'utilisateur connecté
    // TODO Vérifier que le user_id correspond à un utilisateur existant (une requête à chaque fois)
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid or expired token" });
  }
}

// On utilise cette syntaxe en poupées russes pour passer un paramètre à notre middleware
export function isAllowed(requiredRole) {
  return async (req, res, next) => {
    // On va récupérer les rôle de l'utilisateur connecté.
    const user = await User.findByPk(req.user.user_id, {
      include: "role",
    });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    // Si on est admin on a forcément le droit de le faire
    if (user.role.name === "admin") {
      return next();
    }
    // On va comparer ce rôle avec le rôle attendu
    if (user.role.name !== requiredRole) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "Access denied" });
    }
    // Si le rôle est celui attendu => OK
    next();
  };
}
