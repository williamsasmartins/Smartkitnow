import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function ConcreteSlab() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [length, setLength] = useState<string>("20"); // ft or m
  const [width, setWidth] = useState<string>("12");   // ft or m
  const [thickness, setThickness] = useState<string>("4"); // in or cm

  const calc = useMemo(() => {
    const L = Math.max(0, parseFloat(length) || 0);
    const W = Math.max(0, parseFloat(width) || 0);
    const T = Math.max(0, parseFloat(thickness) || 0);

    let vol_ft3 = 0, vol_m3 = 0;

    if (unit === "imperial") {
      const T_ft = T / 12;
      vol_ft3 = L * W * T_ft;
      vol_m3 = vol_ft3 * 0.0283168466;
    } else {
      const T_m = T / 100;
      vol_m3 = L * W * T_m;
      vol_ft3 = vol_m3 / 0.0283168466;
    }

    const yd3 = vol_ft3 / 27;
    const bags40 = Math.ceil(vol_ft3 / 0.30);
    const bags60 = Math.ceil(vol_ft3 / 0.45);
    const bags80 = Math.ceil(vol_ft3 / 0.60);

    return { vol_ft3, vol_m3, yd3, bags40, bags60, bags80 };
  }, [unit, length, width, thickness]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Concrete Slab — Volume & Bags</h1>
        <p className="text-muted-foreground">
          Enter slab length, width, and thickness to estimate volume and premix bags.
        </p>
      </header>

      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Units</Label>
            <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">US (ft/in)</SelectItem>
                <SelectItem value="metric">Metric (m/cm)</SelectItem>
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
          <p className="text-sm text-muted-foreground">Tip: add 5–10% for waste.</p>
        </CardContent>
      </Card>
    </div>
  );
}
