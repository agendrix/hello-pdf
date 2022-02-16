const Queue = require("../../dist/lib/Queue").default;
const cleanProcesses = require("./cleanProcesses");

module.exports = async function () {
  Queue.clean(0);
  global.workerProcess.kill("SIGTERM");
  cleanProcesses();
};
