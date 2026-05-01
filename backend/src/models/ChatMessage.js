import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true, index: true }, // canonical "userA:userB"
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    readAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
