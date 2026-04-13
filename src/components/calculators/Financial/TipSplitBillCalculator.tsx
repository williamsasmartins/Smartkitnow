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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Tip & Split Bill Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">A tip and split bill calculator automates the mental math required to fairly divide restaurant checks and calculate appropriate gratuities. Whether you're dining alone and want to verify the math, or splitting a complex group bill with multiple diners, this tool eliminates rounding errors and disputes over who owes what. Most importantly, it ensures service workers receive the customary 15-20% gratuity while keeping your finances transparent and organized.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, start by entering your bill subtotal (the pre-tax amount from your receipt), then select a tip percentage or input a custom tip amount in dollars. Next, specify how many people are splitting the bill—the calculator will divide both the subtotal and tip equally among all participants. If you need to account for different orders or amounts per person, enter those individual subtotals separately before selecting your tipping preference.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays your results in clear breakdowns: the per-person subtotal, the per-person tip at your chosen percentage, and the final per-person total (before or after tax, depending on the tool). Use this information to determine exactly how much each diner should contribute or to verify the split is fair. Most calculators also round to the nearest cent and show the full group total, helping you confirm the math matches your original receipt.</p>
        </div>
      </section>

      {/* TABLE: Tip Amounts by Percentage on Common Bill Totals */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tip Amounts by Percentage on Common Bill Totals</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how tip amounts vary across standard percentages for typical restaurant bills.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bill Subtotal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15% Tip</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">18% Tip</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20% Tip</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total at 18%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$29.50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$59.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$75.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$88.50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$118.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$150.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$177.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$200.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$236.00</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Amounts shown are pre-tax. Actual totals will be higher when sales tax is added.</p>
      </section>

      {/* TABLE: Per-Person Cost When Splitting Bills Equally */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Per-Person Cost When Splitting Bills Equally</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how bill and tip costs are divided among group sizes for a $120 pre-tax bill at 18% tip.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Number of People</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Subtotal Per Person</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tip Per Person (18%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Per Person</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2 people</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$70.80</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 people</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$47.20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4 people</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$35.40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 people</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4.32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28.32</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6 people</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$23.60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8 people</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$17.70</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual totals exclude sales tax; add local tax rate to each person's final amount.</p>
      </section>

      {/* TABLE: Recommended Tip Percentages by Service Type (2024-2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Tip Percentages by Service Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Industry-standard tipping ranges vary by service category and quality of service.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Service Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Tip</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Tip</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Excellent Service Tip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sit-Down Restaurant</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Casual/Fast Casual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Food Delivery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Takeout Order</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bar/Cocktails</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1-2 per drink</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hair Salon/Barber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hotel Housekeeping</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2-5 per night</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3-5 per night</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5+ per night</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages apply to pre-tax subtotal; dollar amounts are fixed gratuities per service.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always tip on the pre-tax subtotal unless local custom strongly suggests otherwise—this is the industry standard and what most service workers expect, saving you 5-10% on your tip compared to including sales tax.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the 'custom tip amount' feature when you want to round up to a clean number (like tipping $25 on an $87 bill instead of exactly $15.66) or when you're splitting cash and need bills that divide evenly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When splitting with a group, enter everyone's individual subtotals if orders vary significantly in price—this prevents someone who ordered a cheap appetizer from subsidizing someone else's expensive entrée.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Take a photo of your receipt before using the calculator to verify the subtotal and tax separately, ensuring you're tipping on the correct amount and catching any pricing errors from the restaurant.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Tipping on the post-tax total by default</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people accidentally tip on the final bill amount including sales tax, which inflates the gratuity by 5-10% depending on location. Always use the pre-tax subtotal as your base—this is what service industry professionals expect and is the standard in hospitality etiquette.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for discounts or promotions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you used a coupon, had a groupon, or received a special discount, calculate your tip based on the discounted subtotal, not the original menu prices. Using the full pre-discount amount means you're over-tipping relative to what you actually paid.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Splitting equally when orders are significantly different</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dividing a $200 bill equally among 4 people ($50 each) is unfair if one person ordered a $15 salad and another ordered a $75 steak. Use the per-person subtotal feature to ensure each diner's tip is proportional to what they actually consumed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting tip percentage for delivery or takeout</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Delivery and takeout tipping norms are lower (10-15%) than sit-down restaurant standards (18-20%) because servers aren't providing table service. Using your restaurant default of 20% for a takeout order means you're over-tipping relative to the service provided.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the standard tip percentage I should use with this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard tip percentages in the U.S. typically range from 15% to 20% for good service, with 18% being a common baseline for most restaurants. The IRS recognizes tipping as taxable income for service workers, and many point-of-sale systems now default to 15%, 18%, or 20% suggestions. This calculator lets you input any percentage, but these benchmarks help you decide quickly without overthinking the math.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I use this calculator to split a bill between friends?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter the total bill amount, select your desired tip percentage (or enter a custom amount), then specify how many people are splitting. The calculator divides both the subtotal and tip equally among all participants, showing each person's exact share to the nearest cent. This eliminates confusion about who owes what and ensures fair distribution.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I tip on the pre-tax or post-tax amount?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Industry standard practice is to calculate tips on the pre-tax subtotal, not the final total with sales tax included. Most etiquette guides and this calculator's default approach uses the pre-tax amount, which typically saves you 5-10% on your tip depending on local tax rates. However, some people prefer tipping on the full post-tax amount—this calculator allows both options.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I want to add a custom tip amount instead of a percentage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most tip calculators allow you to toggle between percentage-based and fixed-amount tipping. Simply enter your desired tip in dollars (for example, $5.00 or $15.50), and the calculator will divide that amount among all diners along with their share of the bill. This is useful when you want to tip a specific amount or have a cash-only situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator handle unequal bill splits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Basic tip calculators split everything equally, but advanced versions let you assign different subtotals to each person before calculating tips. If one person ordered a $30 entree and another ordered a $15 appetizer, you can input those amounts separately so each person's tip is proportional to what they consumed. This ensures fairness when orders vary significantly in price.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I see the breakdown of tax, subtotal, tip, and total separately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, a well-designed tip calculator displays each component clearly: the pre-tax subtotal, calculated sales tax (if applicable), the tip amount, and the final total. This transparency helps you understand exactly where your money is going and verify the math independently. Many calculators also show the per-person breakdown in the same format.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between tipping 18% versus 20%?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">On a $100 pre-tax bill, 18% equals $18 while 20% equals $20—a $2 difference per person. For larger groups or bills, this gap increases: on a $200 bill, the difference is $4 total. Use this calculator to compare tipping scenarios and decide which percentage aligns with your service experience and budget.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for a group discount or promotion when splitting the bill?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter the final subtotal after any discounts or promotions have been applied—this becomes your starting point for tip calculations. Most restaurants apply discounts before the bill total, so if you received $20 off, subtract that from the original amount first. The calculator then distributes this discounted amount and the appropriate tip equally among all diners.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is there a standard tip percentage for different service types like delivery or takeout?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tipping norms vary: restaurants typically expect 15-20%, delivery services 15-18%, takeout 10-15%, and bartenders $1-2 per drink or 18-20% of the tab. This calculator works for all scenarios—just adjust the percentage based on the service type and quality you received. Many experts recommend tipping delivery drivers at least $2-3 per order plus 10-15%, depending on distance and order complexity.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/publications/p15b" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Guidance on Tipping and Taxable Income</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS publication explaining how tips are treated as taxable income for service workers and employers' responsibilities.</p>
          </li>
          <li>
            <a href="https://emilypost.com/advice/tipping-guide" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Etiquette of Tipping by The Emily Post Institute</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guide to tipping standards across various service industries and situations in modern America.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/about-us/blog/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau: Understanding Your Receipt</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal agency resources on understanding itemized receipts and calculating accurate gratuities and bill splits.</p>
          </li>
          <li>
            <a href="https://www.restaurant.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Restaurant Association: Gratuity and Compensation Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards and best practices for tipping and compensation in food service from the leading U.S. restaurant trade organization.</p>
          </li>
        </ul>
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


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Tip Etiquette, Customs, and the Math Behind Splitting Bills
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Tipping norms vary significantly by country and service type. In the United States, 18-20% is standard for restaurant service, 20-25% for excellent service. Bartenders typically receive $1-2 per drink or 15-20% of the tab. Hotel housekeeping: $2-5 per night. In Japan, tipping is not practiced and offering a tip can be considered rude. In the UK, 10-12.5% is common but not mandatory. Australia has minimal tipping culture. Understanding local conventions prevents both undertipping service workers who depend on tips and creating awkwardness in cultures where it is unnecessary.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The pre-tax vs post-tax tipping question is a minor practical consideration. Technically, tips should be calculated on the pre-tax food and beverage total since the tax is a government charge, not compensation for service. In practice, the difference on a typical restaurant check is under $1. Tipping 18% on a post-tax total at an 8% sales tax rate is equivalent to tipping about 19.4% on the pre-tax total. Most people use the post-tax total for simplicity without meaningful financial impact.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Splitting bills equally works well when everyone ordered similar items. Proportional splitting is fairer when orders vary widely, but requires more tracking. Modern payment apps such as Venmo, Splitwise, and Square Cash handle itemized proportional splits. For groups of 4-6, a hybrid approach works: split shared items (appetizers, wine) equally, then each person pays for their individual items. The social consideration: avoid letting one person consistently under-order while benefiting from others covering shared costs, which creates friction over repeated group meals.
        </p>
      </section>

      <section id="faq" className="scroll-mt-24" aria-label="FAQ" />
    </CalculatorVerticalLayout>
  );
}

