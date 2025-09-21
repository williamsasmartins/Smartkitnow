import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

/**
 * Units:
 * - If unit = feet/inches, thickness is in inches; length/width in feet.
 * - If unit = meters, thickness in centimeters; length/width in meters.
 */

export default function ConcreteSlab() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [length, setLength] = useState<string>("20"); // ft or m
  const [width, setWidth] = useState<string>("12");   // ft or m
  const [thickness, setThickness] = useState<string>("4"); // in or cm

  const meta = {
    title: "Concrete Slab Calculator — Volume & Bags",
    desc: "Estimate concrete volume for a slab and how many premix bags you need. Includes formula, usage steps, example, and FAQ.",
    slug: "/construction/calculator/concrete-slab",
    breadcrumb: ["Home","Construction","Concrete & Masonry","Concrete Slab"],
    faq: [
      { q: "How do I calculate concrete for a slab?", a: "Convert all dimensions to the same unit, compute Volume = Length × Width × Thickness, then convert to cubic yards (US) or cubic meters (metric)." },
      { q: "How many bags do I need?", a: "Divide slab volume by bag yield. Typical yields: 40 lb ≈ 0.30 ft³, 60 lb ≈ 0.45 ft³, 80 lb ≈ 0.60 ft³." },
      { q: "Should I add waste?", a: "Yes. Add 5–10% for spillage, irregular edges, and over-excavation." }
    ]
  };

  const calc = useMemo(() => {
    const L = Math.max(0, parseFloat(length) || 0);
    const W = Math.max(0, parseFloat(width) || 0);
    const T = Math.max(0, parseFloat(thickness) || 0);

    // Convert to cubic feet and cubic meters
    let vol_ft3 = 0, vol_m3 = 0;

    if (unit === "imperial") {
      // L, W in feet; T in inches
      const T_ft = T / 12;
      vol_ft3 = L * W * T_ft;
      vol_m3 = vol_ft3 * 0.0283168466;
    } else {
      // L, W in meters; T in centimeters
      const T_m = T / 100;
      vol_m3 = L * W * T_m;
      vol_ft3 = vol_m3 / 0.0283168466;
    }

    const yd3 = vol_ft3 / 27;

    // Bag yields (approx cubic feet per bag)
    const yield40 = 0.30;
    const yield60 = 0.45;
    const yield80 = 0.60;

    const bags40 = yield40 > 0 ? Math.ceil(vol_ft3 / yield40) : 0;
    const bags60 = yield60 > 0 ? Math.ceil(vol_ft3 / yield60) : 0;
    const bags80 = yield80 > 0 ? Math.ceil(vol_ft3 / yield80) : 0;

    return { vol_ft3, vol_m3, yd3, bags40, bags60, bags80 };
  }, [unit, length, width, thickness]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": meta.title,
    "url": meta.slug,
    "applicationCategory": "Calculator",
    "operatingSystem": "All",
    "description": meta.desc,
    "featureList": ["Concrete slab volume", "Bags 40/60/80 lb", "How to use", "Formula", "FAQ"],
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": meta.breadcrumb.map((name, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": name
      }))
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": meta.faq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      {/* Basic SEO tags + JSON-LD */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.desc} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
        <p className="text-muted-foreground">{meta.desc}</p>
      </header>

      <Card>
        <CardHeader><CardTitle>How to use</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Select the unit system (US or metric).</li>
            <li>Enter slab <strong>length</strong>, <strong>width</strong>, and <strong>thickness</strong>.</li>
            <li>Review the volume in yd³/m³ and the estimated bags of premix.</li>
            <li>Add 5–10% extra for waste.</li>
          </ol>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader><CardTitle>Results</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          <div><strong>Volume:</strong> {calc.yd3.toFixed(3)} yd³ · {calc.vol_m3.toFixed(3)} m³</div>
          <div className="mt-1">
            <strong>Estimated bags:</strong>
            <ul className="list-disc pl-5">
              <li>40 lb: {calc.bags40}</li>
              <li>60 lb: {calc.bags60}</li>
              <li>80 lb: {calc.bags80}</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">Tip: add 5–10% for waste and uneven subgrade.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Formula & Example</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p><strong>US:</strong> <em>Volume(ft³) = Length(ft) × Width(ft) × Thickness(ft)</em>; <em>yd³ = ft³ ÷ 27</em>.</p>
          <p><strong>Metric:</strong> <em>Volume(m³) = Length(m) × Width(m) × Thickness(m)</em>.</p>
          <p>
            <strong>Example:</strong> 20 ft × 12 ft × 4 in → 4 in = 0.333 ft → ft³ = 20 × 12 × 0.333 = 79.92 ft³ → yd³ ≈ 2.96 → 
            bags 60 lb ≈ 79.92 ÷ 0.45 ≈ 178 → <strong>178 bags</strong> (antes do acréscimo de 5–10%).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>FAQ</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {meta.faq.map((f, i) => (
            <div key={i}>
              <p className="font-medium">{f.q}</p>
              <p className="text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
