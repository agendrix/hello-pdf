import { Request, Response } from "express";

import { HtmlDocument } from "../../lib/shared";
import Producer from "../../lib/producer";
import Result from "./Result";

export default async (req: Request, res: Response) => {
  const { filename, header, body, footer, webhookUrl } = req.body;

  const document = new HtmlDocument(filename, body, header, footer, webhookUrl);
  const job = await Producer.enqueue(document);
  const status = await job.getState();

  const result = new Result(job.id, filename, status, webhookUrl);

  res.status(200).json(result);
};
