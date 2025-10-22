import { model, Schema } from "mongoose";

const accountSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["Administrator", "Teacher", "Student"],
      default: "Student",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Archived"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Account", accountSchema);
