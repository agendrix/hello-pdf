import HtmlDocument from "..";
import { Status } from "../..";
import { HtmlFile } from "../../../../tests/helpers";

describe("HtmlDocument", () => {
  describe("toJSON", () => {
    test("It should compress the document when stringified with JSON.stringify.", async () => {
      const document = new HtmlDocument("test", HtmlFile, new HtmlDocument.Metadata(Status.Queued));
      expect(document.compressed).toBeFalsy();
      const stringified = JSON.stringify(document);
      expect(JSON.parse(stringified).compressed).toBeTruthy();
    });
  });

  describe("from()", () => {
    test("It should decompress a document if he is compressed.", async () => {
      const document = new HtmlDocument("test", HtmlFile, new HtmlDocument.Metadata(Status.Queued));
      const serializedDocument = JSON.stringify(document);
      const unserializedDocument = JSON.parse(serializedDocument);
      unserializedDocument.compressed = true;
      const copyObject = HtmlDocument.from(unserializedDocument);
      expect(copyObject.compressed).toBeFalsy();
    });
  });
});
