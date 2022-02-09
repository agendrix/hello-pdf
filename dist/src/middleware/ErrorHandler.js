"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../../shared");
function default_1(error, _, res, _next) {
    shared_1.Logger.error("Internal server error", error);
    res.status(500).send(new shared_1.ErrorResult("Internal server error"));
}
exports.default = default_1;
