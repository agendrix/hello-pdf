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
const timers_1 = require("timers");
const shared_1 = require("../../shared");
function logEvents() {
    listenOnQueueEvents();
    logStats();
}
exports.default = logEvents;
function listenOnQueueEvents() {
    shared_1.Queue.on("global:error", function (error) {
        // An error occured.
        shared_1.Logger.error(error);
    });
    shared_1.Queue.on("global:waiting", function (jobId) {
        // A Job is waiting to be processed as soon as a worker is idling.
        shared_1.Logger.log("waiting", { jobId });
    });
    shared_1.Queue.on("global:active", function (jobId, _jobPromise) {
        // A job has started. You can use `jobPromise.cancel()`` to abort it.
        shared_1.Logger.log("starting", { jobId });
    });
    shared_1.Queue.on("global:stalled", function (jobId) {
        // A job has been marked as stalled. This is useful for debugging job
        // workers that crash or pause the event loop.
        shared_1.Logger.warn("stalled", { jobId });
    });
    shared_1.Queue.on("global:lock-extension-failed", function (jobId, err) {
        // A job failed to extend lock. This will be useful to debug redis
        // connection issues and jobs getting restarted because workers
        // are not able to extend locks.
        shared_1.Logger.error(err, { jobId });
    });
    shared_1.Queue.on("global:completed", function (jobId, _result) {
        shared_1.Logger.log("done", { jobId });
    });
    shared_1.Queue.on("global:failed", function (jobId, err) {
        // A job failed with reason `err`!
        shared_1.Logger.log(`failed: ${err}`, { jobId });
    });
    shared_1.Queue.on("global:paused", function () {
        // The queue has been paused.
        shared_1.Logger.warn("queue paused");
    });
    shared_1.Queue.on("global:resumed", function (_jobId) {
        // The queue has been resumed.
        shared_1.Logger.warn("queue resumed");
    });
    shared_1.Queue.on("global:cleaned", function (_jobs, _type) {
        // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
        // jobs, and `type` is the type of jobs cleaned.
        shared_1.Logger.log("queue cleaned");
    });
    shared_1.Queue.on("global:removed", function (jobId) {
        // A job successfully removed.
        shared_1.Logger.log("removed", { jobId });
    });
    // Queue.on('global:progress', function (jobId, progress) {
    //   // A job's progress was updated!
    // })
    // Queue.on('global:drained', function () {
    //   // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
    // });
}
function logStats() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, timers_1.setInterval)(() => __awaiter(this, void 0, void 0, function* () {
            shared_1.Logger.log("stats", yield shared_1.Queue.getJobCounts());
        }), 5000);
    });
}
