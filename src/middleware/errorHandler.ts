import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.stack);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
