const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const tmp = require("tmp");

const app = express();
const port = 3000;

async function generatePDF({
  inputPath,
  outputPath,
  headerTemplate,
  footerTemplate,
  pdfOptions
}) {
  const browser = await puppeteer.launch({
    // executablePath: "/usr/bin/chromium-browser",
    // headless: true,
    args: ["--disable-web-security"] // ["--no-sandbox", "--disable-dev-shm-usage"]
  });

  try {
    const page = await browser.newPage();
    // await page.emulateMedia("screen");
    await page.goto(`file://${inputPath}`, { waitUntil: "networkidle2" });
    await page.pdf({
      printBackground: true,
      format: "Letter",
      path: outputPath,
      displayHeaderFooter: Boolean(headerTemplate || footerTemplate),
      headerTemplate,
      footerTemplate,
      ...pdfOptions
    });
  } finally {
    await browser.close();
  }

  return pdfOptions.path;
}

app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(express.json({limit: '50mb'}));

app.post("/generate-pdf", async (req, res) => {
  const templates = {
    header: req.body.header,
    body: req.body.body,
    footer: req.body.footer
  };
  const pdfOptions = JSON.parse(req.body.pdfOptions);

  const inputHtmlTempFile = tmp.fileSync({ template: "XXXXXX.html" });
  const outputPDFTempFile = tmp.fileSync({ template: "XXXXXX.pdf" });
  fs.writeFileSync(inputHtmlTempFile.name, templates.body);

  try {
    const pdfPath = await generatePDF({
      inputPath: inputHtmlTempFile.name,
      outputPath: outputPDFTempFile.name,
      headerTemplate: templates.header,
      footerTemplate: templates.footer,
      pdfOptions
    });
    res.send({
      inputHtmlTempFile,
      pdfPath
    });
    return;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
});

app.listen(port, () => console.log(`Hello-PDF listening on port ${port}!`));
