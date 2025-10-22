import { model, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    department: { type: String },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("Course", courseSchema);
