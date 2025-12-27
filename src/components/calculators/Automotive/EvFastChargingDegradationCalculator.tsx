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

export default function EvFastChargingDegradationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    fastChargeSessionsPerMonth: "", // number of fast charges per month
    fastChargeRate: "", // $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Assumptions and logic:
   * - Fast charging degrades battery faster than normal charging.
   * - Typical battery degradation from fast charging is about 2-3% capacity loss per 1000 fast charges.
   * - We'll use 2.5% degradation per 1000 fast charges as a baseline.
   * - Battery replacement cost estimated at $150/kWh (industry average).
   * - Calculate monthly degradation cost and time to 20% capacity loss (end of useful battery life).
   */

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const fastChargeSessionsPerMonth = parseFloat(inputs.fastChargeSessionsPerMonth);
    const fastChargeRate = parseFloat(inputs.fastChargeRate);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(fastChargeSessionsPerMonth) || fastChargeSessionsPerMonth < 0 ||
      isNaN(fastChargeRate) || fastChargeRate <= 0
    ) {
      return {
        primary: "N/A",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting input"
      };
    }

    // Constants
    const degradationPer1000FastCharges = 0.025; // 2.5% battery capacity loss per 1000 fast charges
    const batteryReplacementCostPerKWh = 150; // $150 per kWh battery replacement cost
    const endOfLifeCapacityLoss = 0.20; // 20% capacity loss considered end of battery life

    // Monthly degradation fraction
    const monthlyDegradationFraction = (fastChargeSessionsPerMonth / 1000) * degradationPer1000FastCharges;

    // Months to reach 20% capacity loss
    const monthsToEndOfLife = endOfLifeCapacityLoss / monthlyDegradationFraction;

    // Battery replacement cost total
    const batteryReplacementCostTotal = batteryCapacity * batteryReplacementCostPerKWh;

    // Monthly battery degradation cost (pro-rated)
    const monthlyDegradationCost = batteryReplacementCostTotal * monthlyDegradationFraction;

    // Monthly fast charging energy consumed (kWh)
    // Assume one full battery charge per fast charge session (simplification)
    const monthlyEnergyFastCharged = batteryCapacity * fastChargeSessionsPerMonth;

    // Monthly fast charging cost
    const monthlyFastChargingCost = monthlyEnergyFastCharged * fastChargeRate;

    // Total monthly cost impact (battery degradation cost + charging cost)
    const totalMonthlyCost = monthlyDegradationCost + monthlyFastChargingCost;

    return {
      primary: monthsToEndOfLife > 0 && monthsToEndOfLife < 1000
        ? `${monthsToEndOfLife.toFixed(0)} months`
        : monthsToEndOfLife >= 1000
          ? "> 1000 months"
          : "N/A",
      secondary: `$${totalMonthlyCost.toFixed(2)}`,
      details: `Battery replacement cost estimate: $${batteryReplacementCostTotal.toFixed(0)}. Monthly degradation cost: $${monthlyDegradationCost.toFixed(2)}. Monthly fast charging cost: $${monthlyFastChargingCost.toFixed(2)}.`,
      feedback: monthsToEndOfLife < 24
        ? "High fast charging frequency may significantly reduce battery life."
        : monthsToEndOfLife < 60
          ? "Moderate fast charging frequency with noticeable battery degradation."
          : "Low fast charging frequency with minimal battery degradation."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does fast charging impact EV battery life?",
      answer:
        "Fast charging generates higher heat and stresses the battery cells more than slower charging methods, accelerating chemical degradation. Typically, frequent fast charging can reduce battery capacity by around 2-3% per 1000 fast charge cycles. This degradation shortens the overall battery lifespan, potentially leading to earlier replacement and higher costs."
    },
    {
      question: "What factors influence battery degradation from fast charging?",
      answer:
        "Battery degradation depends on factors such as charging speed, battery chemistry, ambient temperature, and usage patterns. High charging rates and elevated temperatures increase degradation rates. Additionally, the state of charge during fast charging and the battery management system's efficiency also play crucial roles."
    },
    {
      question: "Can fast charging costs outweigh the benefits?",
      answer:
        "While fast charging offers convenience, it can increase operational costs due to accelerated battery wear and higher electricity rates. The calculator helps estimate these costs by combining degradation expenses with charging fees, enabling users to balance convenience against long-term financial impact."
    },
    {
      question: "How accurate are the degradation cost estimates?",
      answer:
        "Estimates are based on industry averages and typical degradation rates but can vary by vehicle model, battery technology, and user habits. The calculator provides a useful approximation but should be complemented with manufacturer data and real-world observations for precise planning."
    },
    {
      question: "How can I minimize battery degradation from fast charging?",
      answer:
        "To reduce degradation, limit fast charging sessions, avoid charging to 100% frequently, and keep the battery within moderate state-of-charge ranges. Using slower charging methods when possible and parking in cool environments also helps maintain battery health over time."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 75 kWh electric SUV with an average of 10 fast charging sessions per month at a fast charging rate of $0.40 per kWh.",
    steps: [
      {
        label: "Step 1: Calculate monthly battery degradation fraction",
        explanation:
          "Degradation per 1000 fast charges = 2.5%. Monthly fast charges = 10. Monthly degradation fraction = (10 / 1000) * 0.025 = 0.00025 (0.025%)."
      },
      {
        label: "Step 2: Calculate months to reach 20% capacity loss",
        explanation:
          "Months to end of life = 0.20 / 0.00025 = 800 months (~66.7 years)."
      },
      {
        label: "Step 3: Calculate battery replacement cost",
        explanation:
          "Battery capacity = 75 kWh. Replacement cost per kWh = $150. Total replacement cost = 75 * 150 = $11,250."
      },
      {
        label: "Step 4: Calculate monthly degradation cost",
        explanation:
          "Monthly degradation cost = $11,250 * 0.00025 = $2.81."
      },
      {
        label: "Step 5: Calculate monthly fast charging energy and cost",
        explanation:
          "Energy per session = 75 kWh. Monthly energy = 75 * 10 = 750 kWh. Monthly charging cost = 750 * $0.40 = $300."
      },
      {
        label: "Step 6: Calculate total monthly cost impact",
        explanation:
          "Total monthly cost = $2.81 (degradation) + $300 (charging) = $302.81."
      }
    ],
    result:
      "The SUV owner can expect the battery to last approximately 66.7 years at this fast charging rate, with a monthly cost impact of about $303 including charging and battery degradation."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Battery University: How to Prolong Lithium-based Batteries",
      description:
        "Comprehensive guide on lithium battery care and degradation factors."
    },
    {
      title: "DOE: Electric Vehicle Battery Life and Degradation",
      description:
        "U.S. Department of Energy resource on EV battery lifespan and charging impacts."
    },
    {
      title: "InsideEVs: EV Battery Replacement Costs and Lifespan",
      description:
        "Industry insights on battery replacement expenses and longevity."
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
          <Label>Fast Charge Sessions per Month</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 10"
            value={inputs.fastChargeSessionsPerMonth}
            onChange={(e) => handleInputChange("fastChargeSessionsPerMonth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Fast Charging Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 0.40"
            value={inputs.fastChargeRate}
            onChange={(e) => handleInputChange("fastChargeRate", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 text-sm font-medium text-blue-700">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter your EV's battery capacity in kilowatt-hours (kWh). This is typically found in your vehicle's specifications.
          </li>
          <li>
            <strong>Step 2:</strong> Input the average number of fast charging sessions you perform each month. This reflects how often you use DC fast chargers.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the cost per kWh you pay for fast charging. This can vary by location and charging network.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to see the estimated impact of fast charging on your battery life and the associated monthly cost.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results, including estimated months until 20% battery capacity loss and combined monthly costs from degradation and charging.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Fast Charging Impact on Battery Life Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicle (EV) batteries degrade over time due to chemical and physical changes within the cells. One of the key factors accelerating this degradation is the use of fast charging, which subjects the battery to higher currents and increased heat. This calculator estimates the impact of fast charging on your EV battery life by considering your battery size, the frequency of fast charging sessions, and the cost of electricity at fast chargers.
          </p>
          <p>
            The calculator uses an industry-standard assumption that fast charging causes approximately 2.5% battery capacity loss per 1000 fast charge cycles. By inputting how many fast charges you perform monthly, it estimates how quickly your battery will degrade to 80% of its original capacity, which is commonly considered the end of useful battery life. It also factors in the cost of replacing the battery, estimated at $150 per kWh, to provide a monthly cost impact of degradation.
          </p>
          <p>
            Additionally, the calculator includes the direct cost of electricity consumed during fast charging, helping you understand the total monthly financial impact. This insight allows EV owners to balance the convenience of fast charging with the potential long-term costs, encouraging smarter charging habits that can extend battery life and reduce expenses.
          </p>
          <p>
            Keep in mind that actual degradation rates vary by battery chemistry, vehicle model, ambient conditions, and charging habits. This tool provides a useful estimate to guide your decisions but should be complemented with manufacturer recommendations and real-world experience.
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
            <strong>1. Ignoring the frequency of fast charging:</strong> Many users underestimate how often they fast charge, leading to inaccurate degradation estimates. Always input realistic monthly fast charge counts.
          </p>
          <p>
            <strong>2. Using average electricity rates instead of fast charging rates:</strong> Fast charging often costs more than home charging. Using incorrect rates can skew cost calculations.
          </p>
          <p>
            <strong>3. Assuming all fast charges fully recharge the battery:</strong> Partial charges still contribute to degradation but may affect calculations differently. This calculator assumes full charges for simplicity.
          </p>
          <p>
            <strong>4. Overlooking environmental factors:</strong> High temperatures and extreme conditions can accelerate degradation beyond the calculator’s estimates.
          </p>
          <p>
            <strong>5. Not considering battery chemistry differences:</strong> Different EVs use different battery chemistries with varying degradation profiles; this tool uses average values.
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
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="EV Fast Charging Impact on Battery Life Calculator"
      description="Professional automotive calculator: EV Fast Charging Impact on Battery Life Calculator. Get accurate estimates, expert advice, and financial insights."
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