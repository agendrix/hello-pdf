import { NextFunction, Request, RequestHandler, Response } from "express";

// Errors returned from asynchronous functions invoked by route handlers and middleware must be passed to next() explicitly
// This middleware allows RequestHandlers to throw errors without having to call next()
export default function (routeHandler: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await routeHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
