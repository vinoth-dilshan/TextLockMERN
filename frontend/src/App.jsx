import { Routes, Route, Link } from "react-router-dom";
import Create from "./pages/Create.jsx";
import View from "./pages/View.jsx";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h2 style={{ margin: 0 }}>TextLock</h2>
        </Link>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/" style={{ textDecoration: "none" }}>Create</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Create />} />
        <Route path="/s/:id" element={<View />} />
      </Routes>
    </div>
  );
}
