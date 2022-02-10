import { readdirSync } from "fs";

import { Logger, Queue } from "..";

class Consumer {
  private static _instance: Consumer;
  private constructor() {}

  static getInstance() {
    if (!this._instance) this._instance = new Consumer();
    return this._instance;
  }

  static consume() {
    this.getInstance().consume();
  }

  static async isHealthy() {
    return (await Queue.getWorkers()).length > 0;
  }

  private async consume() {
    const concurrency = Number(process.env.HELLO_PDF_CONCURRENY) || 1;
    Logger.log(`Workers started with concurrency: ${concurrency}`);
    const processor = this.processorPath();
    if (processor) {
      Queue.process(concurrency, processor);
    } else {
      throw new Error("Queue processor not found");
    }
  }

  private processorPath() {
    const processor = readdirSync(__dirname).find((file) => file.search(/^processor\.[js|ts]+/) != -1);
    return `${__dirname}/${processor}`;
  }
}

export default Consumer;
