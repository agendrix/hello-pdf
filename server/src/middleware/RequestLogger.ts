import { NextFunction, Request, Response } from "express";
import { Logger } from "../../shared";

export default function (req: Request, res: Response, next: NextFunction) {
  Logger.log("request received", { ...req.body, ...req.files });
  next();
}
