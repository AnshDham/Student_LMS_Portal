import { Router } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = Router();

const sign = (u) =>
  jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post(
  "/register",
  [
    body("name").isString().trim().isLength({ min: 2, max: 60 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 60 }),
    body("parentEmail").isEmail(),
    body("parentName").isString().trim().isLength({ min: 2, max: 60 }),
    body("grade").optional().isString().isLength({ max: 30 }),
  ],
  async (req, res, next) => {
    try {
      const errs = validationResult(req);
      if (!errs.isEmpty()) return res.status(400).json({ error: errs.array()[0].msg });
      const { name, email, password, parentEmail, parentName, grade } = req.body;
      if (await User.findOne({ email })) return res.status(409).json({ error: "Student email already exists" });

      let parent = await User.findOne({ email: parentEmail });
      if (!parent) {
        parent = await User.create({
          name: parentName,
          email: parentEmail,
          password: "parent123",
          role: "parent",
        });
      }
      const student = await User.create({
        name,
        email,
        password,
        role: "student",
        grade: grade || "",
        parent: parent._id,
      });
      parent.children.push(student._id);
      await parent.save();
      const token = sign(student);
      res.json({ token, user: { id: student._id, name: student.name, email: student.email, role: student.role } });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().isLength({ min: 1 })],
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      const ok = await user.compare(password);
      if (!ok) return res.status(401).json({ error: "Invalid credentials" });
      const token = sign(user);
      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/me", async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    res.json({ user });
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
