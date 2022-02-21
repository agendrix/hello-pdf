"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const __1 = require("..");
class EventsLogger {
    log() {
        // Prevents MaxListenersExceededWarning warning
        // https://github.com/OptimalBits/bull/issues/1335
        events_1.EventEmitter.defaultMaxListeners = 20;
        this.logGlobalQueueEvents();
        this.logStats();
    }
    logGlobalQueueEvents() {
        __1.Queue.on("global:error", function (error) {
            // An error occured.
            __1.Logger.error(error);
        });
        __1.Queue.on("global:waiting", function (jobId) {
            // A Job is waiting to be processed as soon as a worker is idling.
            __1.Logger.log("waiting", { jobId });
        });
        __1.Queue.on("global:active", function (jobId, _jobPromise) {
            // A job has started. You can use `jobPromise.cancel()`` to abort it.
            __1.Logger.log("starting", { jobId });
        });
        __1.Queue.on("global:stalled", function (jobId) {
            // A job has been marked as stalled. This is useful for debugging job
            // workers that crash or pause the event loop.
            __1.Logger.warn("stalled", { jobId });
        });
        __1.Queue.on("global:lock-extension-failed", function (jobId, err) {
            // A job failed to extend lock. This will be useful to debug redis
            // connection issues and jobs getting restarted because workers
            // are not able to extend locks.
            __1.Logger.error(err, { jobId });
        });
        __1.Queue.on("global:completed", function (jobId, _result) {
            __1.Queue.getJob(jobId).then((job) => {
                let logContext = { jobId };
                if (job && job.processedOn && job.finishedOn) {
                    logContext = Object.assign(Object.assign({}, logContext), { processingTime: job.finishedOn - job.processedOn });
                }
                __1.Logger.log("done", logContext);
            });
        });
        __1.Queue.on("global:failed", function (jobId, err) {
            // A job failed with reason `err`!
            __1.Logger.log(`failed: ${err}`, { jobId });
        });
        __1.Queue.on("global:paused", function () {
            // The queue has been paused.
            __1.Logger.warn("queue paused");
        });
        __1.Queue.on("global:resumed", function (_jobId) {
            // The queue has been resumed.
            __1.Logger.warn("queue resumed");
        });
        __1.Queue.on("global:cleaned", function (_jobs, _type) {
            // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
            // jobs, and `type` is the type of jobs cleaned.
            __1.Logger.log("queue cleaned");
        });
        __1.Queue.on("global:removed", function (jobId) {
            // A job successfully removed.
            __1.Logger.log("removed", { jobId });
        });
    }
    logStats() {
        if (process.env.HELLO_PDF_LOG_STATS == "true") {
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                __1.Logger.log("stats", yield __1.Queue.getJobCounts());
            }), 5000);
        }
    }
}
exports.default = EventsLogger;
