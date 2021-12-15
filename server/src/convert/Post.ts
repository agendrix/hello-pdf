import { Request, Response } from "express";
import { Job } from "bull";

import { HtmlDocument, GetJob } from "../../lib/shared";
import { AsyncResult } from "../../shared";
import { Status } from "../../lib/shared/types";
import Producer from "../../lib/producer";

export default async (req: Request, res: Response) => {
  const { filename, header, body, footer, webhookUrl, s3Url } = req.body;

  const document = new HtmlDocument(filename, body, { status: Status.Queued, webhookUrl, s3Url }, header, footer,);
  let job: Job<HtmlDocument> | null  = await Producer.enqueue(document);

  if (!s3Url) {
    await job.finished();
    job = await GetJob(job.id);
    const pdfBuffer = Buffer.from(job?.returnvalue.data);
    res.contentType("application/pdf");
    return res.status(200).send(pdfBuffer);
  }

  res.status(200).json(new AsyncResult(job.id, filename, job.returnvalue.meta.status, webhookUrl, s3Url));
};
