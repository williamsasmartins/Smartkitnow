import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Função simplificadora básica
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}

export default function FractionReducerCalculator() {
  const [num, setNum] = useState("42");
  const [den, setDen] = useState("56");

  const reduced = useMemo(() => {
    const n = parseFloat(num);
    const d = parseFloat(den);
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
  }, [num, den]);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Card>
        <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="num">Numerator</Label>
            <Input id="num" inputMode="decimal" value={num} onChange={(e) => setNum(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="den">Denominator</Label>
            <Input id="den" inputMode="decimal" value={den} onChange={(e) => setDen(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Reduced</Label>
            <Input readOnly value={reduced ? `${reduced.n} / ${reduced.d}` : "—"} />
          </div>

          <div className="sm:col-span-3">
            <Button variant="reset" onClick={() => { setNum("42"); setDen("56"); }}>
              Reset to example
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
