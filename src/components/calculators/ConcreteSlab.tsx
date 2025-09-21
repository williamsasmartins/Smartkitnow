import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function ConcreteSlab() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [length, setLength] = useState<string>("20"); // ft or m
  const [width, setWidth] = useState<string>("12");   // ft or m
  const [thickness, setThickness] = useState<string>("4"); // in or cm

  // --- SEO (sem Helmet): atualiza title/meta e injeta JSON-LD ---
  useEffect(() => {
    const title = "Concrete Slab Calculator — Volume & Bags";
    const desc =
      "Free online concrete slab calculator. Enter length, width, and thickness to estimate slab volume (yd³ / m³) and required number of 40, 60, or 80 lb premix bags.";

    // <title>
    document.title = title;

    // <meta name="description">
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    // JSON-LD
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      url: "https://smartkitnow.com/construction/calculator/concrete-slab",
      applicationCategory: "Construction Calculator",
      operatingSystem: "All",
      description: desc,
      creator: { "@type": "Organization", name: "Smart Kit Now" },
    };

    // remove anterior (se houver) e injeta um novo
    const id = "jsonld-concrete-slab";
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // limpeza opcional ao desmontar
    return () => {
      const s = document.getElementById(id);
      if (s) s.remove();
    };
  }, []);

  const calc = useMemo(() => {
    const L = Math.max(0, parseFloat(length) || 0);
    const W = Math.max(0, parseFloat(width) || 0);
    const T = Math.max(0, parseFloat(thickness) || 0);

    let vol_ft3 = 0, vol_m3 = 0;

    if (unit === "imperial") {
      const T_ft = T / 12;         // in -> ft
      vol_ft3 = L * W * T_ft;
      vol_m3 = vol_ft3 * 0.0283168466;
    } else {
      const T_m = T / 100;         // cm -> m
      vol_m3 = L * W * T_m;
      vol_ft3 = vol_m3 / 0.0283168466;
    }

    const yd3 = vol_ft3 / 27;

    // rendimentos típicos (ft³ por saco)
    const bags40 = Math.ceil(vol_ft3 / 0.30);
    const bags60 = Math.ceil(vol_ft3 / 0.45);
    const bags80 = Math.ceil(vol_ft3 / 0.60);

    return { vol_ft3, vol_m3, yd3, bags40, bags60, bags80 };
  }, [unit, length, width, thickness]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Concrete Slab Calculator</h1>
        <p className="text-muted-foreground">
          Estimate the concrete volume and number of premix bags required for a slab.
          Supports both US (ft/in) and Metric (m/cm) units.
        </p>
      </header>

      {/* Inputs */}
      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Units</Label>
            <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">US (ft / in)</SelectItem>
                <SelectItem value="metric">Metric (m / cm)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="len">Length ({unit === "imperial" ? "ft" : "m"})</Label>
            <Input id="len" inputMode="decimal" value={length} onChange={e=>setLength(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wid">Width ({unit === "imperial" ? "ft" : "m"})</Label>
            <Input id="wid" inputMode="decimal" value={width} onChange={e=>setWidth(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thk">Thickness ({unit === "imperial" ? "in" : "cm"})</Label>
            <Input id="thk" inputMode="decimal" value={thickness} onChange={e=>setThickness(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader><CardTitle>Results</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Volume:</strong> {calc.yd3.toFixed(3)} yd³ · {calc.vol_m3.toFixed(3)} m³</div>
          <div>
            <strong>Estimated bags:</strong>
            <ul className="list-disc pl-5">
              <li>40 lb: {calc.bags40}</li>
              <li>60 lb: {calc.bags60}</li>
              <li>80 lb: {calc.bags80}</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">Tip: add 5–10% extra to account for waste.</p>
        </CardContent>
      </Card>

      {/* Explanation */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p>
          Concrete volume is calculated as <code>Length × Width × Thickness</code>.
          Thickness is converted to feet (US) or meters (Metric).
          The total volume is reported in cubic yards and cubic meters.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Example</h2>
        <p>
          A 20 ft × 12 ft slab with 4 in thickness:
          <br />
          Volume = 20 × 12 × (4 ÷ 12) = 80 ft³ = 2.96 yd³.
          <br />
          Requires about 99 bags of 40 lb premix, or 66 bags of 60 lb, or 50 bags of 80 lb.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div>
          <p className="font-medium">How accurate is this calculator?</p>
          <p className="text-muted-foreground">It provides a good estimate, but always round up and add 5–10% for waste.</p>
        </div>
        <div>
          <p className="font-medium">What size concrete bags does it support?</p>
          <p className="text-muted-foreground">40 lb, 60 lb, and 80 lb premix bags.</p>
        </div>
        <div>
          <p className="font-medium">Does it work with metric units?</p>
          <p className="text-muted-foreground">Yes, you can switch between US (ft/in) and Metric (m/cm) at the top.</p>
        </div>
      </section>
    </div>
  );
}
