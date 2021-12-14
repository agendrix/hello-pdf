import { Request, Response } from "express";

import Result from "./Result";
import { GetJob } from "../../lib/shared/Utils";

export default async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const job = await GetJob(jobId);
  const status = await job?.getState();
  const filename = job?.data.filename;

  const result = new Result(jobId, filename, status);

  if (status) res.status(200).json(result);
  else res.status(404).json(result)
};
