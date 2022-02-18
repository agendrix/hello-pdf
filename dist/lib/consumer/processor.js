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
const Queue_1 = require("../Queue");
const pdfEngine_1 = __importDefault(require("../pdfEngine"));
module.exports = function (job) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const document = job.data;
            const { webhookUrl, s3Url } = document.meta;
            const async = webhookUrl && s3Url;
            lib_1.Logger.debug("processor", `Starting job ${job.id}, async: ${!!async}`);
            try {
                const pdf = yield pdfEngine_1.default.render(lib_1.HtmlDocument.from(document));
                if (async) {
                    yield uploadPdfToS3(s3Url, pdf);
                    yield (0, Queue_1.cleanJobDataForStorage)(job);
                }
                else {
                    yield updateJobData(job, { renderedPdf: pdf.toString("base64") });
                }
                yield updateJobStatus(job, lib_1.Status.Completed);
                resolve(null);
            }
            catch (error) {
                if (isLastAttempt(job)) {
                    yield updateJobStatus(job, lib_1.Status.Failed);
                }
                lib_1.Logger.error(`An error occured while processing job: ${error}`, error);
                reject(error);
            }
            finally {
                if (async && (job.data.meta.status === lib_1.Status.Completed || job.data.meta.status === lib_1.Status.Failed)) {
                    yield postToWebhook(webhookUrl, job.id);
                }
            }
        }));
    });
};
function updateJobData(job, data) {
    lib_1.Logger.debug("processor", `Updating job data`);
    return job.update(Object.assign(Object.assign({}, job.data), data));
}
function updateJobStatus(job, status) {
    lib_1.Logger.debug("processor", `Updating job status to ${status}`);
    const document = job.data;
    document.meta = Object.assign(Object.assign({}, document.meta), { status: status });
    return job.update(document);
}
function uploadPdfToS3(presignedS3Url, pdf) {
    return __awaiter(this, void 0, void 0, function* () {
        lib_1.Logger.debug("processor", "Starting upload to s3");
        const uploadResponse = yield lib_1.Http.put(presignedS3Url, pdf, "application/pdf");
        if (uploadResponse.statusCode != 200) {
            throw new Error(`Something went wrong while uploading the pdf to S3. statusCode: ${uploadResponse.statusCode}, data: ${uploadResponse.data.toString("utf-8")}`);
        }
        lib_1.Logger.debug("processor", "Finished upload to s3");
    });
}
function postToWebhook(url, jobId) {
    return __awaiter(this, void 0, void 0, function* () {
        lib_1.Logger.debug("processor", "Posting to webhook");
        const response = yield lib_1.Http.post(url, new lib_1.AsyncResult(jobId));
        if (response.statusCode != 200) {
            lib_1.Logger.error(`Pdf was rendered and uploaded successfully but the webhook http called returned an unsuccessful status code. statusCode: ${response.statusCode}, data: ${response.data.toString("utf-8")}`, { jobId });
        }
    });
}
function isLastAttempt(job) {
    return job.attemptsMade === Number(job.opts.attempts) - 1;
}
