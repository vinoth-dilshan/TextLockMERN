import { QRCodeCanvas } from "qrcode.react";

export default function ShareResult({ shareUrl, token, oneTime, expiresLabel }) {
  async function copy(text) {
    await navigator.clipboard.writeText(text);
    alert("Copied");
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Share Ready</h3>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 380px" }}>
          <div style={{ fontSize: 13, opacity: 0.7 }}>Link</div>
          <div style={{ wordBreak: "break-all", padding: 10, border: "1px solid #eee", borderRadius: 10 }}>
            {shareUrl}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button onClick={() => copy(shareUrl)}>Copy link</button>
            <a href={shareUrl} target="_blank" rel="noreferrer">Open</a>
          </div>

          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
            Expiry: <b>{expiresLabel}</b> {oneTime ? "• One-time view" : ""}
          </div>

          {token ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Token (shown once)</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ padding: "10px 12px", border: "1px solid #eee", borderRadius: 10, fontWeight: 700 }}>
                  {token}
                </div>
                <button onClick={() => copy(token)}>Copy token</button>
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ padding: 10, border: "1px solid #eee", borderRadius: 12 }}>
          <QRCodeCanvas value={shareUrl} size={160} />
          <div style={{ textAlign: "center", fontSize: 12, opacity: 0.7, marginTop: 8 }}>Scan QR</div>
        </div>
      </div>
    </div>
  );
}
