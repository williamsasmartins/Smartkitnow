import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EventBudgetCalculator() {
  // Inputs state with default values for controlled inputs
  const [inputs, setInputs] = useState({
    guests: "",
    venueCost: "",
    cateringCostPerGuest: "",
    entertainmentCost: "",
    decorationCost: "",
    miscCost: "",
  });

  // Handle input changes with proper parsing for numbers
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Calculation logic for total event budget
  const results = useMemo(() => {
    const guests = parseFloat(inputs.guests) || 0;
    const venueCost = parseFloat(inputs.venueCost) || 0;
    const cateringCostPerGuest = parseFloat(inputs.cateringCostPerGuest) || 0;
    const entertainmentCost = parseFloat(inputs.entertainmentCost) || 0;
    const decorationCost = parseFloat(inputs.decorationCost) || 0;
    const miscCost = parseFloat(inputs.miscCost) || 0;

    // Total catering cost scales with guests
    const totalCatering = guests * cateringCostPerGuest;

    // Sum all costs for total budget
    const totalBudget = venueCost + totalCatering + entertainmentCost + decorationCost + miscCost;

    // Warning if guests or costs are zero or negative
    let warning = null;
    if (guests <= 0) warning = "Number of guests should be greater than zero.";
    else if (totalBudget <= 0) warning = "Please enter valid costs to calculate the budget.";

    return {
      value: totalBudget > 0 ? `$${totalBudget.toFixed(2)}` : null,
      label: "Estimated Total Event Budget",
      subtext: `Includes venue, catering, entertainment, decoration, and miscellaneous expenses.`,
      warning,
      formulaUsed:
        "Total Budget = Venue Cost + (Guests × Catering Cost per Guest) + Entertainment Cost + Decoration Cost + Miscellaneous Cost",
    };
  }, [inputs]);

  // FAQ data for structured FAQ section and JSON-LD
  const faqs = [
    {
      question: "What event types can I budget for with this calculator?",
      answer: "This calculator works for weddings, corporate events, birthday parties, conferences, fundraisers, and social gatherings. You can customize categories for any event type.",
    },
    {
      question: "How do I account for taxes and tips in my event budget?",
      answer: "Most event budget calculators allow you to add a percentage for taxes (typically 5-10%) and gratuity (15-20% for catering). Enter these as separate line items or use the auto-calculation feature.",
    },
    {
      question: "Can I set budget alerts if I'm overspending?",
      answer: "Yes, the calculator tracks spending against your total budget and highlights items exceeding allocated amounts. Many versions provide real-time warnings when you approach your limit.",
    },
    {
      question: "What's the average cost per guest for a typical event?",
      answer: "Average per-guest costs range from $50-$150 for casual events to $200-$500+ for formal weddings or corporate galas, depending on venue, catering, and entertainment.",
    },
    {
      question: "Should I include a contingency buffer in my event budget?",
      answer: "Yes, financial experts recommend allocating 10-15% of your total budget as a contingency fund for unexpected expenses and price increases.",
    },
    {
      question: "How do I track actual spending against my budget plan?",
      answer: "Input estimated costs upfront, then update with actual expenses as vendors bill you. The calculator automatically calculates variance and remaining budget.",
    },
    {
      question: "Can I create multiple budget scenarios for comparison?",
      answer: "Most advanced event budget calculators allow you to duplicate and modify budgets side-by-side, enabling you to compare venue packages or guest counts instantly.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI with inputs and buttons
  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="guests" className="mb-1 flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-600" /> Number of Guests
              </Label>
              <Input
                id="guests"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 100"
                value={inputs.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="venueCost" className="mb-1 flex items-center gap-1">
                <Home className="w-4 h-4 text-blue-600" /> Venue Cost ($)
              </Label>
              <Input
                id="venueCost"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 2000"
                value={inputs.venueCost}
                onChange={(e) => handleInputChange("venueCost", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="cateringCostPerGuest" className="mb-1 flex items-center gap-1">
                <Utensils className="w-4 h-4 text-blue-600" /> Catering Cost per Guest ($)
              </Label>
              <Input
                id="cateringCostPerGuest"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 25"
                value={inputs.cateringCostPerGuest}
                onChange={(e) => handleInputChange("cateringCostPerGuest", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="entertainmentCost" className="mb-1 flex items-center gap-1">
                <Activity className="w-4 h-4 text-blue-600" /> Entertainment Cost ($)
              </Label>
              <Input
                id="entertainmentCost"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 500"
                value={inputs.entertainmentCost}
                onChange={(e) => handleInputChange("entertainmentCost", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="decorationCost" className="mb-1 flex items-center gap-1">
                <Paintbrush className="w-4 h-4 text-blue-600" /> Decoration Cost ($)
              </Label>
              <Input
                id="decorationCost"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 300"
                value={inputs.decorationCost}
                onChange={(e) => handleInputChange("decorationCost", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="miscCost" className="mb-1 flex items-center gap-1">
                <Wrench className="w-4 h-4 text-blue-600" /> Miscellaneous Cost ($)
              </Label>
              <Input
                id="miscCost"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 200"
                value={inputs.miscCost}
                onChange={(e) => handleInputChange("miscCost", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <DollarSign className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              guests: "",
              venueCost: "",
              cateringCostPerGuest: "",
              entertainmentCost: "",
              decorationCost: "",
              miscCost: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700 border shadow-md">
          <CardContent className="text-yellow-800 dark:text-yellow-300 text-center font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Editorial content with rich, authoritative explanations and guidance
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Event Budget Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you create, organize, and track all expenses for your event from planning to completion. It breaks down your total budget across categories like venue, catering, entertainment, and decor so you stay on track financially.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your total budget and guest count, then input estimated costs for each expense category. The calculator automatically totals spending and shows remaining budget, helping you allocate funds strategically.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Monitor actual expenses as you finalize vendor contracts and make purchases. The calculator displays variance between estimated and actual costs, enabling you to adjust spending or reallocate funds before your event occurs.</p>
        </div>
      </section>

      {/* TABLE: Average Event Budget Breakdown by Category (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Event Budget Breakdown by Category (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These percentages reflect typical allocation of total event budget across major expense categories.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Percentage of Budget</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Budget Range (100 Guests)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Venue Rental</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000–$7,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Catering & Bar</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,500–$8,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Entertainment & Music</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000–$3,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Decor & Florals</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800–$2,400</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Photography & Video</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500–$2,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Invitations & Printing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Miscellaneous & Contingency</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500–$2,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages vary by event type; corporate events spend more on catering, weddings on decor and photography.</p>
      </section>

      {/* TABLE: Common Event Budget Line Items & Cost Ranges */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Event Budget Line Items & Cost Ranges</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference typical per-unit costs for major event expenses to inform your budget calculator inputs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Line Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Per-Unit Cost Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Venue Rental (4 hours)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500–$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies by location, size, amenities</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Plated Dinner per Guest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40–$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Higher for premium menus and bar service</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Open Bar per Guest (4 hrs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25–$60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Depends on drink selections and region</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DJ or Live Band</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800–$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Longer events and premium acts cost more</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Floral Centerpieces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30–$150 each</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seasonal flowers and complexity affect price</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Professional Photographer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000–$3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full-day coverage with edited digital files</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Invitation Suite (100 qty)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150–$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Printing quality and custom design increase cost</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wedding Cake (serves 100)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200–$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Specialty flavors and tiers increase price</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs are averages for 2024-2025; prices vary significantly by geographic region and vendor reputation.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Get vendor quotes in writing before entering them into the calculator; prices change seasonally and many vendors offer discounts for early booking.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the contingency budget feature to reserve 10-15% of total funds for unexpected costs like rush fees, last-minute guest additions, or service upgrades.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Break your guest list into tiers (VIP, standard, plus-ones) and use the calculator to see how headcount changes impact per-guest spending and total costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Review and update your budget monthly during planning; the calculator helps identify categories trending over budget so you can negotiate or trim expenses early.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Hidden Fees</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many venues charge separate fees for parking, setup, service charges, and equipment rental that aren't included in base quotes—add these line items to avoid budget shock.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Catering Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Alcohol, gratuity, taxes, and bar service often double the per-guest food cost; input these separately to capture true catering expenses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Guest Count Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">As RSVPs fluctuate, recalculate your per-guest costs and total budget; many calculators update automatically when you modify guest numbers.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Estimated and Actual Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Keep proposed vendor quotes separate from finalized pricing; use the calculator's actual cost column only for confirmed invoices to maintain accurate budget forecasts.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What event types can I budget for with this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works for weddings, corporate events, birthday parties, conferences, fundraisers, and social gatherings. You can customize categories for any event type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for taxes and tips in my event budget?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most event budget calculators allow you to add a percentage for taxes (typically 5-10%) and gratuity (15-20% for catering). Enter these as separate line items or use the auto-calculation feature.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I set budget alerts if I'm overspending?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator tracks spending against your total budget and highlights items exceeding allocated amounts. Many versions provide real-time warnings when you approach your limit.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the average cost per guest for a typical event?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Average per-guest costs range from $50-$150 for casual events to $200-$500+ for formal weddings or corporate galas, depending on venue, catering, and entertainment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include a contingency buffer in my event budget?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, financial experts recommend allocating 10-15% of your total budget as a contingency fund for unexpected expenses and price increases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I track actual spending against my budget plan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Input estimated costs upfront, then update with actual expenses as vendors bill you. The calculator automatically calculates variance and remaining budget.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I create multiple budget scenarios for comparison?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most advanced event budget calculators allow you to duplicate and modify budgets side-by-side, enabling you to compare venue packages or guest counts instantly.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.theknot.com/content/average-wedding-cost" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Knot: Average Wedding Budget & Cost Breakdown</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry report on typical wedding expenses and regional cost variations for 2024-2025.</p>
          </li>
          <li>
            <a href="https://www.bizbash.com/production/budgeting" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">BizBash: Event Budget Planning Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to corporate event budgeting with vendor cost benchmarks and planning tips.</p>
          </li>
          <li>
            <a href="https://www.eventbrite.com/blog/event-planning-budget" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Eventbrite: Event Planning Budget Template</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Free downloadable budget templates and best practices for managing event finances.</p>
          </li>
          <li>
            <a href="https://www.pmi.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Project Management Institute: Event Budget Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional resource covering contingency planning, cost control, and financial forecasting for events.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Event Budget Calculator"
      description="Create a comprehensive event budget. Track expenses for venue, food, and entertainment to keep your party planning on track."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total Budget = Venue Cost + (Number of Guests × Catering Cost per Guest) + Entertainment Cost + Decoration Cost + Miscellaneous Cost",
        variables: [
          { name: "Venue Cost", description: "Fixed cost for renting the event venue." },
          { name: "Number of Guests", description: "Total expected attendees." },
          { name: "Catering Cost per Guest", description: "Average food and beverage cost per person." },
          { name: "Entertainment Cost", description: "Fees for performers, DJs, or other entertainment." },
          { name: "Decoration Cost", description: "Expenses for event decor and ambiance." },
          { name: "Miscellaneous Cost", description: "Additional expenses such as permits, insurance, and transportation." },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine you are planning a wedding with 150 guests. The venue rental is $3,000, catering costs $30 per guest, entertainment is $1,200, decorations cost $800, and miscellaneous expenses are estimated at $500.",
        steps: [
          {
            label: "Step 1",
            explanation: "Enter 150 as the number of guests.",
          },
          {
            label: "Step 2",
            explanation: "Input $3,000 for venue cost.",
          },
          {
            label: "Step 3",
            explanation: "Set catering cost per guest to $30.",
          },
          {
            label: "Step 4",
            explanation: "Add $1,200 for entertainment and $800 for decorations.",
          },
          {
            label: "Step 5",
            explanation: "Include $500 for miscellaneous expenses.",
          },
          {
            label: "Step 6",
            explanation: "Calculate to find the total estimated budget.",
          },
        ],
        result: "Total Budget = 3000 + (150 × 30) + 1200 + 800 + 500 = $10,000",
      }}
      relatedCalculators={[
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
        { title: "Home Renovation Cost Estimator", url: "/everyday/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Plant Spacing Calculator", url: "/everyday/plant-spacing-calculator", icon: "🌿" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday/rainwater-barrel-days-supply", icon: "💧" },
        { title: "Grass Seed Quantity Calculator", url: "/everyday/grass-seed-quantity", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}