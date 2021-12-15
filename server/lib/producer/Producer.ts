import { Queue as BullQueue, Job } from "bull";

import { HtmlDocument, Queue } from "../../shared";

class Producer {
  constructor(private queue: BullQueue<HtmlDocument>) {}

  async enqueue(document: HtmlDocument): Promise<Job<HtmlDocument>> {
    return this.queue.add(document);
  }
}

export default new Producer(Queue);
