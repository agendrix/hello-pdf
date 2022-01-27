"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Routes = (0, express_1.Router)();
Routes.get("/health", (_, res) => {
    res.status(200).json({ message: "Everything's good!" });
});
exports.default = Routes;
