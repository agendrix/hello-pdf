import { Job } from "bull";
import { Request, Response } from "express";

import { AsyncResult, ErrorResult, GetJob, HtmlDocument, Logger, Queue, Status } from "../../lib";
import { cleanJobDataForStorage } from "../../lib/Queue";
import Producer from "../../lib/producer";
import { IHtmlDocument } from "../../lib/types";
import { RequiredBodyFields } from "../middleware";

const mandatoryFields = ["filename", "body"];
const post = async (req: Request, res: Response) => {
  const document = buildDocument(req.body);
  const async = document.meta.webhookUrl && document.meta.s3Url;
  if ((document.meta.s3Url && !document.meta.webhookUrl) || (!document.meta.s3Url && document.meta.webhookUrl)) {
    return res.status(400).json(new ErrorResult("Both s3_url and webhook_url must be defined."));
  }

  Logger.debug("post", `Enqueuing document, async: ${!!async}`);
  const job: Job<IHtmlDocument> = await Producer.enqueue(document);
  try {
    if (!async) {
      await waitForJobToFinish(job);
      const renderedPdf = await getJobRenderedPdf(job);
      res.contentType("application/pdf");
      res.status(200).send(Buffer.from(renderedPdf, "base64"));
    } else {
      const asyncResult = new AsyncResult(
        job.id,
        document.filename,
        document.meta.status,
        document.meta.webhookUrl,
        document.meta.s3Url,
      );
      res.status(200).json(asyncResult);
    }
  } finally {
    await cleanJobDataForStorage(job);
  }
};

const waitForJobToFinish = async (job: Job<IHtmlDocument>) => {
  Logger.debug("post", "Waiting for job to finish");
  try {
    await job.finished();
  } catch {
    throw new ErrorResult("The job failed all of its attempts.");
  }
  Logger.debug("post", "Job finished");
};

const getJobRenderedPdf = async (job: Job<IHtmlDocument>) => {
  const refreshedJob = await GetJob(job.id);
  if (refreshedJob && refreshedJob.data.renderedPdf) {
    return refreshedJob.data.renderedPdf;
  } else {
    throw new ErrorResult("The job finished but rendered pdf was not present.");
  }
};

const buildDocument = (requestBody: any) => {
  const {
    filename,
    body,
    header = undefined,
    footer = undefined,
    webhookUrl = undefined,
    s3Url = undefined,
    margins = undefined,
    scale = undefined,
    landscape = undefined,
  } = requestBody;

  const metadata = new HtmlDocument.Metadata(Status.Queued, webhookUrl, s3Url);
  return new HtmlDocument(filename, body, metadata, margins, header, footer, scale, landscape);
};

export default [RequiredBodyFields(mandatoryFields), post];
