import { z } from "zod";

export const AccountBodySchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  username: z.string().min(1, "Username is required"),
  profilePictureUrl: z.url().optional().or(z.literal("")),
  role: z.enum(["Administrator", "Teacher", "Student"]).default("Student"),
  status: z.enum(["Active", "Inactive", "Archived"]).default("Active"),
});

export const PartialAccountBodySchema = AccountBodySchema.partial();

export const AccountParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid account ID format"),
});

export const AccountQuerySchema = z.object({
  role: z.enum(["Administrator", "Teacher", "Student"]).optional(),
  status: z.enum(["Active", "Inactive", "Archived"]).optional(),
  search: z.string().optional(),
});

export type AccountBody = z.infer<typeof AccountBodySchema>;
export type PartialAccountBody = z.infer<typeof PartialAccountBodySchema>;
export type AccountParams = z.infer<typeof AccountParamsSchema>;
export type AccountQuery = z.infer<typeof AccountQuerySchema>;
