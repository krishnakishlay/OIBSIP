import { useEffect, useRef, useState } from "react";
import PizzaCard from "../components/PizzaCard";
import { PIZZAS } from "../utils/constants";

export function MenuPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? PIZZAS : PIZZAS.filter(p => p.type === filter);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    ref.current.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // re-observe after filter change
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    setTimeout(() => {
      ref.current?.querySelectorAll(".fade-up:not(.visible)").forEach(el => obs.observe(el));
    }, 50);
    return () => obs.disconnect();
  }, [filter]);

  const FILTERS = [["All", "all"], ["🌿 Veg", "veg"], ["🍗 Non-Veg", "nonveg"]];

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <section style={{ padding: "4rem 3rem", background: "var(--char)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div className="section-tag">Our Menu</div>
            <h1 className="section-title">SIGNATURE<br />PIZZAS</h1>
            <p className="section-sub">Classic recipes perfected over years.</p>
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {FILTERS.map(([label, val]) => (
              <button key={val}
                onClick={() => setFilter(val)}
                style={{
                  padding: "0.5rem 1.1rem", borderRadius: "var(--radius-md)",
                  background: filter === val ? "var(--fire)" : "transparent",
                  border: `1px solid ${filter === val ? "var(--fire)" : "rgba(244,163,0,0.35)"}`,
                  color: filter === val ? "var(--white)" : "var(--amber)",
                  fontSize: "0.82rem", fontWeight: 500,
                  letterSpacing: "0.05em", cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.4rem" }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="fade-up" style={{ transitionDelay: `${(i % 3) * 0.08}s`, position: "relative" }}>
              <PizzaCard pizza={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MenuPage;

