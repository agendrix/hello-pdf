import { writeFileSync } from "fs";
import Puppeteer from "puppeteer";

import { HtmlDocument } from "../../shared";

const puppeteerFlags = [
  "--disable-dev-shm-usage",
  "--font-render-hinting=none",
  "--disable-gpu",
  "--disable-extensions",
  "--disable-setuid-sandbox",
  "--no-sandbox",
];

class PdfEngine {
  public constructor() {}

  async render(document: HtmlDocument): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const browser = await Puppeteer.launch({ args: puppeteerFlags });
      const page = await browser.newPage();
      page.on("error", (e) => reject(e));

      await page.setContent(document.body, { waitUntil: "networkidle2" });
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

export default new PdfEngine();
