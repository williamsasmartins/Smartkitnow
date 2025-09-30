import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export default function PercentIncreaseCalculator() {
  const [oldVal, setOldVal] = useState<string>("80");
  const [newVal, setNewVal] = useState<string>("100");

  const pct = useMemo(() => {
    const o = parseFloat(oldVal);
    const n = parseFloat(newVal);
    if (!isFinite(o) || !isFinite(n) || o === 0) return NaN;
    return ((n - o) / o) * 100;
  }, [oldVal, newVal]);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      {/* Header padrão SKN (verde p/ increase) */}
      <header className="mb-6 text-center">
        <div
          className="mx-auto mb-3 inline-flex items-center justify-center rounded-xl"
          style={{ width: 44, height: 44, backgroundColor: "rgba(16,185,129,0.24)", color: "#34d399" }}
          aria-hidden="true"
        >
          <TrendingUp className="h-5 w-5" />
        </div>

        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Percent Increase
        </h1>

        <p className="text-muted-foreground">How much did a value grow from old to new?</p>
      </header>

      <Card className="mb-6 bg-card border-border/50">
        <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="old">Old value</Label>
            <Input id="old" inputMode="decimal" value={oldVal} onChange={(e) => setOldVal(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new">New value</Label>
            <Input id="new" inputMode="decimal" value={newVal} onChange={(e) => setNewVal(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Increase (%)</Label>
            <Input readOnly value={Number.isFinite(pct) ? pct.toFixed(2) : "—"} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => { setOldVal("80"); setNewVal("100"); }}>
          Reset to example
        </Button>
      </div>

      <section className="mt-8 space-y-2 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">Formula</h2>
        <p><strong>Percent increase</strong> = ((new − old) ÷ old) × 100</p>
      </section>
    </div>
  );
}
