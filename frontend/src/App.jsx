import { Routes, Route, Link, Navigate } from "react-router-dom";
import Create from "./pages/Create.jsx";
import View from "./pages/View.jsx";

export default function App() {
  return (
    <div className="container">
      <div className="topbar">
        <Link to="/" className="brand" style={{ textDecoration: "none" }}>
          <span className="brandDot" />
          Text Share
        </Link>

        <div className="row">
          <Link className="btn" to="/">
            <span className="ms">add</span>
            Create
          </Link>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Create />} />
        <Route path="/s/:id" element={<View />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
