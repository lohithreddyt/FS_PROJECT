export default function AdminAnalytics({ analytics }) {
  if (!analytics) {
    return <div className="sc"><div className="sc-title">Analytics data is unavailable.</div></div>;
  }

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card sc-brand"><div className="stat-ico">T</div><div className="stat-lbl">Total Listings</div><div className="stat-val">{analytics.totalListings}</div></div>
        <div className="stat-card sc-gold"><div className="stat-ico">P</div><div className="stat-lbl">Pending Listings</div><div className="stat-val">{analytics.pendingListings}</div></div>
        <div className="stat-card sc-teal"><div className="stat-ico">A</div><div className="stat-lbl">Active Listings</div><div className="stat-val">{analytics.activeListings}</div></div>
        <div className="stat-card sc-green"><div className="stat-ico">R</div><div className="stat-lbl">Recommendations</div><div className="stat-val">{analytics.totalRecommendations}</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="sc">
          <div className="sc-title" style={{ marginBottom: 18 }}>Top Locations</div>
          {analytics.topCities.map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{item.value}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Most active city or region</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sc">
          <div className="sc-title" style={{ marginBottom: 18 }}>Top Property Types</div>
          {analytics.topCategories.map(item => (
            <div key={item.label} className="abar">
              <div className="abar-head"><span style={{ fontWeight: 500 }}>{item.label}</span><strong>{item.value}</strong></div>
              <div className="abar-track"><div className="abar-fill" style={{ width: `${Math.min(item.value * 20, 100)}%`, background: "var(--brand)" }} /></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
