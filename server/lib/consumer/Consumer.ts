import { Queue } from "../shared";
import PdfEngine from "./PdfEngine";


class Consumer {
  concurrency: number
  processor: string  

  constructor(concurrency: number = 2) {
    this.concurrency = concurrency;
    this.processor = `${__dirname}/processor.ts`;
  }

  async consume() {
    await PdfEngine.build();
    Queue.process(this.concurrency, this.processor);
  }
}

export default Consumer;