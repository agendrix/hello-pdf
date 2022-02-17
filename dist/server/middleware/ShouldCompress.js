"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, _res) {
    var _a;
    return ((_a = req.headers["accept-encoding"]) === null || _a === void 0 ? void 0 : _a.includes("deflate")) || false;
}
exports.default = default_1;
