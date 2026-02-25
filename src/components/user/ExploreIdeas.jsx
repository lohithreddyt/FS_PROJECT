// src/components/user/ExploreIdeas.jsx

export default function ExploreIdeas({ filteredRecs, filter, setFilter, openRec }) {
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
          <div className="rec-card" key={rec.id} onClick={() => openRec(rec)}>
            <div className="rec-img" style={{ background: rec.color }}>{rec.emoji}</div>
            <div className="rec-body">
              <div className="rec-cat" style={{ color: rec.catColor }}>{rec.category}</div>
              <div className="rec-title">{rec.title}</div>
              <div className="rec-desc">{rec.desc}</div>
              <div style={{ marginBottom: 8 }}>{rec.tags.map(t => <span key={t} className="chip">{t}</span>)}</div>
              <div className="rec-foot"><span className="roi-pill">{rec.roi}</span><span className="cost-txt">{rec.cost}</span></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
