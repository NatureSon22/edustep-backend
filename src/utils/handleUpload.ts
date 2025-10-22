import fs from "fs";
import path from "path";
import { uploadFile, type UploadcareFile } from "@uploadcare/upload-client";
import mime from "mime";

const handleUploadFile = async (
  filePath: string,
  fileName: string
): Promise<UploadcareFile> => {
  try {
    const resolvedPath = path.resolve(filePath);

    if (
      !fs.existsSync(resolvedPath) ||
      fs.lstatSync(resolvedPath).isDirectory()
    ) {
      throw new Error(`Invalid file path: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(resolvedPath);
    const contentType =
      mime.getType(resolvedPath) || "application/octet-stream";

    const response = await uploadFile(fileBuffer, {
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY as string,
      store: "auto",
      contentType,
      metadata: {
        subsystem: "js-client",
        description: "File uploaded via Uploadcare client",
        filename: fileName,
      },
    });

    console.log("Upload successful:", response);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Upload failed:", error.message);
    } else {
      console.error("Upload failed:", error);
    }
    throw error;
  }
};

export default handleUploadFile;
