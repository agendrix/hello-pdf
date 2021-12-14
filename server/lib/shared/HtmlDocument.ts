class HtmlDocument {
  constructor(
    public filename: string,
    public body: string,
    public header?: string,
    public footer?: string,
    public webhookUrl?: string) {}
}

export default HtmlDocument;
