import Puppeteer, { Browser, Page } from "puppeteer";
import { HtmlDocument } from "../shared";

class PdfEngine {
  page: Page;
  private static _instance: PdfEngine;

  private constructor(page: Page) {
    this.page = page;
  }

  static async build () {
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    this._instance = new PdfEngine(page);
  }

  static async render(document: HtmlDocument): Promise<Buffer> {
    if (!this._instance) throw new Error("PdfEngine not instanciated"); 

    await this._instance.page.setContent(document.body);
    return this._instance.page.pdf({
      displayHeaderFooter: document.hasHeaderOrFooter(),
      headerTemplate: document.header,
      footerTemplate: document.footer,
      printBackground: true,
      landscape: false,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm"
      }
    });
  }
}

export default PdfEngine;