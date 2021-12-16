import dotenv from "dotenv";
import { readdirSync } from "fs";

import { Logger, Queue } from "../../shared";
import logEvents from "./logger";

dotenv.config();

function Processor() {
  const processor = readdirSync(__dirname).find((file) => file.search(/^processor\.[js|ts]+/) != -1);
  return `${__dirname}/${processor}`;
}

async function main() {
  logEvents();
  const concurrency = Number(process.env.HELLO_PDF_CONCURRENY) || 1;
  Logger.log(`Workers started with concurrency: ${concurrency}`);
  const processor = Processor();
  if (processor) {
    Queue.process(concurrency, processor);
  } else {
    throw new Error("Queue process not found");
  }
}

main();
