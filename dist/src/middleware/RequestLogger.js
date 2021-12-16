"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../../shared");
function default_1(req, _, next) {
    var _a;
    shared_1.Logger.log("request received", {
        method: req.method,
        path: req.originalUrl,
        async: req.body.async,
        filename: req.body.filename,
        files: {
            body: !!req.body.body,
            header: !!req.body.header,
            footer: !!req.body.footer,
        },
        webhookUrl: req.body.webhookUrl,
        s3Url: (_a = req.body.s3Url) === null || _a === void 0 ? void 0 : _a.split("?")[0],
    });
    next();
}
exports.default = default_1;
