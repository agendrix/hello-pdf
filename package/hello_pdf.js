const puppeteer = require("puppeteer");
const fs = require("fs");

/**
 * HelloPDF
 * @see {@link ./bin/hello_pdf.js} for available options
 */
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
    const browser = await puppeteer.launch({
      pipe: true, // https://github.com/puppeteer/puppeteer/issues/1262#issuecomment-448311449
      args: [
        "--disable-web-security",
        ...(this.options.extraArgs || [])
      ]
    });

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
      options.displayHeaderFooter = Boolean(options.headerTemplate || options.footerTemplate)
    }

    return options
  }
}

module.exports = HelloPDF
