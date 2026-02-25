// src/data/db.js
// Static recommendation catalogue (never changes, no need to persist)
export const RECS = [
  { id: 1, category: "Interior",   color: "#FFF3EC", catColor: "#E8541A", emoji: "🎨", title: "Modular Kitchen Upgrade",    desc: "Sleek modular units that improve functionality and aesthetic appeal significantly.",        roi: "+18% ROI", cost: "₹80K–1.5L", tags: ["Kitchen","High Impact"],  rating: 4.8 },
  { id: 2, category: "Exterior",   color: "#F0FBF0", catColor: "#16A34A", emoji: "🏡", title: "Facade & Landscaping",        desc: "Fresh exterior paint with a manicured entrance garden creates powerful first impressions.", roi: "+12% ROI", cost: "₹30K–60K",  tags: ["Curb Appeal","Low Cost"], rating: 4.6 },
  { id: 3, category: "Smart Home", color: "#EFF4FF", catColor: "#1D4ED8", emoji: "💡", title: "Smart Lighting & Automation", desc: "Smart switches, LED lighting, and voice-controlled devices for tech-savvy buyers.",        roi: "+9% ROI",  cost: "₹25K–50K",  tags: ["Smart","Energy"],         rating: 4.5 },
  { id: 4, category: "Vastu",      color: "#FFF8E6", catColor: "#C59B0A", emoji: "🕉️",title: "Vastu-Compliant Redesign",    desc: "Realign key spaces per Vastu Shastra — a major trust signal for Indian buyers.",          roi: "+15% ROI", cost: "₹20K–40K",  tags: ["Vastu","High Demand"],    rating: 4.9 },
  { id: 5, category: "Bathroom",   color: "#F0FAFA", catColor: "#0A6E6E", emoji: "🚿", title: "Bathroom Renovation",         desc: "Modern tiles, concealed plumbing, and quality fixtures elevate property perception.",      roi: "+14% ROI", cost: "₹60K–1.2L", tags: ["Bathroom","Premium"],     rating: 4.7 },
  { id: 6, category: "Energy",     color: "#F5F0FF", catColor: "#7C3AED", emoji: "☀️", title: "Solar Panel Installation",    desc: "Reduce electricity bills by 70% — a top selling point for middle-class families.",        roi: "+11% ROI", cost: "₹1.5L–3L",  tags: ["Solar","Eco"],            rating: 4.4 },
];
