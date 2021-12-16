import BullQueue, { Job, JobId } from "bull";

import HtmlDocument from "./HtmlDocument";
import Queue from "./Queue";

const ServiceQueue = new BullQueue<HtmlDocument>("documents", process.env.HELLO_PDF_REDIS_URL || "redis://127.0.0.1:6379");

export const GetJob = async (jobId: JobId): Promise<Job<HtmlDocument> | null> => {
  return Queue.getJob(jobId);
};

export default ServiceQueue;
