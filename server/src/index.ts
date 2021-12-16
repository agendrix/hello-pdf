import dotenv from "dotenv";
import express from "express";

import Logger from "../shared/Logger";
import Convert from "./convert";
import { CamelizeBodyKeys, ErrorHandler, Multer, RequestLogger } from "./middleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(ErrorHandler);
app.use(Multer);
app.use(CamelizeBodyKeys);
app.use(RequestLogger);

app.get("/health", (_, res) => {
  res.status(200).json({ message: "Everything's good!" });
});

app.use("/convert", Convert);

const port = process.env.HELLO_PDF_SERVER_PORT || 4000;
app.listen(port);
Logger.log(`Running an API server listening on port ${port}`);
