export default function AdminListings({ listings, listingFilter, setListingFilter, searchTerm, setSearchTerm, onApprove, onReject, onDelete }) {
  const statuses = ["All", "pending", "active", "review", "rejected"];
  const filtered = listings.filter(listing => {
    const matchesStatus = listingFilter === "All" || listing.status === listingFilter;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || `${listing.name} ${listing.location} ${listing.type} ${listing.id}`.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="sc">
      <div className="sc-head">
        <div>
          <div className="sc-title">All Property Submissions</div>
          <div className="sc-desc">{listings.length} listings</div>
        </div>
        <input className="finput" placeholder="Search by owner, city, or id" style={{ width: 220, fontSize: 13 }} value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
      </div>

      <div className="ftabs" style={{ marginBottom: 18 }}>
        {statuses.map(status => {
          const count = status === "All" ? listings.length : listings.filter(listing => listing.status === status).length;
          return (
            <button key={status} className={`ftab ${listingFilter === status ? "active" : ""}`} onClick={() => setListingFilter(status)}>
              {status === "All" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              <span style={{ fontWeight: 400, opacity: 0.75 }}> ({count})</span>
            </button>
          );
        })}
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>ID</th><th>Owner</th><th>Location</th><th>Type</th><th>Area</th><th>Budget</th><th>Status</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(listing => (
            <tr key={listing.id}>
              <td><span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted)" }}>{listing.id}</span></td>
              <td><strong>{listing.name}</strong></td>
              <td style={{ fontSize: 12 }}>{listing.location}</td>
              <td><span className="chip">{listing.type}</span></td>
              <td style={{ fontSize: 12 }}>{listing.area}</td>
              <td style={{ fontSize: 12 }}>{listing.budget}</td>
              <td><span className={`sp sp-${listing.status}`}>{listing.status}</span></td>
              <td style={{ fontSize: 11, color: "var(--muted)" }}>{listing.submitted}</td>
              <td>
                <div style={{ display: "flex", gap: 5 }}>
                  {listing.status === "pending" && (
                    <>
                      <button style={{ background: "rgba(22,163,74,0.1)", color: "var(--success)", border: "1px solid rgba(22,163,74,0.25)", padding: "5px 9px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer" }} onClick={() => onApprove(listing.id)}>Approve</button>
                      <button style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", padding: "5px 9px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer" }} onClick={() => onReject(listing.id)}>Reject</button>
                    </>
                  )}
                  <button className="btn-d" onClick={() => onDelete(listing.id)}>X</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", fontSize: 13 }}>No listings found for this filter.</div>}
    </div>
  );
}
