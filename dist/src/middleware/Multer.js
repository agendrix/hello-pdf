"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const Upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
function appendFilesToBody(req, _, next) {
    if (req.files) {
        req.files.forEach((file) => {
            req.body[file.fieldname] = file.buffer.toString();
        });
        delete req.files;
    }
    next();
}
exports.default = [Upload.any(), appendFilesToBody];
