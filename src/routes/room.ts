import { Router } from "express";
import {
  addRoom,
  editRoom,
  getRoomById,
  getRooms,
  toggleRoomArchiveStatus,
} from "../controller/room.js";
import validate from "../middleware/validate.js";
import {
  PartialRoomBodySchema,
  RoomBodySchema,
  RoomParamsSchema,
} from "../validation/room.js";

const roomRouter = Router();

roomRouter.get("/", getRooms);
roomRouter.get("/:id", validate(RoomParamsSchema, "params"), getRoomById);
roomRouter.post("/", validate(RoomBodySchema, "body"), addRoom);
roomRouter.put(
  "/:id",
  validate(RoomParamsSchema, "params"),
  validate(PartialRoomBodySchema, "body"),
  editRoom
);
roomRouter.put(
  "/:id/archive",
  validate(RoomParamsSchema, "params"),
  toggleRoomArchiveStatus
);

export default roomRouter;
