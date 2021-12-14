import { Job, JobId } from "bull";

import HtmlDocument from "./HtmlDocument";
import Queue from "./Queue";

const GetJob = async (jobId: JobId): Promise<Job<HtmlDocument> | null> => {
  return Queue.getJob(jobId);
};

export { GetJob };
