import { Job } from "bull";
import { writeFileSync } from "fs";

import { AsyncResult } from "../../shared";
import { HtmlDocument, http } from "../shared";
import { Status } from "../shared/types";
import PdfEngine from "./PdfEngine";

module.exports = async function (job: Job<HtmlDocument>) {
  const document = job.data;
  document.meta = { ...document.meta, status: Status.Processing };
  job.update(document);

  const { meta: { webhookUrl, s3Url } } = document;

  const pdf = await PdfEngine.render(document);

  if(process.env.NODE_ENV === "development") {
    writeFileSync(`${process.cwd()}/tests/${document.filename}.pdf`, pdf);
  }

  if(s3Url && webhookUrl) {
    await http.put(s3Url, pdf, "");
    await http.post(webhookUrl, new AsyncResult(job.id, document.filename, Status.Completed, webhookUrl, s3Url));
  }

  document.meta = { ...document.meta, status: Status.Completed };
  job.update(document);
  return Promise.resolve("Whut the hell man yo")
  // return Promise.resolve(s3Url ? document : pdf)
}
