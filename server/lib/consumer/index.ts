import dotenv from "dotenv";

import { Logger, Queue } from "../../shared";
import logEvents from "./logger";

dotenv.config();

async function main() {
  logEvents();
  const concurrency = Number(process.env.concurrency) || 1;
  const processor = `${__dirname}/processor.ts`;
  Logger.log(`Workers started with concurrency: ${concurrency}`);
  Queue.process(concurrency, processor);
}

main();
