import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

const validate =
  (schema: ZodObject, type: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[type]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e) => e.message).join(", ");
        return res.status(400).json({
          status: "fail",
          message,
        });
      }
      next(error);
    }
  };

export default validate;
