const childProcess = require("child_process");

module.exports = async function () {
  global.workerProcess = childProcess.spawn("yarn", ["start:worker"]);
};
