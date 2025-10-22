import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const RoomMemberBodySchema = z.object({
  roomId: z
    .string()
    .regex(objectIdRegex, "Invalid room ID format")
    .describe("Reference to ROOM"),
  accountId: z
    .string()
    .regex(objectIdRegex, "Invalid account ID format")
    .describe("Reference to ACCOUNT"),
  joinedAt: z.date().default(() => new Date()),
  leftAt: z.date().optional(),
  status: z.enum(["Active", "Removed", "Archived"]).default("Active"),
  archivedAt: z.date().optional(),
});

export const PartialRoomMemberBodySchema = RoomMemberBodySchema.partial();

export const RoomMemberParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, "Invalid Room Member ID format"),
});

export const RoomMemberQuerySchema = z.object({
  roomId: z.string().regex(objectIdRegex, "Invalid room ID format").optional(),
  accountId: z
    .string()
    .regex(objectIdRegex, "Invalid account ID format")
    .optional(),
  status: z.enum(["Active", "Removed", "Archived"]).optional(),
});

export type RoomMemberBody = z.infer<typeof RoomMemberBodySchema>;
export type PartialRoomMemberBody = z.infer<typeof PartialRoomMemberBodySchema>;
export type RoomMemberParams = z.infer<typeof RoomMemberParamsSchema>;
export type RoomMemberQuery = z.infer<typeof RoomMemberQuerySchema>;
