import argon2 from "argon2";
import { User } from "../models/index.js";

export async function registerUser(req, res) {
  try {
    const { username, password, passwordConfirm } = req.body;

    // Vérifier confirmation mot de passe
    if (password !== passwordConfirm) {
      return res.status(400).json({
        error: "Les mots de passe ne correspondent pas"
      });
    }

    // Vérifier unicité du pseudo
    const existingUser = await User.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Ce pseudo est déjà utilisé"
      });
    }

    // Hash du mot de passe
    const hashedPassword = await argon2.hash(password);

    // Création utilisateur
    const user = await User.create({
      username,
      password: hashedPassword
    });

    // Supprimer le password de la réponse
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erreur interne du serveur"
    });
  }
}