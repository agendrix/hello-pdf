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
const __1 = require("..");
// https://peter.sh/experiments/chromium-command-line-switches/
const puppeteerFlags = [
    "--font-render-hinting=none",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-extensions",
    "--disable-setuid-sandbox",
    "--no-sandbox",
];
if (process.env.NODE_ENV == "test") {
    puppeteerFlags.push('--js-flags="--max-old-space-size=1024"');
}
// 'userDataDir' enables sharing of cached assets between browser sessions
const userDataDir = process.env.NODE_ENV == "production" ? "/tmp" : undefined;
class PdfEngine {
    constructor() { }
    static render(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                __1.Logger.debug("pdf-engine", "Starting a new browser");
                const browser = yield puppeteer_1.default.launch({ args: puppeteerFlags, userDataDir: userDataDir });
                try {
                    __1.Logger.debug("pdf-engine", "Starting a new page");
                    const page = yield browser.newPage();
                    yield page.setContent(document.body, { waitUntil: "networkidle2" });
                    __1.Logger.debug("pdf-engine", "Pdf rendering start");
                    const pdf = yield page.pdf({
                        displayHeaderFooter: (document.header || document.footer) != undefined,
                        headerTemplate: document.header,
                        footerTemplate: document.footer,
                        printBackground: true,
                        margin: document.margins,
                        landscape: document.landscape,
                        scale: document.scale,
                        timeout: process.env.HELLO_PDF_PRINT_TIMEOUT ? Number(process.env.HELLO_PDF_PRINT_TIMEOUT) : 1000 * 60 * 15,
                    });
                    __1.Logger.debug("pdf-engine", "Pdf rendering done");
                    resolve(pdf);
                }
                catch (e) {
                    reject(e);
                }
                finally {
                    browser.close();
                }
            }));
        });
    }
}
exports.default = PdfEngine;
