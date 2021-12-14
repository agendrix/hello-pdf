import { Request, Response } from "express";

import { AsyncResult } from "../../shared";
import { GetJob } from "../../lib/shared/Utils";

export default async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const job = await GetJob(jobId);
  const status = await job?.data.meta.status;
  const filename = job?.data.filename;

  const result = new AsyncResult(jobId, filename, status);

  if (job) res.status(200).json(result);
  else res.status(404).json(result)
};
