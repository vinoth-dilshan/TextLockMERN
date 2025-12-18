export default function TokenBox({ token, setToken, onSubmit, loading, err }) {
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 className="h3">Token required</h3>

      <div className="subtext" style={{ marginBottom: 10 }}>
        Enter the token to unlock this text.
      </div>

      <div className="row">
        <input
          className="input"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token"
        />

        <button className="btn btnPrimary" onClick={onSubmit} disabled={loading}>
          <span className="ms">lock_open</span>
          {loading ? "Checking..." : "Unlock"}
        </button>
      </div>

      {err ? <div className="err">{err}</div> : null}
    </div>
  );
}
