import assert from "assert";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { post, RequestCallback, Response } from "request";

import pdfTemplate from "./data/pdf-template.json";

import { __test__ } from "../lambda/index";
import { PdfRequest } from "../lambda/validation";
import { APIGatewayProxyEvent } from "aws-lambda";

const outputFolder = path.join(__dirname, "output");

const handler = __test__.handler;

const LAMBDA_URL = process.env.HELLO_PDF_LAMBDA_URL;

if (LAMBDA_URL !== undefined) {
  const lambdaUrl = LAMBDA_URL;
  describe("lambda POST call", () => {
    async function postRequest(payload: PdfRequest) {
      return new Promise<Response>((resolve, reject) => {
        const callBack: RequestCallback = (error, response) => {
          if (error) return reject(error);
          return resolve(response);
        };

        post(lambdaUrl, { json: payload, headers: { "content-type": "application/json" } }, callBack);
      });
    }

    it("returns 400 if invalid data", async () => {
      const payload: PdfRequest = {
        filename: "bad request",
      } as any;

      const response = await postRequest(payload);

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.headers?.["content-type"], "application/json");
      assert.ok(response.body.message.includes("Invalid request"));
    });

    it("returns 200 with the generated PDF binary", async () => {
      const filename = "Test PDF on Lambda";
      const filepath = path.join(outputFolder, `${filename}.pdf`);
      const payload: PdfRequest = {
        content: pdfTemplate.templates.htmlTemplate,
        header: pdfTemplate.templates.headerTemplate,
        footer: pdfTemplate.templates.footerTemplate,
        filename,
        pdfOptions: {
          landscape: true,
        },
      };

      const response = await postRequest(payload);
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.headers?.["content-type"], "application/pdf");
      assert.ok((response.headers?.["content-disposition"] as string).includes(`${filename}.pdf`));

      fs.writeFileSync(filepath, response.body as string, "base64");

      const dataBuffer = fs.readFileSync(filepath);
      const data = await pdf(dataBuffer);
      assert.ok(data.numpages > 1);
      assert.ok(data.text.includes("Agendrix"));

      fs.unlinkSync(filepath);
    });
  });
}

describe("exports.handler", () => {
  const fakeContext: any = {};

  const makeEvent = (data: PdfRequest): APIGatewayProxyEvent => {
    return {
      body: JSON.stringify(data),
    } as APIGatewayProxyEvent;
  };

  it("returns 400 if invalid data", async () => {
    const event = makeEvent({
      filename: "bad request",
    } as any);

    const response = await handler(event, fakeContext);

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.headers?.["content-type"], "application/json");
    assert.doesNotThrow(() => JSON.parse(response.body as any));
  });

  it("returns 200 with the generated PDF binary", async () => {
    const filename = "Test PDF";
    const filepath = path.join(outputFolder, `${filename}.pdf`);
    const event = makeEvent({
      content: pdfTemplate.templates.htmlTemplate,
      header: pdfTemplate.templates.headerTemplate,
      footer: pdfTemplate.templates.footerTemplate,
      filename,
      pdfOptions: {
        landscape: true,
      },
    });

    const response = await handler(event, fakeContext);
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.headers?.["content-type"], "application/pdf");
    assert.ok((response.headers?.["content-disposition"] as string).includes(`${filename}.pdf`));

    fs.writeFileSync(filepath, response.body as string, "base64");

    const dataBuffer = fs.readFileSync(filepath);
    const data = await pdf(dataBuffer);
    assert.ok(data.numpages > 1);
    assert.ok(data.text.includes("Agendrix"));

    fs.unlinkSync(filepath);
  });
});
