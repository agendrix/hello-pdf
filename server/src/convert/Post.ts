import { Request, Response } from "express";
import { Job } from "bull";

import { requiredBodyFields } from "../middleware";
import { HtmlDocument, GetJob } from "../../lib/shared";
import { AsyncResult } from "../../shared";
import { Status } from "../../lib/shared/types";
import Producer from "../../lib/producer";

const mandatoryFields = ["filename", "body"];
const post = async (req: Request, res: Response) => {
  const { filename, header, body, footer, webhookUrl, s3Url, marginTop, marginRight, marginBottom, marginLeft } = req.body;
  const metadata = new HtmlDocument.Metadata(Status.Queued, webhookUrl, s3Url);
  const margins = new HtmlDocument.Margins(marginTop, marginRight, marginBottom, marginLeft);

  const document = new HtmlDocument(filename, body, metadata, margins, header, footer,);
  let job: Job<HtmlDocument> | null = await Producer.enqueue(document);

  if (!s3Url) {
    await job.finished();
    job = await GetJob(job.id);

    res.contentType("application/pdf");
    return res.status(200).send(Buffer.from(job?.returnvalue.data));
  }

  res.status(200).json(new AsyncResult(job.id, filename, job.returnvalue.meta.status, webhookUrl, s3Url));
};

export default [requiredBodyFields(mandatoryFields), post];
