import { Job } from "bull";
import { HtmlDocument, http } from "../shared";
import PdfEngine from "./PdfEngine";
import S3 from "./S3";

module.exports = async function (job: Job) {
  const document: HtmlDocument = job.data.document;
  const callbackUrl: string = job.data.callbackUrl;
  const pdf = await PdfEngine.render(document);
  const location = await S3.upload(document.name, pdf);

  if (callbackUrl) {
    await http.post(callbackUrl, location);
  }

  return Promise.resolve(location);
}