// src/components/admin/AdminRecommendations.jsx

export default function AdminRecommendations({ recs, filteredRecs, filter, setFilter, onDelete, showToast }) {
  const FILTERS = ["All", "Interior", "Exterior", "Smart Home", "Vastu", "Bathroom", "Energy"];

  return (
    <>
      <div className="ftabs">
        {FILTERS.map(t => (
          <button key={t} className={`ftab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>
      <div className="rec-grid">
        {filteredRecs.map(rec => (
          <div className="rec-card" key={rec.id} style={{ cursor: "default" }}>
            <div className="rec-img" style={{ background: rec.color }}>{rec.emoji}</div>
            <div className="rec-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div className="rec-cat" style={{ color: rec.catColor }}>{rec.category}</div>
                <div style={{ display: "flex", gap: 5 }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }} onClick={() => showToast("✏ Edit mode coming soon!")}>✏️</button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }} onClick={() => onDelete(rec.id)}>🗑️</button>
                </div>
              </div>
              <div className="rec-title">{rec.title}</div>
              <div className="rec-desc">{rec.desc}</div>
              <div className="rec-foot"><span className="roi-pill">{rec.roi}</span><span className="cost-txt">{rec.cost}</span></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
