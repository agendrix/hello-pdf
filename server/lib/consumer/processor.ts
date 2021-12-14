import { Job } from "bull";
import { HtmlDocument, http } from "../shared";
import PdfEngine from "./PdfEngine";

module.exports = async function (job: Job) {
  const document: HtmlDocument = job.data.document;
  const callbackUrl: string = job.data.callbackUrl;
  const presignedS3Url: string = job.data.presignedS3Url;
  const pdf = await PdfEngine.render(document);

  if(presignedS3Url) {
    await http.put(presignedS3Url, pdf, "");
  }

  // TODO: should return pdf buffer if call is sync
  if (callbackUrl) {
    await http.post(callbackUrl, location);
  }

  return Promise.resolve(location);
}