"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const utils_1 = require("./utils");
console.log("================= Sync Upload: Start =====================\n");
(0, utils_1.GetBaseFormData)().submit(utils_1.URL, function (err, res) {
    if (err) {
        console.log("Sync upload failed:");
        console.log(err);
        return;
    }
    const data = [];
    res.on("data", (chunk) => {
        data.push(chunk);
    });
    res.on("end", () => {
        const path = `tests/pdfs/${utils_1.FILENAME}.pdf`;
        (0, fs_1.writeFileSync)(path, Buffer.concat(data));
        console.log("Sync upload succeed.");
        console.log(`Pdf written to: ${path}`);
        console.log("\n================= Sync Upload: End   =====================");
    });
});
