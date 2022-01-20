"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const producer_1 = __importDefault(require("../../lib/producer"));
const shared_1 = require("../../shared");
const types_1 = require("../../shared/types");
const middleware_1 = require("../middleware");
const mandatoryFields = ["filename", "body"];
const post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, body, header = undefined, footer = undefined, webhookUrl = undefined, s3Url = undefined, margins = undefined, } = req.body;
    const metadata = new shared_1.HtmlDocument.Metadata(types_1.Status.Queued, webhookUrl, s3Url);
    const document = new shared_1.HtmlDocument(filename, body, metadata, margins, header, footer);
    let job = yield producer_1.default.enqueue(document);
    if (!s3Url) {
        yield job.finished();
        job = yield (0, shared_1.GetJob)(job.id);
        if (!job) {
            throw new shared_1.ErrorResult("Something weird happened. The job finished but we were unable to retrieve it.");
        }
        res.contentType("application/pdf");
        return res.status(200).send(Buffer.from(job === null || job === void 0 ? void 0 : job.returnvalue.data));
    }
    res.status(200).json(new shared_1.AsyncResult(job.id, filename, document.meta.status, webhookUrl, s3Url));
});
exports.default = [(0, middleware_1.RequiredBodyFields)(mandatoryFields), post];
