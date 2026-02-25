// src/components/admin/AdminAnalytics.jsx

export default function AdminAnalytics() {
  const categories = [
    { l: "Kitchen Upgrade",     p: 82, c: "var(--brand)" },
    { l: "Vastu Redesign",      p: 74, c: "var(--gold)" },
    { l: "Bathroom Renovation", p: 65, c: "var(--teal)" },
    { l: "Smart Lighting",      p: 58, c: "#1D4ED8" },
    { l: "Solar Panels",        p: 43, c: "var(--success)" },
  ];

  const cities = [
    { city: "Pune",       state: "Maharashtra",   n: 312 },
    { city: "Lucknow",    state: "Uttar Pradesh", n: 278 },
    { city: "Jaipur",     state: "Rajasthan",     n: 201 },
    { city: "Coimbatore", state: "Tamil Nadu",    n: 189 },
    { city: "Nagpur",     state: "Maharashtra",   n: 156 },
  ];

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card sc-brand"><div className="stat-ico">📈</div><div className="stat-lbl">Monthly Submissions</div><div className="stat-val">234</div><div className="stat-chg">↑ 18% vs last month</div></div>
        <div className="stat-card sc-gold"><div className="stat-ico">🎯</div><div className="stat-lbl">Recommendation CTR</div><div className="stat-val">67%</div><div className="stat-chg">↑ 4% this month</div></div>
        <div className="stat-card sc-teal"><div className="stat-ico">🌍</div><div className="stat-lbl">Cities Covered</div><div className="stat-val">38</div><div className="stat-chg">+5 new cities</div></div>
        <div className="stat-card sc-green"><div className="stat-ico">💬</div><div className="stat-lbl">Satisfaction Rate</div><div className="stat-val">94%</div><div className="stat-chg">480 reviews</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="sc">
          <div className="sc-title" style={{ marginBottom: 18 }}>Top Enhancement Categories</div>
          {categories.map(a => (
            <div key={a.l} className="abar">
              <div className="abar-head"><span style={{ fontWeight: 500 }}>{a.l}</span><strong>{a.p}%</strong></div>
              <div className="abar-track"><div className="abar-fill" style={{ width: `${a.p}%`, background: a.c }} /></div>
            </div>
          ))}
        </div>

        <div className="sc">
          <div className="sc-title" style={{ marginBottom: 18 }}>Geographic Distribution</div>
          {cities.map((c, i) => (
            <div key={c.city} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.city}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.state}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--brand)" }}>{c.n}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
