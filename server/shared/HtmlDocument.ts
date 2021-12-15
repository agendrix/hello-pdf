import type { Status } from "./types";

class HtmlDocument {
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
    public margins?: InstanceType<typeof HtmlDocument.Margins>,
    public header?: string,
    public footer?: string,
  ) {}
}

export default HtmlDocument;
