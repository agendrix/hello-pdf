import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.join(__dirname, "/../.env.test") });

const file = fs.readFileSync(path.resolve(__dirname, "./test.html"), "utf8");
const port = process.env.HELLO_PDF_SERVER_PORT || 4000;

export const FILENAME = process.env.FILENAME || "test";
export const URL = `http://localhost:${port}/convert`;

export const CommonPayload = {
  filename: FILENAME,
  margin_top: "2cm",
  margin_right: "2cm",
  margin_bottom: "2cm",
  margin_left: "2cm",
};

export const GetBaseFormData = () => {
  const form = new FormData();
  Object.entries(CommonPayload).forEach(([key, value]) => form.append(key, value));

  form.append("body", Buffer.from(file), { filename: FILENAME });

  return form;
};
