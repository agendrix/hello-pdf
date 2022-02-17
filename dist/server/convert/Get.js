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
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    const job = yield (0, lib_1.GetJob)(jobId);
    const status = job === null || job === void 0 ? void 0 : job.data.meta.status;
    const s3Url = job === null || job === void 0 ? void 0 : job.data.meta.s3Url;
    const webhookUrl = job === null || job === void 0 ? void 0 : job.data.meta.webhookUrl;
    const filename = job === null || job === void 0 ? void 0 : job.data.filename;
    if (job)
        res.status(200).json(new lib_1.AsyncResult(jobId, filename, status, webhookUrl, s3Url));
    else
        res.status(404).json(new lib_1.ErrorResult("Unable to find a job with the provided id."));
});
