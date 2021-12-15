import { Job } from "bull";
import { Request, Response } from "express";

import Producer from "../../lib/producer";
import { AsyncResult, ErrorResult, GetJob, HtmlDocument } from "../../shared";
import { Status } from "../../shared/types";
import { RequiredBodyFields } from "../middleware";

const mandatoryFields = ["filename", "body"];
const post = async (req: Request, res: Response) => {
  const { filename, header, body, footer, webhookUrl, s3Url, marginTop, marginRight, marginBottom, marginLeft } = req.body;
  const metadata = new HtmlDocument.Metadata(Status.Queued, webhookUrl, s3Url);
  const margins = new HtmlDocument.Margins(marginTop, marginRight, marginBottom, marginLeft);

  const document = new HtmlDocument(filename, body, metadata, margins, header, footer);
  let job: Job<HtmlDocument> | null = await Producer.enqueue(document);

  if (!s3Url) {
    await job.finished();
    job = await GetJob(job.id);
    if (!job) {
      return res
        .status(500)
        .json(new ErrorResult("Something weird happened. The job finished but we were unable to retrieve it."));
    }

    res.contentType("application/pdf");
    return res.status(200).send(Buffer.from(job?.returnvalue.data));
  }

  res.status(200).json(new AsyncResult(job.id, filename, job.returnvalue.meta.status, webhookUrl, s3Url));
};

export default [RequiredBodyFields(mandatoryFields), post];
