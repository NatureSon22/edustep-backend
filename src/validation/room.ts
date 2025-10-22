import { z } from "zod";

export const RoomBodySchema = z.object({
  name: z.string().min(1, "Room name is required"),
  joinCode: z.string().min(1, "Join code is required"),
  description: z.string().optional(),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID format"),
  classSection: z.string().min(1, "Class section is required"),
  schoolYearStart: z.number().int().min(2000, "Invalid school year start"),
  schoolYearEnd: z.number().int().min(2000, "Invalid school year end"),
  creatorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid creator ID format"),
  isActive: z.boolean().default(true),
  isArchived: z.boolean().default(false),
  archivedAt: z.date().optional(),
});

export const PartialRoomBodySchema = RoomBodySchema.partial();

// Schema for params (e.g., /rooms/:id)
export const RoomParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid room ID format"),
});

// Schema for query filters
export const RoomQuerySchema = z.object({
  isActive: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  search: z.string().optional(),
});

export type RoomBody = z.infer<typeof RoomBodySchema>;
export type PartialRoomBody = z.infer<typeof PartialRoomBodySchema>;
export type RoomParams = z.infer<typeof RoomParamsSchema>;
export type RoomQuery = z.infer<typeof RoomQuerySchema>;
