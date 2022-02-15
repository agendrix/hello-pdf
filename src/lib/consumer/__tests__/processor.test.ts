import { jest } from "@jest/globals";
import BullQueue from "bull";
import express from "express";
import { promisify } from "util";

import { HtmlDocument, Queue, Status, PdfEngine as unMockedPdfEngine } from "../..";
import { HtmlFile } from "../../../../tests/helpers";
import PdfEngine from "../../pdfEngine";

const processor = require("../processor");

const timeout = promisify(setTimeout);

const document = new HtmlDocument("test", HtmlFile, new HtmlDocument.Metadata(Status.Queued));
let webhookReceived = false;
let webhookReceivedCount = 0;

beforeAll(() => {
  const webhookServer = express();
  webhookServer.post("/webhook", (_req, _res) => {
    webhookReceived = true;
    webhookReceivedCount += 1;
  });
  webhookServer.listen(3000);
});

afterEach(() => {
  webhookReceived = false;
  webhookReceivedCount = 0;
});

describe("processor", () => {
  test("It should only set job status to fail on last attempt.", async () => {
    jest.mock("../../pdfEngine", () => ({
      render: jest.fn(() => {
        throw new Error();
      }),
    }));

    const testQueue = new BullQueue<HtmlDocument>("test-queue", "redis://127.0.0.1:6379");
    const retries = 3;
    const job = await testQueue.add(document, {
      attempts: retries,
    });
    const jobStatuses: Array<String> = [];

    testQueue.process(processor);

    testQueue.on("failed", function (job, _err) {
      if (job.attemptsMade !== job.opts.attempts) {
        jobStatuses.push(job.data.meta.status);
      } else {
        jobStatuses.push(job.data.meta.status);
      }
    });

    try {
      await job.finished();
    } catch (e) {
      // wait for "failed event" to trigger
      await timeout(1000);
      expect(jobStatuses).toEqual([Status.Queued, Status.Queued, Status.Failed]);
    }
  });

  test("It should not post to webhook before last attempt.", async () => {
    jest.mock("../../pdfEngine", () => ({
      render: jest.fn(() => {
        throw new Error();
      }),
    }));

    const testQueue = new BullQueue<HtmlDocument>("test-queue", "redis://127.0.0.1:6379");
    const retries = 3;
    const job = await testQueue.add(document, {
      attempts: retries,
    });
    testQueue.process(processor);

    try {
      await job.finished();
    } catch (e) {
      expect(webhookReceivedCount).toEqual(1);
    }
  });

  test("It should post to webhook if job is async", async () => {
    const { meta, ...rest } = document;
    const job = await Queue.add({
      ...rest,
      meta: { ...meta, webhookUrl: "http://localhost:3000/webhook", s3Url: "" },
    });
    try {
      await job.finished();
    } catch {
      expect(webhookReceived).toBeTruthy();
    }
  });

  test("It should not post to webhook if job is sync", async () => {
    const job = await Queue.add(document);
    await job.finished();
    expect(webhookReceived).toBeFalsy();
  });

  test("It should retry a job after a PdfEngine timeout", async () => {
    process.env.HELLO_PDF_PRINT_TIMEOUT = "5";
    const testQueue = new BullQueue<HtmlDocument>("test-queue", "redis://127.0.0.1:6379");
    const retries = 3;
    const job = await testQueue.add(document, {
      attempts: retries,
    });

    try {
      await job.finished();
    } catch {
      const failedJob = await testQueue.getJob(job.id);
      expect(failedJob?.attemptsMade).toBeGreaterThan(1);
    } finally {
      process.env.HELLO_PDF_PRINT_TIMEOUT = undefined;
    }
  });
});
