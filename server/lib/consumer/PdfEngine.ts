import Puppeteer, { Browser, Page } from "puppeteer";

import { Logger } from "../../shared";
import { HtmlDocument } from "../shared";

class PdfEngine {
  page: Page;
  private static _instance: PdfEngine;

  private constructor(page: Page) {
    this.page = page;
  }

  static async render(document: HtmlDocument): Promise<Buffer> {
    (await this.getInstance()).page.setContent(document.body);
    return this._instance.page.pdf({
      displayHeaderFooter: (document.header || document.footer) != undefined,
      headerTemplate: document.header,
      footerTemplate: document.footer,
      printBackground: true,
      landscape: false,
      margin: document.margins,
    });
  }

  private static async init() {
    Logger.log("Lauching Pupeteer");
    const puppeteerFlags = [
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ];
    const browser = await Puppeteer.launch({ args: puppeteerFlags });
    const page = await browser.newPage();
    this._instance = new PdfEngine(page);
  }

  private static async getInstance(): Promise<PdfEngine> {
    if (!this._instance) await this.init();
    return this._instance;
  }
}

export default PdfEngine;
