import { Queue } from "../shared";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const concurrency = Number(process.env.concurrency) || 1;
  const processor = `${__dirname}/processor.ts`;
  Queue.process(concurrency, processor);
}

main();
