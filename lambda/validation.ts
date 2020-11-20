import Joi from "@hapi/joi";
import { PDFOptions } from "puppeteer";

type htmlString = string;
export type PdfRequest = {
  filename: string;
  content: htmlString;
  header?: htmlString;
  footer?: htmlString;
  css?: string;
  showAsHtml?: boolean;
  pdfOptions?: Omit<PDFOptions, "displayHeaderFooter">;
};

/** Convert and validate JSON string */
const JoiFromJSON: Joi.Root = Joi.extend(joi => {
  return {
    type: "object",
    base: joi.object(),
    coerce(value, _schema) {
      if (typeof value === "string" && value[0] === "{") {
        try {
          return { value: JSON.parse(value) };
        } catch (err) {
          throw new Error("Invalid JSON object");
        }
      } else {
        return { value };
      }
    },
  };
});

export const requestSchema = JoiFromJSON.object<PdfRequest>({
  filename: Joi.string().required(),
  content: Joi.string().required(),
  header: Joi.string(),
  footer: Joi.string(),
  css: Joi.string(),
  showAsHtml: Joi.boolean().default(false),
  pdfOptions: Joi.object<PDFOptions>({
    format: Joi.string().valid("Letter", "A4").default("Letter"),
    landscape: Joi.boolean().default(false),
    margin: Joi.object().default({ top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" }),
    scale: Joi.number(),
  }),
});
