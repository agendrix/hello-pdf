const Queue = require("../../dist/lib/Queue").default;
const cleanProcesses = require("./cleanProcesses");

module.exports = async function () {
  Queue.obliterate({ force: true });
  global.workerProcess.kill("SIGTERM");
  cleanProcesses();
};
