import { Queue as BullQueue, Job } from "bull";

import { HtmlDocument, Queue } from "../../shared";

class Producer {
  constructor(private queue: BullQueue<HtmlDocument>) {}

  async enqueue(document: HtmlDocument): Promise<Job<HtmlDocument>> {
    return this.queue.add(document, {
      attempts: 10,
      backoff: { type: "exponential", delay: 500 }, // Max delay: https://github.com/OptimalBits/bull/blob/master/lib/backoffs.js#L12
    });
  }
}

export default new Producer(Queue);
