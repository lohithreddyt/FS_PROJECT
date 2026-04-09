import { useEffect, useState } from "react";
import { authApi } from "./api/services.js";
import { DB, getReportsForUser, updateUserRecord, registerUser } from "./data/storage.js";
import AuthPage from "./components/auth/AuthPage.jsx";
import UserApp from "./components/user/UserApp.jsx";
import AdminApp from "./components/admin/AdminApp.jsx";
import "./styles/global.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let active = true;
    authApi
      .session()
      .then(user => {
        if (!active) return;
        let stored = DB.users.find(u => u.email === user.email);
        if (!stored && user.role === "user") {
          stored = { email: user.email, name: user.name || user.email, role: user.role, reports: [] };
          registerUser(stored);
        }

        setCurrentUser({
          ...user,
          reports: stored?.reports?.length > 0 ? stored.reports : getReportsForUser(user.email, user.name),
        });
      })
      .catch(() => {
        if (active) setCurrentUser(null);
      })
      .finally(() => {
        if (active) setBooting(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      setCurrentUser(null);
      window.location.hash = "#/";
    }
  };

  const handleLogin = user => {
    let stored = DB.users.find(u => u.email === user.email);
    if (!stored && user.role === "user") {
      stored = { email: user.email, name: user.name || user.email, role: user.role, reports: [] };
      registerUser(stored);
    }

    setCurrentUser({
      ...user,
      reports: stored?.reports?.length > 0 ? stored.reports : getReportsForUser(user.email, user.name),
    });
  };

  const handleUpdateUser = updatedUser => {
    setCurrentUser(updatedUser);
    updateUserRecord(updatedUser);
  };

  if (booting) {
    return (
      <div className="auth-root">
        <div className="auth-panel">
          <div className="auth-box" style={{ textAlign: "center" }}>
            <div className="auth-h">Loading BetterHome</div>
            <div className="auth-sub-text">Checking your session and preparing the dashboard.</div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return currentUser.role === "admin" ? (
    <AdminApp currentUser={currentUser} onLogout={handleLogout} />
  ) : (
    <UserApp currentUser={currentUser} onLogout={handleLogout} updateUser={handleUpdateUser} />
  );
}
