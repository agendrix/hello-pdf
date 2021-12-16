import { Job, JobId } from "bull";
import { performance } from "perf_hooks";

import { AsyncResult, HtmlDocument, Http, Logger } from "../../shared";
import { Status } from "../../shared/types";
import PdfEngine from "./PdfEngine";

module.exports = async function (job: Job<HtmlDocument>) {
  return new Promise(async (resolve, reject) => {
    const document = job.data;
    const { webhookUrl, s3Url } = document.meta;

    try {
      updateJobStatus(job, Status.Processing);
      const pdf = await PdfEngine.render(document);

      if (s3Url) {
        await uploadPdfToS3(s3Url, pdf);
        await updateJobStatus(job, Status.Completed);
      }

      resolve(s3Url ? document : pdf);
    } catch (e: any) {
      await updateJobStatus(job, Status.Failed);
      Logger.error("An error occured", e);
      reject(e);
    } finally {
      if (webhookUrl) await postToWebhook(webhookUrl, job.id);
    }
  });
};

function updateJobStatus(job: Job<HtmlDocument>, status: Status): Promise<void> {
  const document = job.data;
  document.meta = { ...document.meta, status: status };
  return job.update(document);
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

async function postToWebhook(url: string, jobId: JobId) {
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
