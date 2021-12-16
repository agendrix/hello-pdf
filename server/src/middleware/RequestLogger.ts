import { NextFunction, Request, Response } from "express";

import { Logger } from "../../shared";

export default function (req: Request, res: Response, next: NextFunction) {
  Logger.log("request received", {
    method: req.method,
    path: req.path,
    body: { ...req.body, files: (req.files as Array<any>).map((file) => file.fieldname) },
  });
  next();
}
