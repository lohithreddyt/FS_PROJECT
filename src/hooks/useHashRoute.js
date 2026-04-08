import { useEffect, useMemo, useState } from "react";

function readHash(role, fallback) {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [hashRole, tab] = raw.split("/");
  if (hashRole !== role || !tab) return fallback;
  return tab;
}

export default function useHashRoute(role, fallback) {
  const [route, setRoute] = useState(() => readHash(role, fallback));

  useEffect(() => {
    const sync = () => setRoute(readHash(role, fallback));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [role, fallback]);

  const navigate = useMemo(
    () => next => {
      const hash = `#/${role}/${next}`;
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      } else {
        setRoute(next);
      }
    },
    [role]
  );

  return [route, navigate];
}
