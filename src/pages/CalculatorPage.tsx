import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getEntry, REGISTRY } from "@/data/calculatorRegistry";
import NotFound from "@/pages/NotFound";

export default function CalculatorPage() {
  const { category = "", subcategory = "", slug = "" } = useParams();
  const [Loaded, setLoaded] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prefer exact match by category+slug when available to avoid collisions
  const entry = useMemo(() => {
    const s = String(slug || "").trim().toLowerCase();
    const c = String(category || "").trim().toLowerCase();
    const sub = String(subcategory || "").trim().toLowerCase();
    const byCat = REGISTRY.find(e => e.slug === s && e.category === c && (!sub || e.subcategory === sub));
    return byCat || getEntry(s);
  }, [category, subcategory, slug]);

  useEffect(() => {
    let cancelled = false;
    setLoaded(null);
    setError(null);
    if (!entry) {
      setError("notfound");
      return;
    }
    (async () => {
      try {
        const mod = await entry.loader();
        const Comp = mod?.default || mod;
        if (!cancelled) setLoaded(() => Comp as React.ComponentType);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "loaderror");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [entry]);

  if (!entry || error === "notfound") {
    return <NotFound />;
  }
  if (error) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-2">Unable to load calculator</h1>
        <p className="text-muted-foreground">{String(error)}</p>
      </div>
    );
  }
  if (!Loaded) {
    return (
      <div aria-live="polite" role="status" className="p-4">
        Loading…
      </div>
    );
  }
  return <Loaded />;
}