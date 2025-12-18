import { QRCodeCanvas } from "qrcode.react";

export default function ShareResult({ shareUrl, token, oneTime, expiresLabel }) {
  async function copy(text) {
    await navigator.clipboard.writeText(text);
    alert("Copied");
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 className="h3">Share ready</h3>

      <div className="row">
        <div className="col">
          <div className="subtext">Link</div>
          <div className="box" style={{ wordBreak: "break-all" }}>
            {shareUrl}
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn" onClick={() => copy(shareUrl)}>
              <span className="ms">content_copy</span>
              Copy link
            </button>

            <a className="btn" href={shareUrl} target="_blank" rel="noreferrer">
              <span className="ms">open_in_new</span>
              Open
            </a>
          </div>

          <div className="subtext" style={{ marginTop: 10 }}>
            Expiry:{" "}
            <b style={{ color: "var(--text)" }}>{expiresLabel}</b>{" "}
            {oneTime ? " • One-time view" : ""}
          </div>

          {token ? (
            <div style={{ marginTop: 12 }}>
              <div className="subtext">Token (shown once)</div>

              <div className="row" style={{ marginTop: 8 }}>
                <div className="pill">
                  <span className="ms">key</span>
                  {token}
                </div>

                <button className="btn" onClick={() => copy(token)}>
                  <span className="ms">content_copy</span>
                  Copy token
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="qrBox">
          <QRCodeCanvas value={shareUrl} size={160} />
          <div className="subtext" style={{ textAlign: "center", marginTop: 8 }}>
            Scan QR
          </div>
        </div>
      </div>
    </div>
  );
}
