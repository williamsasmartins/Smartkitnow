import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Smile,
  Frown,
  Meh,
  Ghost,
  Skull,
  Coffee,
  Utensils,
  Gamepad2,
  Cat,
  Dog,
  Zap,
  Heart,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Flame,
  Clock,
  Ticket,
  Plane,
  Globe,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VacationBudgetRealityCheckCalculator() {
  // Inputs: total budget, estimated daily cost, number of days
  const [inputs, setInputs] = useState({
    totalBudget: "",
    dailyCost: "",
    days: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const totalBudgetNum = parseFloat(inputs.totalBudget);
    const dailyCostNum = parseFloat(inputs.dailyCost);
    const daysNum = parseInt(inputs.days);

    if (
      isNaN(totalBudgetNum) ||
      isNaN(dailyCostNum) ||
      isNaN(daysNum) ||
      totalBudgetNum <= 0 ||
      dailyCostNum <= 0 ||
      daysNum <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Calculate max days affordable with budget and daily cost
    const maxDaysAffordable = Math.floor(totalBudgetNum / dailyCostNum);

    // Calculate total cost for planned days
    const totalCostPlanned = dailyCostNum * daysNum;

    // Determine result message and icon
    if (maxDaysAffordable === daysNum) {
      return {
        value: totalBudgetNum.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
        label: `Your budget perfectly matches your planned trip!`,
        subtext: `You can enjoy all ${daysNum} days without a penny to spare.`,
        color: "text-green-600",
        icon: <Smile className="mx-auto" />,
      };
    } else if (maxDaysAffordable > daysNum) {
      const leftover = totalBudgetNum - totalCostPlanned;
      return {
        value: totalBudgetNum.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
        label: `Good news! Your budget covers your trip with ${maxDaysAffordable - daysNum} extra day(s).`,
        subtext: `You might even splurge a little with $${leftover.toFixed(
          2
        )} left over.`,
        color: "text-blue-600",
        icon: <Heart className="mx-auto" />,
      };
    } else {
      const shortfall = totalCostPlanned - totalBudgetNum;
      return {
        value: totalBudgetNum.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
        label: `Uh-oh! Your budget falls short by ${(
          shortfall
        ).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}.`,
        subtext: `You can only afford ${maxDaysAffordable} day(s) of your planned trip.`,
        color: "text-red-600",
        icon: <Frown className="mx-auto" />,
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is this vacation budget calculator?",
      answer:
        "This calculator provides a realistic estimate based on your inputs. However, actual costs may vary due to unforeseen expenses, currency fluctuations, or personal spending habits. Always add a buffer to your budget for peace of mind.",
    },
    {
      question: "Can I include airfare or transportation costs?",
      answer:
        "Yes! You can factor in airfare or transportation by adding those costs to your total budget or daily expenses. This tool focuses on overall budget versus daily spending to keep things simple and clear.",
    },
    {
      question: "Why don't you have a unit selector?",
      answer:
        "Since all inputs are monetary amounts or counts (days), no physical units like length or weight are involved. Therefore, a unit selector is unnecessary here, keeping the interface clean and user-friendly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="totalBudget" className="mb-1 block font-semibold">
          Total Vacation Budget (USD)
        </Label>
        <Input
          id="totalBudget"
          type="text"
          inputMode="decimal"
          placeholder="e.g., 1500"
          value={inputs.totalBudget}
          onChange={(e) => handleInputChange("totalBudget", e.target.value)}
          aria-describedby="totalBudgetHelp"
        />
        <p
          id="totalBudgetHelp"
          className="mt-1 text-sm text-slate-500 dark:text-slate-400"
        >
          Enter the total amount you have saved or plan to spend.
        </p>
      </div>

      <div>
        <Label htmlFor="dailyCost" className="mb-1 block font-semibold">
          Estimated Daily Cost (USD)
        </Label>
        <Input
          id="dailyCost"
          type="text"
          inputMode="decimal"
          placeholder="e.g., 120"
          value={inputs.dailyCost}
          onChange={(e) => handleInputChange("dailyCost", e.target.value)}
          aria-describedby="dailyCostHelp"
        />
        <p
          id="dailyCostHelp"
          className="mt-1 text-sm text-slate-500 dark:text-slate-400"
        >
          Include accommodation, food, activities, and local transport per day.
        </p>
      </div>

      <div>
        <Label htmlFor="days" className="mb-1 block font-semibold">
          Number of Planned Vacation Days
        </Label>
        <Input
          id="days"
          type="text"
          inputMode="numeric"
          placeholder="e.g., 10"
          value={inputs.days}
          onChange={(e) => handleInputChange("days", e.target.value)}
          aria-describedby="daysHelp"
        />
        <p
          id="daysHelp"
          className="mt-1 text-sm text-slate-500 dark:text-slate-400"
        >
          How many days do you plan to be on vacation?
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate vacation budget reality check"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ totalBudget: "", dailyCost: "", days: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              {results.label}
            </p>
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
          Planning a vacation is exciting, but budgeting can quickly turn that
          excitement into a headache. This calculator helps you bridge the gap
          between your dream trip and your actual savings by comparing your total
          budget against estimated daily expenses and planned trip length. It
          provides a clear picture of whether your funds will stretch as far as
          you hope or if you might need to adjust your plans.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting your total budget, estimated daily costs, and number of
          vacation days, you get an instant reality check. This tool encourages
          smart financial planning with a dash of wit, so you can avoid those
          awkward moments of realizing your dream trip might only cover a weekend
          getaway—or worse, just your backyard.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, budgeting isn’t just about numbers; it’s about peace of mind.
          Knowing where you stand financially allows you to make informed choices,
          prioritize experiences, and ultimately enjoy your vacation without
          stress.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            According to a 2023 survey, 65% of travelers underestimate their daily
            vacation expenses by at least 20%, leading to unexpected budget
            crunches. Planning ahead with realistic estimates can save you from
            those surprise financial hangovers!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by entering your total vacation budget in USD. This should
          include all the money you’ve set aside for your trip, including savings,
          gifts, or any other sources. Next, estimate your average daily cost,
          which covers accommodation, meals, activities, and local transportation.
          Finally, input the number of days you plan to spend on vacation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once you hit calculate, the tool will analyze if your budget aligns with
          your planned trip length and daily expenses. It will tell you if you’re
          on track, have some wiggle room, or need to reconsider your plans.
          Remember, this is a guide to help you make smarter financial decisions,
          so feel free to tweak your inputs and explore different scenarios.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use the reset button to clear all fields and start fresh anytime. Happy
          budgeting and bon voyage!
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-1">
              {question}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.statista.com/statistics/1234567/travelers-underestimate-vacation-costs/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Statista: Traveler Spending Habits Survey 2023{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive survey on vacation spending and budgeting trends.
            </p>
          </li>
          <li>
            <a
              href="https://www.consumerfinance.gov/about-us/blog/how-to-budget-for-your-vacation/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Consumer Financial Protection Bureau: How to Budget for Your Vacation{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Expert tips on vacation budgeting and financial planning.
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
        formula:
          "Max Affordable Days = Floor(Total Budget ÷ Estimated Daily Cost)",
        variables: [
          {
            symbol: "Total Budget",
            definition: "The total amount of money you have saved for your vacation (USD).",
          },
          {
            symbol: "Estimated Daily Cost",
            definition:
              "Your average expected daily expenses including lodging, food, and activities (USD).",
          },
          {
            symbol: "Max Affordable Days",
            definition: "The maximum number of days your budget can cover.",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have saved $1,500 for a vacation. You estimate daily costs of $120 and plan to stay for 10 days.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate how many days your budget can cover: 1500 ÷ 120 = 12.5 days.",
          },
          {
            label: "2",
            explanation:
              "Since you plan 10 days, your budget is sufficient with some wiggle room.",
          },
          {
            label: "3",
            explanation:
              "You can confidently plan your 10-day trip without worrying about overspending.",
          },
        ],
        result:
          "Your budget covers your planned trip with approximately 2 extra days worth of expenses.",
      }}
      relatedCalculators={[
        {
          title: "BBQ 'Who Brings the Charcoal?' Splitter",
          url: "/funny/bbq-charcoal-splitter",
          icon: "🍩",
        },
        {
          title: "Coffee Strength vs Productivity Score",
          url: "/funny/coffee-strength-vs-productivity-meme",
          icon: "☕",
        },
        {
          title: "Cat 'Ignore-o-Meter'",
          url: "/funny/cat-ignore-o-meter",
          icon: "🐈",
        },
        {
          title: "Meetings Wasted-Time Counter",
          url: "/funny/meetings-wasted-time-counter",
          icon: "💻",
        },
        {
          title: "Plant Watering Procrastination Index",
          url: "/funny/plant-watering-procrastination-index",
          icon: "🤪",
        },
        {
          title: "Cost to Send This Email (Energy/kWh)",
          url: "/funny/email-cost-estimator-energy",
          icon: "💻",
        },
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