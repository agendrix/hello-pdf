"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Result_1 = __importDefault(require("./Result"));
class AsyncResult extends Result_1.default {
    constructor(id, filename = null, status = null, webhookUrl = null, s3Url = null) {
        super();
        this.id = id;
        this.filename = filename;
        this.status = status;
        this.webhookUrl = webhookUrl;
        this.s3Url = s3Url;
    }
}
exports.default = AsyncResult;
