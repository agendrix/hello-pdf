"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
function default_1(error, _, res, _next) {
    lib_1.Logger.error("Internal server error", error);
    res.status(500).send(new lib_1.ErrorResult("Internal server error"));
}
exports.default = default_1;
