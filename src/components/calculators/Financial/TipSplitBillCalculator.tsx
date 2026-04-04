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
      answer:
        "Tip amount = Bill × (Tip % ÷ 100). For a $75 bill with an 18% tip: $75 × 0.18 = $13.50 tip. Total = $75 + $13.50 = $88.50. Per person (4 people) = $88.50 ÷ 4 = $22.13.",
    },
    {
      question: "What is the standard tip percentage in the US?",
      answer:
        "15% is the traditional minimum for acceptable service; 18–20% is now the standard for good service at sit-down restaurants. 20–25% is appropriate for excellent service. For delivery, 15–20% of the pre-tax bill (or a minimum flat $3–$5 for small orders) is typical. For takeout, 10% is appreciated but not obligatory.",
    },
    {
      question: "Should the tip be calculated before or after tax?",
      answer:
        "Tipping etiquette in the US is generally based on the pre-tax subtotal, but in practice most people tip on the total including tax. The difference is small (typically under $1 on a $50 meal) and tipping on the full total is perfectly acceptable.",
    },
    {
      question: "How do I split the bill unevenly?",
      answer:
        "This calculator splits the total evenly. For uneven splits — where each person ordered different amounts — calculate each person's subtotal separately, add their proportional tip, then sum. Many restaurant POS systems now support split-by-item directly on the check.",
    },
    {
      question: "Do I tip on the pre-discount or post-discount price?",
      answer:
        "Tip on the pre-discount (original) price. A coupon or Groupon reduces the cost for you but not the effort of the server. Tipping on the discounted amount is considered poor etiquette in the service industry.",
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

  const editorial = (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-3">Tipping Standards in the US</h2>
        <p className="text-muted-foreground leading-relaxed">
          Tipping customs vary by service type and region, but the following US standards
          are widely accepted:
        </p>
        <ul className="mt-3 space-y-2 text-muted-foreground list-disc ml-6">
          <li><strong>Sit-down restaurants:</strong> 18–20% for good service; 15% minimum; 25%+ for exceptional</li>
          <li><strong>Bars (drinks):</strong> $1–$2 per drink, or 15–20% of tab</li>
          <li><strong>Food delivery:</strong> 15–20% of order (minimum $3–$5 for small orders)</li>
          <li><strong>Takeout/counter service:</strong> 10% if they provide table service, optional otherwise</li>
          <li><strong>Hotel housekeeping:</strong> $2–$5 per night</li>
          <li><strong>Taxi/rideshare:</strong> 15–20%</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">How to Split a Bill Fairly</h2>
        <p className="text-muted-foreground leading-relaxed">
          Equal splits work best when the group ordered similarly. For mixed groups
          (one person had a $12 salad, another had a $45 steak), the fairest approach is
          to calculate each person's individual subtotal + their proportional tip, then
          sum. This calculator uses equal splitting — divide by the number of people after
          adding the full tip to the total bill.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          When paying as a group, use one card or app (Venmo, Splitwise) to pay the full
          amount, then settle among yourselves. Splitting the check into many small payments
          frustrates servers and slows table turnover.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tip & Split Bill Calculator"
      description="Calculate tip amount, total bill, and per-person split. Includes US tipping standards for restaurants, delivery, and bars."
      jsonLd={faqJsonLd}
      formula={{
        formula: "Per Person = (Bill + Bill × Tip%) ÷ People",
        variables: [
          { symbol: "Bill", description: "Pre-tax subtotal of the meal or service" },
          { symbol: "Tip%", description: "Tip percentage expressed as a decimal (18% = 0.18)" },
          { symbol: "People", description: "Number of people splitting the bill equally" },
        ],
        title: "Tip & Split Formula",
      }}
      editorial={editorial}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "tipping", label: "Tipping Standards" },
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

      <section id="faq" className="scroll-mt-24" aria-label="FAQ" />
    </CalculatorVerticalLayout>
  );
}

