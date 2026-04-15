import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Email and password are required.", "warning");
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      const role = data?.data?.user?.role;
      if (role !== "admin") {
        showToast("This account does not have admin access.", "error");
        return;
      }
      showToast("Admin login successful.", "success");
      navigate("/admin/orders");
    } catch (err) {
      showToast(err.response?.data?.message || "Admin login failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "calc(var(--nav-height) + 2rem) 2rem 3rem", display: "flex", justifyContent: "center" }}>
      <div className="card" style={{ width: "100%", maxWidth: 460, padding: "1.5rem" }}>
        <h1 className="section-title" style={{ fontSize: "2.6rem", marginBottom: "0.4rem" }}>ADMIN LOGIN</h1>
        <p className="section-sub" style={{ marginBottom: "1.2rem" }}>
          Sign in with an admin account to manage live orders.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pizzeriaa.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button className="btn-fire" type="submit" disabled={loading} style={{ width: "100%", marginTop: "0.6rem" }}>
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
