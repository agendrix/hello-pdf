import { jest } from "@jest/globals";
import BullQueue, { Job } from "bull";
import express from "express";
import { writeSync } from "fs";
// @ts-expect-error
import PdfParser from "pdf2json";
import tmp from "tmp";
import { promisify } from "util";

import { Queue, Status } from "../..";
// @ts-expect-error
import { asyncDocument, server, syncDocument } from "../../../../tests/helpers";
import { IHtmlDocument } from "../../types";

const processor = require("../processor");

const timeout = promisify(setTimeout);

beforeAll(() => server.start());

afterAll(() => server.stop());

afterEach(() => server.reset());

describe("processor", () => {
  test("It should only set job status to fail on last attempt.", async () => {
    jest.mock("../../pdfEngine", () => ({
      render: jest.fn(() => {
        throw new Error();
      }),
    }));

    const testQueue = new BullQueue<IHtmlDocument>("test-queue", "redis://127.0.0.1:6379");
    const retries = 3;
    const job = await testQueue.add(syncDocument(), {
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

    const testQueue = new BullQueue<IHtmlDocument>("test-queue", "redis://127.0.0.1:6379");
    const retries = 3;
    const job = await testQueue.add(asyncDocument(), {
      attempts: retries,
    });
    testQueue.process(processor);

    try {
      await job.finished();
    } catch (e) {
      expect(server.webhookReceivedCount()).toEqual(1);
    }
  });

  test("It should retry a job after a PdfEngine timeout", async () => {
    process.env.HELLO_PDF_PRINT_TIMEOUT = "5";
    const testQueue = new BullQueue<IHtmlDocument>("test-queue", "redis://127.0.0.1:6379");
    const retries = 3;
    const job = await testQueue.add(syncDocument(), {
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

  describe("async", () => {
    test("It should post to webhook if job is async", async () => {
      const job = await Queue.add(asyncDocument());
      await job.finished();
      expect(server.webhookReceived()).toBeTruthy();
    });

    test("It should upload to remote server if job is async", async () => {
      const job = await Queue.add(asyncDocument());
      await job.finished();
      expect(server.uploadReceived()).toBeTruthy();
    });

    test("It clean the job data after completion", async () => {
      let job: Job<IHtmlDocument> | null = await Queue.add(asyncDocument());
      await job.finished();
      job = await Queue.getJob(job.id);
      expect(job).toBeDefined();
      expect(job?.data?.renderedPdf).toEqual("");
      expect(job?.data?.body).toEqual("");
      expect(job?.data?.header).toEqual("");
      expect(job?.data?.footer).toEqual("");
    });
  });

  describe("sync", () => {
    test("It should not post to webhook if job is sync", async () => {
      const job = await Queue.add(syncDocument());
      await job.finished();
      expect(server.webhookReceived()).toBeFalsy();
    });

    test("It should not upload to remote server if job is sync", async () => {
      const job = await Queue.add(syncDocument());
      await job.finished();
      expect(server.uploadReceived()).toBeFalsy();
    });
  });

  test("It should store a valid PDF file", (done) => {
    Queue.add(syncDocument()).then((job) => {
      job.finished().then(() => {
        const tmpFile = tmp.fileSync();
        Queue.getJob(job.id).then((finishedJob) => {
          if (!finishedJob) {
            throw new Error("Job not defined.");
          }
          expect(finishedJob.data.renderedPdf).toBeDefined();
          writeSync(tmpFile.fd, Buffer.from(finishedJob.data.renderedPdf as string, "base64"));

          const pdfParser = new PdfParser();
          pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            expect(pdfData).toBeTruthy();
            done();
          });

          pdfParser.on("pdfParser_dataError", (pdfData: any) => {
            throw new Error("Pdf is not valid");
          });

          pdfParser.loadPDF(tmpFile.name, 0);
        });
      });
    });
  });
});
