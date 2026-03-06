import "dotenv/config";
import express from "express";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import { errorHandler } from "./middlewares/common.middleware.js";
import listRoutes from "./routes/list.routes.js";
import cardRoutes from "./routes/card.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import authRoutes from "./routes/auth.routes.js";
import mistralRoutes from "./routes/mistral.routes.js"
import { authenticate } from "./middlewares/auth.middleware.js";

const PORT = process.env.PORT || 3000;

const app = express();

// Autorise tous les clients à contacter notre API
app.use(cors());
app.use(xss())
app.use(express.json());

app.use("/auth", authRoutes);

// Ce middleware s'applique à toutes les routes suivantes mais pas aux précédentes. 
app.use(authenticate)

app.use("/mistral", mistralRoutes);
app.use("/lists", listRoutes);
app.use("/cards", cardRoutes);
app.use("/tags", tagRoutes);


app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
