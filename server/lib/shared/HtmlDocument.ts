import { Status } from "./types";

type Metadata = {
  status: Status;
  webhookUrl?: string;
  s3Url?: string;
};

class HtmlDocument {
  constructor(
    public filename: string,
    public body: string,
    public meta: Metadata,
    public header?: string,
    public footer?: string,
  ) {}
}

export default HtmlDocument;
