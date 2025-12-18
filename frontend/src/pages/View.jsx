import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
      setErr(e?.response?.data?.error || "Failed");
    } finally {
      setUnlocking(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (err && !content) return <div style={{ color: "crimson" }}>{err}</div>;

  const expiresText = meta?.expiresAt ? new Date(meta.expiresAt).toLocaleString() : "";

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Shared text</h3>

      {meta ? (
        <div style={{ fontSize: 13, opacity: 0.7 }}>
          Expires: <b>{expiresText}</b> {meta.oneTime ? "• One-time view" : ""}
        </div>
      ) : null}

      {!content && meta?.tokenEnabled ? (
        <TokenBox token={token} setToken={setToken} onSubmit={unlock} loading={unlocking} err={err} />
      ) : null}

      {content ? (
        <div style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{content}</pre>
        </div>
      ) : null}
    </div>
  );
}
