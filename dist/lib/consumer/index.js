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
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const shared_1 = require("../../shared");
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
function Processor() {
    const processor = (0, fs_1.readdirSync)(__dirname).find((file) => file.search(/^processor\.[js|ts]+/) != -1);
    return `${__dirname}/${processor}`;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, logger_1.default)();
        const concurrency = Number(process.env.HELLO_PDF_CONCURRENY) || 1;
        shared_1.Logger.log(`Workers started with concurrency: ${concurrency}`);
        const processor = Processor();
        if (processor) {
            shared_1.Queue.process(concurrency, processor);
        }
        else {
            throw new Error("Queue process not found");
        }
    });
}
main();
