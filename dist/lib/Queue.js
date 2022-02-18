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
exports.cleanJobDataForStorage = exports.GetJob = void 0;
const bull_1 = __importDefault(require("bull"));
const _1 = require(".");
const Queue_1 = __importDefault(require("./Queue"));
const ServiceQueue = new bull_1.default("documents", process.env.HELLO_PDF_REDIS_URL || "redis://127.0.0.1:6379");
const GetJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    return Queue_1.default.getJob(jobId);
});
exports.GetJob = GetJob;
const cleanJobDataForStorage = (job) => __awaiter(void 0, void 0, void 0, function* () {
    _1.Logger.debug("queue", "Clean job data for storage");
    return job.update(Object.assign(Object.assign({}, job.data), { body: "", header: "", footer: "", renderedPdf: "" }));
});
exports.cleanJobDataForStorage = cleanJobDataForStorage;
exports.default = ServiceQueue;
