import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/reservations";

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="eyebrow">Members</p>
          <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p className="page__lead">
            {isLogin
              ? "Log in to book a table and manage your reservations."
              : "Sign up to reserve tables and track your bookings."}
          </p>
        </div>
      </header>

      <div className="container auth">
        <form className="auth__form card-surface" onSubmit={submit}>
          {error && <p className="alert alert--error">{error}</p>}

          {!isLogin && (
            <label className="field">
              <span>Full name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </label>
          )}

          <label className="field">
            <span>Email *</span>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Password *</span>
            <input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              minLength={6}
              required
            />
          </label>

          <button type="submit" className="btn" disabled={busy}>
            {busy ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          </button>

          <p className="auth__switch">
            {isLogin ? "New to Saffron & Sage?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setMode(isLogin ? "register" : "login");
                setError("");
              }}
            >
              {isLogin ? "Create an account" : "Log in"}
            </button>
          </p>
        </form>

        <aside className="auth__aside card-surface">
          <h3>Why sign in?</h3>
          <ul className="ticks">
            <li>Book a table in just a few clicks.</li>
            <li>See all your reservations in one place.</li>
            <li>Cancel or review upcoming bookings anytime.</li>
          </ul>
          <p className="muted">
            Prefer to just browse? Explore the{" "}
            <Link to="/menu">menu</Link> — no account needed.
          </p>
        </aside>
      </div>
    </div>
  );
}
