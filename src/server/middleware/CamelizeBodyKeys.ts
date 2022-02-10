import { NextFunction, Request, Response } from "express";

import { Camelize } from "../../lib";

export default function (req: Request, _: Response, next: NextFunction) {
  req.body = Camelize(req.body);

  next();
}
