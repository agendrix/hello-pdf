import { FILENAME, GetBaseFormData, URL } from "./utils";

const form = GetBaseFormData();

form.append("s3Url", "some url");
form.append("webhookUrl", "some other url");

form.submit(URL, function (err, res) {
  if (err) {
    console.log("Async upload failed:");
    console.log(err);

    return;
  }

  var body = "";
  res.on("data", function () {
    body += res.read();
  });

  res.on("end", () => {
    console.log(body);
    console.log("Returned first response.");
    // const path = `tests/pdfs/${FILENAME}.pdf`;
    // console.log("Sync upload succeed.");
    // console.log(`Pdf written to: ${path}`);
  });
});
