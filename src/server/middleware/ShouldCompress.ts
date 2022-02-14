import { Request, Response } from "express";

export default function (req: Request, _res: Response) {
  return req.headers["accept-encoding"]?.includes("deflate") || false;
}
