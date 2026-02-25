// src/components/user/UserApp.jsx
import { useState } from "react";
import { RECS } from "../../data/db.js";
import { addListing } from "../../data/storage.js";
import Sidebar from "../shared/Sidebar.jsx";
import Toast from "../shared/Toast.jsx";
import RecModal from "../shared/RecModal.jsx";
import UserDashboard from "./UserDashboard.jsx";
import ExploreIdeas from "./ExploreIdeas.jsx";
import SubmitProperty from "./SubmitProperty.jsx";
import MyReports from "./MyReports.jsx";

export default function UserApp({ currentUser, onLogout, updateUser }) {
  const [nav,    setNav]    = useState("dashboard");
  const [filter, setFilter] = useState("All");
  const [modal,  setModal]  = useState(null);
  const [selRec, setSelRec] = useState(null);
  const [toast,  setToast]  = useState(null);
  const [form,   setForm]   = useState({
    name: "", location: "", type: "", area: "",
    budget: "", age: "", concerns: "", image: null, imagePreview: null,
  });

  const showToast = m => { setToast(m); setTimeout(() => setToast(null), 3200); };
  const filteredRecs = filter === "All" ? RECS : RECS.filter(r => r.category === filter);
  const openRec = rec => { setSelRec(rec); setModal("rec"); };
  const isNew = currentUser.reports.length === 0;

  const submitProperty = () => {
    if (!form.name || !form.location || !form.type || !form.area || !form.budget) {
      showToast("⚠ Please fill all required fields."); return;
    }
    const report = {
      id: "P" + String(Date.now()).slice(-5),
      name: form.name,
      location: form.location,
      type: form.type,
      area: form.area + " sqft",
      budget: form.budget,
      age: form.age,
      concerns: form.concerns,
      image: form.imagePreview || null,
      score: Math.floor(42 + Math.random() * 48),
      status: "pending",
      submitted: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      recommendations: RECS.slice(0, 3).map(r => r.title),
    };

    // Persist listing to localStorage (visible in admin panel)
    addListing({ ...report, name: currentUser.name });

    // Update user's reports and persist via updateUser → updateUserRecord
    updateUser({ ...currentUser, reports: [...currentUser.reports, report] });

    setForm({ name: "", location: "", type: "", area: "", budget: "", age: "", concerns: "", image: null, imagePreview: null });
    showToast("✅ Property submitted! View your report in My Reports.");
    setNav("myreports");
  };

  const navItems = [
    { id: "dashboard", ico: "⊞", lbl: "Dashboard" },
    { id: "explore",   ico: "✦", lbl: "Explore Ideas" },
    { id: "submit",    ico: "📝", lbl: "Submit Property" },
    { id: "myreports", ico: "📋", lbl: "My Reports", badge: currentUser.reports.length || null },
  ];

  const titleMap = {
    dashboard: isNew ? `Welcome, ${currentUser.name.split(" ")[0]}! 👋` : "Dashboard",
    explore:   "Explore Enhancement Ideas",
    submit:    "Submit Your Property",
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
          <div className="tb-title">{titleMap[nav]}</div>
          <div className="tb-right">
            {(nav === "dashboard" || nav === "explore") && (
              <button className="btn-p" onClick={() => setNav("submit")}>+ Submit Property</button>
            )}
          </div>
        </div>

        <div className="page">
          {nav === "dashboard" && <UserDashboard currentUser={currentUser} onNav={setNav} openRec={openRec} />}
          {nav === "explore"   && <ExploreIdeas filteredRecs={filteredRecs} filter={filter} setFilter={setFilter} openRec={openRec} />}
          {nav === "submit"    && <SubmitProperty form={form} setForm={setForm} onSubmit={submitProperty} />}
          {nav === "myreports" && <MyReports reports={currentUser.reports} onNav={setNav} />}
        </div>
      </div>

      {modal === "rec" && selRec && (
        <RecModal
          rec={selRec}
          onClose={() => setModal(null)}
          onAdd={() => { showToast("✅ Added to your plan!"); setModal(null); }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
