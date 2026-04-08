import { useEffect, useState } from "react";
import { authApi } from "./api/services.js";
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
        if (active) setCurrentUser(user);
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
    return <AuthPage onLogin={setCurrentUser} />;
  }

  return currentUser.role === "admin" ? (
    <AdminApp currentUser={currentUser} onLogout={handleLogout} />
  ) : (
    <UserApp currentUser={currentUser} onLogout={handleLogout} />
  );
}
