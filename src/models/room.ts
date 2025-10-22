import mongoose, { model, Schema } from "mongoose";

const roomSchema = new Schema(
  {
    name: { type: String, required: true },
    joinCode: { type: String, required: true, unique: true },
    description: { type: String },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    classSection: { type: String, required: true },
    schoolYearStart: { type: Number, required: true },
    schoolYearEnd: { type: Number, required: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    archivedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default model("Room", roomSchema);
