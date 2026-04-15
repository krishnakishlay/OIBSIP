import PizzaBuilder from "../components/Builder";

export function BuilderPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <section style={{ padding: "4rem 3rem", background: "var(--black)" }}>
        <div className="section-tag">Pizza Builder</div>
        <h1 className="section-title" style={{ marginBottom: "0.6rem" }}>CRAFT YOUR<br />OWN PIZZA</h1>
        <p className="section-sub" style={{ marginBottom: "3rem" }}>
          Five simple choices. One perfect pizza.
        </p>
        <PizzaBuilder />
      </section>
    </div>
  );
}

export default BuilderPage;