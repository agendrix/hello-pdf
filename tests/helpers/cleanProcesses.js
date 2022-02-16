const childProcess = require("child_process");

module.exports = function () {
  childProcess.exec("kill -9 $(pgrep -f hello-pdf)");
};
