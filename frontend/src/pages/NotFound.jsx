import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center",
      padding: "2rem",
    }}>
      <div style={{ fontSize: "6rem", marginBottom: "1rem" }}>🍕</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "5rem", color: "var(--fire)", marginBottom: "0.5rem" }}>404</h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem", fontSize: "1.05rem" }}>
        Oops! This slice doesn't exist.
      </p>
      <Link to="/" className="btn-fire" style={{ padding: "0.9rem 2rem" }}>← Back to home</Link>
    </div>
  );
}

export default NotFound;