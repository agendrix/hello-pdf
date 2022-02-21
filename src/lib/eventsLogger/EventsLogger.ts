import { EventEmitter } from "events";

import { Logger, Queue } from "..";

class EventsLogger {
  log() {
    // Prevents MaxListenersExceededWarning warning
    // https://github.com/OptimalBits/bull/issues/1335
    EventEmitter.defaultMaxListeners = 20;

    this.logGlobalQueueEvents();
    this.logStats();
  }

  private logGlobalQueueEvents() {
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
      Queue.getJob(jobId).then((job) => {
        let logContext = { jobId } as Object;
        if (job && job.processedOn && job.finishedOn) {
          logContext = { ...logContext, processingTime: job.finishedOn - job.processedOn };
        }
        Logger.log("done", logContext);
      });
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
  }

  private logStats() {
    if (process.env.HELLO_PDF_LOG_STATS == "true") {
      setInterval(async () => {
        Logger.log("stats", await Queue.getJobCounts());
      }, 5000);
    }
  }
}

export default EventsLogger;
