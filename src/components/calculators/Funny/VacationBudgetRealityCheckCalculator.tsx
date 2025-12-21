import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Meh, Lightbulb, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VacationBudgetRealityCheckCalculator() {
  const [inputs, setInputs] = useState({
    totalBudget: "",
    estimatedCost: "",
    tripDays: "",
    dailySpending: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const totalBudget = parseFloat(inputs.totalBudget);
    const estimatedCost = parseFloat(inputs.estimatedCost);
    const tripDays = parseInt(inputs.tripDays);
    const dailySpending = parseFloat(inputs.dailySpending);

    // If any input is empty or invalid, return neutral state
    if (
      isNaN(totalBudget) ||
      isNaN(estimatedCost) ||
      isNaN(tripDays) ||
      isNaN(dailySpending) ||
      totalBudget <= 0 ||
      estimatedCost <= 0 ||
      tripDays <= 0 ||
      dailySpending < 0
    ) {
      return { value: null };
    }

    // Calculate total estimated trip cost = tripDays * dailySpending
    const totalTripCost = tripDays * dailySpending;

    // Compare totalBudget vs totalTripCost
    const difference = totalBudget - totalTripCost;

    // Format currency
    const formattedBudget = totalBudget.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    const formattedTripCost = totalTripCost.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    const formattedDifference = Math.abs(difference).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    // Determine message and icon based on budget vs cost
    if (difference > 0) {
      return {
        value: formattedDifference,
        label: "You are under budget!",
        subtext: `You have ${formattedDifference} left after your estimated expenses of ${formattedTripCost}. Enjoy your trip!`,
        color: "text-green-600",
        icon: <Smile className="mx-auto" size={48} />,
      };
    } else if (difference === 0) {
      return {
        value: formattedBudget,
        label: "Budget matches expenses",
        subtext: `Your budget exactly covers your estimated trip expenses of ${formattedTripCost}. Plan carefully!`,
        color: "text-yellow-600",
        icon: <Meh className="mx-auto" size={48} />,
      };
    } else {
      return {
        value: formattedDifference,
        label: "You are over budget!",
        subtext: `You need an additional ${formattedDifference} beyond your budget of ${formattedBudget} to cover your estimated expenses.`,
        color: "text-red-600",
        icon: <Frown className="mx-auto" size={48} />,
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How do I estimate daily spending for my trip?",
      answer:
        "Consider all daily expenses such as meals, transportation, activities, and souvenirs. Research typical costs for your destination and add a buffer for unexpected expenses.",
    },
    {
      question: "What if my budget is less than the estimated cost?",
      answer:
        "If your budget is less than your estimated expenses, consider adjusting your trip length, daily spending, or saving more before your trip to avoid financial stress.",
    },
    {
      question: "Can I include airfare and accommodation in this calculator?",
      answer:
        "Yes, you can add those costs into your total budget or daily spending estimates to get a more accurate picture of your vacation expenses.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="totalBudget">Total Vacation Budget (USD)</Label>
          <Input
            id="totalBudget"
            type="text"
            placeholder="e.g. 3000"
            value={inputs.totalBudget}
            onChange={(e) => handleInputChange("totalBudget", e.target.value)}
            inputMode="decimal"
          />
        </div>
        <div>
          <Label htmlFor="tripDays">Number of Trip Days</Label>
          <Input
            id="tripDays"
            type="text"
            placeholder="e.g. 7"
            value={inputs.tripDays}
            onChange={(e) => handleInputChange("tripDays", e.target.value)}
            inputMode="numeric"
          />
        </div>
        <div>
          <Label htmlFor="dailySpending">Estimated Daily Spending (USD)</Label>
          <Input
            id="dailySpending"
            type="text"
            placeholder="e.g. 250"
            value={inputs.dailySpending}
            onChange={(e) => handleInputChange("dailySpending", e.target.value)}
            inputMode="decimal"
          />
        </div>
        <div>
          <Label htmlFor="estimatedCost">Other Estimated Costs (USD)</Label>
          <Input
            id="estimatedCost"
            type="text"
            placeholder="e.g. 500 (flights, accommodation)"
            value={inputs.estimatedCost}
            onChange={(e) => handleInputChange("estimatedCost", e.target.value)}
            inputMode="decimal"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special calculation trigger needed; results update automatically
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              totalBudget: "",
              estimatedCost: "",
              tripDays: "",
              dailySpending: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>{results.value}</p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">{results.label}</p>
            <p className="mt-2 text-sm italic text-slate-500">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Vacation Budget Reality Check
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Planning a vacation is exciting, but budgeting can be challenging. This calculator helps you compare your total vacation budget against your estimated daily spending and other costs to see if your dream trip is financially feasible. By inputting your planned trip length, daily expenses, and additional costs like flights or accommodation, you get a clear picture of your financial readiness. This tool encourages realistic planning to avoid surprises and enjoy your vacation stress-free.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            According to a 2023 survey by the U.S. Travel Association, the average American spends about $1,200 on a one-week vacation, including transportation, lodging, and daily expenses. Proper budgeting can help you avoid debt and maximize enjoyment during your trip.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter your total vacation budget in USD, including savings and any planned spending money. Next, input the number of days you plan to travel and your estimated daily spending, which should cover meals, transport, activities, and incidentals. Add any other estimated costs such as airfare or accommodation separately. Click "Calculate" to see if your budget covers your planned expenses or if adjustments are needed.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside space-y-3 text-slate-700 dark:text-slate-300">
          {faqs.map(({ question, answer }, i) => (
            <li key={i}>
              <strong>{question}</strong>
              <p className="mt-1">{answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.ustravel.org/news/average-american-spends-1200-one-week-vacation"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Travel Association Survey 2023 <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Data on average vacation spending by Americans, including transportation, lodging, and daily expenses.
            </p>
          </li>
          <li>
            <a
              href="https://www.consumerfinance.gov/about-us/blog/how-to-budget-for-a-vacation/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Consumer Financial Protection Bureau: Vacation Budgeting Tips <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical advice on budgeting for vacations to avoid overspending and debt.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Vacation Budget Reality Check"
      description="Budget your dream trip vs reality. A fun tool to see how far your actual savings will get you (maybe just to the backyard?)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Remaining Budget = Total Budget - (Trip Days × Daily Spending + Other Costs)",
        variables: [
          { symbol: "Total Budget", description: "Your total vacation budget in USD" },
          { symbol: "Trip Days", description: "Number of days you plan to travel" },
          { symbol: "Daily Spending", description: "Estimated daily expenses in USD" },
          { symbol: "Other Costs", description: "Additional estimated costs like flights or accommodation in USD" },
          { symbol: "Remaining Budget", description: "Amount left after estimated expenses" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have saved $3,000 for a 7-day trip. You estimate spending $250 per day on food, transport, and activities, plus $500 for flights and accommodation.",
        steps: [
          { label: "1", explanation: "Calculate total daily expenses: 7 days × $250 = $1,750" },
          { label: "2", explanation: "Add other costs: $1,750 + $500 = $2,250 total estimated expenses" },
          { label: "3", explanation: "Subtract from budget: $3,000 - $2,250 = $750 remaining budget" },
        ],
        result: "You have $750 left after your estimated expenses, so your budget is sufficient for this trip.",
      }}
      relatedCalculators={[
        { title: "Drake Equation Calculator", url: "/funny/drake-equation-calculator", icon: "🤪" },
        { title: "Social Media Time Alternatives", url: "/funny/social-media-time-alternatives", icon: "🤪" },
        { title: "Black Hole Sun Impact Calculator", url: "/funny/black-hole-sun-impact", icon: "🧟" },
        { title: "Tab Overload Anxiety Score", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
        { title: "How Much Sugar Is in My Tea? (Dramatic)", url: "/funny/sugar-in-my-tea-dramatic", icon: "☕" },
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}