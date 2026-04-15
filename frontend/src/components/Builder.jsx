import { useState, useMemo } from "react";
import { useNavigate }       from "react-router-dom";
import { useCart }           from "../context/CartContext";
import { useToast }          from "../context/ToastContext";
import { BUILDER_STEPS, BASE_PIZZA_PRICE } from "../utils/constants";

// ── Option button ──────────────────────────────
function OptionBtn({ opt, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      background:   selected ? "rgba(232,64,12,0.12)" : "transparent",
      border:       `1px solid ${selected ? "var(--fire)" : "var(--border)"}`,
      borderRadius: "var(--radius-md)",
      padding:      "0.9rem 0.7rem",
      color:        "var(--white)",
      textAlign:    "center",
      transition:   "all 0.2s",
      cursor:       "pointer",
    }}
    onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = "var(--amber)"; }}
    onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = "var(--border)"; }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>{opt.icon}</div>
      <div style={{ fontSize: "0.76rem", fontWeight: 500 }}>{opt.name}</div>
      <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.2rem" }}>
        {opt.price === 0 ? "Included" : `+₹${opt.price}`}
      </div>
    </button>
  );
}

// ── Step block ─────────────────────────────────
function StepBlock({ step, idx, selections, onSelect, onToggle }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.9rem",
        padding: "1.3rem 1.5rem",
        background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "var(--fire)", color: "var(--white)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
        }}>{idx + 1}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{step.label}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{step.subtitle}</div>
        </div>
      </div>

      {/* Options grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
        gap: "0.75rem", padding: "1.3rem",
      }}>
        {step.options.map(opt => {
          const selected = step.multi
            ? selections.veggies.some(v => v.name === opt.name)
            : selections[step.id]?.name === opt.name;

          return (
            <OptionBtn key={opt.name} opt={opt} selected={selected}
              onClick={() => step.multi ? onToggle(opt) : onSelect(step.id, opt)} />
          );
        })}
      </div>
    </div>
  );
}

// ── Order summary panel ────────────────────────
function OrderSummary({ selections, total }) {
  const { base, sauce, cheese, veggies } = selections;

  const rows = [
    ["Base",    base?.name],
    ["Sauce",   sauce?.name],
    ["Cheese",  cheese?.name],
    ["Veggies", veggies.length ? veggies.map(v => v.name).join(", ") : null],
  ];

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      position: "sticky", top: "calc(var(--nav-height) + 1.5rem)",
    }}>
      <div style={{
        padding: "1.4rem 1.5rem",
        background: "var(--fire)",
        fontFamily: "var(--font-display)",
        fontSize: "1.55rem", letterSpacing: "0.04em",
      }}>Your Order</div>

      {/* Pizza preview */}
      <div style={{
        width: 150, height: 150, borderRadius: "50%",
        background: `conic-gradient(#c8340a 0deg 120deg, #e05a28 120deg 240deg, #d14410 240deg 360deg)`,
        margin: "1.5rem auto",
        boxShadow: "0 0 40px rgba(232,64,12,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em",
        textTransform: "uppercase", transition: "all 0.4s",
      }}>🍕</div>

      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        {rows.map(([label, val]) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "0.87rem", marginBottom: "0.7rem", color: "var(--muted)",
          }}>
            <span>{label}</span>
            <strong style={{ color: val ? "var(--white)" : "var(--muted)", maxWidth: 160, textAlign: "right" }}>
              {val || "—"}
            </strong>
          </div>
        ))}

        <div style={{
          display: "flex", justifyContent: "space-between",
          borderTop: "1px solid var(--border)",
          marginTop: "0.8rem", paddingTop: "0.9rem",
          fontSize: "1rem", fontWeight: 600,
        }}>
          <span>Total</span>
          <span style={{ color: "var(--amber)", fontSize: "1.25rem" }}>₹{total}</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Main Builder component
// ══════════════════════════════════════════════
const EMPTY = { base: null, sauce: null, cheese: null, veggies: [] };

export default function PizzaBuilder() {
  const { addItem }   = useCart();
  const { showToast } = useToast();
  const navigate      = useNavigate();

  const [selections, setSelections] = useState(EMPTY);

  const selectOption = (stepId, opt) =>
    setSelections(prev => ({ ...prev, [stepId]: opt }));

  const toggleVeggie = (opt) =>
    setSelections(prev => {
      const exists = prev.veggies.some(v => v.name === opt.name);
      return {
        ...prev,
        veggies: exists
          ? prev.veggies.filter(v => v.name !== opt.name)
          : [...prev.veggies, opt],
      };
    });

  const total = useMemo(() => {
    const { base, sauce, cheese, veggies } = selections;
    return BASE_PIZZA_PRICE
      + (base?.price   ?? 0)
      + (sauce?.price  ?? 0)
      + (cheese?.price ?? 0)
      + veggies.reduce((s, v) => s + v.price, 0);
  }, [selections]);

  const handleAddToCart = () => {
    const { base, sauce, cheese } = selections;
    if (!base || !sauce || !cheese)
      return showToast("Please select a base, sauce and cheese first!", "warning");

    const desc = [
      `${sauce.name} sauce`,
      cheese.name,
      selections.veggies.length ? selections.veggies.map(v => v.name).join(", ") : null,
    ].filter(Boolean).join(", ");

    addItem({ name: `Custom Pizza (${base.name})`, desc, price: total });
    showToast("Custom pizza added to cart! 🍕", "success");
    navigate("/checkout");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "3rem", alignItems: "start" }}>
      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {BUILDER_STEPS.map((step, idx) => (
          <StepBlock key={step.id} step={step} idx={idx}
            selections={selections} onSelect={selectOption} onToggle={toggleVeggie} />
        ))}
        <button className="btn-fire" onClick={handleAddToCart}
          style={{ padding: "1.1rem", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.04em" }}>
          Add to Cart & Checkout →
        </button>
      </div>

      {/* Summary */}
      <OrderSummary selections={selections} total={total} />
    </div>
  );
}