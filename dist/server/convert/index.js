"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Get_1 = __importDefault(require("./Get"));
const Post_1 = __importDefault(require("./Post"));
const Routes = (0, express_1.Router)();
Routes.post("/", Post_1.default);
Routes.get("/:jobId", Get_1.default);
exports.default = Routes;
