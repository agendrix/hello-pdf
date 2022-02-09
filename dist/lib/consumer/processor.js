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
const zlib_1 = require("zlib");
const shared_1 = require("../../shared");
const types_1 = require("../../shared/types");
const pdfEngine_1 = __importDefault(require("../pdfEngine"));
module.exports = function (job) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const document = job.data;
            const { webhookUrl, s3Url } = document.meta;
            try {
                const pdf = yield pdfEngine_1.default.render(document);
                if (s3Url) {
                    yield uploadPdfToS3(s3Url, pdf);
                    yield updateJobStatus(job, types_1.Status.Completed);
                }
                resolve(s3Url ? document : compress(pdf));
            }
            catch (e) {
                yield updateJobStatus(job, types_1.Status.Failed);
                shared_1.Logger.error("An error occured", e);
                reject(e);
            }
            finally {
                if (webhookUrl)
                    yield postToWebhook(webhookUrl, job.id);
            }
        }));
    });
};
function updateJobStatus(job, status) {
    const document = job.data;
    document.meta = Object.assign(Object.assign({}, document.meta), { status: status });
    return job.update(document);
}
function uploadPdfToS3(presignedS3Url, pdf) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadResponse = yield shared_1.Http.put(presignedS3Url, pdf, "application/pdf");
        if (uploadResponse.statusCode != 200) {
            throw new Error(`Something went wrong while uploading the pdf to S3. statusCode: ${uploadResponse.statusCode}, data: ${uploadResponse.data.toString("utf-8")}`);
        }
    });
}
function postToWebhook(url, jobId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield shared_1.Http.post(url, new shared_1.AsyncResult(jobId));
        if (response.statusCode != 200) {
            shared_1.Logger.error(`Pdf was rendered and uploaded successfully but the webhook http called returned an unsuccessful status code. statusCode: ${response.statusCode}, data: ${response.data.toString("utf-8")}`, { jobId });
        }
    });
}
function compress(file) {
    return (0, zlib_1.deflateSync)(file);
}
