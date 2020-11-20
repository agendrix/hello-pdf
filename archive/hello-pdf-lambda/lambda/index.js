// Medium article: https://medium.com/swlh/how-to-create-pdf-in-lambda-using-puppeteer-6355348b8a82
const middy = require("middy");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const { cors, doNotWaitForEmptyEventLoop, httpHeaderNormalizer, httpErrorHandler } = require("middy/middlewares");

// const fs = require("fs");

const handler = async event => {
  const executablePath = event.isOffline
    ? "./node_modules/puppeteer/.local-chromium/mac-722234/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
    : await chromium.executablePath;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
  });

  const page = await browser.newPage();

  await page.goto("https://www.google.com", {
    waitUntil: ["networkidle0", "load", "domcontentloaded"],
  });

  const pdfStream = await page.pdf();
  const data = pdfStream.toString("base64");

  // fs.writeFileSync("test.pdf", data, "base64");
  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": "attachment; filename=google.pdf",
    },
    body: data,
  };
};

const middyfiedHandler = middy(handler)
  .use(httpHeaderNormalizer())
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());

module.exports = { handler: middyfiedHandler };

// handler({ isOffline: true });
