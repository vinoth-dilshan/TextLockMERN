import { useState } from "react";
import { api } from "../api/client.js";
import ShareResult from "../components/ShareResult.jsx";

export default function Create() {
  const [content, setContent] = useState("");
  const [expiry, setExpiry] = useState("10m");
  const [token, setToken] = useState("");
  const [burnAfterRead, setBurnAfterRead] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const expiryLabel =
    {
      "10m": "10 minutes",
      "1h": "1 hour",
      "1d": "1 day",
      "1w": "1 week",
    }[expiry] || "10 minutes";

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
      const payload = { content, expiry, burnAfterRead };
      if (token.trim()) payload.token = token.trim();

      const { data } = await api.post("/shares", payload);

      const shareUrl = `${window.location.origin}/s/${data.shareId}`;

      setResult({
        shareUrl,
        token: data.token,
        burnAfterRead: data.burnAfterRead,
        expiresLabel: expiryLabel,
      });

      setContent("");
      setToken("");
      setBurnAfterRead(false);
      setExpiry("10m");
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    setContent("");
    setToken("");
    setBurnAfterRead(false);
    setExpiry("10m");
    setResult(null);
    setErr("");
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="h3">Create secure text</div>
          <div className="subtext">No accounts. Optional token. Auto-expiry. QR included.</div>
        </div>
        <div className="pill">
          <span className="ms">shield</span>
          Privacy-first
        </div>
      </div>

      <hr className="hr" />

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <div>
          <div className="label">Text</div>
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste secret text here..."
          />
        </div>

        <div className="row">
          <div style={{ width: 220 }}>
            <div className="label">Expiry</div>
            <select className="select" value={expiry} onChange={(e) => setExpiry(e.target.value)}>
              <option value="10m">10 minutes</option>
              <option value="1h">1 hour</option>
              <option value="1d">1 day</option>
              <option value="1w">1 week</option>
            </select>
          </div>

          <div className="col">
            <div className="label">Token (optional)</div>
            <input
              className="input"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. 1234"
            />
          </div>

          <label className="pill" style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={burnAfterRead}
              onChange={(e) => setBurnAfterRead(e.target.checked)}
              style={{ margin: 0 }}
            />
            <span className="ms">local_fire_department</span>
            Burn after read
          </label>
        </div>

        <div className="row">
          <button className="btn btnPrimary" disabled={loading}>
            <span className="ms">rocket_launch</span>
            {loading ? "Creating..." : "Create share"}
          </button>

          <button type="button" className="btn" onClick={onReset} disabled={loading}>
            <span className="ms">refresh</span>
            Reset
          </button>
        </div>

        {err ? <div className="err">{err}</div> : null}
      </form>

      {result ? (
        <ShareResult
          shareUrl={result.shareUrl}
          token={result.token}
          oneTime={false}
          expiresLabel={result.expiresLabel}
        />
      ) : null}
    </div>
  );
}
