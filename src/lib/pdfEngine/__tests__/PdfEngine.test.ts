// @ts-expect-error
import PdfParser from "pdf2json";

import PdfEngine from "../";
// @ts-expect-error
import { syncDocument } from "../../../../tests/helpers";

describe("pdfEngine", () => {
  test("It should reject promise after timeout.", (done) => {
    const document = syncDocument();
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
