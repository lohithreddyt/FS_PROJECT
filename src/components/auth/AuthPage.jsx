import { useState } from "react";
import { authApi } from "../../api/services.js";
import { API_BASE_URL } from "../../api/client.js";

function extractError(error) {
  if (!error?.response) {
    const backendRoot = API_BASE_URL.replace(/\/api\/?$/, "");
    return `Cannot connect to the backend. Start Spring Boot on ${backendRoot} and try again.`;
  }

  if (typeof error.response.data === "string" && error.response.data.trim()) {
    return `Server error (${error.response.status}). Check the backend configuration.`;
  }

  return error?.response?.data?.message || `Request failed with status ${error.response.status}.`;
}

export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [otpState, setOtpState] = useState({
    sent: false,
    verified: false,
    code: "",
    input: "",
    email: "",
  });

  const f = key => event => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === "email") {
      setOtpState({ sent: false, verified: false, code: "", input: "", email: "" });
    }
  };

  const resetMessages = () => {
    setErr("");
    setMsg("");
  };

  const validateRegister = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirm) {
      return "All fields are required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Enter a valid email address.";
    }
    if (form.password !== form.confirm) {
      return "Passwords do not match.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (role === "admin" && !form.email.toLowerCase().endsWith("@betterhome.in")) {
      return "Admin accounts must use a @betterhome.in email address.";
    }
    if (role === "user" && !otpState.verified) {
      return "Please verify the OTP before creating an account.";
    }
    return "";
  };

  const login = async () => {
    resetMessages();

    if (!form.email.trim() || !form.password) {
      setErr("Email and password are required.");
      return;
    }

    try {
      setBusy(true);
      const user = await authApi.login({
        email: form.email.trim(),
        password: form.password,
      });
      onLogin(user);
      window.location.hash = `#/${user.role}/dashboard`;
    } catch (error) {
      setErr(extractError(error));
    } finally {
      setBusy(false);
    }
  };

  const sendOtp = async () => {
    resetMessages();
    if (!form.email.trim()) {
      setErr("Enter your email address to receive OTP.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setErr("Enter a valid email address.");
      return;
    }

    try {
      setBusy(true);
      await authApi.sendOtp({ email: form.email.trim() });
      setOtpState({
        sent: true,
        verified: false,
        code: "",
        input: "",
        email: form.email.trim(),
      });
      setMsg(`OTP sent to ${form.email.trim()}.`);
    } catch (error) {
      setErr(extractError(error));
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async () => {
    resetMessages();

    if (!otpState.sent) {
      setErr("Send OTP before verifying.");
      return;
    }
    if (!otpState.input.trim()) {
      setErr("Enter the OTP code.");
      return;
    }

    try {
      setBusy(true);
      await authApi.verifyOtp({
        email: form.email.trim(),
        code: otpState.input.trim(),
      });
      setOtpState(prev => ({ ...prev, verified: true }));
      setMsg(tab === "login" ? "OTP verified. You can now sign in." : "OTP verified. You can now create your account.");
    } catch (error) {
      setErr(extractError(error));
    } finally {
      setBusy(false);
    }
  };

  const register = async () => {
    resetMessages();

    const validationError = validateRegister();
    if (validationError) {
      setErr(validationError);
      return;
    }

    try {
      setBusy(true);
      const user = await authApi.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
      });
      setMsg("Account created successfully.");
      onLogin(user);
      window.location.hash = `#/${user.role}/dashboard`;
    } catch (error) {
      setErr(extractError(error));
    } finally {
      setBusy(false);
    }
  };

  const onEnter = action => event => {
    if (event.key === "Enter") {
      action();
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-panel">
        <div className="auth-box">
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 32,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 0.5,
              }}
            >
              Better<span style={{ color: "var(--brand)" }}>Home</span>
            </div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              India&apos;s Property Platform
            </div>
          </div>

          <div className="auth-tabs">
            <button
              className={`atab ${tab === "login" ? "active" : ""}`}
              onClick={() => {
                setTab("login");
                resetMessages();
                setOtpState({ sent: false, verified: false, code: "", input: "", email: "" });
              }}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`atab ${tab === "register" ? "active" : ""}`}
              onClick={() => {
                setTab("register");
                resetMessages();
                setOtpState({ sent: false, verified: false, code: "", input: "", email: "" });
              }}
              type="button"
            >
              Register
            </button>
          </div>

          <div className="role-row">
            <div
              className={`role-card ${role === "user" ? "sel" : ""}`}
              onClick={() => setRole("user")}
            >
              <div className="role-icon">🏠</div>
              <div className="role-lbl">Homeowner</div>
            </div>
            <div
              className={`role-card ${role === "admin" ? "sel" : ""}`}
              onClick={() => setRole("admin")}
            >
              <div className="role-icon">🛡️</div>
              <div className="role-lbl">Admin</div>
            </div>
          </div>

          {tab === "login" ? (
            <>
              <div className="auth-h">Welcome back</div>
              <div className="auth-sub-text">Sign in with your BetterHome account</div>
            </>
          ) : (
            <>
              <div className="auth-h">Create account</div>
              <div className="auth-sub-text">Register and start managing property improvements</div>
            </>
          )}

          {err && <div className="aerr">! {err}</div>}
          {msg && <div className="amsg">OK {msg}</div>}

          {tab === "register" && (
            <div className="afield">
              <label className="alabel">Full Name</label>
              <input
                className="ainput"
                placeholder="e.g. Ravi Kumar"
                value={form.name}
                onChange={f("name")}
              />
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
              onKeyDown={onEnter(tab === "login" ? login : register)}
            />
          </div>

          <div className="afield">
            <label className="alabel">Password</label>
            <input
              className="ainput"
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={f("password")}
              onKeyDown={onEnter(tab === "login" ? login : register)}
            />
          </div>


          {tab === "register" && (
            <>
              <div className="afield">
                <label className="alabel">Confirm Password</label>
                <input
                  className="ainput"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={f("confirm")}
                  onKeyDown={onEnter(register)}
                />
              </div>

              {role === "user" && (
                <>
                  <div className="otp-row">
                    <div className="afield" style={{ marginBottom: 0 }}>
                      <label className="alabel">OTP Code</label>
                      <input
                        className="ainput"
                        type="text"
                        placeholder="Enter OTP"
                        value={otpState.input}
                        onChange={event => setOtpState(prev => ({ ...prev, input: event.target.value }))}
                        onKeyDown={event => event.key === "Enter" && verifyOtp()}
                      />
                    </div>
                    <div className="otp-actions">
                      <button
                        className={`otp-button ${busy ? "disabled" : ""}`}
                        onClick={sendOtp}
                        type="button"
                        disabled={busy}
                      >
                        {otpState.sent ? "Resend OTP" : "Send OTP"}
                      </button>
                      <button
                        className={`otp-button ${busy || !otpState.sent ? "disabled" : ""}`}
                        onClick={verifyOtp}
                        type="button"
                        disabled={busy || !otpState.sent}
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>

                  {otpState.sent && (
                    <div className="amsg" style={{ marginBottom: 16, color: otpState.verified ? "#ADF7B6" : "#FDE68A" }}>
                      {otpState.verified ? "OTP verified for " + otpState.email : "OTP sent to " + otpState.email + ". Enter it above."}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <button
            className="asubmit"
            onClick={tab === "login" ? login : register}
            disabled={busy}
            type="button"
          >
            {busy ? "Please wait..." : tab === "login" ? "Sign In ->" : "Register ->"}
          </button>

          <div className="adivider">
            <span>or</span>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgba(255,255,255,0.28)",
            }}
          >
            {tab === "login" ? "New to BetterHome? " : "Already have an account? "}
            <span
              style={{ color: "var(--brand)", cursor: "pointer", fontWeight: 600 }}
              onClick={() => {
                setTab(tab === "login" ? "register" : "login");
                resetMessages();
              }}
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
