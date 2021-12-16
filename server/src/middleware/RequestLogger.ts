import { NextFunction, Request, Response } from "express";

import { Logger } from "../../shared";

export default function (req: Request, _: Response, next: NextFunction) {
  Logger.log("request received", {
    method: req.method,
    path: req.originalUrl,
    async: req.body.async,
    filename: req.body.filename,
    files: {
      body: !!req.body.body,
      header: !!req.body.header,
      footer: !!req.body.footer,
    },
    webhookUrl: req.body.webhookUrl,
    s3Url: req.body.s3Url?.split("?")[0],
  });
  next();
}
