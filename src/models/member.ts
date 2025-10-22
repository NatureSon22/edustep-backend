import { Schema, model, Types } from "mongoose";

const roomMemberSchema = new Schema(
  {
    roomId: {
      type: Types.ObjectId,
      ref: "Room",
      required: true,
    },
    accountId: {
      type: Types.ObjectId,
      ref: "Account",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Removed", "Archived"],
      default: "Active",
      required: true,
    },
    archivedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default model("RoomMember", roomMemberSchema);
