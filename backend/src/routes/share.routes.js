import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate.js";
import { createLimiter, tokenCheckLimiter } from "../middlewares/rateLimiters.js";
import { createShare, getShareMeta, viewShare } from "../controllers/share.controller.js";

const router = Router();

const createSchema = z.object({
  content: z.string().min(1).max(20000),
  expiry: z.enum(["10m", "1h", "1d", "1w"]),
  token: z.string().min(3).max(32).optional(),
  oneTime: z.boolean().optional()
});

router.post("/shares", createLimiter, validate(createSchema), createShare);
router.get("/shares/:id/meta", getShareMeta);
router.post("/shares/:id/view", tokenCheckLimiter, viewShare);

export default router;
