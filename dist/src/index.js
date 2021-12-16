"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const Logger_1 = __importDefault(require("../shared/Logger"));
const convert_1 = __importDefault(require("./convert"));
const middleware_1 = require("./middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(middleware_1.ErrorHandler);
app.use(middleware_1.Multer);
app.use(middleware_1.CamelizeBodyKeys);
app.use(middleware_1.RequestLogger);
app.get("/health", (_, res) => {
    res.status(200).json({ message: "Everything's good!" });
});
app.use("/convert", convert_1.default);
const port = process.env.HELLO_PDF_SERVER_PORT || 4000;
app.listen(port);
Logger_1.default.log(`Running an API server listening on port ${port}`);
