import Puppeteer from "puppeteer";

import { HtmlDocument, Logger } from "..";

// https://peter.sh/experiments/chromium-command-line-switches/
const puppeteerFlags = [
  "--font-render-hinting=none",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--disable-extensions",
  "--disable-setuid-sandbox",
  "--no-sandbox",
];

if (process.env.NODE_ENV == "test") {
  puppeteerFlags.push('--js-flags="--max-old-space-size=1024"');
}

// 'userDataDir' enables sharing of cached assets between browser sessions
const userDataDir = process.env.NODE_ENV == "production" ? "/tmp" : undefined;

class PdfEngine {
  public constructor() {}

  static async render(document: HtmlDocument): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      Logger.debug("pdf-engine", "Starting a new browser");
      const browser = await Puppeteer.launch({ args: puppeteerFlags, userDataDir: userDataDir });
      try {
        Logger.debug("pdf-engine", "Starting a new page");
        const page = await browser.newPage();
        await page.setContent(document.body, { waitUntil: "networkidle2" });
        Logger.debug("pdf-engine", "Pdf rendering start");
        const pdf = await page.pdf({
          displayHeaderFooter: (document.header || document.footer) != undefined,
          headerTemplate: document.header,
          footerTemplate: document.footer,
          printBackground: true,
          margin: document.margins,
          landscape: document.landscape,
          scale: document.scale,
          timeout: process.env.HELLO_PDF_PRINT_TIMEOUT ? Number(process.env.HELLO_PDF_PRINT_TIMEOUT) : 1000 * 60 * 15,
        });
        Logger.debug("pdf-engine", "Pdf rendering done");
        resolve(pdf);
      } catch (e) {
        reject(e);
      } finally {
        browser.close();
      }
    });
  }
}

export default PdfEngine;
