import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client.js";
import TokenBox from "../components/TokenBox.jsx";

export default function View() {
  const { id } = useParams();

  const [meta, setMeta] = useState(null);
  const [content, setContent] = useState("");
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const { data } = await api.get(`/shares/${id}/meta`);
        if (!mounted) return;

        setMeta(data);

        if (!data.tokenEnabled) {
          const viewed = await api.post(`/shares/${id}/view`, {});
          if (!mounted) return;
          setContent(viewed.data.content);
        }
      } catch (e) {
        setErr(e?.response?.data?.error || "Not found or expired");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function unlock() {
    setUnlocking(true);
    setErr("");

    try {
      const { data } = await api.post(`/shares/${id}/view`, { token });
      setContent(data.content);
    } catch (e) {
      setErr(e?.response?.data?.error || "Wrong token");
    } finally {
      setUnlocking(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="row">
          <span className="ms">hourglass_top</span>
          <div>
            <div className="h3" style={{ marginBottom: 4 }}>Loading…</div>
            <div className="subtext">Fetching share details</div>
          </div>
        </div>
      </div>
    );
  }

  const expiresText = meta?.expiresAt ? new Date(meta.expiresAt).toLocaleString() : "";

  if (err && !content) {
    return (
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <span className="ms" style={{ color: "var(--danger)" }}>error</span>
            <div>
              <div className="h3" style={{ marginBottom: 4 }}>Unavailable</div>
              <div className="subtext">{err}</div>
            </div>
          </div>
          <Link className="btn" to="/">
            <span className="ms">arrow_back</span>
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="h3">Shared text</div>
          {meta ? (
            <div className="subtext">
              Expires: <b style={{ color: "var(--text)" }}>{expiresText}</b>
              {meta.oneTime ? " • One-time view" : ""}
            </div>
          ) : null}
        </div>

        <div className="pill">
          <span className="ms">visibility</span>
          View
        </div>
      </div>

      <hr className="hr" />

      {!content && meta?.tokenEnabled ? (
        <TokenBox token={token} setToken={setToken} onSubmit={unlock} loading={unlocking} err={err} />
      ) : null}

      {content ? (
        <div style={{ marginTop: 16 }}>
          <div className="label">Content</div>
          <div className="box">
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {content}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
