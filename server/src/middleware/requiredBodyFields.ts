import { Request, Response, NextFunction } from "express";

export default (mandatoryBodyFields: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bodyFields = Object.keys(req.body);
    if (mandatoryBodyFields.some(field => !bodyFields.includes(field))) {
      res.status(400).json({error_message: "Missing required body fields"});
    } else {
      next();
    }
  }
}
