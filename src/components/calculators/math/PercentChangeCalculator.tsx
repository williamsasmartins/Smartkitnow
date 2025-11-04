import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PercentChangeCalculator() {
  const [oldVal, setOldVal] = useState<string>("120");
  const [newVal, setNewVal] = useState<string>("90");

  const pct = useMemo(() => {
    const o = parseFloat(oldVal);
    const n = parseFloat(newVal);
    if (!isFinite(o) || !isFinite(n) || o === 0) return NaN;
    return ((n - o) / o) * 100; // negativo = queda, positivo = alta
  }, [oldVal, newVal]);

  const formatted = Number.isFinite(pct) ? pct.toFixed(2) : "—";

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      {/* Sem header/título aqui — o título vem do CalculatorPage */}

      <Card className="mb-6 bg-card border-border/50">
        <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="old">Old value</Label>
            <Input
              id="old"
              inputMode="decimal"
              value={oldVal}
              onChange={(e) => setOldVal(e.target.value)}
              placeholder="e.g. 120"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new">New value</Label>
            <Input
              id="new"
              inputMode="decimal"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder="e.g. 90"
            />
          </div>

          <div className="grid gap-2">
            <Label>Percent change (%)</Label>
            <Input readOnly value={formatted} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="calculate"
          onClick={() => {
            // cálculo já é reativo; manter o botão por padrão visual/UX
            // (sem setState aqui)
          }}
        >
          Calculate
        </Button>

        <Button
          variant="reset"
          onClick={() => {
            setOldVal("120");
            setNewVal("90");
          }}
        >
          Reset
        </Button>
      </div>

      <section className="mt-8 space-y-2 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">How it works</h2>
        <p>
          <strong>Percent change</strong> = ((<em>new</em> − <em>old</em>) ÷ <em>old</em>) × 100.
          Positive values indicate increase; negative values indicate decrease.
        </p>
      </section>
    </div>
  );
}
