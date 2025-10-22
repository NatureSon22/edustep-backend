import multer, { FileFilterCallback } from "multer";
import storage from "./storage";
import { Request, Response, NextFunction } from "express";

const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100 MB

// Configure multer
const upload = multer({
  storage: storage("document"),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type is not allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

// Middleware to check total size of all uploaded files
const checkTotalSize = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Multer can attach files as req.files (array or object)
  const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;

  let totalSize = 0;

  if (Array.isArray(files)) {
    totalSize = files.reduce((sum, file) => sum + file.size, 0);
  } else if (files && typeof files === "object") {
    totalSize = Object.values(files).flat().reduce((sum, file) => sum + file.size, 0);
  }

  if (totalSize > MAX_TOTAL_SIZE) {
    res.status(400).json({
      message: `Total file size exceeds the 100MB limit. Uploaded size: ${(
        totalSize /
        (1024 * 1024)
      ).toFixed(2)}MB`,
    });
    return;
  }

  next();
};

export { upload, checkTotalSize };