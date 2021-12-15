import { Request, Response } from "express";

import { HtmlDocument } from "../../lib/shared";
import { AsyncResult } from "../../shared";
import { Status } from "../../lib/shared/types";
import Producer from "../../lib/producer";

export default async (req: Request, res: Response) => {
  const { filename, header, body, footer, webhookUrl, s3Url } = req.body;

  const document = new HtmlDocument(filename, body, { status: Status.Queued, webhookUrl, s3Url }, header, footer,);
  const job = await Producer.enqueue(document);

  if (!s3Url) {
    await job.finished();
    console.log("JOB FINISHED (SYNC)!")
    console.log(job.returnvalue);

    res.contentType("application/pdf");
    return res.status(200).send(job.returnvalue);
  }

  res.status(200).json(new AsyncResult(job.id, filename, job.returnvalue.meta.status, webhookUrl, s3Url));
};
