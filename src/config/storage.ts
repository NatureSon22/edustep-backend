import multer, { StorageEngine } from "multer";
import fs from "fs";
import path from "path";
import type { Request } from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = (folder: string): StorageEngine => {
  const storagePath = path.join(__dirname, "uploads", folder);

  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ): void => {
      cb(null, storagePath);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ): void => {
      cb(null, file.originalname);
    },
  });
};

export default storage;
