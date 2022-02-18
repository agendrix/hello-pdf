const { asyncDocument, syncDocument } = require("./htmlDocument");
const htmlFile = require("./htmlFile");
const server = require("./server");

module.exports = { htmlFile, syncDocument, asyncDocument, server };
