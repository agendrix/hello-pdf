const Queue = require("../../dist/lib/Queue").default;

module.exports = async function () {
  Queue.obliterate({ force: true });
  global.workerProcess.kill("SIGTERM");
};
