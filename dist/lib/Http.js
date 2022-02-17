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
exports.put = exports.post = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
function request(uri, method, payload, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new URL(uri).protocol === "https:" ? https_1.default : http_1.default;
        const options = {
            method: method,
            headers: {
                "Content-Type": contentType,
                "Content-Length": Buffer.byteLength(payload),
            },
        };
        return new Promise((resolve, reject) => {
            const request = client.request(uri, options, (res) => {
                const data = [];
                res.on("data", (chunk) => {
                    data.push(chunk);
                });
                res.on("end", () => resolve({ statusCode: res.statusCode, data: Buffer.concat(data) }));
            });
            request.on("error", reject);
            request.write(payload, () => request.end());
        });
    });
}
function post(uri, data, contentType = "application/json") {
    if (data instanceof Object && contentType === "application/json") {
        data = JSON.stringify(data);
    }
    return request(uri, "POST", data, contentType);
}
exports.post = post;
function put(uri, data, contentType = "application/json") {
    if (data instanceof Object && contentType === "application/json") {
        data = JSON.stringify(data);
    }
    return request(uri, "PUT", data, contentType);
}
exports.put = put;
