import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Settings, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EvBatteryDegradationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    degradationRate: "", // % per year
    years: "", // number of years to estimate
    replacementCostPerKWh: "" // $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const degradationRate = parseFloat(inputs.degradationRate);
    const years = parseFloat(inputs.years);
    const replacementCostPerKWh = parseFloat(inputs.replacementCostPerKWh);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(degradationRate) || degradationRate < 0 ||
      isNaN(years) || years <= 0 ||
      isNaN(replacementCostPerKWh) || replacementCostPerKWh <= 0
    ) {
      return {
        primary: "Invalid input",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Input error"
      };
    }

    // Calculate remaining battery capacity after degradation over the years
    // Using exponential decay: Remaining Capacity = Initial * (1 - rate)^years
    const remainingCapacity = batteryCapacity * Math.pow(1 - degradationRate / 100, years);

    // Capacity lost
    const capacityLost = batteryCapacity - remainingCapacity;

    // Estimated replacement cost for lost capacity
    const replacementCost = capacityLost * replacementCostPerKWh;

    // Estimated range loss percentage
    const rangeLossPercent = (capacityLost / batteryCapacity) * 100;

    // Feedback based on range loss
    let feedback = "Battery health is good.";
    if (rangeLossPercent > 30) feedback = "Significant battery degradation.";
    else if (rangeLossPercent > 15) feedback = "Moderate battery degradation.";
    else if (rangeLossPercent > 5) feedback = "Minor battery degradation.";

    return {
      primary: `${remainingCapacity.toFixed(2)} kWh`,
      secondary: `$${replacementCost.toFixed(2)}`,
      details: `Estimated battery capacity after ${years} years with ${degradationRate}% annual degradation. Capacity lost: ${capacityLost.toFixed(2)} kWh (${rangeLossPercent.toFixed(1)}%).`,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does battery degradation affect my EV's range over time?",
      answer:
        "Battery degradation reduces the total energy capacity of your EV's battery pack, which directly impacts the driving range. Typically, EV batteries degrade by about 1-3% per year depending on usage, climate, and charging habits. This calculator estimates the remaining battery capacity after a given number of years, helping you understand how much range you might lose over time."
    },
    {
      question: "What factors influence the rate of battery degradation?",
      answer:
        "Several factors affect battery degradation including temperature extremes, frequent fast charging, deep discharges, and high mileage. Proper battery management, moderate charging speeds, and avoiding extreme temperatures can slow degradation. This calculator uses a user-input degradation rate to reflect your specific conditions or manufacturer estimates."
    },
    {
      question: "How is the replacement cost of battery capacity calculated?",
      answer:
        "Replacement cost is estimated by multiplying the lost battery capacity (in kWh) by the cost per kWh to replace or refurbish the battery cells. This cost varies by manufacturer, battery chemistry, and market prices. The calculator allows you to input a custom cost per kWh to get an accurate financial estimate."
    },
    {
      question: "Can I use this calculator for different EV models?",
      answer:
        "Yes, this calculator is designed to be flexible. Simply input your EV's battery capacity, expected degradation rate, years of use, and replacement cost per kWh. This allows you to estimate battery health and replacement costs for any EV model, whether a compact car or a large SUV."
    },
    {
      question: "Why is it important to estimate battery degradation and replacement costs?",
      answer:
        "Estimating battery degradation helps EV owners plan for future range reductions and potential battery replacement expenses. Understanding these factors can influence buying decisions, maintenance planning, and financial budgeting. This calculator provides a clear picture of long-term battery performance and associated costs."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $45,000 electric SUV with a 75 kWh battery, expecting a 2.5% annual degradation rate, and estimating battery replacement cost at $150 per kWh over 8 years.",
    steps: [
      {
        label: "Step 1: Calculate remaining battery capacity",
        explanation:
          "Remaining Capacity = 75 kWh * (1 - 0.025)^8 = 75 * 0.8179 = 61.34 kWh"
      },
      {
        label: "Step 2: Calculate capacity lost",
        explanation:
          "Capacity Lost = 75 - 61.34 = 13.66 kWh"
      },
      {
        label: "Step 3: Calculate replacement cost",
        explanation:
          "Replacement Cost = 13.66 kWh * $150/kWh = $2049"
      },
      {
        label: "Step 4: Interpret results",
        explanation:
          "After 8 years, the battery capacity is estimated at 61.34 kWh, representing an 18.2% loss in capacity. The estimated cost to replace the lost capacity is approximately $2,049."
      }
    ],
    result:
      "Final Result: Remaining battery capacity is 61.34 kWh with an estimated replacement cost of $2,049 after 8 years."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Battery University - How to Prolong Lithium-based Batteries",
      description:
        "Comprehensive guide on lithium-ion battery care and degradation factors.",
      url: "https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries"
    },
    {
      title: "U.S. Department of Energy - Electric Vehicle Battery Life",
      description:
        "Official resource explaining EV battery lifespan and degradation.",
      url: "https://www.energy.gov/eere/vehicles/articles/electric-vehicle-battery-life"
    },
    {
      title: "InsideEVs - EV Battery Replacement Cost Analysis",
      description:
        "Detailed analysis of EV battery replacement costs and market trends.",
      url: "https://insideevs.com/news/341045/how-much-does-it-cost-to-replace-an-ev-battery/"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Battery Capacity (kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 75"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Degradation Rate (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="e.g. 2.5"
            value={inputs.degradationRate}
            onChange={(e) => handleInputChange("degradationRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Years of Use</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 8"
            value={inputs.years}
            onChange={(e) => handleInputChange("years", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Replacement Cost ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 150"
            value={inputs.replacementCostPerKWh}
            onChange={(e) => handleInputChange("replacementCostPerKWh", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 font-semibold text-blue-700">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Enter your EV's battery capacity in kilowatt-hours (kWh). This is usually found in your vehicle specifications.
          </li>
          <li>
            <strong>Step 2:</strong> Input the expected annual battery degradation rate as a percentage. Typical values range from 1% to 3% per year.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the number of years you want to estimate the battery degradation for.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the replacement cost per kWh for your battery pack. This helps estimate the financial impact of capacity loss.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to see the estimated remaining battery capacity, replacement cost, and degradation feedback.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Battery Degradation & Long-Term Range Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicle (EV) batteries degrade over time due to chemical and physical changes within the battery cells. This degradation reduces the battery's total energy capacity, which in turn decreases the vehicle's driving range. Understanding and estimating this degradation is crucial for EV owners to plan for future performance and potential replacement costs.
          </p>
          <p>
            The degradation rate varies depending on factors such as battery chemistry, usage patterns, charging habits, and environmental conditions. Typically, lithium-ion batteries used in EVs degrade at a rate of about 1-3% per year. This calculator uses an exponential decay model to estimate remaining battery capacity after a specified number of years, providing a realistic long-term outlook.
          </p>
          <p>
            Additionally, the calculator estimates the financial impact of battery degradation by calculating the replacement cost of the lost capacity. Battery replacement costs are expressed in dollars per kilowatt-hour and can vary widely depending on the manufacturer and technology. By inputting your own replacement cost, you get a personalized estimate of potential expenses.
          </p>
          <p>
            This tool is valuable for prospective EV buyers, current owners, and fleet managers who want to understand how battery health affects vehicle range and ownership costs over time. It supports informed decision-making regarding vehicle purchase, maintenance, and resale value.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring degradation variability:</strong> Battery degradation rates vary widely based on usage and environment. Using a generic rate without considering your specific conditions can lead to inaccurate estimates.
          </p>
          <p>
            <strong>2. Confusing capacity loss with range loss:</strong> While battery capacity loss reduces range, other factors like driving habits and temperature also affect range. This calculator focuses on capacity degradation only.
          </p>
          <p>
            <strong>3. Using outdated replacement cost data:</strong> Battery replacement costs are decreasing over time. Using old or inflated cost figures may overestimate financial impact.
          </p>
          <p>
            <strong>4. Not accounting for warranty and battery management systems:</strong> Many EVs have warranties covering battery degradation up to a certain percentage, and advanced battery management can slow degradation.
          </p>
          <p>
            <strong>5. Entering unrealistic input values:</strong> Ensure all inputs are positive numbers and within reasonable ranges to get meaningful results.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Battery Degradation & Long-Term Range Estimator"
      description="Professional automotive calculator: EV Battery Degradation & Long-Term Range Estimator. Get accurate estimates, expert advice, and financial insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}