import { useState, useEffect } from "react";
import { RECS } from "../../data/db.js";
import { deleteListing, approveListing, rejectListing } from "../../data/storage.js";
import { listingApi } from "../../api/services.js";
import Sidebar from "../shared/Sidebar.jsx";
import Toast from "../shared/Toast.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminRecommendations from "./AdminRecommendations.jsx";
import AdminListings from "./AdminListings.jsx";
import AdminAnalytics from "./AdminAnalytics.jsx";
import AddRecModal from "./AddRecModal.jsx";

export default function AdminApp({ currentUser, onLogout }) {
  const [nav, setNav] = useState("dashboard");
  const [filter, setFilter] = useState("All");
  const [listingFilter, setListingFilter] = useState("All");
  const [listingSearch, setListingSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [recs, setRecs] = useState([...RECS]);
  const [listings, setListings] = useState([]);
  const [newRec, setNewRec] = useState({ title: "", category: "Interior", cost: "", roi: "", desc: "" });
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadListings();

    const handleFocus = () => loadListings();
    const handleStorage = event => {
      if (event.key === "bh_listings" || event.key === "bh_users") {
        loadListings();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const loadListings = async () => {
    try {
      const data = await listingApi.list();
      const transformed = data.map(listing => ({
        id: listing.id,
        name: listing.ownerName,
        location: listing.location,
        type: listing.type,
        area: listing.area,
        budget: listing.budget,
        age: listing.age,
        concerns: listing.concerns,
        image: listing.image,
        score: listing.score,
        status: listing.status,
        submitted: new Date(listing.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        rejectionReason: listing.rejectionReason,
        recommendations: listing.recommendations,
        ownerEmail: listing.ownerEmail,
      }));
      setListings(transformed);
    } catch (error) {
      console.error("Failed to load listings:", error);
      showToast("❌ Failed to load listings.");
    }
  };

  const showToast = m => {
    setToast(m);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 3200);
  };

  const refreshListings = () => loadListings();

  const filteredRecs = filter === "All" ? recs : recs.filter(r => r.category === filter);

  const handleDeleteRec = id => {
    setRecs(p => p.filter(r => r.id !== id));
    showToast("🗑 Recommendation removed.");
  };

  const handleDeleteListing = async (id) => {
    try {
      await listingApi.remove(id);
      await loadListings();
      showToast("🗑 Listing removed.");
    } catch (error) {
      console.error("Failed to delete listing:", error);
      showToast("❌ Failed to delete listing.");
    }
  };

  const handleApproveListing = async (id) => {
    try {
      await listingApi.updateStatus(id, { status: "active" });
      await loadListings();
      showToast("✅ Listing approved and set to Active.");
    } catch (error) {
      console.error("Failed to approve listing:", error);
      showToast("❌ Failed to approve listing.");
    }
  };

  const handleRejectPrompt = id => {
    setRejectTarget(id);
    setRejectReason("");
    setModal("rejectListing");
  };

  const submitRejectListing = async () => {
    if (!rejectReason.trim()) {
      showToast("⚠ Please provide a reason for rejection.");
      return;
    }

    try {
      await listingApi.updateStatus(rejectTarget, { status: "rejected", rejectionReason: rejectReason });
      await loadListings();
      setModal(null);
      setRejectTarget(null);
      showToast("Listing rejected.");
    } catch (error) {
      console.error("Failed to reject listing:", error);
      showToast("❌ Failed to reject listing.");
    }
  };

  const addRec = () => {
    if (!newRec.title || !newRec.desc) {
      showToast("⚠ Title and description required.");
      return;
    }
    setRecs(p => [...p, {
      id: Date.now(),
      ...newRec,
      color: "#F5F0FF",
      catColor: "#7C3AED",
      emoji: "✨",
      tags: [newRec.category],
      rating: 4.5,
    }] );
    showToast("✅ Recommendation published!");
    setModal(null);
    setNewRec({ title: "", category: "Interior", cost: "", roi: "", desc: "" });
  };

  const navItems = [
    { id: "dashboard", ico: "⊞", lbl: "Dashboard" },
    { id: "recommendations", ico: "✦", lbl: "Recommendations" },
    { id: "listings", ico: "🏘", lbl: "Property Listings", badge: listings.filter(l => l.status === "pending").length || null },
    { id: "analytics", ico: "📈", lbl: "Analytics" },
  ];

  const titleMap = {
    dashboard: "Admin Dashboard",
    recommendations: "Manage Recommendations",
    listings: "Property Listings",
    analytics: "Analytics",
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
              searchTerm={listingSearch}
              setSearchTerm={setListingSearch}
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
          <div className="modal-content" style={{ padding: "24px", width: "400px", maxWidth: "90%" }} onClick={event => event.stopPropagation()}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Reject Listing</h2>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>Please provide a reason for rejecting this property.</p>
            <textarea className="finput" style={{ width: "100%", height: "80px", marginBottom: "16px", resize: "none" }} placeholder="e.g. Incomplete details..." value={rejectReason} onChange={event => setRejectReason(event.target.value)} />
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
