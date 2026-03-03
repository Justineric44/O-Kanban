import User from "../models/user.model.js";

// Cette fonction permet de récupérer les informations de l'utilisateur connecté
export const getMe = async (req, res, next) => {
  try {
   
    // On récupère l'id de l'utilisateur à partir de req.user, qui a été injecté par le middleware d'authentification
    const userId = req.user.id;
// On récupère l'utilisateur en excluant le champ password
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
// Si l'utilisateur n'existe pas, on renvoie une erreur 404
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};