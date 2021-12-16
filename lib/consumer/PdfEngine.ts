import Puppeteer, { Browser, Page } from "puppeteer";

import { HtmlDocument, Logger } from "../../shared";

const puppeteerFlags = [
  "--disable-dev-shm-usage",
  "--font-render-hinting=none",
  "--disable-gpu",
  "--disable-extensions",
  "--disable-setuid-sandbox",
  "--no-sandbox",
];

class PdfEngine {
  private constructor() {}

  static async render(document: HtmlDocument): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const browser = await Puppeteer.launch({ args: puppeteerFlags });
      const page = await browser.newPage();
      page.on("error", (e) => reject(e));

      const pdf = await page.pdf({
        displayHeaderFooter: (document.header || document.footer) != undefined,
        headerTemplate: document.header,
        footerTemplate: document.footer,
        printBackground: true,
        landscape: false,
        margin: document.margins,
        timeout: 1000 * 60 * 15,
      });

      resolve(pdf);
      browser.close();
    });
  }
}

export default PdfEngine;
