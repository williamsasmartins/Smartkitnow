import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function FractionToDecimalCalculator() {
  const [num, setNum] = useState("3");
  const [den, setDen] = useState("8");
  const [precision, setPrecision] = useState("4");

  const value = useMemo(() => {
    const n = parseFloat(num);
    const d = parseFloat(den);
    const p = Math.max(0, Math.min(10, parseInt(precision || "4", 10)));
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return "—";
    return (n / d).toFixed(p);
  }, [num, den, precision]);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Card>
        <CardContent className="p-4 grid gap-4 sm:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="num">Numerator</Label>
            <Input id="num" inputMode="decimal" value={num} onChange={(e) => setNum(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="den">Denominator</Label>
            <Input id="den" inputMode="decimal" value={den} onChange={(e) => setDen(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prec">Precision</Label>
            <Input id="prec" inputMode="numeric" value={precision} onChange={(e) => setPrecision(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Decimal</Label>
            <Input readOnly value={value} />
          </div>

          <div className="sm:col-span-4">
            <Button variant="reset" onClick={() => { setNum("3"); setDen("8"); setPrecision("4"); }}>
              Reset to example
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
