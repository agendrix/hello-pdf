import { Job } from "bull";

import { AsyncResult, HtmlDocument, Http } from "../../shared";
import { Status } from "../../shared/types";
import PdfEngine from "./PdfEngine";

module.exports = async function (job: Job<HtmlDocument>) {
  const document = job.data;
  document.meta = { ...document.meta, status: Status.Processing };
  job.update(document);

  const {
    meta: { webhookUrl, s3Url },
  } = document;

  try {
    const pdf = await PdfEngine.render(document);

    if (s3Url && webhookUrl) {
      await Http.put(s3Url, pdf, "");
      await Http.post(webhookUrl, new AsyncResult(job.id, document.filename, Status.Completed, webhookUrl, s3Url));
    }

    document.meta = { ...document.meta, status: Status.Completed };
    job.update(document);
    return Promise.resolve(s3Url ? document : pdf);
  } catch (e) {
    return Promise.reject(e);
  }
};
