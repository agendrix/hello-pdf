const childProcess = require("child_process");
const cleanProcesses = require("./cleanProcesses");

module.exports = async function () {
  cleanProcesses();
  global.workerProcess = childProcess.spawn("yarn", ["start:worker"]);
};
