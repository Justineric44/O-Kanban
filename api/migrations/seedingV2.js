import { Card, List, Tag, User } from "../models/index.js";
import { sequelize } from "../models/sequelize.client.js";

(async () => {
  console.log("🔄 Okanban seeding started...");

  // 1️⃣ Supprime et recrée toutes les tables
  await sequelize.sync({ force: true });
  console.log("🚧 Tables créées");

  // 2️⃣ Seed Tags
  const urgentTag = await Tag.create({ name: 'Urgent', color: '#FF00FF' });
  const lateTag   = await Tag.create({ name: 'En retard', color: '#000000' });
  const ecoTag    = await Tag.create({ name: 'Eco-friendly', color: '#00FF00' });

  // 3️⃣ Seed Lists et Cards
  await List.bulkCreate([
    { title: 'Liste des courses', position: 1, cards: [
      { content: 'Chartreuse', position: 3 },
      { content: 'Concombre', position: 2, color: '#00FF00' },
      { content: 'Savon', position: 1, color: '#FF00FF' },
    ] },
    { title: 'Todo', position: 2, cards: [
      { content: 'Dormir', position: 1, color: '#FF0000' },
      { content: 'Nourrir le chat', position: 2 },
      { content: 'Devenir le meilleur dresseur', position: 3 },
    ] },
    { title: 'Liste des anniversaires', position: 3, cards: [
      { content: 'Maman le 01/01/1970', position: 1, color: '#0000FF' },
    ] }
  ], { include: ["cards"] });

  // 4️⃣ Ajouter Tags aux cartes
  async function addTagToCard(cardContent, tagEntity) {
    const card = await Card.findOne({ where: { content: cardContent }});
    await card.addTag(tagEntity);
  }
  await addTagToCard("Savon", ecoTag);
  await addTagToCard("Savon", urgentTag);
  await addTagToCard("Nourrir le chat", urgentTag);
  await addTagToCard("Dormir", lateTag);


  // 6️⃣ Fermer la connexion **une seule fois**
  await sequelize.close();
})();