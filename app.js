import fs from "node:fs/promises";

import bodyParser from "body-parser";
import express from "express";
import path from "node:path";

const app = express();

app.use(express.static("images"));
app.use(bodyParser.json());

const userPlacesPath = path.join(process.cwd("data", "user-places.json"));
const placesPath = path.join(process.cwd("data", "places.json"));
// CORS

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT", "OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.get("/places", async (req, res) => {
  const fileContent = await fs.readFile(placesPath);

  const placesData = JSON.parse(fileContent);

  res.status(200).json({ places: placesData });
});

app.get("/user-places", async (req, res) => {
  const fileContent = await fs.readFile(userPlacesPath);

  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});

app.put("/user-places", async (req, res) => {
  const places = req.body.places;

  await fs.writeFile(userPlacesPath, JSON.stringify(places));

  res.status(200).json({ message: "User places updated!" });
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

export default app;
