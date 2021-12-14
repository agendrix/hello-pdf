import { Job } from "bull";

import { AsyncResult } from "../../shared";
import { HtmlDocument, http } from "../shared";
import { JobStatus } from "../shared/types";
import PdfEngine from "./PdfEngine";

module.exports = async function (job: Job<HtmlDocument>) {
  const document = job.data;
  const { meta: { webhookUrl, s3Url } } = document;
  document.meta = { webhookUrl, s3Url, status: JobStatus.Processing };
  job.update(document);

  const pdf = await PdfEngine.render(document);

  if(s3Url) {
    await http.put(s3Url, pdf, "");
    await http.post(webhookUrl, new AsyncResult(job.id, document.filename, JobStatus.Completed, webhookUrl, s3Url));
  }

  return Promise.resolve(s3Url ? document : pdf)
}
