import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "parent", "tutor", "admin"],
      required: true,
    },
    avatar: { type: String, default: "" },
    // student-specific
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    grade: { type: String, default: "" },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streakDays: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    badges: [{ type: String }], // badge keys
    // parent-specific
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // tutor-specific
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.compare = function (raw) {
  return bcrypt.compare(raw, this.password);
};

export default mongoose.model("User", userSchema);
