#!/usr/bin/env node

const path = require("path");
const args = require("yargs")
  .option("url", {
    alias: "i",
    describe: "Input URL of html file",
    type: "string",
    coerce: (url) => {
      if (url.indexOf("://") === -1) {
        url = "file://" + path.resolve(url);
      }
      return url;
    },
  })
  .option("output", {
    alias: "o",
    describe: "Provide a path to output file",
    type: "string",
    coerce: path.resolve,
  })
  .option("header", {
    alias: "h",
    describe: "Header path",
    coerce: path.resolve,
  })
  .option("footer", {
    alias: "f",
    describe: "Footer path",
    coerce: path.resolve,
  })
  .option("pdf-options", {
    describe:
      "JSON PDF Options passed directly to Puppeteer, see https://github.com/GoogleChrome/puppeteer/blob/v1.2.0/docs/api.md#pagepdfoptions",
    type: "string",
    coerce: JSON.parse,
  })
  .option("extra-args", {
    describe: "Extra arguments passed to browser instance used by Puppeteer",
    type: "string",
    coerce: JSON.parse,
  })
  .option("timeout", {
    describe: "Sometimes, processes can hang for 38h+; causing CPUs to top at 100%. " +
              "This timeout manually kills hanging processes after its value has elapsed. " +
              "Disabled if not defined.",
    type: "number",
    default: undefined,
  })
  .demandOption(["url", "output"], "Please provide both url and output arguments to work with this tool")
  .help().argv;

const HelloPDF = require("../hello_pdf");

const pdf = new HelloPDF({
  pageUrl: args.url,
  outputPath: args.output,
  headerPath: args.header,
  footerPath: args.footer,
  pdf: args.pdfOptions,
  extraArgs: args.extraArgs,
});

let killTimeout;
if (args.timeout) {
  killTimeout = setTimeout(() => {
    console.error(`Process ${process.pid} killed after timer expired.`);
    return process.kill(process.pid);
  }, args.timeout);
}

pdf.generate()
  .then((path) => {
    console.log(path);
  })
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => {
    clearTimeout(killTimeout);
  });
