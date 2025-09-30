import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PercentDecreaseCalculator() {
  const [oldVal, setOldVal] = useState<string>("100");
  const [newVal, setNewVal] = useState<string>("80");

  const pct = useMemo(() => {
    const o = parseFloat(oldVal);
    const n = parseFloat(newVal);
    if (!isFinite(o) || !isFinite(n) || o === 0) return NaN;
    return ((o - n) / o) * 100;
  }, [oldVal, newVal]);

  const onReset = () => {
    setOldVal("100");
    setNewVal("80");
  };

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
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
            <Label>Decrease (%)</Label>
            <Input readOnly value={Number.isFinite(pct) ? pct.toFixed(2) : "—"} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="calculate">Calculate</Button>
        <Button variant="reset" onClick={onReset}>Reset</Button>
      </div>

      <section className="mt-8 space-y-2 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">Formula</h2>
        <p><strong>Percent decrease</strong> = ((old − new) ÷ old) × 100</p>
      </section>
    </div>
  );
}
