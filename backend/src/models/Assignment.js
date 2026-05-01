import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    maxScore: { type: Number, default: 100 },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
