"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const Logger_1 = __importDefault(require("../shared/Logger"));
const convert_1 = __importDefault(require("./convert"));
const health_1 = __importDefault(require("./health"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
// Middlewares
app.use(body_parser_1.default.json({ inflate: true, limit: process.env.HELLO_PDF_MAX_BODY_SIZE || "20mb" }));
app.use(middleware_1.ErrorHandler);
app.use(middleware_1.CamelizeBodyKeys);
app.use(middleware_1.RequestLogger);
// Routers
app.use("/health", health_1.default);
app.use("/convert", convert_1.default);
const port = process.env.HELLO_PDF_SERVER_PORT || 4000;
app.listen(port);
Logger_1.default.log(`Running an API server listening on port ${port}`);
