// src/components/calculators/math/PercentOfCalculator.tsx
import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PercentOfCalculator() {
  const [percent, setPercent] = useState<string>("15");
  const [total, setTotal] = useState<string>("240");

  const value = useMemo(() => {
    const p = parseFloat(percent);
    const t = parseFloat(total);
    if (!isFinite(p) || !isFinite(t)) return NaN;
    return (p / 100) * t;
  }, [percent, total]);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Percent of Total</h1>
        <p className="text-muted-foreground">
          Compute <em>X%</em> of a number. Example: 15% of 240 = 36.
        </p>
      </header>

      <Card className="mb-6">
        <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="p">Percent (%)</Label>
            <Input
              id="p"
              inputMode="decimal"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="t">Total</Label>
            <Input
              id="t"
              inputMode="decimal"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="e.g. 240"
            />
          </div>
          <div className="grid gap-2">
            <Label>Result</Label>
            <Input readOnly value={Number.isFinite(value) ? value.toString() : "—"} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            setPercent("15");
            setTotal("240");
          }}
        >
          Reset to example
        </Button>
      </div>

      <section className="mt-8 space-y-2 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">How it works</h2>
        <p>
          <strong>Formula:</strong> value = (<em>percent</em> ÷ 100) × <em>total</em>
        </p>
      </section>
    </div>
  );
}
