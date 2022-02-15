import Queue from "../../src/lib/Queue";

export default async function () {
  Queue.obliterate({ force: true });
  // @ts-expect-error
  if (global.workerProcess) {
    // @ts-expect-error
    global.workerProcess.kill("SIGTERM");
  }
}
