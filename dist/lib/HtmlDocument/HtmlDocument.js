"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zlib_1 = require("zlib");
const __1 = require("..");
class HtmlDocument {
    constructor(filename, body, meta, margins = new HtmlDocument.Margins(), header, footer, scale = 1, landscape = false, compressed = false) {
        this.filename = filename;
        this.body = body;
        this.meta = meta;
        this.margins = margins;
        this.header = header;
        this.footer = footer;
        this.scale = scale;
        this.landscape = landscape;
        this.compressed = compressed;
    }
    toJSON() {
        this.compress();
        return this;
    }
    compress() {
        if (!this.compressed) {
            __1.Logger.debug("html-document", "Compressing the document");
            this.body = (0, zlib_1.gzipSync)(this.body).toString("base64");
            this.header = this.header ? (0, zlib_1.gzipSync)(this.header).toString("base64") : undefined;
            this.footer = this.footer ? (0, zlib_1.gzipSync)(this.footer).toString("base64") : undefined;
            this.compressed = true;
        }
    }
    decompress() {
        if (this.compressed) {
            __1.Logger.debug("html-document", "Decompressing the document");
            this.body = (0, zlib_1.gunzipSync)(Buffer.from(this.body, "base64")).toString("utf8");
            this.header = this.header ? (0, zlib_1.gunzipSync)(Buffer.from(this.header, "base64")).toString("utf8") : undefined;
            this.footer = this.footer ? (0, zlib_1.gunzipSync)(Buffer.from(this.footer, "base64")).toString("utf8") : undefined;
            this.compressed = false;
        }
    }
    static from(object) {
        const copy = new HtmlDocument(object.filename, object.body, object.meta, object.margins, object.header, object.footer, object.scale, object.landscape, object.compressed);
        copy.decompress();
        return copy;
    }
}
exports.default = HtmlDocument;
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
