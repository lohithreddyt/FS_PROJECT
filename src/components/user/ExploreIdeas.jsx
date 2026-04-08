import { recommendationFilters } from "../../utils/recommendations.js";

export default function ExploreIdeas({ filteredRecs, filter, setFilter, openRec }) {
  return (
    <>
      <div className="ftabs">
        {recommendationFilters.map(item => (
          <button key={item} className={`ftab ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{item}</button>
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
              <div style={{ marginBottom: 8 }}>{rec.tags.map(tag => <span key={tag} className="chip">{tag}</span>)}</div>
              <div className="rec-foot"><span className="roi-pill">{rec.roi}</span><span className="cost-txt">{rec.cost}</span></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
