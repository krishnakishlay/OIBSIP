import { useCart }  from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function PizzaCard({ pizza }) {
  const { addItem }   = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addItem({ name: pizza.name, desc: pizza.desc, price: pizza.price });
    showToast(`${pizza.name} added to cart! 🍕`, "success");
  };

  return (
    <article className="card" style={{ cursor: "default" }}>
      {/* Badge */}
      {pizza.badge && (
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "var(--amber)", color: "var(--black)",
          fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: "0.2rem 0.6rem",
          borderRadius: "var(--radius-sm)", zIndex: 1,
        }}>
          {pizza.badge}
        </div>
      )}

      {/* Image / emoji tile */}
      <div style={{
        position: "relative", height: 190,
        background: "linear-gradient(135deg, #1e1010, #2a1505)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "5rem",
      }}>
        {pizza.emoji}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 55%, var(--card-bg))",
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: "1.3rem" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.55rem", letterSpacing: "0.03em", marginBottom: "0.3rem" }}>
          {pizza.name}
        </div>
        <div style={{ fontSize: "0.83rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem", minHeight: 44 }}>
          {pizza.type === "veg" && <span className="veg-dot" />}
          {pizza.desc}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--amber)" }}>
            ₹{pizza.price}
          </span>
          <button className="btn-fire"
            style={{ padding: "0.45rem 1.1rem", fontSize: "0.82rem" }}
            onClick={handleAdd}>
            + Add
          </button>
        </div>
      </div>
    </article>
  );
}