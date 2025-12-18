import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema(
  {
    shareId: { type: String, unique: true, index: true, required: true },
    content: { type: String, required: true },

    tokenEnabled: { type: Boolean, default: false },
    tokenHash: { type: String, default: null },

    expiresAt: { type: Date, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
    viewCount: { type: Number, default: 0 },
    lastViewedAt: { type: Date, default: null }
  },
  { versionKey: false }
);

// ✅ MongoDB TTL index: auto delete when expiresAt time passes
ShareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Share", ShareSchema);
