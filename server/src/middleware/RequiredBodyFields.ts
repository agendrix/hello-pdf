import { NextFunction, Request, Response } from "express";

import { ErrorResult, Logger } from "../../shared";

export default (mandatoryRequestFields: { files: Array<string>; body: Array<string> }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let error;
    if (mandatoryRequestFields.body.some((field) => !req.body[field])) {
      error = new ErrorResult("Missing required body fields.");
    }
    if (
      mandatoryRequestFields.files.some((field) => {
        !(req.files as Array<any>)?.some((file: any) => {
          file.fieldname === field;
        });
      })
    ) {
      error = new ErrorResult("Missing required files fields.");
    }

    if (error) res.status(400).json(error);
    else next();
  };
};
