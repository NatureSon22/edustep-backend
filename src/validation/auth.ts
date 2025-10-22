import { z } from "zod";

export const AuthBodySchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const AuthRequestSchema = z.object({
  body: AuthBodySchema,
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type AuthBody = z.infer<typeof AuthBodySchema>;