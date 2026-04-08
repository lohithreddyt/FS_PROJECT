import { useEffect, useMemo, useState } from "react";
import { listingApi, recommendationApi } from "../../api/services.js";
import useHashRoute from "../../hooks/useHashRoute.js";
import { normalizeRecommendation } from "../../utils/recommendations.js";
import Sidebar from "../shared/Sidebar.jsx";
import Toast from "../shared/Toast.jsx";
import RecModal from "../shared/RecModal.jsx";
import UserDashboard from "./UserDashboard.jsx";
import ExploreIdeas from "./ExploreIdeas.jsx";
import SubmitProperty from "./SubmitProperty.jsx";
import MyReports from "./MyReports.jsx";

const emptyForm = userName => ({
  name: userName || "",
  location: "",
  type: "",
  area: "",
  budget: "",
  age: "",
  concerns: "",
  image: null,
  imagePreview: null,
});

function formatListing(listing) {
  return {
    ...listing,
    name: listing.ownerName,
    submitted: new Date(listing.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    recommendations: listing.recommendations || [],
  };
}

function extractError(error) {
  return error?.response?.data?.message || "Something went wrong. Please try again.";
}

export default function UserApp({ currentUser, onLogout }) {
  const [nav, setNav] = useHashRoute("user", "dashboard");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selRec, setSelRec] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState(() => emptyForm(currentUser.name));
  const [reports, setReports] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitErrors, setSubmitErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([listingApi.list(), recommendationApi.list()])
      .then(([listingData, recData]) => {
        if (!active) return;
        setReports(listingData.map(formatListing));
        setRecs(recData.map(normalizeRecommendation));
      })
      .catch(error => {
        if (active) setToast(extractError(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setForm(prev => ({ ...prev, name: currentUser.name }));
  }, [currentUser.name]);

  const showToast = message => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 3200);
  };

  const filteredRecs = useMemo(() => {
    return filter === "All" ? recs : recs.filter(rec => rec.category === filter);
  }, [filter, recs]);

  const openRec = rec => {
    setSelRec(rec);
    setModal("rec");
  };

  const validateProperty = () => {
    const next = {};
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.type.trim()) next.type = "Property type is required.";
    if (!form.area.trim()) next.area = "Built-up area is required.";
    if (!form.budget.trim()) next.budget = "Budget is required.";
    return next;
  };

  const submitProperty = async () => {
    const errors = validateProperty();
    setSubmitErrors(errors);
    if (Object.keys(errors).length) {
      showToast("Please fix the highlighted fields.");
      return;
    }

    try {
      setSubmitting(true);
      const created = await listingApi.create({
        location: form.location,
        type: form.type,
        area: form.area,
        budget: form.budget,
        age: form.age,
        concerns: form.concerns,
        image: form.imagePreview,
      });
      setReports(prev => [formatListing(created), ...prev]);
      setForm(emptyForm(currentUser.name));
      setSubmitErrors({});
      showToast("Property submitted successfully.");
      setNav("myreports");
    } catch (error) {
      showToast(extractError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const navItems = [
    { id: "dashboard", ico: "D", lbl: "Dashboard" },
    { id: "explore", ico: "I", lbl: "Explore Ideas" },
    { id: "submit", ico: "S", lbl: "Submit Property" },
    { id: "myreports", ico: "R", lbl: "My Reports", badge: reports.length || null },
  ];

  const titleMap = {
    dashboard: reports.length === 0 ? `Welcome, ${currentUser.name.split(" ")[0]}!` : "Dashboard",
    explore: "Explore Enhancement Ideas",
    submit: "Submit Your Property",
    myreports: "My Reports",
  };

  return (
    <div className="app-root">
      <Sidebar
        brand="Menu"
        sub="Property Platform"
        navItems={navItems}
        nav={nav}
        onNav={setNav}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <div className="main-wrap">
        <div className="topbar">
          <div className="tb-title">{titleMap[nav] || "BetterHome"}</div>
          <div className="tb-right">
            {(nav === "dashboard" || nav === "explore") && (
              <button className="btn-p" onClick={() => setNav("submit")}>+ Submit Property</button>
            )}
          </div>
        </div>

        <div className="page">
          {loading ? (
            <div className="sc"><div className="sc-title">Loading your workspace...</div></div>
          ) : (
            <>
              {nav === "dashboard" && <UserDashboard currentUser={currentUser} reports={reports} recs={recs} onNav={setNav} openRec={openRec} />}
              {nav === "explore" && <ExploreIdeas filteredRecs={filteredRecs} filter={filter} setFilter={setFilter} openRec={openRec} />}
              {nav === "submit" && <SubmitProperty form={form} setForm={setForm} onSubmit={submitProperty} errors={submitErrors} submitting={submitting} />}
              {nav === "myreports" && <MyReports reports={reports} onNav={setNav} />}
            </>
          )}
        </div>
      </div>

      {modal === "rec" && selRec && (
        <RecModal
          rec={selRec}
          onClose={() => setModal(null)}
          onAdd={() => { showToast("Added to your plan."); setModal(null); }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
