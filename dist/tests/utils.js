"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBaseFormData = exports.CommonPayload = exports.URL = exports.FILENAME = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "/../.env.test") });
const file = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "./test.html"), "utf8");
const port = process.env.HELLO_PDF_SERVER_PORT || 4000;
exports.FILENAME = process.env.FILENAME || "test";
exports.URL = `http://localhost:${port}/convert`;
exports.CommonPayload = {
    filename: exports.FILENAME,
    margin_top: "2cm",
    margin_right: "2cm",
    margin_bottom: "2cm",
    margin_left: "2cm",
};
const GetBaseFormData = () => {
    const form = new form_data_1.default();
    Object.entries(exports.CommonPayload).forEach(([key, value]) => form.append(key, value));
    form.append("body", Buffer.from(file), { filename: exports.FILENAME });
    return form;
};
exports.GetBaseFormData = GetBaseFormData;
