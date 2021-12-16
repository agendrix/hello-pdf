import BullQueue, { Job, JobId } from "bull";

import HtmlDocument from "./HtmlDocument";
import Queue from "./Queue";

const ServiceQueue = new BullQueue<HtmlDocument>("documents", process.env.REDIS_URL!);

export const GetJob = async (jobId: JobId): Promise<Job<HtmlDocument> | null> => {
  return Queue.getJob(jobId);
};

export default ServiceQueue;
