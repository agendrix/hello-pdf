"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HtmlDocument {
    constructor(filename, body, meta, margins, header, footer) {
        this.filename = filename;
        this.body = body;
        this.meta = meta;
        this.margins = margins;
        this.header = header;
        this.footer = footer;
    }
}
HtmlDocument.Metadata = class {
    constructor(status, webhookUrl, s3Url) {
        this.status = status;
        this.webhookUrl = webhookUrl;
        this.s3Url = s3Url;
    }
};
HtmlDocument.Margins = class {
    constructor(top = "1cm", right = "1cm", bottom = "1cm", left = "1cm") {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
};
exports.default = HtmlDocument;
