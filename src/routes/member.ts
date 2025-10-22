import { Router } from "express";
import validate from "../middleware/validate";
import {
  RoomMemberBodySchema,
  RoomMemberParamsSchema,
} from "../validation/member.js";
import {
  addMember,
  getMemberById,
  getMembers,
  removeMember,
} from "../controller/member.js";

const memberRouter = Router();

memberRouter.get("/", getMembers);
memberRouter.get(
  "/:id",
  validate(RoomMemberParamsSchema, "params"),
  getMemberById
);
memberRouter.post("/", validate(RoomMemberBodySchema, "body"), addMember);
memberRouter.put(
  "/:id",
  validate(RoomMemberParamsSchema, "params"),
  removeMember
);

export default memberRouter;
