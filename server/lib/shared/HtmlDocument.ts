class HtmlDocument {
  constructor(
    public filename: string,
    public body: string,
    public header?: string,
    public footer?: string,
    public webhookUrl?: string) {}

  hasHeaderOrFooter(): boolean {
    return this.header != undefined || this.footer != undefined;
  }
}

export default HtmlDocument;
