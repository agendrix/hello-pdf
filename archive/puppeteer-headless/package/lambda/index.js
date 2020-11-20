// const chromium = require("chrome-aws-lambda");
const fs = require("fs");
const tmp = require("tmp");

// TODO: yarn add :
// "chrome-aws-lambda": "^2.1.1",
// "puppeteer-core": "^2.1.1",

exports.handler = async (event, context) => {
  console.log(JSON.stringify({ event, context }, null, 2));

  
  return context.succeed("test completed");
  // const templates = {
  //   header: event.body.header,
  //   body: event.body.body,
  //   footer: event.body.footer
  // };

  // const inputHtmlTempFile = tmp.fileSync({ template: "XXXXXX.html" });
  // const outputPDFTempFile = tmp.fileSync({ template: "XXXXXX.pdf" });
  // fs.writeFileSync(inputHtmlTempFile.name, templates.body);

  // const {
  //   inputPath,
  //   outputPath,
  //   headerTemplate,
  //   footerTemplate,
  //   pdfOptions
  // } = {
  //   inputPath: inputHtmlTempFile.name,
  //   outputPath: outputPDFTempFile.name,
  //   headerTemplate: templates.header,
  //   footerTemplate: templates.footer,
  //   pdfOptions: JSON.parse(event.body.pdfOptions)
  // };

  // let result = null;
  // let browser = null;
  // try {
  //   browser = await chromium.puppeteer.launch({
  //     args: chromium.args,
  //     defaultViewport: chromium.defaultViewport,
  //     executablePath: await chromium.executablePath,
  //     headless: chromium.headless
  //   });

  //   const page = await browser.newPage();

  //   await page.goto(`file://${inputPath}`, { waitUntil: "networkidle2" });
  //   await page.pdf({
  //     printBackground: true,
  //     format: "Letter",
  //     path: outputPath,
  //     displayHeaderFooter: Boolean(headerTemplate || footerTemplate),
  //     headerTemplate,
  //     footerTemplate,
  //     ...pdfOptions
  //   });

  //   result = await page.title();
  // } catch (error) {
  //   return context.fail(error);
  // } finally {
  //   if (browser !== null) {
  //     await browser.close();
  //   }
  // }

  // return context.succeed(result);
};
