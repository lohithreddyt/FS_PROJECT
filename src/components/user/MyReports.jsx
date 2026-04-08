export default function MyReports({ reports, onNav }) {
  if (reports.length === 0) {
    return (
      <div className="empty">
        <div className="empty-ico">R</div>
        <div className="empty-t">No reports yet</div>
        <div className="empty-d">Submit your property details to receive a personalised enhancement report with ROI-backed recommendations.</div>
        <button className="btn-p" onClick={() => onNav("submit")}>Submit Property</button>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 16, fontSize: 13, color: "var(--muted)" }}>
        Showing <strong>{reports.length}</strong> report{reports.length !== 1 ? "s" : ""}
      </div>

      {reports.map(report => (
        <div className="rcard" key={report.id}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {report.image && <img src={report.image} alt="Property" style={{ width: 110, height: 85, objectFit: "cover", borderRadius: 9, border: "1px solid var(--border)", flexShrink: 0 }} />}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 13 }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 19, fontWeight: 700 }}>{report.location}</span>
                    <span className="chip">{report.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    ID: {report.id} | {report.area} | Budget: {report.budget} | Submitted: {report.submitted}
                  </div>
                </div>
                <span className={`sp sp-${report.status}`}>{report.status}</span>
              </div>

              {report.concerns && (
                <div style={{ marginTop: 11, padding: "9px 13px", background: "rgba(212,82,26,0.05)", borderRadius: 8, border: "1px solid rgba(212,82,26,0.12)" }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--brand)", letterSpacing: 0.5, textTransform: "uppercase" }}>Noted Concerns: </span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{report.concerns}</span>
                </div>
              )}

              {report.rejectionReason && (
                <div style={{ marginTop: 11, padding: "9px 13px", background: "rgba(239,68,68,0.05)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#ef4444", letterSpacing: 0.5, textTransform: "uppercase" }}>Rejection Reason: </span>
                  <span style={{ fontSize: 12, color: "#ef4444" }}>{report.rejectionReason}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
