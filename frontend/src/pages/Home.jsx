// ═══════════════════════════════════════════════
// pages/Home.jsx
// ═══════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { Link }              from "react-router-dom";
import PizzaCard             from "../components/PizzaCard";
import { PIZZAS, TESTIMONIALS } from "../utils/constants";

// ── Intersection observer hook ─────────────────
function useFadeUp(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    ref.current.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

// ── Stats bar ──────────────────────────────────
const STATS = [
  ["50+", "Pizza Varieties"],
  ["20K+", "Happy Customers"],
  ["30 min", "Avg Delivery"],
  ["4.9★", "Rating"],
];

function StatsBar() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      {STATS.map(([num, label], i) => (
        <div key={i} style={{ padding: "1.8rem 2.5rem", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", color: "var(--amber)", lineHeight: 1 }}>{num}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.3rem" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── How it works ───────────────────────────────
const HOW = [
  { icon: "🍕", title: "Build your pizza",   desc: "Choose base, sauce, cheese and toppings." },
  { icon: "💳", title: "Secure checkout",     desc: "Pay safely via Razorpay in seconds." },
  { icon: "👨‍🍳", title: "We prepare it",      desc: "Baked fresh in our wood-fired oven." },
  { icon: "🛵", title: "Delivered hot",       desc: "At your door in 30 minutes or less." },
];

function HowItWorks() {
  const ref = useRef(null);
  useFadeUp(ref);
  return (
    <section ref={ref} style={{ padding: "5rem 3rem", background: "var(--char)" }}>
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div className="section-tag">Process</div>
        <h2 className="section-title">HOW IT WORKS</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem", maxWidth: 960, margin: "0 auto" }}>
        {HOW.map((h, i) => (
          <div key={i} className="fade-up" style={{ textAlign: "center", transitionDelay: `${i * 0.12}s` }}>
            <div style={{
              width: 68, height: 68, borderRadius: "50%",
              background: "var(--card-bg)", border: "2px solid var(--fire)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.9rem", margin: "0 auto 1.2rem",
            }}>{h.icon}</div>
            <div style={{ fontWeight: 600, marginBottom: "0.4rem" }}>{h.title}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>{h.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────
function Testimonials() {
  const ref = useRef(null);
  useFadeUp(ref);
  return (
    <section ref={ref} style={{ padding: "5rem 3rem", background: "var(--black)" }}>
      <div className="section-tag">Reviews</div>
      <h2 className="section-title" style={{ marginBottom: "3rem" }}>WHAT PEOPLE<br />ARE SAYING</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.3rem" }}>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="card fade-up" style={{ padding: "1.8rem", position: "relative", overflow: "hidden", transitionDelay: `${(i % 3) * 0.1}s` }}>
            <div style={{ position: "absolute", top: -10, right: 16, fontFamily: "var(--font-display)", fontSize: "7rem", color: "var(--fire)", opacity: 0.08, lineHeight: 1 }}>"</div>
            <div style={{ color: "var(--amber)", marginBottom: "0.8rem" }}>{"★".repeat(t.rating)}</div>
            <p style={{ fontSize: "0.87rem", lineHeight: 1.7, color: "rgba(245,240,232,0.82)", marginBottom: "1.3rem" }}>"{t.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--fire), var(--amber))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.85rem", color: "var(--black)",
              }}>{t.initial}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.83rem" }}>{t.name}</div>
                <div style={{ fontSize: "0.73rem", color: "var(--muted)" }}>{t.meta}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Hero ───────────────────────────────────────
function Hero() {
  return (
    <section style={{
      minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr",
      alignItems: "center", padding: "calc(var(--nav-height) + 3rem) 3rem 4rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: "10%", right: 0,
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,64,12,0.14) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div>
        <div style={{ fontSize: "0.73rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ width: "2rem", height: 1, background: "var(--amber)", display: "block" }} />
          Fresh · Crafted · Delivered
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(5rem, 9vw, 9rem)", lineHeight: 0.92, letterSpacing: "0.02em", marginBottom: "1.4rem" }}>
          BUILD<br />YOUR{" "}
          <em style={{ fontFamily: "var(--font-italic)", fontStyle: "italic", color: "var(--amber)", fontSize: "0.7em" }}>Perfect</em>
          <br />SLICE
        </h1>
        <p style={{ fontSize: "1.02rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 440, marginBottom: "2.4rem" }}>
          Handcrafted pizzas made exactly the way you want them. Choose your base, sauce, cheese and toppings — we'll fire it up and deliver to your door.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/build" className="btn-fire" style={{ padding: "1rem 2.4rem", fontSize: "1rem" }}>Start building →</Link>
          <Link to="/menu"  className="btn-ghost" style={{ padding: "1rem 1.8rem", fontSize: "1rem" }}>View menu</Link>
        </div>
      </div>

      {/* Floating pizza */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 430,
            height: 430,
            borderRadius: "50%",
            overflow: "hidden",
            animation: "float 6s ease-in-out infinite",
            boxShadow: "0 26px 58px rgba(24, 24, 24, 0.42)",
          }}
        >
          <img
            src="/hero-pizza.png"
            alt="Floating pizza"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transform: "scale(1.22)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ── Home page ──────────────────────────────────
export default function Home() {
  const featuredRef = useRef(null);
  useFadeUp(featuredRef);

  return (
    <>
      <Hero />
      <StatsBar />

      {/* Featured pizzas */}
      <section ref={featuredRef} style={{ padding: "5rem 3rem", background: "var(--char)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div className="section-tag">Favourites</div>
            <h2 className="section-title">BESTSELLERS</h2>
          </div>
          <Link to="/menu" className="btn-outline">See all pizzas →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.4rem" }}>
          {PIZZAS.slice(0, 3).map((p, i) => (
            <div key={p.id} className="fade-up" style={{ transitionDelay: `${i * 0.1}s`, position: "relative" }}>
              <PizzaCard pizza={p} />
            </div>
          ))}
        </div>
      </section>

      <HowItWorks />
      <Testimonials />

      {/* CTA band */}
      <section style={{ padding: "5rem 3rem", background: "var(--fire)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem" }}>
          READY TO BUILD YOUR PERFECT PIZZA?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "2rem", fontSize: "1.05rem" }}>
          Over 50 combinations. Delivered in 30 minutes.
        </p>
        <Link to="/build" style={{
          display: "inline-block", padding: "1rem 2.8rem",
          background: "var(--white)", color: "var(--fire)",
          borderRadius: "var(--radius-md)", fontWeight: 700,
          fontSize: "1rem", letterSpacing: "0.05em", textTransform: "uppercase",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}>Start building →</Link>
      </section>
    </>
  );
}