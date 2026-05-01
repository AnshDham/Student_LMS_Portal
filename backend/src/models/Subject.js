import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    emoji: { type: String, default: "📘" },
    color: { type: String, default: "#6366f1" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
