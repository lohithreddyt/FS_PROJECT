// src/components/auth/AuthPage.jsx
import { useState } from "react";
import { DB, registerUser, registerAdmin, saveSession } from "../../data/storage.js";

export default function AuthPage({ onLogin }) {
  const [tab,  setTab]  = useState("login");
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err,  setErr]  = useState("");
  const [msg,  setMsg]  = useState("");

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const login = () => {
    setErr(""); setMsg("");
    if (role === "admin" && !form.email.toLowerCase().endsWith("@betterhome.in")) {
      setErr("Admin accounts must use a @betterhome.in email address."); return;
    }
    const list = role === "admin" ? DB.admins : DB.users;
    const found = list.find(u => u.email === form.email && u.password === form.password);
    if (!found) { setErr("Incorrect email or password."); return; }
    saveSession(found);
    onLogin({ ...found });
  };

  const register = () => {
    setErr(""); setMsg("");
    if (!form.name || !form.email || !form.password || !form.confirm) { setErr("All fields are required."); return; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    if (form.password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (role === "admin" && !form.email.toLowerCase().endsWith("@betterhome.in")) {
      setErr("Admin accounts must use a @betterhome.in email address."); return;
    }
    const list = role === "admin" ? DB.admins : DB.users;
    if (list.find(u => u.email === form.email)) { setErr("Email already registered."); return; }

    const nu = { email: form.email, password: form.password, name: form.name, role, ...(role === "user" ? { reports: [] } : {}) };
    if (role === "admin") registerAdmin(nu);
    else                  registerUser(nu);

    setMsg("Account created! You can now sign in.");
    setTab("login");
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div className="auth-root">
      <div className="auth-panel">
        <div className="auth-box">

          {/* BetterHome branding */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>
              Better<span style={{ color: "var(--brand)" }}>Home</span>
            </div>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: 4, fontWeight: 600 }}>
              India's Property Platform
            </div>
          </div>

          {/* Sign In / Register tabs */}
          <div className="auth-tabs">
            <button className={`atab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr(""); setMsg(""); }}>Sign In</button>
            <button className={`atab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setErr(""); setMsg(""); }}>Register</button>
          </div>

          {/* Role selector */}
          <div className="role-row">
            <div className={`role-card ${role === "user" ? "sel" : ""}`} onClick={() => setRole("user")}>
              <div className="role-icon">🏠</div>
              <div className="role-lbl">Homeowner</div>
            </div>
            <div className={`role-card ${role === "admin" ? "sel" : ""}`} onClick={() => setRole("admin")}>
              <div className="role-icon">🛡️</div>
              <div className="role-lbl">Admin</div>
            </div>
          </div>

          {tab === "login"
            ? <><div className="auth-h">Welcome back</div><div className="auth-sub-text">Sign in to your BetterHome account</div></>
            : <><div className="auth-h">Create account</div><div className="auth-sub-text">Join BetterHome and boost your property</div></>
          }

          {err && <div className="aerr">⚠ {err}</div>}
          {msg && <div className="amsg">✓ {msg}</div>}

          {tab === "register" && (
            <div className="afield">
              <label className="alabel">Full Name</label>
              <input className="ainput" placeholder="e.g. Ravi Kumar" value={form.name} onChange={f("name")} />
            </div>
          )}

          <div className="afield">
            <label className="alabel">Email Address</label>
            <input
              className="ainput"
              type="email"
              placeholder={role === "admin" ? "you@betterhome.in" : "you@example.com"}
              value={form.email}
              onChange={f("email")}
              onKeyDown={e => e.key === "Enter" && (tab === "login" ? login() : register())}
            />
            {role === "admin" && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                ⚠ Admin accounts require a @betterhome.in email
              </div>
            )}
          </div>

          <div className="afield">
            <label className="alabel">Password</label>
            <input
              className="ainput"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={f("password")}
              onKeyDown={e => e.key === "Enter" && (tab === "login" ? login() : register())}
            />
          </div>

          {tab === "register" && (
            <div className="afield">
              <label className="alabel">Confirm Password</label>
              <input
                className="ainput"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={f("confirm")}
                onKeyDown={e => e.key === "Enter" && register()}
              />
            </div>
          )}

          <button className="asubmit" onClick={tab === "login" ? login : register}>
            {tab === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div className="adivider"><span>or</span></div>
          <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
            {tab === "login" ? "New to BetterHome? " : "Already have an account? "}
            <span
              style={{ color: "var(--brand)", cursor: "pointer", fontWeight: 600 }}
              onClick={() => { setTab(tab === "login" ? "register" : "login"); setErr(""); setMsg(""); }}
            >
              {tab === "login" ? "Register here" : "Sign in"}
            </span>
          </div>

          {tab === "login" && (
            <div className="demo-box">
              <div className="demo-label">Demo Credentials</div>
              <div className="demo-line">User: user@betterhome.in / user123</div>
              <div className="demo-line">Admin: admin@betterhome.in / admin123</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
