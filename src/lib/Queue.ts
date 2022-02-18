import BullQueue, { Job, JobId } from "bull";

import Queue from "./Queue";
import { IHtmlDocument } from "./types";

const ServiceQueue = new BullQueue<IHtmlDocument>("documents", process.env.HELLO_PDF_REDIS_URL || "redis://127.0.0.1:6379");

export const GetJob = async (jobId: JobId): Promise<Job<IHtmlDocument> | null> => {
  return Queue.getJob(jobId);
};

export default ServiceQueue;
