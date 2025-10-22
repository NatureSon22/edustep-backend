import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import AppError from "../utils/appError.js";
import handleUploadFile from "../utils/handleUpload.js";
import { FileBody, FileParams } from "../validation/file.js";
import file from "../models/file.js";

// Helper to map MIME type → enum
const mapMimeToFileType = (mime: string): "PDF" | "PPT" | "DOCX" => {
  if (mime === "application/pdf") return "PDF";
  if (
    mime === "application/vnd.ms-powerpoint" ||
    mime ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return "PPT";
  if (
    mime === "application/msword" ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "DOCX";
  throw new Error(`Unsupported file type: ${mime}`);
};

export const addFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files;

    if (!files) {
      res.status(400).json({ message: "No files uploaded." });
      return;
    }

    const uploadedFiles: Express.Multer.File[] = Array.isArray(files)
      ? files
      : Object.values(files as Record<string, Express.Multer.File[]>).flat();

    if (uploadedFiles.length === 0) {
      res.status(400).json({ message: "No valid files found." });
      return;
    }

    // 🔹 Upload all files to Uploadcare
    const uploadResults = await Promise.all(
      uploadedFiles.map((file) =>
        handleUploadFile(file.path, file.originalname)
      )
    );

    const fileDocs: FileBody[] = uploadResults.map((file) => {
      const fileType = mapMimeToFileType(file.mimeType);
      return {
        fileName: file.metadata?.filename || file.name,
        fileType,
        fileUrl: file.cdnUrl,
      };
    });

    // Save all files
    const savedFiles = await file.insertMany(fileDocs);

    if (!savedFiles || savedFiles.length === 0) {
      return next(new AppError("Files not uploaded!", 500));
    }

    //Delete temp files after successful upload
    for (const f of uploadedFiles) {
      const filePath = path.resolve(f.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑 Deleted temporary file: ${filePath}`);
      }
    }

    res.status(200).json({
      message: "Files uploaded successfully!",
      data: savedFiles,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (
  req: Request<FileParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fileId = req.params.id;

    const deletedDoc = await file.findByIdAndDelete(fileId);

    if (!deletedDoc) {
      return next(new AppError("Failed to delete file", 500));
    }

    res.status(200).json({
      message: "File deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
