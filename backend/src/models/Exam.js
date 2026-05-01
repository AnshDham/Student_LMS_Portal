import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    q: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
  },
  { _id: true }
);

const examSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    durationMin: { type: Number, default: 30 },
    maxScore: { type: Number, default: 100 },
    questions: [questionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
