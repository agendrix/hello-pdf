import { Request, Response } from "express";

import { AsyncResult, ErrorResult, GetJob } from "../../shared";

export default async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const job = await GetJob(jobId);
  const status = job?.data.meta.status;
  const filename = job?.data.filename;

  if (job) res.status(200).json(new AsyncResult(jobId, filename, status));
  else res.status(404).json(new ErrorResult("Unable to find a job with the provided id."));
};
