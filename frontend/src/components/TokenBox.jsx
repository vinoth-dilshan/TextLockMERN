export default function TokenBox({ token, setToken, onSubmit, loading, err }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Token required</h3>
      <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 10 }}>
        Enter the token to unlock this text.
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token"
          style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <button onClick={onSubmit} disabled={loading} style={{ padding: "10px 14px", borderRadius: 10 }}>
          {loading ? "Checking..." : "Unlock"}
        </button>
      </div>

      {err ? <div style={{ color: "crimson", marginTop: 10 }}>{err}</div> : null}
    </div>
  );
}
