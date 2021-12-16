"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
console.log("================= Async Upload: Start =====================\n");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.put("/bucket", (req, res) => {
    console.log("Sent pdf to S3 bucket!");
    const path = `tests/pdfs/${utils_1.FILENAME}.pdf`;
    let data = [];
    req.on("data", function (chunk) {
        data.push(chunk);
    });
    req.on("end", function () {
        fs_1.default.writeFileSync(path, Buffer.concat(data));
        console.log(`Pdf written to: ${path}`);
        res.status(200).json({ message: "Everything's good!" });
    });
});
app.post("/webhook", (req, res) => {
    console.log("Sent result to webhook!");
    console.log(req.body);
    res.status(200).json({ message: "Everything's good!" });
    httpServer.close();
    console.log("\n================= Async Upload: End   =====================");
});
const httpServer = require("http").createServer(app);
httpServer.listen(5000, () => {
    console.log("Started server for webhook.");
    const form = (0, utils_1.GetBaseFormData)();
    form.append("webhook_url", "http://localhost:5000/webhook");
    form.append("s3_url", "http://localhost:5000/bucket");
    form.submit(utils_1.URL, function (err, res) {
        if (err) {
            console.log("Async upload failed:");
            console.log(err);
            return;
        }
        let data = "";
        res.on("data", function (chunk) {
            data += chunk;
        });
        res.on("end", () => {
            const body = JSON.parse(data);
            console.log(`File '${body["filename"]}' with id '${body["id"]}' has been queued.`);
        });
    });
});
