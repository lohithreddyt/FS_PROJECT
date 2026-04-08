import { useEffect, useMemo, useState } from "react";
import { analyticsApi, listingApi, recommendationApi } from "../../api/services.js";
import useHashRoute from "../../hooks/useHashRoute.js";
import { normalizeRecommendation } from "../../utils/recommendations.js";
import Sidebar from "../shared/Sidebar.jsx";
import Toast from "../shared/Toast.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminRecommendations from "./AdminRecommendations.jsx";
import AdminListings from "./AdminListings.jsx";
import AdminAnalytics from "./AdminAnalytics.jsx";
import AddRecModal from "./AddRecModal.jsx";

function formatListing(listing) {
  return {
    ...listing,
    name: listing.ownerName,
    submitted: new Date(listing.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  };
}

function extractError(error) {
  return error?.response?.data?.message || "Something went wrong. Please try again.";
}

export default function AdminApp({ currentUser, onLogout }) {
  const [nav, setNav] = useHashRoute("admin", "dashboard");
  const [filter, setFilter] = useState("All");
  const [listingFilter, setListingFilter] = useState("All");
  const [listingSearch, setListingSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [recs, setRecs] = useState([]);
  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingRec, setSavingRec] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [newRec, setNewRec] = useState({ title: "", category: "Interior", cost: "", roi: "", desc: "" });

  const showToast = message => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 3200);
  };

  const loadAll = async () => {
    const [recData, listingData, analyticsData] = await Promise.all([
      recommendationApi.list(),
      listingApi.list(),
      analyticsApi.get(),
    ]);
    setRecs(recData.map(normalizeRecommendation));
    setListings(listingData.map(formatListing));
    setAnalytics(analyticsData);
  };

  useEffect(() => {
    let active = true;
    loadAll()
      .catch(error => active && showToast(extractError(error)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filteredRecs = useMemo(() => {
    return filter === "All" ? recs : recs.filter(rec => rec.category === filter);
  }, [filter, recs]);

  const refreshAnalytics = async () => {
    const [listingData, analyticsData] = await Promise.all([listingApi.list(), analyticsApi.get()]);
    setListings(listingData.map(formatListing));
    setAnalytics(analyticsData);
  };

  const handleDeleteRec = async id => {
    try {
      setDeletingId(id);
      await recommendationApi.remove(id);
      setRecs(prev => prev.filter(rec => rec.id !== id));
      showToast("Recommendation removed.");
      setDeletingId(null);
      const analyticsData = await analyticsApi.get();
      setAnalytics(analyticsData);
    } catch (error) {
      setDeletingId(null);
      showToast(extractError(error));
    }
  };

  const handleDeleteListing = async id => {
    try {
      await listingApi.remove(id);
      await refreshAnalytics();
      showToast("Listing removed.");
    } catch (error) {
      showToast(extractError(error));
    }
  };

  const handleApproveListing = async id => {
    try {
      await listingApi.updateStatus(id, { status: "active" });
      await refreshAnalytics();
      showToast("Listing approved and set to Active.");
    } catch (error) {
      showToast(extractError(error));
    }
  };

  const handleRejectPrompt = id => {
    setRejectTarget(id);
    setRejectReason("");
    setModal("rejectListing");
  };

  const submitRejectListing = async () => {
    if (!rejectReason.trim()) {
      showToast("Please provide a reason for rejection.");
      return;
    }

    try {
      await listingApi.updateStatus(rejectTarget, { status: "rejected", rejectionReason: rejectReason });
      await refreshAnalytics();
      setModal(null);
      setRejectTarget(null);
      setRejectReason("");
      showToast("Listing rejected.");
    } catch (error) {
      showToast(extractError(error));
    }
  };

  const addRec = async () => {
    if (!newRec.title || !newRec.desc || !newRec.cost || !newRec.roi) {
      showToast("Title, description, cost, and ROI are required.");
      return;
    }

    try {
      setSavingRec(true);
      const created = await recommendationApi.create({
        title: newRec.title,
        category: newRec.category,
        description: newRec.desc,
        cost: newRec.cost,
        roi: newRec.roi,
        actionText: "New admin recommendation",
      });
      setRecs(prev => [...prev, normalizeRecommendation(created)]);
      setModal(null);
      setNewRec({ title: "", category: "Interior", cost: "", roi: "", desc: "" });
      showToast("Recommendation published.");
      const analyticsData = await analyticsApi.get();
      setAnalytics(analyticsData);
    } catch (error) {
      showToast(extractError(error));
    } finally {
      setSavingRec(false);
    }
  };

  const navItems = [
    { id: "dashboard", ico: "D", lbl: "Dashboard" },
    { id: "recommendations", ico: "R", lbl: "Recommendations" },
    { id: "listings", ico: "L", lbl: "Property Listings", badge: listings.filter(listing => listing.status === "pending").length || null },
    { id: "analytics", ico: "A", lbl: "Analytics" },
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
        onNav={setNav}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <div className="main-wrap">
        <div className="topbar">
          <div className="tb-title">{titleMap[nav] || "Admin Console"}</div>
          <div className="tb-right">
            {nav === "recommendations" && <button className="btn-p" onClick={() => setModal("addRec")}>+ Add Recommendation</button>}
          </div>
        </div>

        <div className="page">
          {loading ? (
            <div className="sc"><div className="sc-title">Loading admin workspace...</div></div>
          ) : (
            <>
              {nav === "dashboard" && <AdminDashboard recs={recs} listings={listings} />}
              {nav === "recommendations" && (
                <AdminRecommendations
                  filteredRecs={filteredRecs}
                  filter={filter}
                  setFilter={setFilter}
                  onDelete={handleDeleteRec}
                  showToast={showToast}
                  deletingId={deletingId}
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
              {nav === "analytics" && <AdminAnalytics analytics={analytics} />}
            </>
          )}
        </div>
      </div>

      {modal === "addRec" && (
        <AddRecModal newRec={newRec} setNewRec={setNewRec} onAdd={addRec} onClose={() => setModal(null)} saving={savingRec} />
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
