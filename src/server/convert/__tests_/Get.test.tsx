import request from "supertest";

import { HtmlDocument, Status } from "../../../lib";
import Producer from "../../../lib/producer";
import app from "../../app";

describe("GET /convert", () => {
  test("It should return a successfull response if the job is found.", async () => {
    const metadata = new HtmlDocument.Metadata(Status.Queued);
    const document = new HtmlDocument("filename", "<html></html>", metadata);
    const job = await Producer.enqueue(document);

    const response = await request(app).get(`/convert/${job.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.filename).toBe(document.filename);
  });

  test("It should return a not found error if the job is not found in the queue.", async () => {
    const response = await request(app).get(`/convert/-1`);
    expect(response.statusCode).toBe(404);
  });
});
