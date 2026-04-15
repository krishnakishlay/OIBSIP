import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllOrders, updateOrderStatus } from "../services/order.service";
import { useToast } from "../context/ToastContext";

const STATUS_OPTIONS = ["pending", "confirmed", "in_kitchen", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrders() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      setLoading(false);
      return;
    }

    getAllOrders()
      .then(({ data }) => setOrders(data.data))
      .catch((err) => showToast(err.response?.data?.message || "Could not load orders.", "error"))
      .finally(() => setLoading(false));
  }, [user, showToast]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const summary = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      in_kitchen: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      if (counts[order.status] !== undefined) counts[order.status] += 1;
    });
    return counts;
  }, [orders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      const { data } = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((order) => (order._id === orderId ? data.data : order)));
      showToast("Order status updated.", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "calc(var(--nav-height) + 2rem) 2rem" }}>
        Sign in as admin to view orders. <Link to="/admin/login">Go to admin login</Link>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div style={{ padding: "calc(var(--nav-height) + 2rem) 2rem" }}>
        You do not have admin access. <Link to="/admin/login">Use admin login</Link>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: "calc(var(--nav-height) + 2rem) 2rem" }}>Loading orders...</div>;
  }

  return (
    <div style={{ padding: "calc(var(--nav-height) + 2rem) 2rem 3rem" }}>
      <h1 className="section-title" style={{ marginBottom: "1.6rem" }}>ORDERS</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.8rem", marginBottom: "1.2rem" }}>
        {[
          ["all", "Total"],
          ["pending", "Pending"],
          ["confirmed", "Confirmed"],
          ["in_kitchen", "Kitchen"],
          ["out_for_delivery", "Out"],
          ["delivered", "Delivered"],
          ["cancelled", "Cancelled"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? "btn-fire" : "card"}
            onClick={() => setFilter(key)}
            style={{
              padding: "0.8rem",
              textAlign: "left",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {label}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.2rem" }}>{summary[key]}</div>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {["all", ...STATUS_OPTIONS].map((status) => (
          <button
            key={status}
            className={filter === status ? "btn-fire" : "btn-outline"}
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.74rem" }}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: "1rem" }}>
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="card"
            style={{ padding: "1rem 1.2rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", cursor: "pointer" }}
            onClick={() => setSelectedOrder(order)}
          >
            <div>
              <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>#{order._id.slice(-8)}</div>
              <div style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
                {order.user?.name || "Unknown user"} · {order.user?.email || "No email"}
              </div>
              <div style={{ fontSize: "0.9rem", marginTop: "0.4rem" }}>
                {order.items?.length || 0} item(s) · ₹{order.total}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <select
                className="form-control"
                value={order.status}
                onChange={(e) => {
                  e.stopPropagation();
                  handleStatusChange(order._id, e.target.value);
                }}
                disabled={updatingId === order._id}
                style={{ minWidth: 180 }}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                className="btn-outline"
                style={{ padding: "0.4rem 0.7rem", fontSize: "0.75rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(order._id, "confirmed");
                }}
                disabled={updatingId === order._id}
              >
                Approve
              </button>
              <button
                className="btn-outline"
                style={{ padding: "0.4rem 0.7rem", fontSize: "0.75rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(order._id, "cancelled");
                }}
                disabled={updatingId === order._id}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
        {!filteredOrders.length && <div>No orders for this filter.</div>}
      </div>

      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 2200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="card"
            style={{ width: "100%", maxWidth: 640, maxHeight: "88vh", overflowY: "auto", padding: "1.2rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}>ORDER #{selectedOrder._id.slice(-8)}</h2>
              <button className="btn-outline" onClick={() => setSelectedOrder(null)} style={{ padding: "0.35rem 0.7rem" }}>
                Close
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.45rem", marginBottom: "1rem" }}>
              <div><strong>Customer:</strong> {selectedOrder.user?.name || "Unknown"}</div>
              <div><strong>Email:</strong> {selectedOrder.user?.email || "No email"}</div>
              <div><strong>Phone:</strong> {selectedOrder.phone || "N/A"}</div>
              <div><strong>Address:</strong> {selectedOrder.address || "N/A"}</div>
              <div><strong>Status:</strong> {selectedOrder.status}</div>
              <div><strong>Total:</strong> ₹{selectedOrder.total}</div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.8rem" }}>
              <h3 style={{ marginBottom: "0.7rem" }}>Items</h3>
              <div style={{ display: "grid", gap: "0.55rem" }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={`${item.name}-${idx}`} style={{ padding: "0.55rem 0.7rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{item.desc || "No description"}</div>
                    <div style={{ marginTop: "0.2rem", fontSize: "0.85rem" }}>
                      Qty: {item.qty || 1} · Price: ₹{item.price}
                    </div>
                  </div>
                ))}
                {!(selectedOrder.items || []).length && <div>No items in this order.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
