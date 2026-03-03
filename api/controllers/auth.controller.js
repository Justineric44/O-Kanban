import { User } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import argon2 from "argon2";

export async function registerUser(req, res) {
    // Hasher le mdp avec argon2
    const hashedPassword = await argon2.hash(req.body.password);

    try {
        // Enregistrer l'utilisateur
        const user = await User.create({ username: req.body.username, password: hashedPassword });
        // On renvoit l'id et le username de notre nouvel user
        res.status(StatusCodes.CREATED).json({ id: user.id, username: user.username });
    } catch (error) {
        // Cette erreur sera levée si le username n'est pas unique
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(StatusCodes.CONFLICT).json({ error: "Username already exists" });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }

}

export async function loginUser(req, res) {
    // On va pouvoir gerer la connexion 
}