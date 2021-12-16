import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.join(__dirname, "/../.env.test") });

const file = fs.readFileSync(path.resolve(__dirname, "./test.html"), "utf8");
const port = process.env.PORT || 4000;

export const FILENAME = process.env.FILENAME || "test";
export const URL = `http://localhost:${port}/convert`;

export const CommonPayload = {
  filename: FILENAME,
  marginTop: "2cm",
  marginRight: "2cm",
  marginBottom: "2cm",
  marginLeft: "2cm",
};

export const GetBaseFormData = () => {
  const form = new FormData();
  Object.entries(CommonPayload).forEach(([key, value]) => form.append(key, value));

  form.append("body", Buffer.from(file), { filename: FILENAME });

  return form;
};
