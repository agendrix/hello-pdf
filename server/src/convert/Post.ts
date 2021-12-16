import { Job } from "bull";
import { Request, Response } from "express";

import Producer from "../../lib/producer";
import { AsyncResult, ErrorResult, GetJob, HtmlDocument } from "../../shared";
import { Status } from "../../shared/types";
import { RequiredBodyFields } from "../middleware";

const mandatoryFields = ["filename", "body"];
const post = async (req: Request, res: Response) => {
  const {
    filename,
    body,
    header = undefined,
    footer = undefined,
    webhook_url = undefined,
    s3_url = undefined,
    margin_top = undefined,
    margin_right = undefined,
    margin_bottom = undefined,
    margin_left = undefined,
  } = req.body;

  const metadata = new HtmlDocument.Metadata(Status.Queued, webhook_url, s3_url);
  const margins = new HtmlDocument.Margins(margin_top, margin_right, margin_bottom, margin_left);
  const document = new HtmlDocument(filename, body, metadata, margins, header, footer);

  let job: Job<HtmlDocument> | null = await Producer.enqueue(document);

  if (!s3_url) {
    await job.finished();
    job = await GetJob(job.id);
    if (!job) {
      throw new ErrorResult("Something weird happened. The job finished but we were unable to retrieve it.");
    }

    res.contentType("application/pdf");
    return res.status(200).send(Buffer.from(job?.returnvalue.data));
  }

  res.status(200).json(new AsyncResult(job.id, filename, document.meta.status, webhook_url, s3_url));
};

export default [RequiredBodyFields(mandatoryFields), post];
