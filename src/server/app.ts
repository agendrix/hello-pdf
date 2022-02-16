// To auto-instrument modules, the Appsignal module must be both required and initialized before any other package
import { expressMiddleware as appSignalMiddleware, expressErrorHandler } from "@appsignal/express";
import compression from "compression";
import express from "express";

import AppSignal from "./AppSignal";
import Convert from "./convert";
import Health from "./health";
import { CamelizeBodyKeys, ErrorHandler, RequestLogger, ShouldCompress } from "./middleware";
import Monitor from "./monitor";

const app = express();

// Middlewares
app.use(
  express.json({
    inflate: true,
    limit: process.env.HELLO_PDF_MAX_BODY_SIZE || "50mb",
  }),
);
app.use(compression({ filter: ShouldCompress }));
app.use(CamelizeBodyKeys);
app.use(RequestLogger);
// The AppSignal express middleware must be AFTER all other express middleware but BEFORE any routes
app.use(appSignalMiddleware(AppSignal));

// Routers
app.get("/health", Health);
app.use("/convert", Convert);
app.use("/monitor", Monitor);

// Error handlers
app.use(expressErrorHandler(AppSignal));
app.use(ErrorHandler);

app.use(express.static("public"));

export default app;
