import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import Share from "../models/Share.js";
import { expiryToDate } from "../utils/expiry.js";
import { HttpError } from "../utils/httpError.js";

export async function createShare(req, res, next) {
  try {
    const { content, expiry, token, oneTime } = req.body;

    if (typeof content !== "string" || content.trim() === "") throw new HttpError(400, "Content required");
    if (!expiry) throw new HttpError(400, "Expiry required");

    const shareId = nanoid(10);
    const expiresAt = expiryToDate(expiry);
    if (!(expiresAt instanceof Date) || Number.isNaN(expiresAt.getTime())) throw new HttpError(400, "Invalid expiry");

    const tokenEnabled = typeof token === "string" && token.length > 0;
    const tokenHash = tokenEnabled ? await bcrypt.hash(token, 12) : null;

    await Share.create({
      shareId,
      content,
      tokenEnabled,
      tokenHash,
      oneTime: !!oneTime,
      consumedAt: null,
      viewCount: 0,
      lastViewedAt: null,
      expiresAt
    });

    res.status(201).json({
      shareId,
      tokenEnabled,
      oneTime: !!oneTime,
      token: tokenEnabled ? token : null,
      expiresAt
    });
  } catch (e) {
    next(e);
  }
}

export async function getShareMeta(req, res, next) {
  try {
    const { id } = req.params;
    const now = new Date();

    const doc = await Share.findOne({ shareId: id, expiresAt: { $gt: now } }).lean();
    if (!doc) throw new HttpError(404, "Not found or expired");

    res.json({
      shareId: doc.shareId,
      tokenEnabled: !!doc.tokenEnabled,
      oneTime: !!doc.oneTime,
      consumedAt: doc.consumedAt ?? null,
      expiresAt: doc.expiresAt
    });
  } catch (e) {
    next(e);
  }
}

export async function viewShare(req, res, next) {
  try {
    const { id } = req.params;
    const providedToken = req.body?.token;
    const now = new Date();

    const doc = await Share.findOne({ shareId: id, expiresAt: { $gt: now } });
    if (!doc) throw new HttpError(404, "Not found or expired");

    if (doc.oneTime && doc.consumedAt) throw new HttpError(410, "Already consumed");

    if (doc.tokenEnabled) {
      if (typeof providedToken !== "string" || providedToken.length === 0) throw new HttpError(401, "Token required");
      const ok = await bcrypt.compare(providedToken, doc.tokenHash);
      if (!ok) throw new HttpError(401, "Invalid token");
    }

    if (doc.oneTime) {
      const consumed = await Share.findOneAndUpdate(
        { shareId: id, expiresAt: { $gt: now }, consumedAt: null },
        { $set: { consumedAt: now, lastViewedAt: now }, $inc: { viewCount: 1 } },
        { new: true }
      );

      if (!consumed) throw new HttpError(410, "Already consumed");

      return res.json({
        shareId: consumed.shareId,
        content: consumed.content,
        expiresAt: consumed.expiresAt,
        oneTime: true,
        viewCount: consumed.viewCount
      });
    }

    doc.viewCount = (doc.viewCount || 0) + 1;
    doc.lastViewedAt = now;
    await doc.save();

    res.json({
      shareId: doc.shareId,
      content: doc.content,
      expiresAt: doc.expiresAt,
      oneTime: false,
      viewCount: doc.viewCount
    });
  } catch (e) {
    next(e);
  }
}
