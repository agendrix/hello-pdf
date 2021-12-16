import { readdirSync } from "fs";

import { Logger, Queue } from "../../shared";

class Consumer {
  public constructor() {}

  async consume() {
    this.listenOnQueueEvents();
    this.logStats();
    const concurrency = Number(process.env.HELLO_PDF_CONCURRENY) || 1;
    Logger.log(`Workers started with concurrency: ${concurrency}`);
    const processor = this.processorPath();
    if (processor) {
      Queue.process(concurrency, processor);
    } else {
      throw new Error("Queue process not found");
    }
  }

  private processorPath() {
    const processor = readdirSync(__dirname).find((file) => file.search(/^processor\.[js|ts]+/) != -1);
    return `${__dirname}/${processor}`;
  }

  private listenOnQueueEvents() {
    Queue.on("global:error", function (error) {
      // An error occured.
      Logger.error(error);
    });

    Queue.on("global:waiting", function (jobId) {
      // A Job is waiting to be processed as soon as a worker is idling.
      Logger.log("waiting", { jobId });
    });

    Queue.on("global:active", function (jobId, _jobPromise) {
      // A job has started. You can use `jobPromise.cancel()`` to abort it.
      Logger.log("starting", { jobId });
    });

    Queue.on("global:stalled", function (jobId) {
      // A job has been marked as stalled. This is useful for debugging job
      // workers that crash or pause the event loop.
      Logger.warn("stalled", { jobId });
    });

    Queue.on("global:lock-extension-failed", function (jobId, err) {
      // A job failed to extend lock. This will be useful to debug redis
      // connection issues and jobs getting restarted because workers
      // are not able to extend locks.
      Logger.error(err, { jobId });
    });

    Queue.on("global:completed", function (jobId, _result) {
      Logger.log("done", { jobId });
    });

    Queue.on("global:failed", function (jobId, err) {
      // A job failed with reason `err`!
      Logger.log(`failed: ${err}`, { jobId });
    });

    Queue.on("global:paused", function () {
      // The queue has been paused.
      Logger.warn("queue paused");
    });

    Queue.on("global:resumed", function (_jobId) {
      // The queue has been resumed.
      Logger.warn("queue resumed");
    });

    Queue.on("global:cleaned", function (_jobs, _type) {
      // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
      // jobs, and `type` is the type of jobs cleaned.
      Logger.log("queue cleaned");
    });

    Queue.on("global:removed", function (jobId) {
      // A job successfully removed.
      Logger.log("removed", { jobId });
    });

    // Queue.on('global:progress', function (jobId, progress) {
    //   // A job's progress was updated!
    // })

    // Queue.on('global:drained', function () {
    //   // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
    // });
  }

  private logStats() {
    if (process.env.NODE_ENV === "production") {
      setInterval(async () => {
        Logger.log("stats", await Queue.getJobCounts());
      }, 5000);
    }
  }
}

export default new Consumer();
