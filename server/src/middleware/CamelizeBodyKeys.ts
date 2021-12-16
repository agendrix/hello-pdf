import { NextFunction, Request, Response } from "express";

import { Camelize } from "../../shared/Utils";

export default async (req: Request, _: Response, next: NextFunction) => {
  req.body = Camelize(req.body);

  next();
};