// src/components/shared/Sidebar.jsx
export default function Sidebar({ brand, sub, navItems, nav, onNav, currentUser, onLogout }) {
  const initials = currentUser.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="sidebar">
      <div className="sb-logo">
        <div className="sb-brand">Better<span>Home</span></div>
        <div className="sb-sub">{sub}</div>
      </div>

      <nav className="sb-nav">
        <div className="sb-sec">{brand}</div>
        {navItems.map(it => (
          <div
            key={it.id}
            className={`nav-item ${nav === it.id ? "active" : ""}`}
            onClick={() => onNav(it.id)}
          >
            <span className="nav-ico">{it.ico}</span>
            <span>{it.lbl}</span>
            {it.badge ? <span className="nav-badge">{it.badge}</span> : null}
          </div>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="user-chip">
          <div className="u-av">{initials}</div>
          <div>
            <div className="u-nm">{currentUser.name}</div>
            <div className="u-rl">{currentUser.role === "admin" ? "Administrator" : "Homeowner"}</div>
          </div>
          <button className="logout-btn" title="Sign out" onClick={onLogout}>⏻</button>
        </div>
      </div>
    </div>
  );
}
