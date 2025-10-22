import { z } from "zod";

// Main Course schema
export const CourseBodySchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().optional(),
  department: z.string().optional(),
  isArchived: z.boolean().default(false),
});

export const PartialCourseBodySchema = CourseBodySchema.partial();

// Schema for params (e.g., /courses/:id)
export const CourseParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID format"),
});

// Schema for query filters
export const CourseQuerySchema = z.object({
  department: z.string().optional(),
  search: z.string().optional(),
});

export type CourseBody = z.infer<typeof CourseBodySchema>;
export type PartialCourseBody = z.infer<typeof PartialCourseBodySchema>;
export type CourseParams = z.infer<typeof CourseParamsSchema>;
export type CourseQuery = z.infer<typeof CourseQuerySchema>;
