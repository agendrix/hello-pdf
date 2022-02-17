"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const app_1 = __importDefault(require("./app"));
const port = process.env.HELLO_PDF_SERVER_PORT || 4000;
app_1.default.listen(port);
lib_1.Logger.log(`Running an API server listening on port ${port}`);
