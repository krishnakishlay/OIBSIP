// ═══════════════════════════════════════════════
// components/Toast.jsx
// ═══════════════════════════════════════════════
import { useToast } from "../context/ToastContext";

const containerStyle = {
  position: "fixed", bottom: "2rem", right: "2rem",
  zIndex: 3000, display: "flex", flexDirection: "column", gap: "0.7rem",
};

const COLOR = {
  success: "var(--green)",
  warning: "var(--amber)",
  error:   "var(--fire)",
  info:    "#4a9eff",
};

export default function ToastList() {
  const { toasts } = useToast();

  return (
    <div style={containerStyle}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderLeft: `4px solid ${COLOR[t.type] || COLOR.info}`,
          borderRadius: "var(--radius-md)",
          padding: "0.9rem 1.3rem",
          fontSize: "0.88rem", maxWidth: 320,
          boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
          animation: "toast-in 0.35s ease",
        }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}