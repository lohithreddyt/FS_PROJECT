// src/components/admin/AdminApp.jsx
import { useState } from "react";
import { RECS } from "../../data/db.js";
import { DB, deleteListing, approveListing, rejectListing } from "../../data/storage.js";
import Sidebar from "../shared/Sidebar.jsx";
import Toast from "../shared/Toast.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminRecommendations from "./AdminRecommendations.jsx";
import AdminListings from "./AdminListings.jsx";
import AdminAnalytics from "./AdminAnalytics.jsx";
import AddRecModal from "./AddRecModal.jsx";

export default function AdminApp({ currentUser, onLogout }) {
  const [nav,           setNav]           = useState("dashboard");
  const [filter,        setFilter]        = useState("All");
  const [listingFilter, setListingFilter] = useState("All");
  const [modal,         setModal]         = useState(null);
  const [toast,         setToast]         = useState(null);
  const [recs,          setRecs]          = useState([...RECS]);
  const [listings,      setListings]      = useState(() => DB.listings);
  const [newRec,        setNewRec]        = useState({ title: "", category: "Interior", cost: "", roi: "", desc: "" });
  const [rejectTarget,  setRejectTarget]  = useState(null);
  const [rejectReason,  setRejectReason]  = useState("");
  const showToast = m => { setToast(m); setTimeout(() => setToast(null), 3200); };

  // Re-read listings from localStorage (picks up user submissions)
  const refreshListings = () => setListings(DB.listings);

  const filteredRecs = filter === "All" ? recs : recs.filter(r => r.category === filter);

  const handleDeleteRec = id => {
    setRecs(p => p.filter(r => r.id !== id));
    showToast("🗑 Recommendation removed.");
  };

  const handleDeleteListing = id => {
    deleteListing(id);           // persists to localStorage + removes from user reports
    setListings(DB.listings);    // refresh local state from storage
    showToast("🗑 Listing removed.");
  };

  const handleApproveListing = id => {
    approveListing(id);          // persists status change to localStorage + user reports
    setListings(DB.listings);    // refresh local state from storage
    showToast("✅ Listing approved and set to Active.");
  };

  const handleRejectPrompt = id => {
    setRejectTarget(id);
    setRejectReason("");
    setModal("rejectListing");
  };

  const submitRejectListing = () => {
    if (!rejectReason.trim()) { showToast("⚠ Please provide a reason for rejection."); return; }
    rejectListing(rejectTarget, rejectReason);
    setListings(DB.listings);
    setModal(null);
    setRejectTarget(null);
    setRejectReason("");
    showToast("❌ Listing rejected.");
  };

  const addRec = () => {
    if (!newRec.title || !newRec.desc) { showToast("⚠ Title and description required."); return; }
    setRecs(p => [...p, {
      id: Date.now(), ...newRec,
      color: "#F5F0FF", catColor: "#7C3AED", emoji: "✨",
      tags: [newRec.category], rating: 4.5,
    }]);
    showToast("✅ Recommendation published!");
    setModal(null);
    setNewRec({ title: "", category: "Interior", cost: "", roi: "", desc: "" });
  };

  const navItems = [
    { id: "dashboard",       ico: "⊞", lbl: "Dashboard" },
    { id: "recommendations", ico: "✦", lbl: "Recommendations" },
    { id: "listings",        ico: "🏘", lbl: "Property Listings", badge: DB.listings.filter(l => l.status === "pending").length || null },
    { id: "analytics",       ico: "📈", lbl: "Analytics" },
  ];

  const titleMap = {
    dashboard:       "Admin Dashboard",
    recommendations: "Manage Recommendations",
    listings:        "Property Listings",
    analytics:       "Analytics",
  };

  return (
    <div className="app-root">
      <Sidebar
        brand="Administration"
        sub="Admin Console"
        navItems={navItems}
        nav={nav}
        onNav={id => { if (id === "listings") refreshListings(); setNav(id); }}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <div className="main-wrap">
        <div className="topbar">
          <div className="tb-title">{titleMap[nav]}</div>
          <div className="tb-right">
            {nav === "recommendations" && (
              <button className="btn-p" onClick={() => setModal("addRec")}>+ Add Recommendation</button>
            )}
          </div>
        </div>

        <div className="page">
          {nav === "dashboard" && <AdminDashboard recs={recs} listings={listings} />}

          {nav === "recommendations" && (
            <AdminRecommendations
              recs={recs}
              filteredRecs={filteredRecs}
              filter={filter}
              setFilter={setFilter}
              onDelete={handleDeleteRec}
              showToast={showToast}
            />
          )}

          {nav === "listings" && (
            <AdminListings
              listings={listings}
              listingFilter={listingFilter}
              setListingFilter={setListingFilter}
              onApprove={handleApproveListing}
              onReject={handleRejectPrompt}
              onDelete={handleDeleteListing}
            />
          )}

          {nav === "analytics" && <AdminAnalytics />}
        </div>
      </div>

      {modal === "addRec" && (
        <AddRecModal
          newRec={newRec}
          setNewRec={setNewRec}
          onAdd={addRec}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "rejectListing" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" style={{ padding: "24px", width: "400px", maxWidth: "90%" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Reject Listing</h2>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>Please provide a reason for rejecting this property.</p>
            <textarea 
              className="finput" 
              style={{ width: "100%", height: "80px", marginBottom: "16px", resize: "none" }} 
              placeholder="e.g. Incomplete details..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn-s" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-p" style={{ backgroundColor: "#ef4444" }} onClick={submitRejectListing}>Reject</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
