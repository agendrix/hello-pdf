type Metadata = {
  status: string;
  webhookUrl?: string;
  s3Url?: string;
};

class HtmlDocument {
  constructor(
    public filename: string,
    public body: string,
    public header?: string,
    public footer?: string,
    public meta: Metadata) {}

  hasHeaderOrFooter(): boolean {
    return this.header != undefined || this.footer != undefined;
  }
}

export default HtmlDocument;
