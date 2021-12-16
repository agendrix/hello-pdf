import { NextFunction, Request, Response } from "express";

import { ErrorResult } from "../../shared";

export default (mandatoryBodyFields: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bodyFields = Object.keys(req.body);
    if (mandatoryBodyFields.some((field) => !bodyFields.includes(field))) {
      res.status(400).json(new ErrorResult("Missing required body fields."));
    } else {
      next();
    }
  };
};
