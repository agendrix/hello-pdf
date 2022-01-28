"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodejs_1 = require("@appsignal/nodejs");
const AppSignal = new nodejs_1.Appsignal({
    name: "HelloPdf",
    environment: process.env.APPSIGNAL_APP_ENV,
    active: process.env.APPSIGNAL_PUSH_API_KEY !== undefined,
    pushApiKey: process.env.APPSIGNAL_PUSH_API_KEY,
    log: "stdout",
    // TODO: Ignore health checks
    ignoreActions: [],
});
exports.default = AppSignal;
