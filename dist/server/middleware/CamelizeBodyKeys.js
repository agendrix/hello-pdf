"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
function default_1(req, _, next) {
    req.body = (0, lib_1.Camelize)(req.body);
    next();
}
exports.default = default_1;
