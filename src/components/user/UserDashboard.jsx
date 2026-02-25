// src/components/user/UserDashboard.jsx
import { RECS } from "../../data/db.js";

export default function UserDashboard({ currentUser, onNav, openRec }) {
  const isNew = currentUser.reports.length === 0;

  if (isNew) {
    return (
      <>
        <div className="hero">
          <div className="hero-eye">Welcome to BetterHome</div>
          <div className="hero-h">Let's unlock your home's<br />true market value</div>
          <div className="hero-desc">Submit your property to receive a personalised enhancement report with ROI-backed recommendations designed for Indian middle-class homes.</div>
          <div className="hero-chips">
            <div className="hchip">🏠 950+ Homes Enhanced</div>
            <div className="hchip">💰 Avg +22% Value Boost</div>
            <div className="hchip">📍 38 Cities Covered</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          <div className="sc" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 38, textAlign: "center", border: "2px dashed var(--border)" }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>📝</div>
            <div className="sc-title" style={{ marginBottom: 7 }}>Submit Your Property</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 18 }}>Tell us about your home and get a personalised enhancement report with ROI estimates.</div>
            <button className="btn-p" onClick={() => onNav("submit")}>Get Started →</button>
          </div>
          <div className="sc" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 38, textAlign: "center", border: "2px dashed var(--border)" }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>✦</div>
            <div className="sc-title" style={{ marginBottom: 7 }}>Browse Ideas</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 18 }}>Explore curated improvement ideas — from Vastu redesign to smart home upgrades.</div>
            <button className="btn-g" onClick={() => onNav("explore")}>Explore Ideas →</button>
          </div>
        </div>

        <div className="sc">
          <div className="sc-head"><div className="sc-title">Why BetterHome?</div></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[
              { ico: "🎯", h: "Personalized Reports",  d: "Recommendations based on your property type, budget, and location." },
              { ico: "📈", h: "ROI-Backed Advice",     d: "Every suggestion includes estimated return on investment." },
              { ico: "🕉️", h: "Vastu & Cultural Fit", d: "Solutions designed for Indian homes and buyer preferences." },
            ].map(c => (
              <div key={c.h} style={{ padding: 18, background: "#fff", borderRadius: 12, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 30, marginBottom: 9 }}>{c.ico}</div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontWeight: 700, marginBottom: 5 }}>{c.h}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Returning user dashboard
  return (
    <>
      <div className="hero">
        <div className="hero-eye">BetterHome Dashboard</div>
        <div className="hero-h">Welcome back,<br />{currentUser.name.split(" ")[0]}!</div>
        <div className="hero-desc">Your property enhancement journey is underway. Track your reports and discover new ideas.</div>
        <div className="hero-chips">
          <div className="hchip">📋 {currentUser.reports.length} Report{currentUser.reports.length !== 1 ? "s" : ""} Submitted</div>
          <div className="hchip">⏳ {currentUser.reports.filter(r => r.status === "pending").length} Pending</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card sc-brand"><div className="stat-ico">📋</div><div className="stat-lbl">My Submissions</div><div className="stat-val">{currentUser.reports.length}</div></div>
        <div className="stat-card sc-gold"><div className="stat-ico">⏳</div><div className="stat-lbl">Pending Review</div><div className="stat-val">{currentUser.reports.filter(r => r.status === "pending").length}</div></div>
        <div className="stat-card sc-teal"><div className="stat-ico">✦</div><div className="stat-lbl">Ideas Available</div><div className="stat-val">{RECS.length}</div></div>
        <div className="stat-card sc-green"><div className="stat-ico">⭐</div><div className="stat-lbl">Avg Platform Rating</div><div className="stat-val">4.8</div></div>
      </div>

      <div className="sc">
        <div className="sc-head">
          <div><div className="sc-title">Recent Reports</div><div className="sc-desc">Your latest submissions</div></div>
          <button className="btn-g" onClick={() => onNav("myreports")}>View All →</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Location</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {[...currentUser.reports].reverse().slice(0, 3).map(r => (
              <tr key={r.id}>
                <td><strong>{r.location}</strong><br /><span style={{ fontSize: 11, color: "var(--muted)" }}>{r.area}</span></td>
                <td><span className="chip">{r.type}</span></td>
                <td><span className={`sp sp-${r.status}`}>{r.status}</span></td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.submitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sc">
        <div className="sc-head">
          <div className="sc-title">Top Picks For You</div>
          <button className="btn-g" onClick={() => onNav("explore")}>See All →</button>
        </div>
        <div className="rec-grid">
          {RECS.slice(0, 3).map(rec => (
            <div className="rec-card" key={rec.id} onClick={() => openRec(rec)}>
              <div className="rec-img" style={{ background: rec.color }}>{rec.emoji}</div>
              <div className="rec-body">
                <div className="rec-cat" style={{ color: rec.catColor }}>{rec.category}</div>
                <div className="rec-title">{rec.title}</div>
                <div className="rec-desc">{rec.desc}</div>
                <div className="rec-foot"><span className="roi-pill">{rec.roi}</span><span className="cost-txt">{rec.cost}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
