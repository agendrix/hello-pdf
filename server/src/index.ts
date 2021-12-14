import express from "express";
import dotenv from "dotenv";

import Convert from "./convert";

const defaultPort = 4000;

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.status(200).json({ message: "Everything's good!" });
});

app.use("/convert", Convert);

const port = process.env.PORT || defaultPort;
app.listen(port);
console.log(`Running an API server at localhost:${port}`);
