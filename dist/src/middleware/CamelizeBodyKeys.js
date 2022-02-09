"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../../shared");
function default_1(req, _, next) {
    req.body = (0, shared_1.Camelize)(req.body);
    next();
}
exports.default = default_1;
