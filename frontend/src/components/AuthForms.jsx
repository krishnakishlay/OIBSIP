import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import * as authService from "../services/auth.service";

const title = { fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "0.3rem" };
const sub = { color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.8rem" };
const link = { color: "var(--amber)", cursor: "pointer", textDecoration: "none" };

function Field({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input className="form-control" type={type} value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function SubmitBtn({ loading, children }) {
  return (
    <button className="btn-fire" disabled={loading}
      style={{ width: "100%", padding: "0.95rem", fontSize: "0.95rem", marginTop: "0.4rem",
               opacity: loading ? 0.7 : 1 }}>
      {loading ? "Please wait…" : children}
    </button>
  );
}

function LoginForm({ onSwitch, onSuccess }) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) return showToast("Please fill in all fields.", "warning");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return showToast("Please enter a valid email.", "warning");
    try {
      setLoading(true);
      await login(email, pass);
      showToast("Welcome back! 🎉", "success");
      onSuccess();
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={title}>Welcome back</div>
      <div style={sub}>
        New here?{" "}
        <span style={link} onClick={() => onSwitch("register")}>Create an account →</span>
      </div>
      <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Password"      type="password" value={pass}  onChange={setPass}  placeholder="Your password" />
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <span style={{ ...link, fontSize: "0.8rem" }} onClick={() => onSwitch("forgot")}>
          Forgot password?
        </span>
      </div>
      <SubmitBtn loading={loading}>Sign in</SubmitBtn>
    </form>
  );
}

function RegisterForm({ onSwitch, onSuccess }) {
  const { register } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !pass) return showToast("Please fill in all fields.", "warning");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return showToast("Please enter a valid email.", "warning");
    if (pass.length < 8) return showToast("Password must be at least 8 characters.", "warning");
    try {
      setLoading(true);
      await register(name, email, pass);
      showToast("Account created! Welcome to Pizzeriaa 🍕", "success");
      onSuccess();
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={title}>Create account</div>
      <div style={sub}>
        Already have one?{" "}
        <span style={link} onClick={() => onSwitch("login")}>Sign in →</span>
      </div>
      <Field label="Full name"     value={name}  onChange={setName}  placeholder="John Doe" />
      <Field label="Email address" type="email"    value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Password"      type="password" value={pass}  onChange={setPass}  placeholder="Min. 8 characters" />
      <SubmitBtn loading={loading}>Create account</SubmitBtn>
    </form>
  );
}

function ForgotForm({ onSwitch }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return showToast("Please enter your email.", "warning");
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      showToast("Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "1rem 0" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✉️</div>
      <div style={title}>Check your inbox</div>
      <div style={{ ...sub, margin: "0.5rem auto 1.5rem" }}>
        We sent a password reset link to <strong>{email}</strong>
      </div>
      <span style={link} onClick={() => onSwitch("login")}>← Back to sign in</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={title}>Reset password</div>
      <div style={{ ...sub }}>
        Enter your email and we'll send a reset link.{" "}
        <span style={link} onClick={() => onSwitch("login")}>← Back to sign in</span>
      </div>
      <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <SubmitBtn loading={loading}>Send reset link</SubmitBtn>
    </form>
  );
}

export default function AuthForms({ mode, onSwitch, onSuccess }) {
  if (mode === "register") {
    return <RegisterForm onSwitch={onSwitch} onSuccess={onSuccess} />;
  }
  if (mode === "forgot") {
    return <ForgotForm onSwitch={onSwitch} />;
  }
  return <LoginForm onSwitch={onSwitch} onSuccess={onSuccess} />;
}