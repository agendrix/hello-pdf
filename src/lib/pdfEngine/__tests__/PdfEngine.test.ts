import PdfEngine from "../";
import { HtmlDocument, Status } from "../..";
import { HtmlFile } from "../../../../tests/helpers";

describe("pdfEngine", () => {
  test("It should reject promise after timeout.", (done) => {
    const document = new HtmlDocument("test", HtmlFile, new HtmlDocument.Metadata(Status.Queued));
    let promiseRejected = false;

    process.env.HELLO_PDF_PRINT_TIMEOUT = "5";
    const promise = PdfEngine.render(document);
    promise
      .catch(() => {
        promiseRejected = true;
      })
      .finally(() => {
        process.env.HELLO_PDF_PRINT_TIMEOUT = undefined;
        expect(promiseRejected).toBeTruthy();
        done();
      });
  });
});
