import { NextFunction, Request, RequestHandler, Response } from "express";

export const trace_middleware: RequestHandler = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
    req.timestamp = new Date();
    req["trace-id"] = generateTraceId(); // Generate a unique trace ID for each request
    next();
}

function generateTraceId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

