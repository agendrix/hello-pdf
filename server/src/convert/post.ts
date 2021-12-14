import { Request, Response } from "express";

import { HtmlDocument } from "../../lib/shared";
import { AsyncResult } from "../../shared";
import { JobStatus } from "../../lib/shared/types";
import Producer from "../../lib/producer";

export default async (req: Request, res: Response) => {
  const { filename, header, body, footer, webhookUrl, s3Url } = req.body;

  const document = new HtmlDocument(filename, body, header, footer, { status: JobStatus.Queued, webhookUrl, s3Url });
  const job = await Producer.enqueue(document);
  const status = await job.getState();

  if (!s3Url) {
    job.on('completed', (job, result) => {
      res.contentType("application/pdf");
      return res.status(200).send(result);
    })
  }

  res.status(200).json(new AsyncResult(job.id, filename, status, webhookUrl, s3Url));
};
