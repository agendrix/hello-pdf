import { writeFileSync } from "fs";

import { FILENAME, GetBaseFormData, URL } from "./utils";

GetBaseFormData().submit(URL, function (err, res) {
  if (err) {
    console.log("Sync upload failed:");
    console.log(err);

    return;
  }

  const data: Array<any> = [];
  res.on("data", (chunk) => {
    data.push(chunk);
  });

  res.on("end", () => {
    const path = `tests/pdfs/${FILENAME}.pdf`;
    writeFileSync(path, Buffer.concat(data));
    console.log("Sync upload succeed.");
    console.log(`Pdf written to: ${path}`);
  });
});
