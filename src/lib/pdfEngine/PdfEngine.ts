import Puppeteer from "puppeteer";

import { HtmlDocument } from "..";

// https://peter.sh/experiments/chromium-command-line-switches/
const puppeteerFlags = [
  "--font-render-hinting=none",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--disable-extensions",
  "--disable-setuid-sandbox",
  "--no-sandbox",
];

// 'userDataDir' enables sharing of cached assets between browser sessions
const userDataDir = process.env.NODE_ENV == "production" ? "/tmp" : undefined;

class PdfEngine {
  public constructor() {}

  static async render(document: HtmlDocument): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const browser = await Puppeteer.launch({ args: puppeteerFlags, userDataDir: userDataDir });
      try {
        const page = await browser.newPage();
        await page.setContent(document.body, { waitUntil: "networkidle2" });
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
