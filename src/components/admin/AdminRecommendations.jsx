import { recommendationFilters } from "../../utils/recommendations.js";

export default function AdminRecommendations({ filteredRecs, filter, setFilter, onDelete, showToast, deletingId }) {
  return (
    <>
      <div className="ftabs">
        {recommendationFilters.map(item => (
          <button key={item} className={`ftab ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{item}</button>
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
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }} onClick={() => showToast("Edit mode is not part of this submission.")}>E</button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }} onClick={() => onDelete(rec.id)} disabled={deletingId === rec.id}>{deletingId === rec.id ? "..." : "X"}</button>
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
