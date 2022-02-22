import { Request, Response } from "express";

import { AsyncResult, ErrorResult, GetJob } from "../../lib";
import { AsyncRoute } from "../middleware";

const get = async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const job = await GetJob(jobId);
  const status = job?.data.meta.status;
  const s3Url = job?.data.meta.s3Url;
  const webhookUrl = job?.data.meta.webhookUrl;
  const filename = job?.data.filename;

  if (job) res.status(200).json(new AsyncResult(jobId, filename, status, webhookUrl, s3Url));
  else res.status(404).json(new ErrorResult("Unable to find a job with the provided id."));
};

export default AsyncRoute(get);
