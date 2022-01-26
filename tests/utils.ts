import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { deflateSync } from "zlib";

dotenv.config({ path: path.join(__dirname, "/../.env.test") });

const file = fs.readFileSync(path.resolve(__dirname, "./test.html"), "utf8");
const port = process.env.HELLO_PDF_SERVER_PORT || 4000;

export const FILENAME = process.env.FILENAME || "test";
export const URL = `http://localhost:${port}/convert`;

export const CommonPayload = {
  filename: FILENAME,
  margins: {
    top: "2cm",
    right: "2cm",
    bottom: "2cm",
    left: "2cm",
  },
  scale: 0.5,
  landscape: true,
};

export const GetBasePayload = () => {
  return { ...CommonPayload, body: file };
};
