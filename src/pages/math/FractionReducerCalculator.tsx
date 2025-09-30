import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/** Props padrão para permitir esconder header interno quando a página pai já renderiza um header */
type BrandingProps = { branding?: { hideHeader?: boolean } };

export default function FractionReducerCalculator({ branding }: BrandingProps) {
  const [num, setNum] = useState("42");
  const [den, setDen] = useState("56");

  const gcd = (a: number, b: number) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

  const reduced = useMemo(() => {
    const n = parseFloat(num);
    const d = parseFloat(den);
    if (!isFinite(n) || !isFinite(d) || d === 0) return null;
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
  }, [num, den]);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      {!branding?.hideHeader && (
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Fraction Reducer
          </h1>
          <p className="text-muted-foreground">
            Simplify any fraction to lowest terms.
          </p>
        </header>
      )}

      <Card className="mb-6 bg-card border-border/50">
        <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="n">Numerator</Label>
            <Input id="n" inputMode="decimal" value={num} onChange={(e) => setNum(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="d">Denominator</Label>
            <Input id="d" inputMode="decimal" value={den} onChange={(e) => setDen(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Reduced</Label>
            <Input
              readOnly
              value={
                reduced ? `${reduced.n}${reduced.d !== 1 ? ` / ${reduced.d}` : ""}` : "—"
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            setNum("42");
            setDen("56");
          }}
        >
          Reset to example
        </Button>
      </div>
    </div>
  );
}
