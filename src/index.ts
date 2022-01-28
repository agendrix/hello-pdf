import bodyParser from "body-parser";
import express from "express";

import Logger from "../shared/Logger";
import Convert from "./convert";
import Health from "./health";
import { CamelizeBodyKeys, ErrorHandler, RequestLogger } from "./middleware";

const app = express();

// Middlewares
app.use(bodyParser.json({ inflate: true, limit: process.env.HELLO_PDF_MAX_BODY_SIZE || "20mb" }));
app.use(ErrorHandler);
app.use(CamelizeBodyKeys);
app.use(RequestLogger);

// Routers
app.get("/health", Health);
app.use("/convert", Convert);

const port = process.env.HELLO_PDF_SERVER_PORT || 4000;
app.listen(port);
Logger.log(`Running an API server listening on port ${port}`);
