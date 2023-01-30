import cors from "cors";
import express from "express";
import morgan from "morgan";

import { seedDatabase } from "./database";
import { UserController } from "./controllers/user_controller";
import { ProductController } from "./controllers/product_controller";
import { MenuController } from "./controllers/menu_controller";

const app = express();

app.use(express.json());

app.use(cors());

app.use(morgan("dev"));

seedDatabase();

// app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to mock-server!" });
});

app.get("/api/seed", async (req, res) => {
  await seedDatabase();
  res.send({ success: true });
});

app.use("/api/users", UserController.router);
app.use("/api/products", ProductController.router);
app.use("/api/menu", MenuController.router);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on("error", console.error);
