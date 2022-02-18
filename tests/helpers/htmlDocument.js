const { HtmlDocument, Status } = require("../../dist/lib");
const htmlFile = require("./htmlFile");
const server = require("./server");

module.exports = {
  syncDocument: () => new HtmlDocument("test", htmlFile, new HtmlDocument.Metadata(Status.Queued)),
  asyncDocument: () =>
    new HtmlDocument("test", htmlFile, new HtmlDocument.Metadata(Status.Queued, server.webhookUrl, server.s3Url)),
};
