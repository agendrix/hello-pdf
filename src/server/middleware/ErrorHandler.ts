import { NextFunction, Request, Response } from "express";

import { ErrorResult, Logger } from "../../lib";

export default function (error: Error, _: Request, res: Response, _next: NextFunction) {
  Logger.error("Internal server error", error);
  res.status(500).send(new ErrorResult("Internal server error"));
}