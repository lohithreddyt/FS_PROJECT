// src/App.jsx
import { useState } from "react";
import { DB, updateUserRecord, saveSession, loadSession, clearSession } from "./data/storage.js";
import AuthPage from "./components/auth/AuthPage.jsx";
import UserApp  from "./components/user/UserApp.jsx";
import AdminApp from "./components/admin/AdminApp.jsx";
import "./styles/global.css";

// ── Restore session from localStorage on first load ───────────────────────────
function resolveSession() {
  const session = loadSession();
  if (!session) return null;
  const list = session.role === "admin" ? DB.admins : DB.users;
  return list.find(u => u.email === session.email) || null;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => resolveSession());

  // Called by UserApp whenever user data changes (e.g. new report submitted)
  const updateUser = updated => {
    setCurrentUser(updated);
    updateUserRecord(updated);   // persist to localStorage
    saveSession(updated);        // keep session fresh
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
  };

  return (
    <>
      {!currentUser && <AuthPage onLogin={user => { saveSession(user); setCurrentUser(user); }} />}
      {currentUser?.role === "user"  && <UserApp  currentUser={currentUser} onLogout={handleLogout} updateUser={updateUser} />}
      {currentUser?.role === "admin" && <AdminApp currentUser={currentUser} onLogout={handleLogout} />}
    </>
  );
}
