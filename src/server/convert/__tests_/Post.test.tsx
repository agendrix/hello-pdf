import { readFileSync } from "fs";
import request from "supertest";
import { Inflate, constants, createDeflate, createInflate, deflateRawSync, deflateSync, inflateSync } from "zlib";

import app from "../../app";

describe("POST /convert", () => {
  describe("sync", () => {
    test("It should return successfully handle application/json content type.", async () => {
      const payload = JSON.stringify({
        filename: "test",
        body: readFileSync("./tests/helpers/test.html").toString(),
      });

      const response = await request(app).post("/convert").set("Content-Type", "application/json").send(payload);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Buffer);
    });

    test("It should return successfully handle deflated encoding.", async () => {
      const payload = JSON.stringify({
        filename: "test",
        body: readFileSync("./tests/helpers/test.html").toString().toString(),
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
  });
});
