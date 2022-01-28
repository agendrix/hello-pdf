import { Appsignal } from "@appsignal/nodejs";

const appSignalClient = new Appsignal({
  name: "HelloPdf",
  environment: process.env.APPSIGNAL_APP_ENV,
  active: process.env.APPSIGNAL_PUSH_API_KEY !== undefined && process.env.NODE_ENV === "production",
  pushApiKey: process.env.APPSIGNAL_PUSH_API_KEY,
  log: "stdout",
  // TODO: Ignore health checks
  ignoreActions: [],
  debug: true,
});

export default appSignalClient;
