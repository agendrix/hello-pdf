// To auto-instrument modules, the Appsignal module must be both required and initialized before any other package
import { expressMiddleware as appSignalMiddleware, expressErrorHandler } from "@appsignal/express";
import bodyParser from "body-parser";
import express from "express";

import AppSignal from "./AppSignal";
import Convert from "./convert";
import Health from "./health";
import { CamelizeBodyKeys, ErrorHandler, RequestLogger } from "./middleware";

const app = express();

// Middlewares
app.use(
  bodyParser.json({
    inflate: true,
    limit: process.env.HELLO_PDF_MAX_BODY_SIZE || "50mb",
  }),
);
app.use(CamelizeBodyKeys);
app.use(RequestLogger);
// The AppSignal express middleware must be AFTER all other express middleware but BEFORE any routes
app.use(appSignalMiddleware(AppSignal));

// Routers
app.get("/health", Health);
app.use("/convert", Convert);

// Error handlers
app.use(expressErrorHandler(AppSignal));
app.use(ErrorHandler);

export default app;
