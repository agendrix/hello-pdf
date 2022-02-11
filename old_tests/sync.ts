import { writeFileSync } from "fs";
import { inflateSync } from "zlib";

import { Http } from "../src/lib";
import { FILENAME, GetBasePayload, URL } from "./utils";

const syncTest = async () => {
  console.log("================= Sync Upload: Start =====================\n");

  const response = await Http.post(URL, JSON.stringify(GetBasePayload()));
  const path = `tests/pdfs/${FILENAME}.pdf`;
  writeFileSync(path, inflateSync(response.data));
  console.log("Sync upload succeed.");
  console.log(`Pdf written to: ${path}`);

  console.log("\n================= Sync Upload: End   =====================");
};

syncTest();
