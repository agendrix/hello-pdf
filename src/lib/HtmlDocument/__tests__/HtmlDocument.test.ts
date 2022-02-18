import HtmlDocument from "..";
// @ts-ignore
import { syncDocument } from "../../../../tests/helpers";

describe("HtmlDocument", () => {
  describe("toJSON", () => {
    test("It should compress the document when stringified with JSON.stringify.", async () => {
      const document = syncDocument();
      expect(document.compressed).toBeFalsy();
      const stringified = JSON.stringify(document);
      expect(JSON.parse(stringified).compressed).toBeTruthy();
    });
  });

  describe("from()", () => {
    test("It should decompress a document if he is compressed.", async () => {
      const document = syncDocument();
      const serializedDocument = JSON.stringify(document);
      const unserializedDocument = JSON.parse(serializedDocument);
      unserializedDocument.compressed = true;
      const copyObject = HtmlDocument.from(unserializedDocument);
      expect(copyObject.compressed).toBeFalsy();
    });
  });
});
