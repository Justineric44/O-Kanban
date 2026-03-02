import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";
import argon2 from "argon2";

export class User extends Model {}

User.init({
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  }
}, {
  sequelize,
  // LE nom de la table doit etre au singulier 
  tableName: "user",
  // Tu n'a pas besoin de ca, le hachage se fait dans le controller :)
  
});