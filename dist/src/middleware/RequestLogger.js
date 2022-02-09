"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../../shared");
const skipLoggingForPaths = ["/health"];
function default_1(req, _, next) {
    var _a;
    let request = {
        method: req.method,
        path: req.originalUrl,
    };
    if (req.body) {
        request = Object.assign(Object.assign({}, request), { body: {
                async: req.body.async,
                filename: req.body.filename,
                body_present: !!req.body.body,
                header_present: !!req.body.header,
                footer_present: !!req.body.footer,
                scale: req.body.scale,
                landscape: req.body.landscape,
                margins: req.body.margins,
                webhookUrl: req.body.webhookUrl,
                s3Url: (_a = req.body.s3Url) === null || _a === void 0 ? void 0 : _a.split("?")[0],
            } });
    }
    if (!skipLoggingForPaths.includes(request.path))
        shared_1.Logger.log("request received", request);
    next();
}
exports.default = default_1;
