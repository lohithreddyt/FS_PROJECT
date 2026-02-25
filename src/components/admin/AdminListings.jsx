// src/components/admin/AdminListings.jsx

export default function AdminListings({ listings, listingFilter, setListingFilter, onApprove, onDelete }) {
  const STATUSES = ["All", "pending", "active", "review"];

  const filtered = [...listings]
    .reverse()
    .filter(l => listingFilter === "All" || l.status === listingFilter);

  return (
    <div className="sc">
      <div className="sc-head">
        <div>
          <div className="sc-title">All Property Submissions</div>
          <div className="sc-desc">{listings.length} listings</div>
        </div>
        <input className="finput" placeholder="Search..." style={{ width: 190, fontSize: 13 }} />
      </div>

      {/* Status filter tabs */}
      <div className="ftabs" style={{ marginBottom: 18 }}>
        {STATUSES.map(s => {
          const count = s === "All" ? listings.length : listings.filter(l => l.status === s).length;
          return (
            <button
              key={s}
              className={`ftab ${listingFilter === s ? "active" : ""}`}
              onClick={() => setListingFilter(s)}
            >
              {s === "All" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              <span style={{ fontWeight: 400, opacity: 0.75 }}> ({count})</span>
            </button>
          );
        })}
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>ID</th><th>Owner</th><th>Location</th><th>Type</th>
            <th>Area</th><th>Budget</th><th>Status</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(l => (
            <tr key={l.id}>
              <td><span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted)" }}>{l.id}</span></td>
              <td><strong>{l.name}</strong></td>
              <td style={{ fontSize: 12 }}>{l.location}</td>
              <td><span className="chip">{l.type}</span></td>
              <td style={{ fontSize: 12 }}>{l.area}</td>
              <td style={{ fontSize: 12 }}>{l.budget}</td>
              <td><span className={`sp sp-${l.status}`}>{l.status}</span></td>
              <td style={{ fontSize: 11, color: "var(--muted)" }}>{l.submitted}</td>
              <td>
                <div style={{ display: "flex", gap: 5 }}>
                  {l.status === "pending" && (
                    <button
                      style={{
                        background: "rgba(22,163,74,0.1)", color: "var(--success)",
                        border: "1px solid rgba(22,163,74,0.25)", padding: "5px 9px",
                        borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s",
                      }}
                      onClick={() => onApprove(l.id)}
                    >
                      ✓ Approve
                    </button>
                  )}
                  <button className="btn-d" onClick={() => onDelete(l.id)}>✕</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", fontSize: 13 }}>
          No listings found for this status.
        </div>
      )}
    </div>
  );
}
