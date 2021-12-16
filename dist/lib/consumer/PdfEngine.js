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
const puppeteer_1 = __importDefault(require("puppeteer"));
const puppeteerFlags = [
    "--disable-dev-shm-usage",
    "--font-render-hinting=none",
    "--disable-gpu",
    "--disable-extensions",
    "--disable-setuid-sandbox",
    "--no-sandbox",
];
class PdfEngine {
    constructor() { }
    static render(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const browser = yield puppeteer_1.default.launch({ args: puppeteerFlags });
                const page = yield browser.newPage();
                page.on("error", (e) => reject(e));
                const pdf = yield page.pdf({
                    displayHeaderFooter: (document.header || document.footer) != undefined,
                    headerTemplate: document.header,
                    footerTemplate: document.footer,
                    printBackground: true,
                    landscape: false,
                    margin: document.margins,
                    timeout: 1000 * 60 * 15,
                });
                resolve(pdf);
                browser.close();
            }));
        });
    }
}
exports.default = PdfEngine;