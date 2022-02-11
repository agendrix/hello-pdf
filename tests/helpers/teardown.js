const Queue = require("../../dist/src/lib/Queue").default;

module.exports = async function () {
  Queue.obliterate({ force: true });
  global.workerProcess.kill("SIGTERM");
};
