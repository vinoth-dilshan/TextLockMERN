import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import Share from "../models/Share.js";
import { expiryToDate } from "../utils/expiry.js";

export async function createShare(req, res) {
  const { content, expiry, token } = req.body;

  const shareId = nanoid(10);
  const expiresAt = expiryToDate(expiry);

  const tokenEnabled = !!token;
  const tokenHash = tokenEnabled ? await bcrypt.hash(token, 12) : null;

  await Share.create({
    shareId,
    content,
    tokenEnabled,
    tokenHash,
    expiresAt
  });

  return res.status(201).json({
    shareId,
    tokenEnabled,
    // ⚠️ show token ONLY now (frontend should show once)
    token: tokenEnabled ? token : null
  });
}

export async function getShareMeta(req, res) {
  const { id } = req.params;

  const doc = await Share.findOne({ shareId: id }).lean();
  if (!doc) return res.status(404).json({ error: "Not found or expired" });

  return res.json({
    shareId: doc.shareId,
    tokenEnabled: doc.tokenEnabled,
    expiresAt: doc.expiresAt
  });
}

export async function viewShare(req, res) {
  const { id } = req.params;
  const { token } = req.body || {};

  const doc = await Share.findOne({ shareId: id });
  if (!doc) return res.status(404).json({ error: "Not found or expired" });

  if (doc.tokenEnabled) {
    if (!token) return res.status(401).json({ error: "Token required" });

    const ok = await bcrypt.compare(token, doc.tokenHash);
    if (!ok) return res.status(401).json({ error: "Invalid token" });
  }

  doc.viewCount += 1;
  doc.lastViewedAt = new Date();
  await doc.save();

  return res.json({
    shareId: doc.shareId,
    content: doc.content,
    expiresAt: doc.expiresAt,
    viewCount: doc.viewCount
  });
}
