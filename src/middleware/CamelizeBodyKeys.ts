import { NextFunction, Request, Response } from "express";

import { Camelize } from "../../shared";

export default function (req: Request, _: Response, next: NextFunction) {
  req.body = Camelize(req.body);

  next();
}
