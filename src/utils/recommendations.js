const CATEGORY_THEME = {
  Interior: { color: "#FFF3EC", catColor: "#E8541A", emoji: "Kitchen", tags: ["Interior", "High Impact"], rating: 4.8 },
  Exterior: { color: "#F0FBF0", catColor: "#16A34A", emoji: "Home", tags: ["Exterior", "Curb Appeal"], rating: 4.6 },
  "Smart Home": { color: "#EFF4FF", catColor: "#1D4ED8", emoji: "Light", tags: ["Smart", "Energy"], rating: 4.5 },
  Vastu: { color: "#FFF8E6", catColor: "#C59B0A", emoji: "Compass", tags: ["Vastu", "Trust"], rating: 4.9 },
  Bathroom: { color: "#F0FAFA", catColor: "#0A6E6E", emoji: "Drop", tags: ["Bathroom", "Premium"], rating: 4.7 },
  Energy: { color: "#F5F0FF", catColor: "#7C3AED", emoji: "Sun", tags: ["Energy", "Eco"], rating: 4.4 },
};

function iconFor(name) {
  const map = {
    Kitchen: "K",
    Home: "H",
    Light: "L",
    Compass: "V",
    Drop: "B",
    Sun: "E",
  };
  return map[name] || "R";
}

export function normalizeRecommendation(rec) {
  const theme = CATEGORY_THEME[rec.category] || CATEGORY_THEME.Interior;
  return {
    id: rec.id,
    category: rec.category,
    title: rec.title,
    desc: rec.description,
    roi: rec.roi,
    cost: rec.cost,
    actionText: rec.actionText,
    color: theme.color,
    catColor: theme.catColor,
    emoji: iconFor(theme.emoji),
    tags: theme.tags,
    rating: theme.rating,
  };
}

export const recommendationFilters = ["All", ...Object.keys(CATEGORY_THEME)];
