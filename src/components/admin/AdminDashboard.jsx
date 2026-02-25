// src/components/admin/AdminDashboard.jsx

export default function AdminDashboard({ recs, listings }) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card sc-brand"><div className="stat-ico">📋</div><div className="stat-lbl">Total Submissions</div><div className="stat-val">{listings.length + 1276}</div><div className="stat-chg">↑ 34 this week</div></div>
        <div className="stat-card sc-gold"><div className="stat-ico">✦</div><div className="stat-lbl">Recommendations</div><div className="stat-val">{recs.length}</div></div>
        <div className="stat-card sc-teal"><div className="stat-ico">⏳</div><div className="stat-lbl">Pending Reviews</div><div className="stat-val">{listings.filter(l => l.status === "pending").length}</div><div className="stat-chg">Needs attention</div></div>
        <div className="stat-card sc-green"><div className="stat-ico">💰</div><div className="stat-lbl">Avg Value Boost</div><div className="stat-val">22%</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="sc">
          <div className="sc-head"><div className="sc-title">Recent Submissions</div></div>
          <table className="tbl">
            <thead><tr><th>Owner</th><th>Location</th><th>Budget</th><th>Status</th></tr></thead>
            <tbody>
              {[...listings].reverse().slice(0, 5).map(l => (
                <tr key={l.id}>
                  <td><strong>{l.name}</strong><br /><span style={{ fontSize: 11, color: "var(--muted)" }}>{l.id}</span></td>
                  <td style={{ fontSize: 12 }}>{l.location}</td>
                  <td style={{ fontSize: 12 }}>{l.budget}</td>
                  <td><span className={`sp sp-${l.status}`}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sc">
          <div className="sc-head"><div className="sc-title">Top Recommendations</div></div>
          {recs.slice(0, 4).map(rec => (
            <div key={rec.id} style={{ display: "flex", gap: 11, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: rec.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{rec.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{rec.title}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{rec.category} · {rec.cost}</div>
              </div>
              <span className="roi-pill">{rec.roi}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
