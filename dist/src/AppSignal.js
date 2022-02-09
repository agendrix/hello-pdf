"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodejs_1 = require("@appsignal/nodejs");
const appSignalClient = new nodejs_1.Appsignal({
    name: "HelloPdf",
    environment: process.env.APPSIGNAL_APP_ENV,
    active: process.env.APPSIGNAL_PUSH_API_KEY !== undefined && process.env.NODE_ENV === "production",
    pushApiKey: process.env.APPSIGNAL_PUSH_API_KEY,
    log: "stdout",
    ignoreActions: ["GET /health"],
    debug: false,
});
exports.default = appSignalClient;
