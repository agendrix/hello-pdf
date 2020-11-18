const HelloPDF = require("../hello_pdf");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const outputPath = path.resolve(__dirname, "tmp/table.pdf");
const pageUrl = "file://" + path.resolve(__dirname, "fixtures/table/index.html");

test("generate a pdf", async () => {
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

  const pdf = new HelloPDF({
    headerPath: path.resolve(__dirname, "fixtures/table/header.html"),
    footerPath: path.resolve(__dirname, "fixtures/table/footer.html"),
    pageUrl,
    outputPath: outputPath,
    pdf: {
      landscape: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    },
  });

  const pdfPath = await pdf.generate();

  expect(pdfPath).toBe(outputPath);
  expect(fs.existsSync(outputPath)).toBe(true);
  fs.unlinkSync(outputPath);
});

test("cli can generate PDF", async () => {
  const cmd = ["node", path.resolve(__dirname, "../../package/bin/hello_pdf"), "--url", pageUrl, "--o", outputPath];

  await new Promise(async (resolve) => {
    exec(cmd.join(" "), (_error, stdout, _stderr) => {
      expect(stdout.trim()).toBe(outputPath);
      resolve();
    });
  });

  expect(fs.existsSync(outputPath)).toBe(true);
  fs.unlinkSync(outputPath);
});

test("cli can timeout", async () => {
  const cmd = [
    "PROCESS_TIMEOUT=1",
    "node",
    path.resolve(__dirname, "../../package/bin/hello_pdf"),
    "--url",
    pageUrl,
    "--o",
    outputPath,
  ];

  await new Promise(async (resolve) => {
    exec(cmd.join(" "), (_error, _stdout, stderr) => {
      expect(stderr).toContain("killed after timer expired");
      resolve();
    });
  });

  expect(fs.existsSync(outputPath)).toBe(false);
});
