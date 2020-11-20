import { APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import chromium from "chrome-aws-lambda";
// import AWS from "aws-sdk";
import Joi from "@hapi/joi";
import { Browser } from "puppeteer";
import { PdfRequest, requestSchema } from "./validation";
import { Handler } from "./types";

const errorResponse = (statusCode: number, message: string) => {
  return {
    statusCode,
    isBase64Encoded: false,
    body: JSON.stringify({ error: 400, message: message }),
    headers: {
      "content-type": "application/json",
      "content-disposition": "",
    },
  };
};

const handler: Handler<APIGatewayEvent, APIGatewayProxyStructuredResultV2> = async (event, _context) => {
  let request: PdfRequest;
  try {
    request = Joi.attempt(event.body, requestSchema, "Invalid request:");
  } catch (error) {
    return errorResponse(400, error.message);
  }

  let browser: Browser | null = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true, // chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(request.content);
    const pdf = await page.pdf({
      printBackground: true,
      headerTemplate: request.header,
      footerTemplate: request.footer,
      displayHeaderFooter: Boolean(request.header || request.footer),
      ...request.pdfOptions,
    });

    return {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename=${request.filename}.pdf`,
      },
      statusCode: 200,
      body: pdf.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return errorResponse(500, error.message);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

exports.handler = handler;

export const __test__ = {
  handler,
};
