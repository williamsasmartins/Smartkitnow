import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const SHEETS = {
  "4×8 ft": 32,   // área por folha (ft²)
  "4×12 ft": 48,
};

export { default } from "./DrywallEstimator";
  const [areaPerRoom, setAreaPerRoom] = useState<string>("450"); // ft² por cômodo
  const [rooms, setRooms] = useState<string>("1");
  const [sheetKey, setSheetKey] = useState<keyof typeof SHEETS>("4×8 ft");

  // SEO básico sem Helmet (title/meta + JSON-LD)
  useEffect(() => {
    const title = "Drywall — Area & Sheets Calculator";
    const desc =
      "Estimate drywall sheets from total wall area and sheet size (4×8 or 4×12). Includes formula, how to use, example, and FAQ.";

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
      url: "https://smartkitnow.com/construction/wall-ceiling-calculators/drywall-area-sheets",
      applicationCategory: "Construction Calculator",
      operatingSystem: "All",
      description: desc,
      featureList: ["Drywall sheets estimate", "4×8 and 4×12", "How to use", "Formula", "FAQ"],
      creator: { "@type": "Organization", name: "Smart Kit Now" },
    };

    const id = "jsonld-drywall-area-sheets";
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById(id);
      if (s) s.remove();
    };
  }, []);

  const result = useMemo(() => {
    const a = Math.max(0, parseFloat(areaPerRoom) || 0); // ft² por cômodo
    const r = Math.max(1, Math.floor(Number(rooms) || 1));
    const total_ft2 = a * r;
    const m2 = total_ft2 * 0.092903;
    const perSheet = SHEETS[sheetKey];
    const sheets = perSheet > 0 ? Math.ceil(total_ft2 / perSheet) : 0;
    return { total_ft2, m2, sheets, perSheet };
  }, [areaPerRoom, rooms, sheetKey]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Drywall — Area & Sheets</h1>
        <p className="text-muted-foreground">
          Enter the total wall area per room (in ft²), number of rooms, and select sheet size (4×8 or 4×12).
        </p>
      </header>

      {/* How to use */}
      <Card>
        <CardHeader><CardTitle>How to use</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Type the <strong>wall area per room</strong> in ft² (estimate walls minus doors/windows).</li>
            <li>Enter the number of <strong>rooms</strong>.</li>
            <li>Select the <strong>sheet size</strong>.</li>
            <li>Review total area and the <strong>estimated sheets</strong> (rounded up).</li>
          </ol>
          <p className="text-sm text-muted-foreground">Tip: add 10–15% extra for waste and cuts.</p>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="area">Wall area per room (ft²)</Label>
            <Input
              id="area"
              inputMode="decimal"
              placeholder="e.g., 450"
              value={areaPerRoom}
              onChange={(e) => setAreaPerRoom(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rooms">Rooms</Label>
            <Input
              id="rooms"
              inputMode="numeric"
              placeholder="1"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Sheet size</Label>
            <Select value={sheetKey} onValueChange={(v) => setSheetKey(v as any)}>
              <SelectTrigger><SelectValue placeholder="Select a size" /></SelectTrigger>
              <SelectContent>
                {Object.keys(SHEETS).map((k) => (
                  <SelectItem key={k} value={k}>{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader><CardTitle>Results</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Total area:</strong> {result.total_ft2.toFixed(2)} ft² ({result.m2.toFixed(2)} m²)</div>
          <div><strong>Estimated sheets:</strong> {result.sheets} ({String(sheetKey)} • {result.perSheet} ft²/sheet)</div>
          <p className="text-sm text-muted-foreground">Recommendation: add 10–15% for waste depending on layout and cuts.</p>
        </CardContent>
      </Card>

      {/* Formula */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Formula</h2>
        <p><strong>Sheets</strong> = <em>ceil( TotalArea(ft²) ÷ SheetArea(ft²) )</em></p>
        <p><strong>Sheet areas:</strong> 4×8 = 32 ft², 4×12 = 48 ft². <strong>Conversion:</strong> 1 m² = 10.7639 ft².</p>
      </section>

      {/* Example */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Example</h2>
        <p>
          If one room has 450 ft² of wall area and you have 1 room:
          <br />
          With 4×8 (32 ft²/sheet): 450 ÷ 32 = 14.06 → <strong>15 sheets</strong>.
          <br />
          With 4×12 (48 ft²/sheet): 450 ÷ 48 = 9.38 → <strong>10 sheets</strong>.
        </p>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div>
          <p className="font-medium">Should I add waste?</p>
          <p className="text-muted-foreground">Yes. Add ~10–15% for waste, cuts, and layout inefficiencies.</p>
        </div>
        <div>
          <p className="font-medium">Can I mix 4×8 and 4×12?</p>
          <p className="text-muted-foreground">Yes. This basic tool shows a single size at a time. For mixed sizes, plan per room or run two estimates.</p>
        </div>
        <div>
          <p className="font-medium">Does it include ceilings?</p>
          <p className="text-muted-foreground">This estimate is for wall area. Include ceilings by adding their area to the inputs.</p>
        </div>
      </section>
    </div>
  );
}
