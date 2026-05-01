import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    attendedMin: { type: Number, default: 0 },
    present: { type: Boolean, default: false },
  },
  { timestamps: true }
);

attendanceSchema.index({ student: 1, class: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
