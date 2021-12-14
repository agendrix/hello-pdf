import { JobId } from "bull";

import { JobStatus } from "../lib/shared/types";

class AsyncResult {
  constructor(
    private id: JobId,
    private filename: string | null = null,
    private status: JobStatus | null = null,
    private webhookUrl: string | null = null,
    private s3Url: string | null = null) {}
}

export default AsyncResult;
