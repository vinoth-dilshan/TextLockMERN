import { useState } from "react";
import { api } from "../api/client.js";
import ShareResult from "../components/ShareResult.jsx";

export default function Create() {
  const [content, setContent] = useState("");
  const [expiry, setExpiry] = useState("10m");
  const [token, setToken] = useState("");
  const [oneTime, setOneTime] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const expiryLabel = {
    "10m": "10 minutes",
    "1h": "1 hour",
    "1d": "1 day",
    "1w": "1 week"
  }[expiry];

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setResult(null);

    if (!content.trim()) {
      setErr("Text is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        content,
        expiry,
        oneTime
      };

      if (token.trim()) payload.token = token.trim();

      const { data } = await api.post("/shares", payload);

      const shareUrl = `${window.location.origin}/s/${data.shareId}`;

      setResult({
        shareUrl,
        token: data.token,
        oneTime: data.oneTime,
        expiresLabel: expiryLabel
      });

      setContent("");
      setToken("");
      setOneTime(false);
      setExpiry("10m");
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Create a secure text</h3>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <textarea
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste secret text here..."
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd", resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>Expiry</div>
            <select value={expiry} onChange={(e) => setExpiry(e.target.value)} style={{ padding: 10, borderRadius: 10 }}>
              <option value="10m">10 minutes</option>
              <option value="1h">1 hour</option>
              <option value="1d">1 day</option>
              <option value="1w">1 week</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 13, opacity: 0.7 }}>Token (optional)</div>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. 1234"
              style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
            />
          </div>

          <label style={{ display: "flex", gap: 10, alignItems: "center", userSelect: "none" }}>
            <input type="checkbox" checked={oneTime} onChange={(e) => setOneTime(e.target.checked)} />
            One-time view
          </label>
        </div>

        <button disabled={loading} style={{ padding: 12, borderRadius: 12 }}>
          {loading ? "Creating..." : "Create share"}
        </button>

        {err ? <div style={{ color: "crimson" }}>{err}</div> : null}
      </form>

      {result ? (
        <ShareResult
          shareUrl={result.shareUrl}
          token={result.token}
          oneTime={result.oneTime}
          expiresLabel={result.expiresLabel}
        />
      ) : null}
    </div>
  );
}
