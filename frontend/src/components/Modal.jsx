// ═══════════════════════════════════════════════
// components/Modal.jsx
// ═══════════════════════════════════════════════
import { useEffect } from "react";

const overlayStyle = {
  position: "fixed", inset: 0, zIndex: 2000,
  background: "rgba(0,0,0,0.82)",
  backdropFilter: "blur(12px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "1rem",
};

const boxStyle = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  width: "100%", maxWidth: 440,
  maxHeight: "90vh", overflowY: "auto",
  padding: "2.4rem",
  position: "relative",
  animation: "modal-in 0.28s ease",
};

const closeStyle = {
  position: "absolute", top: "1rem", right: "1rem",
  width: 30, height: 30, borderRadius: "50%",
  background: "rgba(255,255,255,0.06)",
  border: "none", color: "var(--white)",
  fontSize: "1.1rem", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "background 0.2s",
};

export default function Modal({ isOpen, onClose, children, wide }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...boxStyle, maxWidth: wide ? 600 : 440 }}>
        <button style={closeStyle} onClick={onClose}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}