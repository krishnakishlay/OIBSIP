
// pages/OrderSuccess.jsx
// ═══════════════════════════════════════════════
import { useEffect, useState } from "react";
import { useParams, Link }     from "react-router-dom";
import { getOrderById }        from "../services/order.service";

const STATUS_STEPS = [
  { key: "pending",           label: "Order received",     icon: "✅" },
  { key: "confirmed",         label: "Payment confirmed",  icon: "💳" },
  { key: "in_kitchen",        label: "In the kitchen",     icon: "👨‍🍳" },
  { key: "out_for_delivery",  label: "Out for delivery",   icon: "🛵" },
  { key: "delivered",         label: "Delivered",          icon: "🎉" },
];

export default function OrderSuccess() {
  const { id }  = useParams();
  const [order, setOrder] = useState(null);
  const [err,   setErr]   = useState(null);

  useEffect(() => {
    getOrderById(id)
      .then(({ data }) => setOrder(data.data))
      .catch(() => setErr("Could not load order."));
  }, [id]);

  const currentIdx = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : 0;

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "4.5rem", marginBottom: "1rem" }}>🎉</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3.5rem", marginBottom: "0.4rem" }}>ORDER PLACED!</h1>
        <p style={{ color: "var(--muted)", marginBottom: "2.5rem", fontSize: "1rem" }}>
          Your pizza is being crafted. Order ID: <code style={{ color: "var(--amber)", fontSize: "0.8rem" }}>{id}</code>
        </p>

        {err && <p style={{ color: "var(--fire)" }}>{err}</p>}

        {/* Status tracker */}
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "1.8rem", marginBottom: "2rem",
        }}>
          {STATUS_STEPS.map((step, i) => {
            const done   = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <div key={step.key} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: i < STATUS_STEPS.length - 1 ? "1rem" : 0 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                  background: done ? "var(--fire)" : "rgba(255,255,255,0.05)",
                  border: `2px solid ${done ? "var(--fire)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", transition: "all 0.4s",
                }}>{done ? step.icon : "○"}</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: active ? 600 : 400, color: done ? "var(--white)" : "var(--muted)", fontSize: "0.9rem" }}>
                    {step.label}
                  </div>
                </div>
                {active && (
                  <div style={{ marginLeft: "auto", width: 10, height: 10, borderRadius: "50%", background: "var(--amber)", animation: "float 1.5s ease-in-out infinite" }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/"     className="btn-ghost"  style={{ padding: "0.8rem 1.8rem" }}>← Home</Link>
          <Link to="/menu" className="btn-fire"   style={{ padding: "0.8rem 1.8rem" }}>Order more →</Link>
        </div>
      </div>
    </div>
  );
}