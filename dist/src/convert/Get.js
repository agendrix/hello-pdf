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
const shared_1 = require("../../shared");
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    const job = yield (0, shared_1.GetJob)(jobId);
    const status = job === null || job === void 0 ? void 0 : job.data.meta.status;
    const filename = job === null || job === void 0 ? void 0 : job.data.filename;
    if (job)
        res.status(200).json(new shared_1.AsyncResult(jobId, filename, status));
    else
        res.status(404).json(new shared_1.ErrorResult("Unable to find a job with the provided id."));
});