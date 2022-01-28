import { Appsignal } from "@appsignal/nodejs";

const AppSignal = new Appsignal({
  name: "HelloPdf",
  environment: process.env.APPSIGNAL_APP_ENV,
  active: process.env.APPSIGNAL_PUSH_API_KEY !== undefined,
  pushApiKey: process.env.APPSIGNAL_PUSH_API_KEY,
  log: "stdout",
  // TODO: Ignore health checks
  ignoreActions: [],
});

export default AppSignal;
