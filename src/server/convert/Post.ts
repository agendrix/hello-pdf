import { Job } from "bull";
import { Request, Response } from "express";

import { AsyncResult, ErrorResult, GetJob, HtmlDocument, Status } from "../../lib";
import Producer from "../../lib/producer";
import { RequiredBodyFields } from "../middleware";

const mandatoryFields = ["filename", "body"];
const post = async (req: Request, res: Response) => {
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
  } = req.body;

  const metadata = new HtmlDocument.Metadata(Status.Queued, webhookUrl, s3Url);
  const document = new HtmlDocument(filename, body, metadata, margins, header, footer, scale, landscape);

  let job: Job<HtmlDocument> | null = await Producer.enqueue(document);

  if (!s3Url) {
    try {
      await job.finished();
      job = await GetJob(job.id);
      if (!job) {
        throw new ErrorResult("Something weird happened. The job finished but we were unable to retrieve it.");
      }

      res.contentType("application/pdf");
      return res.status(200).send(Buffer.from(job.returnvalue, "base64"));
    } catch {
      throw new ErrorResult("The job failed all of its attempts.");
    }
  }

  res.status(200).json(new AsyncResult(job.id, filename, document.meta.status, webhookUrl, s3Url));
};

export default [RequiredBodyFields(mandatoryFields), post];