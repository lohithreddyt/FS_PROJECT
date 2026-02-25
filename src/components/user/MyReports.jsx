// src/components/user/MyReports.jsx

export default function MyReports({ reports, onNav }) {
  if (reports.length === 0) {
    return (
      <div className="empty">
        <div className="empty-ico">📋</div>
        <div className="empty-t">No reports yet</div>
        <div className="empty-d">Submit your property details to receive a personalised enhancement report with ROI-backed recommendations.</div>
        <button className="btn-p" onClick={() => onNav("submit")}>Submit Property →</button>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 16, fontSize: 13, color: "var(--muted)" }}>
        Showing <strong>{reports.length}</strong> report{reports.length !== 1 ? "s" : ""}
      </div>

      {[...reports].reverse().map(r => (
        <div className="rcard" key={r.id}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {r.image && (
              <img src={r.image} alt="Property" style={{ width: 110, height: 85, objectFit: "cover", borderRadius: 9, border: "1px solid var(--border)", flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 13 }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 19, fontWeight: 700 }}>{r.location}</span>
                    <span className="chip">{r.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    ID: {r.id} · {r.area} · Budget: {r.budget} · Submitted: {r.submitted}
                  </div>
                </div>
                <span className={`sp sp-${r.status}`}>{r.status}</span>
              </div>

              {r.concerns && (
                <div style={{ marginTop: 11, padding: "9px 13px", background: "rgba(212,82,26,0.05)", borderRadius: 8, border: "1px solid rgba(212,82,26,0.12)" }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--brand)", letterSpacing: 0.5, textTransform: "uppercase" }}>Noted Concerns: </span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{r.concerns}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
