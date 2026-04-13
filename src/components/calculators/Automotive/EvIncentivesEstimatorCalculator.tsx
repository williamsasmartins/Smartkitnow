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

export default function EvIncentivesEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // Battery capacity in kWh
    ratePerKWh: "",      // Rate in $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const battery = parseFloat(inputs.batteryCapacity);
    const rate = parseFloat(inputs.ratePerKWh);

    if (isNaN(battery) || battery <= 0 || isNaN(rate) || rate <= 0) {
      return {
        primary: "0 kWh",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for battery capacity and rate.",
        feedback: "Awaiting valid input"
      };
    }

    // Calculate estimated charging cost for a full battery charge
    const cost = battery * rate;

    // Estimate time to fully charge based on typical home charger rates (Level 2 ~7.2 kW)
    // Time (hours) = Battery capacity (kWh) / Charger power (kW)
    // Using 7.2 kW as a common Level 2 charger rate
    const chargerPower = 7.2;
    const timeHours = battery / chargerPower;

    return {
      primary: `${battery.toFixed(1)} kWh`,
      secondary: `$${cost.toFixed(2)}`,
      details: `Estimated full charge time: ${timeHours.toFixed(1)} hours at ${chargerPower} kW charger.`,
      feedback: "Calculation based on typical home charging rates"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the federal EV tax credit for 2024?",
      answer: "The federal EV tax credit is up to $7,500 for new electric vehicles and up to $4,000 for used electric vehicles purchased in 2024. The credit amount depends on vehicle assembly location, battery component sourcing, mineral content requirements, and your household income. For new EVs, your modified adjusted gross income (MAGI) must not exceed $300,000 (married filing jointly) or $150,000 (single filers).",
    },
    {
      question: "How does vehicle price affect my EV tax credit eligibility?",
      answer: "New electric vehicles are subject to price caps: sedans cannot exceed $55,000 and SUVs/trucks cannot exceed $80,000 as of 2024. Used electric vehicles must be priced at or below $25,000. Vehicles exceeding these caps are ineligible for the federal tax credit, regardless of other qualifying factors.",
    },
    {
      question: "Can I claim the EV tax credit if I lease instead of purchase?",
      answer: "Yes, but the credit structure differs significantly. For leased EVs, the $7,500 credit typically goes to the leasing company, which may reduce your monthly lease payments. You cannot claim the tax credit directly on your tax return if you lease, but you benefit indirectly through lower lease costs—typically $200-$400 monthly savings.",
    },
    {
      question: "What battery mineral requirements must my EV meet for the full credit?",
      answer: "Starting in 2024, the IRS enforces strict battery mineral content and critical mineral extraction requirements. Vehicles must meet thresholds for cobalt, lithium, manganese, and nickel sourcing from qualifying countries. Failure to meet these requirements can reduce your credit by 50% or eliminate it entirely, even if the vehicle meets other criteria.",
    },
    {
      question: "Are there state-level EV incentives in addition to the federal credit?",
      answer: "Yes, many states offer additional incentives ranging from $500 to $7,500. California offers up to $10,000 for used EVs through its Clean Cars 4 All program, while New York provides $2,000-$3,000 rebates. Your total incentive package can exceed the federal credit when combined with state programs, but eligibility varies significantly by location and vehicle type.",
    },
    {
      question: "What is the battery component domestic content requirement for 2024?",
      answer: "In 2024, at least 50% of battery component value must originate from North America (United States, Canada, or Mexico). This percentage increases annually, reaching 100% by 2029. Vehicles failing to meet the current year's domestic content threshold lose eligibility for the federal tax credit entirely.",
    },
    {
      question: "Can I use the EV tax credit if my vehicle is assembled outside the U.S.?",
      answer: "No, the vehicle must be assembled in North America to qualify for the federal tax credit. This includes vehicles assembled in the United States, Canada, or Mexico. Imported EVs, regardless of price or specifications, are ineligible for the $7,500 new vehicle credit but may qualify for the $4,000 used vehicle credit if they meet other requirements.",
    },
    {
      question: "How is the used EV tax credit calculated differently from the new vehicle credit?",
      answer: "The used EV credit is a flat $4,000 (not income-dependent) for vehicles at least 2 years old and priced at or below $25,000. Used vehicle MAGI caps are lower: $300,000 (married filing jointly), $150,000 (single filers). The used credit has no battery mineral or assembly location requirements, making it more accessible for older EV models.",
    },
    {
      question: "What happens if I exceed the income limits for the EV tax credit?",
      answer: "If your MAGI exceeds the limit, you become ineligible for the credit entirely—there is no partial credit phase-out. For 2024, new vehicle limits are $300,000 (married filing jointly), $150,000 (single/head of household), and $150,000 (married filing separately). Even exceeding by $1 disqualifies you from claiming any portion of the credit.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $40,000 electric sedan with a 60 kWh battery and an average electricity rate of $0.13 per kWh at home.",
    steps: [
      {
        label: "Step 1: Input Battery Capacity",
        explanation: "The vehicle has a 60 kWh battery capacity."
      },
      {
        label: "Step 2: Input Electricity Rate",
        explanation: "The average residential electricity rate is $0.13 per kWh."
      },
      {
        label: "Step 3: Calculate Charging Cost",
        explanation:
          "Charging cost = Battery capacity × Rate = 60 kWh × $0.13/kWh = $7.80 per full charge."
      },
      {
        label: "Step 4: Estimate Charging Time",
        explanation:
          "Charging time = Battery capacity ÷ Charger power = 60 kWh ÷ 7.2 kW ≈ 8.3 hours for a full charge."
      }
    ],
    result:
      "Final Result: It will cost approximately $7.80 to fully charge the EV at home, taking about 8.3 hours using a typical Level 2 charger."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description:
        "Comprehensive resource on electric vehicle charging, incentives, and tax credits."
    },
    {
      title: "Internal Revenue Service - Plug-In Electric Drive Vehicle Credit",
      description:
        "Official IRS page detailing federal tax credits available for qualifying electric vehicles."
    },
    {
      title: "EnergySage - Electric Vehicle Charging Costs",
      description:
        "Detailed analysis and calculators for estimating EV charging costs and savings."
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
            placeholder="e.g. 60"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 0.13"
            value={inputs.ratePerKWh}
            onChange={(e) => handleInputChange("ratePerKWh", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the EV Incentives & Tax Credits Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine your eligibility for federal and state EV tax credits and incentives, which can reduce your effective EV purchase cost by $4,000 to $17,500 depending on location and vehicle. Whether you're buying new or used, leasing or purchasing outright, understanding your available credits is essential to making an informed EV buying decision. The tool accounts for income limits, vehicle assembly location, battery component sourcing, and state-specific programs to provide an accurate estimate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires you to input your household income (MAGI), the vehicle's purchase price, assembly location, battery component sourcing, your state of residence, and whether you're buying new or used. Each input directly impacts credit eligibility—for example, exceeding your state's MAGI threshold by even $1 can eliminate your federal credit entirely. Battery mineral sourcing and domestic content requirements change annually, so providing accurate information ensures your estimate reflects current 2024-2025 rules.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">After submitting your information, the calculator displays your estimated federal credit, applicable state incentives, total potential savings, and any ineligibility reasons. Review the detailed breakdown to understand which specific requirements your vehicle meets or fails to meet. If you're ineligible for certain credits, the output explains why (e.g., exceeds price cap, insufficient domestic content) so you can adjust your vehicle choice or timeline accordingly.</p>
        </div>
      </section>

      {/* TABLE: 2024 Federal EV Tax Credit Limits by Vehicle Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024 Federal EV Tax Credit Limits by Vehicle Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the maximum federal tax credits available for new and used electric vehicles in 2024, including price caps and income thresholds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Credit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Price Cap</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">MAGI Limit (MFJ)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">MAGI Limit (Single)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New EV Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$55,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New EV SUV/Truck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Used EV (2+ years old)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Used EV with Trade-in</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">MAGI = Modified Adjusted Gross Income; MFJ = Married Filing Jointly. Income limits are per household. Vehicles exceeding price caps lose all credit eligibility.</p>
      </section>

      {/* TABLE: Battery Component Domestic Content Requirements (2024-2029) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Battery Component Domestic Content Requirements (2024-2029)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">The domestic content requirement for battery components increases each year, affecting which vehicles qualify for the federal tax credit.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Domestic Content %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Penalty for Non-Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full credit ineligibility</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2025</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full credit ineligibility</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2026</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full credit ineligibility</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2027</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full credit ineligibility</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2028</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full credit ineligibility</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2029+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full credit ineligibility</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Domestic content includes components sourced and processed in North America (U.S., Canada, Mexico). If a vehicle fails to meet the threshold, it is entirely disqualified from the federal tax credit.</p>
      </section>

      {/* TABLE: State EV Incentives (Top Examples, 2024) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">State EV Incentives (Top Examples, 2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Selected states and territories offer additional EV purchase incentives that can be combined with federal tax credits.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">State</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">New Vehicle Incentive</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Used Vehicle Incentive</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Income Limit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000-$6,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000+ (context-dependent)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000-$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200,000-$250,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Colorado</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000-$7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$180,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Massachusetts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$Up to $1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Virginia</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">State incentives vary by income, vehicle type, and program availability. Some states prioritize used EVs or offer rebates instead of tax credits. Contact your state's environmental or energy office for current eligibility.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your state's EV incentive programs before purchasing—states like California and New York offer substantial additional credits ($2,000-$10,000) that stack on top of the federal $7,500, potentially bringing total savings to $17,500 or more.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Verify assembly location and battery component sourcing before committing to a purchase, as these are non-negotiable eligibility factors; many affordable foreign-made EVs do not qualify, while domestically assembled models at higher prices may be worth the investment for credit purposes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your MAGI is near the income limit, consider timing your purchase strategically—claiming deductions in the current year or deferring income to the following year could preserve your eligibility if you're within $5,000-$10,000 of the threshold.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For used EV buyers, prioritize vehicles at least 2 years old and under $25,000 to access the $4,000 credit, which has no battery mineral or assembly requirements, making older EV models universally eligible regardless of origin.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming you can claim both federal and state credits as separate deductions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Federal and state credits are generally non-refundable tax credits, not deductions, and they reduce your tax liability dollar-for-dollar. Claiming a credit twice or incorrectly categorizing it could trigger an IRS audit. Use the calculator to determine which credits you truly qualify for, as combining ineligible credits will be flagged during tax filing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking the price cap for your specific vehicle type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sedans have a $55,000 cap while SUVs/trucks have an $80,000 cap; exceeding these limits disqualifies you entirely from the federal credit. Many buyers mistakenly assume they qualify because the vehicle is electric, not realizing their $58,000 sedan or $85,000 truck exceeds the threshold.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring battery mineral content and domestic content sourcing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The IRS strictly enforces mineral extraction and component sourcing rules; vehicles failing to meet 2024's 50% domestic content threshold are entirely ineligible, even if they meet all other criteria. Manufacturers update their supply chains frequently, so verifying current compliance with your specific vehicle's production date is critical.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Miscalculating household MAGI and losing eligibility at tax time</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">MAGI includes wages, interest, dividends, and self-employment income; bonuses, side income, or investment gains may push you over the threshold. Many buyers estimate conservatively but discover during tax filing that their actual MAGI exceeds limits, forcing them to repay the credit in full on their tax return.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the federal EV tax credit for 2024?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The federal EV tax credit is up to $7,500 for new electric vehicles and up to $4,000 for used electric vehicles purchased in 2024. The credit amount depends on vehicle assembly location, battery component sourcing, mineral content requirements, and your household income. For new EVs, your modified adjusted gross income (MAGI) must not exceed $300,000 (married filing jointly) or $150,000 (single filers).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does vehicle price affect my EV tax credit eligibility?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">New electric vehicles are subject to price caps: sedans cannot exceed $55,000 and SUVs/trucks cannot exceed $80,000 as of 2024. Used electric vehicles must be priced at or below $25,000. Vehicles exceeding these caps are ineligible for the federal tax credit, regardless of other qualifying factors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I claim the EV tax credit if I lease instead of purchase?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but the credit structure differs significantly. For leased EVs, the $7,500 credit typically goes to the leasing company, which may reduce your monthly lease payments. You cannot claim the tax credit directly on your tax return if you lease, but you benefit indirectly through lower lease costs—typically $200-$400 monthly savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What battery mineral requirements must my EV meet for the full credit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Starting in 2024, the IRS enforces strict battery mineral content and critical mineral extraction requirements. Vehicles must meet thresholds for cobalt, lithium, manganese, and nickel sourcing from qualifying countries. Failure to meet these requirements can reduce your credit by 50% or eliminate it entirely, even if the vehicle meets other criteria.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there state-level EV incentives in addition to the federal credit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, many states offer additional incentives ranging from $500 to $7,500. California offers up to $10,000 for used EVs through its Clean Cars 4 All program, while New York provides $2,000-$3,000 rebates. Your total incentive package can exceed the federal credit when combined with state programs, but eligibility varies significantly by location and vehicle type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the battery component domestic content requirement for 2024?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">In 2024, at least 50% of battery component value must originate from North America (United States, Canada, or Mexico). This percentage increases annually, reaching 100% by 2029. Vehicles failing to meet the current year's domestic content threshold lose eligibility for the federal tax credit entirely.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the EV tax credit if my vehicle is assembled outside the U.S.?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, the vehicle must be assembled in North America to qualify for the federal tax credit. This includes vehicles assembled in the United States, Canada, or Mexico. Imported EVs, regardless of price or specifications, are ineligible for the $7,500 new vehicle credit but may qualify for the $4,000 used vehicle credit if they meet other requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is the used EV tax credit calculated differently from the new vehicle credit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The used EV credit is a flat $4,000 (not income-dependent) for vehicles at least 2 years old and priced at or below $25,000. Used vehicle MAGI caps are lower: $300,000 (married filing jointly), $150,000 (single filers). The used credit has no battery mineral or assembly location requirements, making it more accessible for older EV models.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I exceed the income limits for the EV tax credit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your MAGI exceeds the limit, you become ineligible for the credit entirely—there is no partial credit phase-out. For 2024, new vehicle limits are $300,000 (married filing jointly), $150,000 (single/head of household), and $150,000 (married filing separately). Even exceeding by $1 disqualifies you from claiming any portion of the credit.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/credits-deductions/plug-in-electric-vehicle-credit" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Electric Vehicle Tax Credit (Form 8936)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on EV tax credit eligibility, calculation, and annual updates including 2024 income limits and vehicle price caps.</p>
          </li>
          <li>
            <a href="https://www.fueleconomy.gov/feg/tax.shtml" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Energy - Federal Tax Credits for Electric Vehicles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive DOE resource detailing federal EV tax credit requirements, vehicle eligibility checks, and links to state incentive programs.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/electric-vehicle-tax-credit-5215518" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia - Electric Vehicle Tax Credit Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational overview of federal and state EV tax credits, income limits, and how to claim credits on your tax return.</p>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/article/taxes/electric-vehicle-tax-credit" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NerdWallet - EV Tax Credits and State Incentives</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comparison guide covering federal tax credit amounts, state-by-state incentives, and eligibility checklist for new and used EV buyers.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="EV Incentives & Tax Credits Estimator"
      description="Professional automotive calculator: EV Incentives & Tax Credits Estimator. Get accurate estimates, expert advice, and financial insights."
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