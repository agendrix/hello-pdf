import { jest } from "@jest/globals";
import request from "supertest";
import { deflateSync } from "zlib";

import { HtmlFile } from "../../../../tests/helpers";
import app from "../../app";

jest.setTimeout(10000);

describe("POST /convert", () => {
  describe("sync", () => {
    test("It should return successfully handle application/json content type.", async () => {
      const payload = JSON.stringify({
        filename: "test",
        body: HtmlFile,
      });

      const response = await request(app).post("/convert").set("Content-Type", "application/json").send(payload);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Buffer);
    });

    test("It should return successfully handle deflated encoding.", async () => {
      const payload = JSON.stringify({
        filename: "test",
        body: HtmlFile,
      });

      const response = await request(app)
        .post("/convert")
        .set("Content-Type", "application/json")
        .set("Content-Encoding", "deflate")
        .send(deflateSync(payload))
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
        body: HtmlFile,
      });

      const response = await request(app)
        .post("/convert")
        .set("Content-Type", "application/json")
        .send(payloadWithoutFileName);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("async", () => {
    test("It should return instance of AsyncResult if s3Url is present.", async () => {
      const payload = JSON.stringify({
        filename: "test",
        body: HtmlFile,
        s3Url: "http://localhost",
      });

      const response = await request(app).post("/convert").set("Content-Type", "application/json").send(payload);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
    });
  });
});
