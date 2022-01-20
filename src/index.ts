import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";

import Logger from "../shared/Logger";
import Convert from "./convert";
import { CamelizeBodyKeys, ErrorHandler, RequestLogger } from "./middleware";

const MAX_BODY_SIZE = "20mb";

dotenv.config();

const app = express();
app.use(bodyParser.json({ inflate: true, limit: MAX_BODY_SIZE }));
app.use(ErrorHandler);
app.use(CamelizeBodyKeys);
app.use(RequestLogger);

app.get("/health", (_, res) => {
  res.status(200).json({ message: "Everything's good!" });
});

app.use("/convert", Convert);

const port = process.env.HELLO_PDF_SERVER_PORT || 4000;
app.listen(port);
Logger.log(`Running an API server listening on port ${port}`);
