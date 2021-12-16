import dotenv from "dotenv";
import FormData from "form-data";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

dotenv.config({ path: path.join(__dirname, "/../.env.test") });

const port = process.env.PORT || 4000;
const url = `http://localhost:${port}/convert`;
const filename = "test";
const file = readFileSync(path.resolve(__dirname, "./test.html"), "utf8");

const payload = {
  filename: filename,
  marginTop: "2cm",
  marginRight: "2cm",
  marginBottom: "2cm",
  marginLeft: "2cm",
};

const form = new FormData();
Object.entries(payload).forEach(([key, value]) => form.append(key, value));

form.append("body", Buffer.from(file), { filename: filename });

form.submit(url, function (_err, res) {
  if (_err) {
    console.log(_err);
  }

  const data: Array<any> = [];
  res.on("data", (chunk) => {
    data.push(chunk);
  });

  res.on("end", () => {
    writeFileSync(`tests/pdfs/${payload.filename}.pdf`, Buffer.concat(data));
  });
});
