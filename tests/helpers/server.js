const { Server } = require("http");
const express = require("express");

const app = express();
app.set("webhookReceived", false);
app.set("webhookReceivedCount", 0);
app.set("uploadReceived", false);

app.post("/webhook", (_req, res) => {
  app.set("webhookReceived", true);
  app.set("webhookReceivedCount", app.get("webhookReceivedCount") + 1);
  res.sendStatus(200);
});

app.put("/upload", (_req, res) => {
  app.set("uploadReceived", true);
  res.sendStatus(200);
});

let server = undefined;
const start = () => (server = app.listen(3000));
const stop = () => server?.close();
const reset = () => {
  app.set("webhookReceived", false);
  app.set("webhookReceivedCount", 0);
  app.set("uploadReceived", false);
};
const webhookReceived = () => app.get("webhookReceived");
const webhookReceivedCount = () => app.get("webhookReceivedCount");
const uploadReceived = () => app.get("uploadReceived");

module.exports = {
  start,
  stop,
  reset,
  webhookUrl: "http://localhost:3000/webhook",
  s3Url: "http://localhost:3000/upload",
  webhookReceived,
  webhookReceivedCount,
  uploadReceived,
};
