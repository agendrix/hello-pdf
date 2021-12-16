import { NextFunction, Request, Response } from "express";
import Multer from "multer";

const Upload = Multer({ storage: Multer.memoryStorage() });

function appendFilesToBody(req: Request, res: Response, next: NextFunction) {
  if (req.files) {
    (req.files as Array<any>).forEach((file) => {
      req.body[file.fieldname] = file.buffer.toString();
    });

    delete req.files;
  }

  next();
}

export default [Upload.any(), appendFilesToBody];
