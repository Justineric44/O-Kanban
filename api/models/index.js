// Importer nos modèles
import { Card } from "./card.model.js";
import { List } from "./list.model.js";
import { Tag } from "./tag.model.js";
import { User } from "./user.model.js";
import { sequelize } from "./sequelize.client.js";
import { Role } from "./role.model.js";


Role.hasMany(User, { // Un rôle peut être attribué à plusieurs utilisateurs
  as: "users",
  foreignKey: {
    name: "role_id",
    allowNull: false
  },
  onDelete :"RESTRICT" // Si un rôle est supprimé, on ne veut pas supprimer les utilisateurs qui y sont associés, mais plutôt empêcher la suppression du rôle tant qu'il est associé à des utilisateurs
})

User.belongsTo(Role, { // Un utilisateur appartient à un rôle
  as: "role",
  foreignKey: "role_id"
})


// List <--> Card (One-to-Many)
List.hasMany(Card, { // Une liste peut contenir plusieurs cartes
  as: "cards", // alias, permet de faire les 'include' sans avoir à importer le deuxième modèle. // On choisi la valeur pour cet alias, mais en pratique, répondre à la questio: "quand je requête un liste, je veux pouvoir récupérer ses..."
  foreignKey: {
    name: "list_id",
    allowNull: false,
  },
  onDelete: "CASCADE"
});
Card.belongsTo(List, { // Une carte appartient à une liste
  as: "list", // Quand je requête une carte, je veux pouvoir récupérer... sa liste
  foreignKey: "list_id" // obligatoire, sinon il créé un champ 'listId' dont on ne veut pas
});

// Card <--> Tag (Many-to-Many)
Card.belongsToMany(Tag, { // Une carte peut avoir plusieurs tags
  as: "tags",
  through: "card_has_tag",
  foreignKey: "card_id"
});

Tag.belongsToMany(Card, { // Un tag peut être associé à plusieurs cartes
  as: "cards",
  through: "card_has_tag",
  foreignKey: "tag_id"
});




// Exporter nos modèles
export { Card, List, Tag, User, Role, sequelize };
