"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Result_1 = __importDefault(require("./Result"));
class ErrorResult extends Result_1.default {
    constructor(errorMessage) {
        super();
        this.errorMessage = errorMessage;
    }
}
exports.default = ErrorResult;
