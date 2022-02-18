import { Job, JobId } from "bull";

import { AsyncResult, HtmlDocument, Http, Logger, Status } from "../../lib";
import PdfEngine from "../pdfEngine";
import { IHtmlDocument } from "../types";

module.exports = async function (job: Job<IHtmlDocument>) {
  return new Promise(async (resolve, reject) => {
    const document = job.data;
    const { webhookUrl, s3Url } = document.meta;
    const async = webhookUrl && s3Url;
    Logger.debug("processor", `Starting job ${job.id}, async: ${!!async}`);
    try {
      const pdf = await PdfEngine.render(HtmlDocument.from(document));

      if (async) {
        await uploadPdfToS3(s3Url, pdf);
      }

      await updateJobStatus(job, Status.Completed);

      // We only store the pdf if the job is sync in order to reduce memory footprint
      resolve(async ? null : pdf.toString("base64"));
    } catch (error: any) {
      if (isLastAttempt(job)) {
        await updateJobStatus(job, Status.Failed);
      }
      Logger.error(`An error occured while processing job: ${error}`, error);
      reject(error);
    } finally {
      if (async && (job.data.meta.status === Status.Completed || job.data.meta.status === Status.Failed)) {
        await postToWebhook(webhookUrl, job.id);
      }
    }
  });
};

function updateJobStatus(job: Job<IHtmlDocument>, status: Status): Promise<void> {
  Logger.debug("processor", `Updating job status to ${status}`);
  const document = job.data;
  document.meta = { ...document.meta, status: status };
  return job.update(document);
}

async function uploadPdfToS3(presignedS3Url: string, pdf: Buffer) {
  Logger.debug("processor", "Starting upload to s3");
  const uploadResponse = await Http.put(presignedS3Url, pdf, "application/pdf");
  if (uploadResponse.statusCode != 200) {
    throw new Error(
      `Something went wrong while uploading the pdf to S3. statusCode: ${
        uploadResponse.statusCode
      }, data: ${uploadResponse.data.toString("utf-8")}`,
    );
  }
  Logger.debug("processor", "Finished upload to s3");
}

async function postToWebhook(url: string, jobId: JobId) {
  Logger.debug("processor", "Posting to webhook");
  const response = await Http.post(url, new AsyncResult(jobId));

  if (response.statusCode != 200) {
    Logger.error(
      `Pdf was rendered and uploaded successfully but the webhook http called returned an unsuccessful status code. statusCode: ${
        response.statusCode
      }, data: ${response.data.toString("utf-8")}`,
      { jobId },
    );
  }
}

function isLastAttempt(job: Job) {
  return job.attemptsMade === Number(job.opts.attempts) - 1;
}
