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
class Producer {
    constructor(queue) {
        this.queue = queue;
    }
    enqueue(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queue.add(document, {
                attempts: 10,
                backoff: { type: "exponential", delay: 500 }, // Max delay: https://github.com/OptimalBits/bull/blob/master/lib/backoffs.js#L12
            });
        });
    }
}
exports.default = new Producer(shared_1.Queue);
