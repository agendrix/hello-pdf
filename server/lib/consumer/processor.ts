import { Job, JobId } from "bull";

import { AsyncResult, HtmlDocument, Http, Logger } from "../../shared";
import { Status } from "../../shared/types";
import PdfEngine from "./PdfEngine";

module.exports = async function (job: Job<HtmlDocument>) {
  updateJobStatus(job, Status.Processing);
  const document = job.data;
  const {
    meta: { webhookUrl, s3Url },
  } = document;

  try {
    const pdf = await PdfEngine.render(document);

    if (s3Url && webhookUrl) {
      await uploadPdfToS3(s3Url, pdf);
      await postToWebhook(webhookUrl, document, job.id);
    }

    updateJobStatus(job, Status.Completed);
    return Promise.resolve(s3Url ? document : pdf);
  } catch (e: any) {
    updateJobStatus(job, Status.Failed);
    Logger.error("An error occured", e);
    return Promise.reject(e);
  }
};

function updateJobStatus(job: Job<HtmlDocument>, status: Status) {
  const document = job.data;
  document.meta = { ...document.meta, status: status };
  job.update(document);
}

async function uploadPdfToS3(presignedS3Url: string, pdf: Buffer) {
  const uploadResponse = await Http.put(presignedS3Url, pdf, "application/pdf");
  if (uploadResponse.statusCode != 200) {
    throw new Error(
      `Something went wrong while uploading the pdf to S3. statusCode: ${
        uploadResponse.statusCode
      }, data: ${uploadResponse.data.toString("utf-8")}`,
    );
  }
}

async function postToWebhook(url: string, document: HtmlDocument, jobId: JobId) {
  const response = await Http.post(
    url,
    new AsyncResult(jobId, document.filename, Status.Completed, document.meta.webhookUrl, document.meta.s3Url),
  );

  if (response.statusCode != 200) {
    Logger.error(
      `Pdf was rendered and uploaded successfully but the webhook http called returned an unsuccessful status code. statusCode: ${
        response.statusCode
      }, data: ${response.data.toString("utf-8")}`,
      { jobId },
    );
  }
}
