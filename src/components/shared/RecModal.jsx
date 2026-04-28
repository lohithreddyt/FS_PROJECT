// src/components/shared/RecModal.jsx

export default function RecModal({ rec, onClose, onAdd }) {
  if (!rec) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="mbox" onClick={e => e.stopPropagation()}>
        <div className="mhead">
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: rec.catColor, fontWeight: 700, marginBottom: 5 }}>{rec.category}</div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 23, fontWeight: 700 }}>{rec.title}</div>
          </div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div style={{ background: rec.color, borderRadius: 12, height: 148, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 74, marginBottom: 17 }}>{rec.emoji}</div>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.75, marginBottom: 17 }}>
          {rec.desc} This improvement is particularly effective for Indian middle-class residential properties in tier-1 and tier-2 cities, backed by 2024–25 market survey data.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 17 }}>
          <div style={{ background: "var(--success-bg)", borderRadius: 10, padding: 13, textAlign: "center" }}>
            <div style={{ fontSize: 10.5, color: "var(--muted)", marginBottom: 3 }}>ROI Estimate</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "var(--success)" }}>{rec.roi}</div>
          </div>
          <div style={{ background: "rgba(212,82,26,0.07)", borderRadius: 10, padding: 13, textAlign: "center" }}>
            <div style={{ fontSize: 10.5, color: "var(--muted)", marginBottom: 3 }}>Est. Cost</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--brand)" }}>{rec.cost}</div>
          </div>
          <div style={{ background: "rgba(197,155,10,0.08)", borderRadius: 10, padding: 13, textAlign: "center" }}>
            <div style={{ fontSize: 10.5, color: "var(--muted)", marginBottom: 3 }}>Rating</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "var(--gold)" }}>{rec.rating}★</div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>{rec.tags.map(t => <span key={t} className="chip">{t}</span>)}</div>
        <button className="btn-p" style={{ width: "100%" }} onClick={onAdd}>Add to My Plan</button>
      </div>
    </div>
  );
}
