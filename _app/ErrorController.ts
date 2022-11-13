import { Request, Response, NextFunction } from "express";

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`_-_-_ERROR_-_-_ : ${err.message}`);
  next(err);
};

export const errorResponder = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(400).send(err.message);
};
