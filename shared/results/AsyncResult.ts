import { JobId } from "bull";

import { Status } from "../types";
import Result from "./Result";

class AsyncResult extends Result {
  constructor(
    private id: JobId,
    private filename: string | null = null,
    private status: Status | null = null,
    private webhookUrl: string | null = null,
    private s3Url: string | null = null,
  ) {
    super();
  }
}

export default AsyncResult;
