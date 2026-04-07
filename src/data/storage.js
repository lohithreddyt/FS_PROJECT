// src/data/storage.js
// ── Keys ─────────────────────────────────────────────────────────────────────
const KEYS = {
  users:    "bh_users",
  admins:   "bh_admins",
  listings: "bh_listings",
  session:  "bh_session",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

// ── Seed data (only used if localStorage is empty) ────────────────────────────
const SEED_USERS = [
  { email: "user@betterhome.in", password: "user123", name: "Demo User", role: "user", reports: [] },
];

const SEED_ADMINS = [
  { email: "admin@betterhome.in", password: "admin123", name: "Admin Verma", role: "admin" },
];

const SEED_LISTINGS = [
  { id: "P001", name: "Ravi Kumar",   location: "Pune, Maharashtra",  type: "2BHK", area: "950 sqft",  score: 72, status: "active",  submitted: "Feb 20, 2026", budget: "₹75,000",  concerns: "Better resale value", image: null },
  { id: "P002", name: "Anita Sharma", location: "Lucknow, UP",        type: "3BHK", area: "1200 sqft", score: 58, status: "pending", submitted: "Feb 22, 2026", budget: "₹40,000",  concerns: "Damp walls",          image: null },
  { id: "P003", name: "Vikram Nair",  location: "Coimbatore, TN",     type: "2BHK", area: "890 sqft",  score: 85, status: "active",  submitted: "Feb 18, 2026", budget: "₹2 Lakhs", concerns: "Full renovation",      image: null },
  { id: "P004", name: "Priya Mehta",  location: "Jaipur, Rajasthan",  type: "1BHK", area: "650 sqft",  score: 41, status: "review",  submitted: "Feb 24, 2026", budget: "₹20,000",  concerns: "Paint and tiles",     image: null },
];

// ── DB object (initialised from localStorage, falls back to seed) ─────────────
export const DB = {
  get users()    { return load(KEYS.users,    SEED_USERS);    },
  get admins()   { return load(KEYS.admins,   SEED_ADMINS);   },
  get listings() { return load(KEYS.listings, SEED_LISTINGS); },
};

// ── Write helpers ─────────────────────────────────────────────────────────────

/** Persist the whole users array */
export const saveUsers = (arr) => save(KEYS.users, arr);

/** Persist the whole admins array */
export const saveAdmins = (arr) => save(KEYS.admins, arr);

/** Persist the whole listings array */
export const saveListings = (arr) => save(KEYS.listings, arr);

/** Add a new user account and persist */
export const registerUser = (newUser) => {
  const users = DB.users;
  users.push(newUser);
  saveUsers(users);
};

/** Add a new admin account and persist */
export const registerAdmin = (newAdmin) => {
  const admins = DB.admins;
  admins.push(newAdmin);
  saveAdmins(admins);
};

/** Update a single user's record (matched by email) and persist */
export const updateUserRecord = (updatedUser) => {
  const users = DB.users;
  const idx = users.findIndex(u => u.email === updatedUser.email);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveUsers(users);
  }
};

/** Add a listing and persist */
export const addListing = (listing) => {
  const listings = DB.listings;
  listings.push(listing);
  saveListings(listings);
};

/** Delete a listing by id, also remove from matching user reports, then persist */
export const deleteListing = (id) => {
  const listings = DB.listings.filter(l => l.id !== id);
  saveListings(listings);

  // Remove from user reports too
  const users = DB.users.map(u => ({
    ...u,
    reports: u.reports ? u.reports.filter(r => r.id !== id) : [],
  }));
  saveUsers(users);
};

/** Approve a listing (pending → active) and sync to user reports */
export const approveListing = (id) => {
  const listings = DB.listings.map(l => l.id === id ? { ...l, status: "active" } : l);
  saveListings(listings);

  // Also update status in user reports
  const users = DB.users.map(u => ({
    ...u,
    reports: u.reports
      ? u.reports.map(r => r.id === id ? { ...r, status: "active" } : r)
      : [],
  }));
  saveUsers(users);
};

/** Reject a listing (pending → rejected) and sync to user reports */
export const rejectListing = (id, reason) => {
  const listings = DB.listings.map(l => l.id === id ? { ...l, status: "rejected", rejectionReason: reason } : l);
  saveListings(listings);

  // Also update status and add reason in user reports
  const users = DB.users.map(u => ({
    ...u,
    reports: u.reports
      ? u.reports.map(r => r.id === id ? { ...r, status: "rejected", rejectionReason: reason } : r)
      : [],
  }));
  saveUsers(users);
};

// ── Session helpers ───────────────────────────────────────────────────────────

/** Save logged-in user's email + role to session so page reload auto-logs in */
export const saveSession = (user) => {
  save(KEYS.session, { email: user.email, role: user.role });
};

/** Load session – returns { email, role } or null */
export const loadSession = () => load(KEYS.session, null);

/** Clear session on logout */
export const clearSession = () => {
  try { localStorage.removeItem(KEYS.session); } catch {}
};
