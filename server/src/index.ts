import dotenv from "dotenv";
import express from "express";

import Logger from "../shared/Logger";
import Convert from "./convert";
import { Multer, RequestLogger } from "./middleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(Multer);
app.use(RequestLogger);

app.get("/health", (_, res) => {
  res.status(200).json({ message: "Everything's good!" });
});

app.use("/convert", Convert);

const port = process.env.PORT || 4000;
app.listen(port);
Logger.log(`Running an API server listening on port ${port}`);
