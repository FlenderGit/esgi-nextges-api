import { NextFunction, Response, Request, RequestHandler } from "express";

export const log_middleware: RequestHandler = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};
