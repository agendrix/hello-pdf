"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// To auto-instrument modules, the Appsignal module must be both required and initialized before any other package
const express_1 = require("@appsignal/express");
const compression_1 = __importDefault(require("compression"));
const express_2 = __importDefault(require("express"));
const AppSignal_1 = __importDefault(require("./AppSignal"));
const convert_1 = __importDefault(require("./convert"));
const health_1 = __importDefault(require("./health"));
const middleware_1 = require("./middleware");
const monitor_1 = __importDefault(require("./monitor"));
const app = (0, express_2.default)();
// Middlewares
app.use(express_2.default.json({
    inflate: true,
    limit: process.env.HELLO_PDF_MAX_BODY_SIZE || "50mb",
}));
app.use((0, compression_1.default)({ filter: middleware_1.ShouldCompress }));
app.use(middleware_1.CamelizeBodyKeys);
app.use(middleware_1.RequestLogger);
// The AppSignal express middleware must be AFTER all other express middleware but BEFORE any routes
app.use((0, express_1.expressMiddleware)(AppSignal_1.default));
// Routers
app.get("/health", health_1.default);
app.use("/convert", convert_1.default);
app.use("/monitor", monitor_1.default);
// Error handlers
app.use((0, express_1.expressErrorHandler)(AppSignal_1.default));
app.use(middleware_1.ErrorHandler);
app.use(express_2.default.static("public"));
exports.default = app;
