import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth }  from "../context/AuthContext";
import { useCart }  from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Modal        from "./Modal";
import AuthForms    from "./AuthForms";

const styles = {
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 2.5rem", height: "var(--nav-height)",
    background: "rgba(255,247,239,0.84)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border)",
  },
  logo: {
    fontFamily: "var(--font-display)",
    fontSize: "1.9rem", letterSpacing: "0.04em",
    color: "var(--amber)", textDecoration: "none",
  },
  links: { display: "flex", gap: "2rem", listStyle: "none" },
  link: {
    fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.08em",
    textTransform: "uppercase", opacity: 0.7,
    textDecoration: "none", color: "var(--white)",
    transition: "opacity 0.2s, color 0.2s",
  },
  cta: { display: "flex", alignItems: "center", gap: "0.75rem" },
  cartBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "0.55rem 1rem",
    background: "var(--fire)", color: "var(--white)",
    border: "none", borderRadius: "var(--radius-md)",
    fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.05em",
    textTransform: "uppercase", cursor: "pointer",
    transition: "background 0.2s",
  },
  badge: {
    background: "var(--amber)", color: "var(--black)",
    width: 20, height: 20, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.7rem", fontWeight: 700,
  },
  userChip: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "0.4rem 0.9rem",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 999, fontSize: "0.82rem",
    color: "var(--white)",
  },
  avatar: {
    width: 28, height: 28, borderRadius: "50%",
    background: "linear-gradient(135deg, var(--fire), var(--amber))",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.75rem", fontWeight: 700, color: "var(--black)",
  },
};

export default function Navbar() {
  const { user, logout }  = useAuth();
  const { count }         = useCart();
  const { showToast }     = useToast();
  const navigate          = useNavigate();
  const [modal, setModal] = useState(null); // "login" | "register"

  const handleLogout = () => {
    logout();
    showToast("Logged out. See you soon! 👋");
    navigate("/");
  };

  return (
    <>
      <nav style={styles.nav}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          Pizzeriaa
        </Link>

        {/* Links */}
        <ul style={styles.links}>
          {[["Menu", "/menu"], ["Build Pizza", "/build"], ...(user?.role === "admin" ? [["Admin Orders", "/admin/orders"]] : [["Admin Login", "/admin/login"]])].map(([label, to]) => (
            <li key={to}>
              <Link to={to} style={styles.link}
                onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.color = "var(--amber)"; }}
                onMouseLeave={e => { e.target.style.opacity = 0.7; e.target.style.color = "var(--white)"; }}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={styles.cta}>
          {/* Cart */}
          <button style={styles.cartBtn} onClick={() => navigate("/checkout")}
            onMouseEnter={e => e.currentTarget.style.background = "#c7340a"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--fire)"}>
            🛒
            {count > 0 && <span style={styles.badge}>{count}</span>}
          </button>

          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={styles.userChip}>
                <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
                <span>{user.name.split(" ")[0]}</span>
              </div>
              <button className="btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.78rem" }}
                onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <>
              <button className="btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.78rem" }}
                onClick={() => setModal("login")}>
                Sign in
              </button>
              <button className="btn-fire" style={{ padding: "0.55rem 1.2rem", fontSize: "0.82rem" }}
                onClick={() => setModal("register")}>
                Order now
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Auth modal */}
      <Modal isOpen={!!modal} onClose={() => setModal(null)}>
        <AuthForms
          mode={modal}
          onSwitch={setModal}
          onSuccess={() => setModal(null)}
        />
      </Modal>
    </>
  );
}