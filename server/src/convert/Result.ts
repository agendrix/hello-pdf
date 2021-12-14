import { JobId } from "bull";

import { JobStatus } from "../../lib/shared/types";

class Result {
  constructor(
    private id: JobId,
    private filename: string | null = null,
    private status: JobStatus | null = null,
    private webhookUrl: string | null = null) {}
}

export default Result;
