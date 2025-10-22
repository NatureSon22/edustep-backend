import { z } from "zod";

export const FileBodySchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.enum(["PDF", "PPT", "DOCX"]),
  fileUrl: z.url("File URL must be a valid URL"),
});

export const PartialFileBodySchema = FileBodySchema.partial();

export const FileParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid file ID format"),
});

export const FileQuerySchema = z.object({
  fileType: z.enum(["PDF", "PPT", "DOCX"]).optional(),
  search: z.string().optional(),
});

export type FileBody = z.infer<typeof FileBodySchema>;
export type PartialFileBody = z.infer<typeof PartialFileBodySchema>;
export type FileParams = z.infer<typeof FileParamsSchema>;
export type FileQuery = z.infer<typeof FileQuerySchema>;
