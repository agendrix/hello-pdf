import { NextFunction, Request, Response } from "express";

import { Logger } from "../../shared";

export default function (req: Request, res: Response, next: NextFunction) {
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
    webhookUrl: req.body.webhook_url,
    s3Url: req.body.s3_url.split("?")[0],
  });
  next();
}
