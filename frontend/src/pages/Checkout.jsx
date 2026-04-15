
// pages/Checkout.jsx
// ═══════════════════════════════════════════════
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart }   from "../context/CartContext";
import { useAuth }   from "../context/AuthContext";
import { useToast }  from "../context/ToastContext";
import { createOrder }           from "../services/order.service";
import { createRazorpayOrder, verifyPayment, markOrderSuccessForNow } from "../services/payment.service";

const S = {
  page: { paddingTop: "var(--nav-height)", minHeight: "100vh", padding: "calc(var(--nav-height) + 2rem) 3rem 4rem" },
  grid: { display: "grid", gridTemplateColumns: "1fr 380px", gap: "3rem", alignItems: "start", maxWidth: 1100, margin: "0 auto" },
  panel: { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" },
  panelHeader: { padding: "1.2rem 1.5rem", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: "0.95rem" },
  panelBody: { padding: "1.5rem" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid var(--border)" },
  total: { display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem", marginTop: "1rem" },
  info: { background: "rgba(244,163,0,0.08)", border: "1px solid rgba(244,163,0,0.25)", borderRadius: "var(--radius-md)", padding: "0.9rem 1rem", fontSize: "0.82rem", color: "var(--amber)", marginTop: "1rem" },
};

// Load Razorpay SDK dynamically
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user }     = useAuth();
  const { showToast } = useToast();
  const navigate      = useNavigate();

  const [address, setAddress] = useState("");
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(false);

  // Empty cart state
  if (!items.length) return (
    <div style={{ ...S.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🛒</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", marginBottom: "0.5rem" }}>YOUR CART IS EMPTY</h2>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>Add some pizzas first!</p>
      <Link to="/menu" className="btn-fire" style={{ padding: "0.9rem 2rem" }}>Browse menu →</Link>
    </div>
  );

  const validateCheckout = () => {
    if (!user) {
      showToast("Please sign in to place an order.", "warning");
      return false;
    }
    if (!address.trim()) {
      showToast("Please enter your delivery address.", "warning");
      return false;
    }
    if (!phone.trim()) {
      showToast("Please enter your phone number.", "warning");
      return false;
    }
    if (!/^\+?[\d\s\-]{10,}$/.test(phone)) {
      showToast("Please enter a valid phone number.", "warning");
      return false;
    }
    return true;
  };

  const createOrderRecord = async () => {
    const { data: orderData } = await createOrder({ items, total, address, phone });
    return orderData.data._id;
  };

  const handlePayment = async () => {
    if (!validateCheckout()) return;

    try {
      setLoading(true);

      // 1. Create order in DB
      const orderId = await createOrderRecord();

      // 2. Create Razorpay order
      const { data: rpData } = await createRazorpayOrder(orderId);

      // 3. Load SDK
      const loaded = await loadRazorpay();
      if (!loaded) return showToast("Payment gateway failed to load. Check your connection.", "error");

      // 4. Open Razorpay checkout
      const options = {
        key:      import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:   rpData.data.amount,
        currency: "INR",
        name:     "Pizzeriaa",
        description: "Pizza Order",
        order_id: rpData.data.razorpayOrderId,
        prefill:  { name: user.name, email: user.email, contact: phone },
        theme:    { color: "#e8400c" },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            });
            clearCart();
            navigate(`/order/${orderId}`);
          } catch {
            showToast("Payment verification failed. Contact support.", "error");
          }
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSuccess = async () => {
    if (!validateCheckout()) return;

    try {
      setLoading(true);
      const orderId = await createOrderRecord();
      await markOrderSuccessForNow(orderId);
      clearCart();
      navigate(`/order/${orderId}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Could not mark order successful.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 className="section-title" style={{ marginBottom: "2.5rem" }}>CHECKOUT</h1>

        <div style={S.grid}>
          {/* Left — delivery details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={S.panel}>
              <div style={S.panelHeader}>Delivery Details</div>
              <div style={S.panelBody}>
                <div className="form-group">
                  <label>Full delivery address</label>
                  <input className="form-control" value={address} onChange={e => setAddress(e.target.value)}
                    placeholder="Flat / House no., Street, Area, City, PIN" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Phone number</label>
                  <input className="form-control" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            {!user && (
              <div style={{ ...S.info, color: "var(--fire)", borderColor: "rgba(232,64,12,0.3)", background: "rgba(232,64,12,0.08)" }}>
                ⚠️ You must be signed in to place an order.
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div style={S.panel}>
            <div style={S.panelHeader}>Order Summary</div>
            <div style={S.panelBody}>
              {items.map((item, i) => (
                <div key={i} style={S.row}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{item.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", maxWidth: 200 }}>{item.desc?.substring(0, 50)}…</div>
                  </div>
                  <div style={{ color: "var(--amber)", fontWeight: 600, marginLeft: "1rem" }}>₹{item.price}</div>
                </div>
              ))}

              <div style={S.total}>
                <span>Total</span>
                <span style={{ color: "var(--amber)", fontSize: "1.3rem" }}>₹{total}</span>
              </div>

              <div style={S.info}>🔒 Razorpay secure checkout. Test mode active.</div>

              <button className="btn-fire" onClick={handlePayment} disabled={loading}
                style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: 700, marginTop: "1.2rem", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Processing…" : `Pay ₹${total} with Razorpay →`}
              </button>
              <button
                className="btn-outline"
                onClick={handleDemoSuccess}
                disabled={loading}
                style={{ width: "100%", padding: "0.9rem", fontSize: "0.9rem", fontWeight: 700, marginTop: "0.6rem", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Processing..." : "Order Success (For Now)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
