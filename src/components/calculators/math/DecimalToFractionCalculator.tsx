import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function toFraction(decimal: number, maxDen = 10000) {
  let bestN = 0, bestD = 1, bestErr = Infinity;
  for (let d = 1; d <= maxDen; d++) {
    const n = Math.round(decimal * d);
    const err = Math.abs(decimal - n / d);
    if (err < bestErr) { bestErr = err; bestN = n; bestD = d; }
    if (bestErr === 0) break;
  }
  return { n: bestN, d: bestD };
}

export default function DecimalToFractionCalculator() {
  const [dec, setDec] = useState("1.25");

  const frac = useMemo(() => {
    const x = parseFloat(dec);
    if (!Number.isFinite(x)) return null;
    return toFraction(x);
  }, [dec]);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Card>
        <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="dec">Decimal</Label>
            <Input id="dec" inputMode="decimal" value={dec} onChange={(e) => setDec(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Fraction (approx.)</Label>
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
            <Button variant="reset" onClick={() => setDec("1.25")}>
              Reset to example
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
