const { readFileSync } = require("fs");

const file = readFileSync(`${__dirname}/test.html`).toString();
module.exports = file;
