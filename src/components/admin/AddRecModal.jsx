export default function AddRecModal({ newRec, setNewRec, onAdd, onClose, saving = false }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="mbox" onClick={event => event.stopPropagation()}>
        <div className="mhead">
          <div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700 }}>Add New Recommendation</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>Curate property enhancement content</div>
          </div>
          <button className="mclose" onClick={onClose}>X</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div className="fg">
            <label className="flabel">Title *</label>
            <input className="finput" placeholder="e.g. Modular Kitchen Upgrade" value={newRec.title} onChange={event => setNewRec({ ...newRec, title: event.target.value })} />
          </div>

          <div className="fg">
            <label className="flabel">Category</label>
            <select className="finput" value={newRec.category} onChange={event => setNewRec({ ...newRec, category: event.target.value })}>
              <option>Interior</option><option>Exterior</option><option>Smart Home</option><option>Vastu</option><option>Bathroom</option><option>Energy</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="fg">
              <label className="flabel">Estimated Cost *</label>
              <input className="finput" placeholder="e.g. Rs 80K-1.5L" value={newRec.cost} onChange={event => setNewRec({ ...newRec, cost: event.target.value })} />
            </div>
            <div className="fg">
              <label className="flabel">ROI Estimate *</label>
              <input className="finput" placeholder="e.g. +18% ROI" value={newRec.roi} onChange={event => setNewRec({ ...newRec, roi: event.target.value })} />
            </div>
          </div>

          <div className="fg">
            <label className="flabel">Description *</label>
            <textarea className="finput" rows={3} placeholder="Describe the improvement and its impact..." value={newRec.desc} onChange={event => setNewRec({ ...newRec, desc: event.target.value })} />
          </div>
        </div>

        <button className="btn-p" style={{ marginTop: 16, width: "100%" }} onClick={onAdd} disabled={saving}>
          {saving ? "Publishing..." : "Publish Recommendation"}
        </button>
      </div>
    </div>
  );
}
