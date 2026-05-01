import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { BADGES } from "../utils/gamify.js";

const router = Router();
router.use(requireAuth);

router.get("/badges", (_req, res) => {
  const out = Object.entries(BADGES).map(([key, v]) => ({ key, ...v }));
  res.json({ badges: out });
});

export default router;
