import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}

export default function PercentToFractionCalculator() {
  const [percent, setPercent] = useState("12.5");

  const frac = useMemo(() => {
    const p = parseFloat(percent);
    if (!Number.isFinite(p)) return null;
    const asDecimal = p / 100;
    const den = 10000;
    const num = Math.round(asDecimal * den);
    const g = gcd(num, den);
    return { n: num / g, d: den / g };
  }, [percent]);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Card>
        <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="p">Percent (%)</Label>
            <Input id="p" inputMode="decimal" value={percent} onChange={(e) => setPercent(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Fraction</Label>
            <Input readOnly value={frac ? `${frac.n} / ${frac.d}` : "—"} />
          </div>
          <div className="grid gap-2">
            <Label>Mixed</Label>
            <Input
              readOnly
              value={
                frac
                  ? `${Math.trunc(frac.n / frac.d)} ${Math.abs(frac.n % frac.d)} / ${frac.d}`
                  : "—"
              }
            />
          </div>

          <div className="sm:col-span-3">
            <Button variant="reset" onClick={() => setPercent("12.5")}>
              Reset to example
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
