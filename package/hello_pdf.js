const puppeteer = require("puppeteer");
const fs = require("fs");

//
// HelloPDF
//
// Options :
//  outputPath
//  pageUrl
//  headerPath
//  footerPath
//  pdf: {} => https://github.com/GoogleChrome/puppeteer/blob/v1.2.0/docs/api.md#pagepdfoptions
//
class HelloPDF {
  constructor(options) {
    this.options = options
  }

  validateConfig() {
    if (!this.options.outputPath) throw new Error("options.outputPath is required")
    if (!this.options.pageUrl) throw new Error("options.pageUrl is required")
  }

  async generate() {
    this.validateConfig()
    const pdfOptions = this.pdfOptions();
    const browser = await puppeteer.launch();

    try {
      const page = await browser.newPage();
      // await page.emulateMedia("screen");
      await page.goto(this.options.pageUrl, { waitUntil: "networkidle2" });
      await page.pdf(pdfOptions);
    } catch (e) {
      await browser.close();
      throw e;
    }

    await browser.close();
    return pdfOptions.path;
  }

  pdfOptions() {
    const options = {
      printBackground: true,
      format: "Letter",
      path: this.options.outputPath,
      ...this.options.pdf,
    }

    // Read header and footer
    if (this.options.headerPath) {
      options.headerTemplate = fs.readFileSync(this.options.headerPath).toString()
    }

    if (this.options.footerPath) {
      options.footerTemplate = fs.readFileSync(this.options.footerPath).toString()
    }

    // Automatically display header and footer if not set and template provided
    if (typeof options.displayHeaderFooter == "undefined") {
      options.displayHeaderFooter = options.headerTemplate || options.footerTemplate
    }

    return options
  }
}

module.exports = HelloPDF
