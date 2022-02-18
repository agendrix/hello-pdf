import { jest } from "@jest/globals";
import { writeSync } from "fs";
// @ts-expect-error
import PdfParser from "pdf2json";
import request from "supertest";
import tmp from "tmp";
import { gzipSync } from "zlib";

// @ts-expect-error
import { htmlFile } from "../../../../tests/helpers";
import { Queue } from "../../../lib";
import app from "../../app";

jest.setTimeout(10000);

describe("POST /convert", () => {
  describe("sync", () => {
    test("It should return successfully handle application/json content type.", async () => {
      const payload = JSON.stringify({
        filename: "test",
        body: htmlFile,
      });

      const response = await request(app).post("/convert").set("Content-Type", "application/json").send(payload);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Buffer);
    });

    test("It should return successfully handle gzip encoding.", async () => {
      const payload = JSON.stringify({
        filename: "test",
        body: htmlFile,
      });

      const response = await request(app)
        .post("/convert")
        .set("Content-Type", "application/json")
        .set("Content-Encoding", "gzip")
        .send(gzipSync(payload))
        .serialize((obj) => obj);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Buffer);
    });

    test("It should return an error if body field is missing.", async () => {
      const payloadWithoutBody = JSON.stringify({
        filename: "test",
      });

      const response = await request(app).post("/convert").set("Content-Type", "application/json").send(payloadWithoutBody);
      expect(response.statusCode).toBe(400);
    });

    test("It should return an error if filename field is missing.", async () => {
      const payloadWithoutFileName = JSON.stringify({
        body: htmlFile,
      });

      const response = await request(app)
        .post("/convert")
        .set("Content-Type", "application/json")
        .send(payloadWithoutFileName);
      expect(response.statusCode).toBe(400);
    });

    test("It should return valid PDF file.", (done) => {
      const payloadWithoutFileName = JSON.stringify({
        body: htmlFile,
        filename: "test",
      });

      request(app)
        .post("/convert")
        .set("Content-Type", "application/json")
        .send(payloadWithoutFileName)
        .then((response) => {
          const tmpFile = tmp.fileSync();
          writeSync(tmpFile.fd, Buffer.from(response.body, "base64"));

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

    test("It should clean job data after sending it to the client.", async () => {
      await Queue.obliterate({ force: true });
      expect(await Queue.count()).toEqual(0);
      const payload = JSON.stringify({
        filename: "test",
        body: htmlFile,
      });

      const response = await request(app).post("/convert").set("Content-Type", "application/json").send(payload);
      expect(response.statusCode).toBe(200);

      const jobs = await Queue.getCompleted();
      expect(jobs.length).toEqual(1);

      const job = jobs.pop();
      expect(job?.data?.renderedPdf).toEqual("");
      expect(job?.data?.body).toEqual("");
      expect(job?.data?.header).toEqual("");
      expect(job?.data?.footer).toEqual("");
    });
  });

  describe("async", () => {
    test("It should return instance of AsyncResult if s3Url is present.", async () => {
      const payload = JSON.stringify({
        filename: "test",
        body: htmlFile,
        s3Url: "http://localhost",
        webhookUrl: "http://localhost",
      });

      const response = await request(app).post("/convert").set("Content-Type", "application/json").send(payload);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
    });

    test("It should return a bad request error if one of s3Url and webhookUrl not present.", async () => {
      const payload = JSON.stringify({
        filename: "test",
        body: htmlFile,
        s3Url: "http://localhost",
      });

      const response = await request(app).post("/convert").set("Content-Type", "application/json").send(payload);
      expect(response.statusCode).toBe(400);
    });
  });
});
