const HelloPDF = require("../hello_pdf");
const path = require("path");
const fs = require("fs");

test("adds 1 + 2 to equal 3", () => {
  const outputPath = path.resolve(__dirname, "tmp/table.pdf")
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)

  pdf = new HelloPDF({
    headerPath: path.resolve(__dirname, "fixtures/table/header.html"),
    footerPath: path.resolve(__dirname, "fixtures/table/footer.html"),
    pageUrl: "file://" + path.resolve(__dirname, "fixtures/table/index.html"),
    outputPath: outputPath,
    pdf: {
      landscape: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm"
      }
    }
  })

  pdf.generate()
    .then((path) => {
      expect(path).toBe(outputPath)
      expect(fs.existsSync(outputPath)).toBe(true);
      fs.unlinkSync(outputPath)
    })
    .catch((err) => {
      console.error(err)
    })
});
