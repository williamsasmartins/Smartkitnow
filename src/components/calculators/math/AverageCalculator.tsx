import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AverageCalculator() {
  const [list, setList] = useState<string>("10, 20, 30, 40");

  const { count, sum, mean } = useMemo(() => {
    const nums = list
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n));
    const c = nums.length;
    const s = nums.reduce((acc, n) => acc + n, 0);
    const m = c > 0 ? s / c : NaN;
    return { count: c, sum: s, mean: m };
  }, [list]);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Card className="mb-6 bg-card border-border/50">
        <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3 grid gap-2">
            <Label htmlFor="numbers">Numbers (comma or space separated)</Label>
            <Input
              id="numbers"
              value={list}
              onChange={(e) => setList(e.target.value)}
              placeholder="e.g. 10, 20, 30, 40"
            />
          </div>

          <div className="grid gap-2">
            <Label>Count</Label>
            <Input readOnly value={count || "—"} />
          </div>
          <div className="grid gap-2">
            <Label>Sum</Label>
            <Input readOnly value={count ? sum : "—"} />
          </div>
          <div className="grid gap-2">
            <Label>Mean</Label>
            <Input readOnly value={count ? mean.toFixed(4) : "—"} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="calculate"
          onClick={() => {
            /* cálculo já é reativo; botão mantido por consistência visual */
          }}
        >
          Calculate
        </Button>
        <Button
          variant="reset"
          onClick={() => setList("10, 20, 30, 40")}
        >
          Reset
        </Button>
      </div>

      <section className="mt-8 space-y-2 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">Formula</h2>
        <p>
          <strong>Mean</strong> = (x₁ + x₂ + … + xₙ) ÷ n
        </p>
      </section>
    </div>
  );
}
