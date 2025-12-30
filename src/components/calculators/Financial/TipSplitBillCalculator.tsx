import { useMemo, useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Inputs = {
  billAmount: string;
  tipPercent: string;
  people: string;
};

function clampNumber(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function toNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const normalized = trimmed.replace(/,/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TipSplitBillCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    billAmount: "50",
    tipPercent: "18",
    people: "2",
  });

  const faqJsonLd = useFaqJsonLd([
    {
      question: "How do I calculate the tip amount?",
      answer: "Tip = Bill × (Tip % / 100).",
    },
    {
      question: "How do I split the total between people?",
      answer: "Per person = (Bill + Tip) ÷ People.",
    },
  ]);

  const { bill, tipPct, people, tipAmount, total, perPerson } = useMemo(() => {
    const bill = Math.max(0, toNumber(inputs.billAmount));
    const tipPct = clampNumber(toNumber(inputs.tipPercent), 0, 100);
    const people = Math.max(1, Math.floor(toNumber(inputs.people) || 1));
    const tipAmount = bill * (tipPct / 100);
    const total = bill + tipAmount;
    const perPerson = total / people;
    return { bill, tipPct, people, tipAmount, total, perPerson };
  }, [inputs.billAmount, inputs.tipPercent, inputs.people]);

  return (
    <CalculatorVerticalLayout
      title="Tip & Split Bill Calculator"
      description="Calculate tip amount, total bill, and how much each person owes."
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "faq", label: "FAQ" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#5c82ee]" />
              Tip Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bill">Bill amount</Label>
                <Input
                  id="bill"
                  inputMode="decimal"
                  value={inputs.billAmount}
                  onChange={(e) => setInputs((p) => ({ ...p, billAmount: e.target.value }))}
                  placeholder="e.g., 50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipPct">Tip %</Label>
                <Input
                  id="tipPct"
                  inputMode="decimal"
                  value={inputs.tipPercent}
                  onChange={(e) => setInputs((p) => ({ ...p, tipPercent: e.target.value }))}
                  placeholder="e.g., 18"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="people">People</Label>
                <Input
                  id="people"
                  inputMode="numeric"
                  value={inputs.people}
                  onChange={(e) => setInputs((p) => ({ ...p, people: e.target.value }))}
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tip amount</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${formatMoney(tipAmount)}</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${formatMoney(total)}</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Per person</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${formatMoney(perPerson)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Bill: ${formatMoney(bill)} · Tip: {tipPct}% · People: {people}
              </div>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => setInputs({ billAmount: "50", tipPercent: "18", people: "2" })}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="faq" className="scroll-mt-24" />
    </CalculatorVerticalLayout>
  );
}

