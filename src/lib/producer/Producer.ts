import { Queue as BullQueue, Job } from "bull";

import { HtmlDocument, Logger, Queue } from "..";

const JOB_EXPIRATION_IN_SECONDS = process.env.JOB_EXPIRATION_IN_SECONDS
  ? Number(process.env.JOB_EXPIRATION_IN_SECONDS)
  : 60 * 60 * 24 * 7;

class Producer {
  constructor(private queue: BullQueue<HtmlDocument>) {}

  async enqueue(document: HtmlDocument): Promise<Job<HtmlDocument>> {
    Logger.debug("producer", "Enqueing job");
    return this.queue.add(document, {
      attempts: 10,
      backoff: { type: "exponential", delay: 500 }, // Max delay: https://github.com/OptimalBits/bull/blob/master/lib/backoffs.js#L12,
      removeOnComplete: { age: JOB_EXPIRATION_IN_SECONDS },
      removeOnFail: { age: JOB_EXPIRATION_IN_SECONDS },
    });
  }
}

export default new Producer(Queue);
