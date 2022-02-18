import { gunzipSync, gzipSync } from "zlib";

import { Logger } from "..";
import type { Status } from "../types";

export interface IHtmlDocument {
  filename: string;
  body: string;
  meta: InstanceType<typeof HtmlDocument.Metadata>;
  margins: InstanceType<typeof HtmlDocument.Margins>;
  header?: string;
  footer?: string;
  scale: number;
  landscape: boolean;
  compressed: boolean;
}

export default class HtmlDocument implements IHtmlDocument {
  static Metadata = class {
    constructor(public status: Status, public webhookUrl?: string, public s3Url?: string) {}
  };

  static Margins = class {
    constructor(
      public top: string = "1cm",
      public right: string = "1cm",
      public bottom: string = "1cm",
      public left: string = "1cm",
    ) {}
  };

  constructor(
    public filename: string,
    public body: string,
    public meta: InstanceType<typeof HtmlDocument.Metadata>,
    public margins: InstanceType<typeof HtmlDocument.Margins> = new HtmlDocument.Margins(),
    public header?: string,
    public footer?: string,
    public scale: number = 1,
    public landscape: boolean = false,
    public compressed: boolean = false,
  ) {}

  toJSON() {
    this.compress();
    return this;
  }

  compress() {
    if (!this.compressed) {
      Logger.debug("html-document", "Compressing the document");
      this.body = gzipSync(this.body).toString("base64");
      this.header = this.header ? gzipSync(this.header).toString("base64") : undefined;
      this.footer = this.footer ? gzipSync(this.footer).toString("base64") : undefined;
      this.compressed = true;
    }
  }

  decompress() {
    if (this.compressed) {
      Logger.debug("html-document", "Decompressing the document");
      this.body = gunzipSync(Buffer.from(this.body, "base64")).toString("utf8");
      this.header = this.header ? gunzipSync(Buffer.from(this.header, "base64")).toString("utf8") : undefined;
      this.footer = this.footer ? gunzipSync(Buffer.from(this.footer, "base64")).toString("utf8") : undefined;
      this.compressed = false;
    }
  }

  static from(object: IHtmlDocument) {
    const copy = new HtmlDocument(
      object.filename,
      object.body,
      object.meta,
      object.margins,
      object.header,
      object.footer,
      object.scale,
      object.landscape,
      object.compressed,
    );

    copy.decompress();
    return copy;
  }
}
