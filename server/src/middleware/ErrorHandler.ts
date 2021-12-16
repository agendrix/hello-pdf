import { NextFunction, Request, Response } from "express";

import { ErrorResult, Logger } from "../../shared";

export default function (error: Error, _req: Request, res: Response, _next: NextFunction) {
  Logger.error("Internal server error", error);
  res.status(500).send(new ErrorResult("Internal server error"));
}
