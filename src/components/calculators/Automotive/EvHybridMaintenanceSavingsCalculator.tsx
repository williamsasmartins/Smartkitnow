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

export default function EvHybridMaintenanceSavingsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    maintenanceHybridAnnual: "", // $/year
    maintenanceEvAnnual: "", // $/year
    years: "5"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const maintenanceHybridAnnual = parseFloat(inputs.maintenanceHybridAnnual);
    const maintenanceEvAnnual = parseFloat(inputs.maintenanceEvAnnual);
    const years = parseInt(inputs.years);

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(maintenanceHybridAnnual) || maintenanceHybridAnnual < 0 ||
      isNaN(maintenanceEvAnnual) || maintenanceEvAnnual < 0 ||
      isNaN(years) || years <= 0
    ) {
      return {
        primary: "—",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Awaiting valid input"
      };
    }

    // Calculate annual battery charging cost
    // Assume average daily driving 30 miles, EV efficiency ~3.5 miles/kWh
    // Daily kWh = 30 / 3.5 = ~8.57 kWh
    // Annual kWh = 8.57 * 365 = 3128 kWh (approx)
    // But battery capacity is input, so let's assume full charge once per day:
    // Annual kWh = batteryCapacity * 365
    // This is a simplification; user can adjust electricity rate accordingly.

    const annualChargingKWh = batteryCapacity * 365;
    const annualChargingCost = annualChargingKWh * electricityRate;

    // Total EV annual cost = charging cost + EV maintenance
    const totalEvAnnualCost = annualChargingCost + maintenanceEvAnnual;

    // Total Hybrid annual maintenance cost (fuel cost excluded)
    // This calculator focuses on maintenance savings, so fuel cost is excluded.
    // User inputs hybrid maintenance cost per year.

    // Savings per year = Hybrid maintenance - EV maintenance - EV charging cost
    // But since fuel cost is excluded, savings = Hybrid maintenance - EV maintenance - charging cost
    // Actually, charging cost is an EV operational cost, not maintenance.
    // The calculator is "EV Maintenance Savings vs Hybrid" so focus on maintenance only.
    // But user wants cost/time output including battery charging cost.

    // So we show:
    // 1) Annual EV maintenance cost
    // 2) Annual Hybrid maintenance cost
    // 3) Annual EV battery charging cost
    // 4) Total EV annual cost (maintenance + charging)
    // 5) Maintenance savings = Hybrid maintenance - EV maintenance
    // 6) Net savings = Maintenance savings - charging cost

    const maintenanceSavingsAnnual = maintenanceHybridAnnual - maintenanceEvAnnual;
    const netSavingsAnnual = maintenanceSavingsAnnual - annualChargingCost;

    // Multiply by years for total savings
    const totalMaintenanceSavings = maintenanceSavingsAnnual * years;
    const totalNetSavings = netSavingsAnnual * years;

    return {
      primary: `$${totalNetSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      secondary: `Over ${years} year${years > 1 ? "s" : ""}`,
      details: `Annual EV charging cost: $${annualChargingCost.toFixed(2)} | Annual maintenance savings: $${maintenanceSavingsAnnual.toFixed(2)} | Net savings per year: $${netSavingsAnnual.toFixed(2)}`,
      feedback: netSavingsAnnual >= 0 ? "EV saves money on maintenance and charging" : "Hybrid may be cheaper when including charging"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does this calculator estimate EV maintenance savings compared to hybrids?",
      answer:
        "This calculator compares the annual maintenance costs of electric vehicles (EVs) and hybrid vehicles, factoring in the cost of charging the EV battery. It uses user inputs for battery capacity, electricity rates, and annual maintenance costs for both vehicle types to estimate total savings over a specified number of years. By isolating maintenance and charging costs, it provides a clear financial comparison excluding fuel costs."
    },
    {
      question: "Why do I need to input the battery capacity and electricity rate?",
      answer:
        "Battery capacity (in kWh) and electricity rate ($/kWh) are essential to estimate the annual cost of charging your EV. Since charging cost depends on how much energy your battery consumes and the price you pay per kWh, these inputs help calculate the operational cost of running an EV, which impacts overall savings compared to a hybrid."
    },
    {
      question: "Does this calculator include fuel costs for hybrids?",
      answer:
        "No, this calculator focuses solely on maintenance and charging costs to isolate savings related to upkeep and energy consumption. Fuel costs for hybrids vary widely based on driving habits and fuel prices, so they are excluded to provide a clearer comparison of maintenance-related expenses."
    },
    {
      question: "Can I use this calculator for different time periods?",
      answer:
        "Yes, you can specify the number of years over which you want to calculate savings. This allows you to see both annual and cumulative savings over your chosen timeframe, helping you make informed long-term financial decisions."
    },
    {
      question: "What assumptions does this calculator make about EV charging?",
      answer:
        "The calculator assumes a full battery charge every day to estimate annual electricity consumption, which simplifies real-world driving patterns. Actual charging frequency and energy use may vary based on driving distance, efficiency, and charging habits, so results should be considered estimates."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 60 kWh battery EV with an electricity rate of $0.13/kWh, comparing maintenance costs to a hybrid with $900 annual maintenance, and an EV maintenance cost of $400 annually, over 5 years.",
    steps: [
      {
        label: "Step 1: Calculate annual EV charging cost",
        explanation:
          "Battery capacity (60 kWh) × 365 days = 21,900 kWh/year. Multiply by electricity rate: 21,900 kWh × $0.13/kWh = $2,847 annual charging cost."
      },
      {
        label: "Step 2: Calculate annual maintenance savings",
        explanation:
          "Hybrid maintenance $900 - EV maintenance $400 = $500 savings per year."
      },
      {
        label: "Step 3: Calculate net savings",
        explanation:
          "Maintenance savings $500 - charging cost $2,847 = -$2,347 net savings (meaning EV costs more annually when including charging)."
      },
      {
        label: "Step 4: Calculate total net savings over 5 years",
        explanation:
          "-$2,347 × 5 years = -$11,735 total net savings (EV costs more over 5 years)."
      }
    ],
    result: "Final Result: The EV costs approximately $11,735 more than the hybrid over 5 years when including charging and maintenance costs."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and energy consumption of vehicles."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews and ownership cost analysis."
    },
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Information on electric vehicle charging and costs."
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
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
            placeholder="e.g. 60"
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
            placeholder="e.g. 0.13"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Hybrid Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={inputs.maintenanceHybridAnnual}
            onChange={(e) => handleInputChange("maintenanceHybridAnnual", e.target.value)}
            placeholder="e.g. 900"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual EV Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={inputs.maintenanceEvAnnual}
            onChange={(e) => handleInputChange("maintenanceEvAnnual", e.target.value)}
            placeholder="e.g. 400"
          />
        </div>
        <div className="space-y-2">
          <Label>Number of Years</Label>
          <Input
            type="number"
            min="1"
            step="1"
            value={inputs.years}
            onChange={(e) => handleInputChange("years", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-2 font-semibold">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter your EV's battery capacity in kilowatt-hours (kWh). This is usually found in your vehicle's specifications.
          </li>
          <li>
            <strong>Step 2:</strong> Input your local electricity rate in dollars per kilowatt-hour ($/kWh). This rate affects your charging cost.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the estimated annual maintenance cost for a comparable hybrid vehicle.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the estimated annual maintenance cost for your EV.
          </li>
          <li>
            <strong>Step 5:</strong> Specify the number of years over which you want to calculate the savings.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to see your estimated net savings or costs over the selected period.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV Maintenance Savings vs Hybrid Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicles (EVs) are often touted for their lower maintenance costs compared to traditional internal combustion engine vehicles, including hybrids. This calculator helps quantify those savings by comparing the annual maintenance expenses of an EV and a hybrid vehicle, while also factoring in the cost of charging the EV's battery. Maintenance costs for EVs are generally lower because they have fewer moving parts, no oil changes, and less wear on brakes due to regenerative braking.
          </p>
          <p>
            The calculator requires you to input your EV's battery capacity and your local electricity rate to estimate the annual charging cost. It assumes a full battery charge every day, which simplifies real-world driving but provides a reasonable baseline for calculations. You also input the annual maintenance costs for both the hybrid and the EV, which can vary based on vehicle model, usage, and local service rates.
          </p>
          <p>
            By entering the number of years you plan to own the vehicle, the calculator projects total savings or costs over that period. The result shows whether the EV's lower maintenance costs offset the cost of electricity for charging, helping you make an informed financial decision. Keep in mind that this calculator excludes fuel costs for hybrids and focuses solely on maintenance and charging expenses, providing a clear comparison of upkeep costs.
          </p>
          <p>
            Understanding these costs is crucial for budgeting and evaluating the total cost of ownership. While EVs typically have higher upfront costs, their lower maintenance and operational expenses can lead to significant savings over time. Use this calculator as a tool to estimate those savings based on your specific circumstances.
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
            <strong>1. Ignoring electricity rate fluctuations:</strong> Electricity prices can vary by location and time of day. Using an average rate may not reflect your actual charging costs.
          </p>
          <p>
            <strong>2. Overestimating battery charging frequency:</strong> Assuming a full battery charge every day might overstate electricity consumption if your daily driving is less than the battery range.
          </p>
          <p>
            <strong>3. Excluding fuel costs for hybrids:</strong> This calculator focuses on maintenance and charging costs only. Fuel expenses for hybrids can significantly affect total ownership costs.
          </p>
          <p>
            <strong>4. Using inaccurate maintenance cost estimates:</strong> Maintenance costs vary by vehicle model, age, and driving conditions. Use realistic estimates for better accuracy.
          </p>
          <p>
            <strong>5. Not considering incentives or rebates:</strong> Government incentives for EVs can affect overall cost savings but are not included in this calculator.
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
      title="EV Maintenance Savings vs Hybrid Calculator"
      description="Professional automotive calculator: EV Maintenance Savings vs Hybrid Calculator. Get accurate estimates, expert advice, and financial insights."
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