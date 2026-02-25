# BetterHome 🏠

> India's Property Enhancement Platform — helping homeowners boost property value with curated upgrades, Vastu insights, and ROI-backed recommendations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
betterhome/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx                          # React entry point
    ├── App.jsx                           # Root: routes between Auth / User / Admin
    ├── styles/
    │   └── global.css                    # Global CSS styles
    ├── data/
    │   ├── db.js                         # Static RECS catalogue
    │   └── storage.js                    # localStorage persistence layer
    └── components/
        ├── auth/
        │   └── AuthPage.jsx              # Login & Register page
        ├── shared/
        │   ├── Sidebar.jsx               # Reused sidebar (User & Admin)
        │   ├── Toast.jsx                 # Toast notifications
        │   └── RecModal.jsx              # Recommendation detail modal
        ├── user/
        │   ├── UserApp.jsx               # User layout & state management
        │   ├── UserDashboard.jsx         # New/returning user dashboard
        │   ├── ExploreIdeas.jsx          # Browse recommendations
        │   ├── SubmitProperty.jsx        # Property submission form
        │   └── MyReports.jsx             # User's submitted reports
        └── admin/
            ├── AdminApp.jsx              # Admin layout & state management
            ├── AdminDashboard.jsx        # Stats & recent submissions
            ├── AdminRecommendations.jsx  # Manage recommendations
            ├── AdminListings.jsx         # Property listings with filters
            ├── AdminAnalytics.jsx        # Analytics & charts
            └── AddRecModal.jsx           # Add recommendation modal
```

---

## 🔐 Demo Credentials

| Role      | Email                     | Password   |
|-----------|---------------------------|------------|
| Homeowner | user@betterhome.in        | user123    |
| Admin     | admin@betterhome.in       | admin123   |

> **Note:** Admin accounts must use a `@betterhome.in` email address.

---

## ✨ Features

### User
- Register / Login with persistent accounts (saved in `localStorage`)
- Submit property details for enhancement analysis
- View submitted reports with status tracking
- Browse curated improvement ideas by category
- Session persists across page reloads

### Admin
- View all property submissions with status filter tabs (All / Pending / Active / Review)
- Approve pending listings → moves to Active (syncs to user reports)
- Delete listings (also removes from user's My Reports)
- Manage enhancement recommendations (add / delete)
- Analytics dashboard with category and geographic distribution

---

## 🛠 Tech Stack

- **React 18** — UI library
- **Vite** — Build tool & dev server
- **localStorage** — Client-side data persistence (no backend required)
- **CSS Custom Properties** — Design tokens & theming

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.
