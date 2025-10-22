import { model, Schema } from "mongoose";

const fileSchema = new Schema(
  {
    fileName: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["PDF", "PPT", "DOCX"],
      required: true,
    },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("File", fileSchema);
