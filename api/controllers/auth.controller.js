import { User, Role } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import "dotenv/config";

export async function registerUser(req, res) {
  const hashedPassword = await argon2.hash(req.body.password);

  try {
    // Ici on récupère le role user pour avoir son id
    const userRole = await Role.findOne({
      where: { name: "user" },
    });
    // On enregistre l'user avec un role par défaut lors de l'inscription sur le front
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      role_id: userRole.id,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ id: user.id, username: user.username });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "Username already exists" });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }

  /* MON CODE
    const username = req.body.username;
      const existingUser = await User.findAll({
        where: {
          username: username,
        },
      });
      if (existingUser[0]) {
        return res.status(403).json({ error: "User already exist" });
      }

      try {
        const hash = await argon2.hash(req.body.password);
        const user = await User.create({
          username: username,
          password: hash,
        });
        return res.status(StatusCodes.CREATED).json(user.username);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "erreur create " });
    }
  */
}

export async function loginUser(req, res) {
  // Gestion de la connexion d'un utilisateur
  // On tente de récupérer un utilisateur via son username
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  // Si l'utilisateur n'existe pas ou que le mot de passe n'est pas bon
  if (!user || !(await argon2.verify(user.password, req.body.password))) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid username or password" });
  }

  // On a généré un token avec une date d'expiration de 1h
  const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(StatusCodes.OK).json({ token });
}

export async function getUser(req, res) {
  // Ici on récupère l'id de l'utilisateur
  const userId = req.user.user_id;
  const user = await User.findByPk(userId, {
    attributes: ["id", "username"],
    include: "role",
  });
  // Si l'utilisateur n'existe pas
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }
  res.status(StatusCodes.OK).json(user);
}
