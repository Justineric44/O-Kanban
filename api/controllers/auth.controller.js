import { User, Role } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import "dotenv/config";

export async function registerUser(req, res) {
    // Hasher le mdp avec argon2
    const hashedPassword = await argon2.hash(req.body.password);

    try {
        // Ici, on recupere le role user pour avoir son ID
        const userRole = await Role.findOne({
            where: {
                name: "user"
            }
        });

        // Enregistrer l'utilisateur avec un role par defaut user
        const user = await User.create({ username: req.body.username, password: hashedPassword, role_id: userRole.id });
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
    // On va pouvoir gerer la connexion d'un utilisateur
    // On tente de recuperer un utilisateur via son id
    const user = await User.findOne({
        where: {
            username: req.body.username
        }
    })
    // Si l'utilisateur n'existe pas ou que le mot de passe n'est pas bon
    if(!user || !await argon2.verify(user.password, req.body.password)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid username or password" });
    }
    
    // On a generé un token avec une date d'expiration de 1h00
    const token = jwt.sign({user_id: user.id}, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
    /*if(!user || !argon2.verify(user.password, req.body.password)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid username or password" });
    } else {
        res.status(StatusCodes.OK).json({message: "Connection successfull"});
    }*/


    res.status(StatusCodes.OK).json({ token });
}

export async function getConnectedUser(req, res) {
    // req.user.user_id
    const user = await User.findByPk(req.user.user_id, {
        attributes: ["id", "username"],
        include: "role"
    });

    if(!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    res.status(StatusCodes.OK).json(user);

}