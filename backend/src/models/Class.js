import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    startsAt: { type: Date, required: true },
    durationMin: { type: Number, default: 60 },
    meetingUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
