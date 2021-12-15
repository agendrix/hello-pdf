import { Status } from "./types";

class HtmlDocument {
  static Metadata = class {
    constructor(public status: Status, public webhookUrl?: string, public s3Url?: string) {}
  };

  static Margins = class {
    constructor(
      public top: string = "1px",
      public right: string = "1px",
      public bottom: string = "1px",
      public left: string = "1px",
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
