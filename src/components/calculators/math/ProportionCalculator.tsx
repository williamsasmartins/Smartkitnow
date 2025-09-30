import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Field = "a" | "b" | "c" | "d";

export default function ProportionCalculator() {
  const [a, setA] = useState<string>("3");
  const [b, setB] = useState<string>("4");
  const [c, setC] = useState<string>("6");
  const [d, setD] = useState<string>("");

  // Decide qual campo está vazio e calcula por regra de três
  const solved = useMemo(() => {
    const A = parseFloat(a);
    const B = parseFloat(b);
    const C = parseFloat(c);
    const D = parseFloat(d);

    const blanks: Field[] = [];
    if (a.trim() === "") blanks.push("a");
    if (b.trim() === "") blanks.push("b");
    if (c.trim() === "") blanks.push("c");
    if (d.trim() === "") blanks.push("d");

    if (blanks.length !== 1) return { which: null as Field | null, value: NaN };

    const which = blanks[0];
    if (which === "a") {
      if (!isFinite(B) || !isFinite(C) || !isFinite(D) || B === 0) return { which, value: NaN };
      return { which, value: (B * C) / D };
    }
    if (which === "b") {
      if (!isFinite(A) || !isFinite(C) || !isFinite(D) || A === 0) return { which, value: NaN };
      return { which, value: (A * D) / C };
    }
    if (which === "c") {
      if (!isFinite(A) || !isFinite(B) || !isFinite(D) || B === 0) return { which, value: NaN };
      return { which, value: (A * D) / B };
    }
    // which === "d"
    if (!isFinite(A) || !isFinite(B) || !isFinite(C) || A === 0) return { which, value: NaN };
    return { which, value: (B * C) / A };
  }, [a, b, c, d]);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Card className="mb-6 bg-card border-border/50">
        <CardContent className="p-4 grid gap-4 sm:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="a">a</Label>
            <Input id="a" value={a} onChange={(e) => setA(e.target.value)} placeholder="blank to solve" />
          </div>
          <div className="grid place-items-center text-muted-foreground">/</div>
          <div className="grid gap-2">
            <Label htmlFor="b">b</Label>
            <Input id="b" value={b} onChange={(e) => setB(e.target.value)} placeholder="blank to solve" />
          </div>
          <div className="grid place-items-center text-foreground">=</div>

          <div className="grid gap-2">
            <Label htmlFor="c">c</Label>
            <Input id="c" value={c} onChange={(e) => setC(e.target.value)} placeholder="blank to solve" />
          </div>
          <div className="grid place-items-center text-muted-foreground">/</div>
          <div className="grid gap-2">
            <Label htmlFor="d">d</Label>
            <Input id="d" value={d} onChange={(e) => setD(e.target.value)} placeholder="blank to solve" />
          </div>
          <div className="grid place-items-center" />

          <div className="sm:col-span-4 grid gap-2">
            <Label>Solution</Label>
            <Input
              readOnly
              value={
                solved.which
                  ? `${solved.which} = ${Number.isFinite(solved.value) ? solved.value : "—"}`
                  : "Leave exactly one field blank to solve it."
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="calculate" onClick={() => { /* cálculo reativo */ }}>
          Calculate
        </Button>
        <Button
          variant="reset"
          onClick={() => {
            setA("3"); setB("4"); setC("6"); setD("");
          }}
        >
          Reset
        </Button>
      </div>

      <section className="mt-8 space-y-2 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">How it works</h2>
        <p>
          Para a proporção <strong>a/b = c/d</strong>, deixe <em>um</em> campo vazio e resolva por regra de três:
          a = (b·c)/d, b = (a·d)/c, c = (a·d)/b, d = (b·c)/a.
        </p>
      </section>
    </div>
  );
}
