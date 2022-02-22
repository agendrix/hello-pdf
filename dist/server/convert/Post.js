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
const lib_1 = require("../../lib");
const Queue_1 = require("../../lib/Queue");
const producer_1 = __importDefault(require("../../lib/producer"));
const middleware_1 = require("../middleware");
const mandatoryFields = ["filename", "body"];
const post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const document = buildDocument(req.body);
    const async = document.meta.webhookUrl && document.meta.s3Url;
    if ((document.meta.s3Url && !document.meta.webhookUrl) || (!document.meta.s3Url && document.meta.webhookUrl)) {
        return res.status(400).json(new lib_1.ErrorResult("Both s3_url and webhook_url must be defined."));
    }
    lib_1.Logger.debug("post", `Enqueuing document, async: ${!!async}`);
    const job = yield producer_1.default.enqueue(document);
    try {
        if (!async) {
            yield waitForJobToFinish(job);
            const renderedPdf = yield getJobRenderedPdf(job);
            res.contentType("application/pdf");
            res.status(200).send(Buffer.from(renderedPdf, "base64"));
        }
        else {
            const asyncResult = new lib_1.AsyncResult(job.id, document.filename, document.meta.status, document.meta.webhookUrl, document.meta.s3Url);
            res.status(200).json(asyncResult);
        }
    }
    finally {
        yield (0, Queue_1.cleanJobDataForStorage)(job);
    }
});
const waitForJobToFinish = (job) => __awaiter(void 0, void 0, void 0, function* () {
    lib_1.Logger.debug("post", "Waiting for job to finish");
    try {
        yield job.finished();
    }
    catch (_a) {
        throw new lib_1.ErrorResult("The job failed all of its attempts.");
    }
    lib_1.Logger.debug("post", "Job finished");
});
const getJobRenderedPdf = (job) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshedJob = yield (0, lib_1.GetJob)(job.id);
    if (refreshedJob && refreshedJob.data.renderedPdf) {
        return refreshedJob.data.renderedPdf;
    }
    else {
        throw new lib_1.ErrorResult("The job finished but rendered pdf was not present.");
    }
});
const buildDocument = (requestBody) => {
    const { filename, body, header = undefined, footer = undefined, webhookUrl = undefined, s3Url = undefined, margins = undefined, scale = undefined, landscape = undefined, } = requestBody;
    const metadata = new lib_1.HtmlDocument.Metadata(lib_1.Status.Queued, webhookUrl, s3Url);
    return new lib_1.HtmlDocument(filename, body, metadata, margins, header, footer, scale, landscape);
};
exports.default = [(0, middleware_1.RequiredBodyFields)(mandatoryFields), (0, middleware_1.AsyncRoute)(post)];
