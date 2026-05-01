import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    kind: { type: String, enum: ["assignment", "exam"], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, default: 100 },
    feedback: { type: String, default: "" },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

gradeSchema.index({ student: 1, kind: 1, refId: 1 }, { unique: true });

export default mongoose.model("Grade", gradeSchema);
