import { NextFunction, Request, Response } from "express";

import { Logger } from "../../lib";

const skipLoggingForPaths = ["/health"];

export default function (req: Request, _: Response, next: NextFunction) {
  let request: Record<string, any> = {
    method: req.method,
    path: req.originalUrl,
  };

  if (req.body) {
    request = {
      ...request,
      body: {
        async: req.body.async,
        filename: req.body.filename,
        body_present: !!req.body.body,
        header_present: !!req.body.header,
        footer_present: !!req.body.footer,
        scale: req.body.scale,
        landscape: req.body.landscape,
        margins: req.body.margins,
        webhookUrl: req.body.webhookUrl,
        s3Url: req.body.s3Url?.split("?")[0],
      },
    };
  }

  if (!skipLoggingForPaths.includes(request.path)) Logger.log("request received", request);
  next();
}
