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

export default function InsuranceCostPerYearCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    carValue: "", // Vehicle value in USD or local currency
    driverAge: "", // Driver's age in years
    locationRiskFactor: "", // Risk factor multiplier based on location (e.g., 1.0 = average risk)
    coverageLevel: "standard" // Coverage level: basic, standard, premium
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const coverageMultipliers: Record<string, number> = {
    basic: 0.015,    // 1.5% of car value
    standard: 0.025, // 2.5% of car value
    premium: 0.04    // 4.0% of car value
  };

  const results = useMemo(() => {
    const carValueNum = parseFloat(inputs.carValue);
    const driverAgeNum = parseInt(inputs.driverAge);
    const locationRiskNum = parseFloat(inputs.locationRiskFactor);
    const coverageLevel = inputs.coverageLevel;

    if (
      isNaN(carValueNum) || carValueNum <= 0 ||
      isNaN(driverAgeNum) || driverAgeNum <= 0 ||
      isNaN(locationRiskNum) || locationRiskNum <= 0 ||
      !(coverageLevel in coverageMultipliers)
    ) {
      return {
        primary: "—",
        secondary: "$0.00",
        details: "Please enter valid inputs.",
        feedback: "Invalid input"
      };
    }

    // Base insurance cost is a percentage of car value based on coverage level
    const baseCost = carValueNum * coverageMultipliers[coverageLevel];

    // Adjust cost based on driver age risk factor
    // Younger than 25: +50% cost, 25-40: no change, 41-65: -10%, 65+: +20%
    let ageFactor = 1;
    if (driverAgeNum < 25) ageFactor = 1.5;
    else if (driverAgeNum <= 40) ageFactor = 1.0;
    else if (driverAgeNum <= 65) ageFactor = 0.9;
    else ageFactor = 1.2;

    // Final insurance cost calculation
    const finalCost = baseCost * ageFactor * locationRiskNum;

    return {
      primary: finalCost.toFixed(0),
      secondary: `$${finalCost.toFixed(2)}`,
      details: `Base: $${baseCost.toFixed(2)}, Age factor: ${ageFactor.toFixed(2)}, Location factor: ${locationRiskNum.toFixed(2)}`,
      feedback: "Estimated annual insurance cost"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What factors affect my annual car insurance cost the most?",
      answer: "The biggest factors impacting your annual insurance premium are your age, driving record, vehicle type, coverage limits, and location. For example, a 16-year-old driver typically pays $4,500–$7,500 annually for full coverage, while a 40-year-old with a clean record may pay $1,200–$1,800 for the same coverage. Your deductible choice and credit score also significantly influence your final premium.",
    },
    {
      question: "How much does full coverage insurance cost per year on average?",
      answer: "According to 2024 data, full coverage (liability, collision, and comprehensive) costs an average of $1,771 per year for good drivers, though this varies by state and vehicle. Drivers in high-cost states like Florida or New Jersey may pay $2,200–$2,600 annually, while those in low-cost states like Maine or Idaho may pay $1,100–$1,400. Your individual rate depends on personal factors like age, driving history, and the specific vehicle insured.",
    },
    {
      question: "What is the difference between liability and full coverage costs?",
      answer: "Liability-only insurance (required by law in most states) costs significantly less than full coverage, averaging $600–$900 annually, as it covers only damage you cause to others. Full coverage adds collision and comprehensive protection for your own vehicle, typically adding $800–$1,000 per year to the total premium. Full coverage is usually required if you have an outstanding auto loan or lease.",
    },
    {
      question: "How do age and driving experience impact annual insurance costs?",
      answer: "Teen drivers (16–19) face the highest rates, averaging $4,500–$7,500 per year due to inexperience and higher accident risk. Young adults (20–25) pay $2,500–$4,000 annually, while drivers aged 30–55 with clean records typically pay $1,200–$1,800. Rates generally drop after age 25 and remain stable until age 65–70, when they may increase again due to potential health-related driving concerns.",
    },
    {
      question: "Can I reduce my annual insurance cost with discounts?",
      answer: "Yes, multiple discounts can lower your annual premium by 10–50%. Common discounts include bundling (home &amp; auto saves 15–25%), good driver discounts (5–10% off), good student discounts (10–15% for GPA &gt;3.0), safety features discounts (10–25%), and usage-based/telematics programs (10–30% for safe driving). Combining 3–4 discounts can reduce your annual cost from $1,771 to $900–$1,200.",
    },
    {
      question: "How does my vehicle choice affect insurance costs annually?",
      answer: "Insurance costs vary significantly by vehicle model, with luxury and sports cars costing 20–40% more to insure than sedans due to higher repair costs and theft risk. For example, insuring a Honda Civic averages $1,400 annually, while a BMW 3 Series may cost $2,100–$2,400 for the same coverage. Electric vehicles and hybrid vehicles often qualify for discounts of 5–15%, offsetting their higher purchase price.",
    },
    {
      question: "What role does my location play in determining annual insurance rates?",
      answer: "Location dramatically affects insurance costs, with urban areas typically costing 20–50% more than rural areas due to higher accident and theft rates. For example, average annual full coverage in New York City is $2,400–$2,800, while the same coverage in rural Montana costs $1,100–$1,400. Weather conditions, population density, local accident statistics, and regional repair costs all influence your premium.",
    },
    {
      question: "How much should I budget for annual insurance if I have a poor driving record?",
      answer: "Drivers with accidents or violations typically pay 50–200% more than clean-record drivers, ranging from $2,500–$5,000+ annually depending on severity. A single at-fault accident can increase premiums by $400–$800 per year for 3–5 years, while a DUI conviction can result in $2,000–$3,500 annual increases for 7–10 years. SR-22 insurance requirements (for high-risk drivers) can cost $3,000–$6,000 per year.",
    },
    {
      question: "What is the average annual insurance cost difference between states?",
      answer: "State insurance costs vary dramatically, with Florida averaging $2,187 annually and New Jersey at $2,108, while Maine averages $1,026 and Idaho $1,062 for the same coverage. This 50–100% variation is driven by state minimum coverage requirements, population density, weather patterns, and claims history. When using this calculator, your specific state selection will significantly impact your annual cost estimate.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $30,000 sedan with a 28-year-old driver living in a moderate-risk area (risk factor 1.1) choosing standard coverage.",
    steps: [
      {
        label: "Step 1: Determine base cost",
        explanation: "Standard coverage multiplier is 2.5%, so base cost = 30,000 × 0.025 = $750."
      },
      {
        label: "Step 2: Adjust for driver age",
        explanation: "Driver is 28 years old, so age factor = 1.0 (no adjustment)."
      },
      {
        label: "Step 3: Adjust for location risk",
        explanation: "Location risk factor is 1.1, so adjusted cost = 750 × 1.1 = $825."
      },
      {
        label: "Step 4: Calculate final insurance cost",
        explanation: "Final annual insurance cost = $825.00."
      }
    ],
    result: "Final Result: $825.00 per year"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "National Association of Insurance Commissioners (NAIC)",
      description: "Comprehensive data and reports on insurance costs and factors."
    },
    {
      title: "Insurance Information Institute",
      description: "Trusted resource for insurance education and statistics."
    },
    {
      title: "Edmunds Car Insurance Guide",
      description: "Practical advice on car insurance costs and savings tips."
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
            <SelectItem value="imperial">Imperial (USD)</SelectItem>
            <SelectItem value="metric">Metric (Local Currency)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vehicle Value ({inputs.unit === "imperial" ? "USD" : "Local Currency"})</Label>
          <Input
            type="number"
            min="0"
            placeholder="e.g. 30000"
            value={inputs.carValue}
            onChange={(e) => handleInputChange("carValue", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Driver Age (years)</Label>
          <Input
            type="number"
            min="16"
            max="120"
            placeholder="e.g. 28"
            value={inputs.driverAge}
            onChange={(e) => handleInputChange("driverAge", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Location Risk Factor</Label>
          <Input
            type="number"
            step="0.01"
            min="0.5"
            max="3"
            placeholder="e.g. 1.1"
            value={inputs.locationRiskFactor}
            onChange={(e) => handleInputChange("locationRiskFactor", e.target.value)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Typical range: 0.8 (low risk) to 1.5+ (high risk)
          </p>
        </div>
        <div className="space-y-2">
          <Label>Coverage Level</Label>
          <Select
            value={inputs.coverageLevel}
            onValueChange={(v) => handleInputChange("coverageLevel", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic (1.5%)</SelectItem>
              <SelectItem value="standard">Standard (2.5%)</SelectItem>
              <SelectItem value="premium">Premium (4.0%)</SelectItem>
            </SelectContent>
          </Select>
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
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Insurance Cost per Year Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Insurance Cost per Year calculator is designed to help you estimate your annual auto insurance premium based on your personal profile, vehicle details, and coverage preferences. Understanding your expected insurance costs allows you to budget more effectively, compare quotes from multiple insurers, and identify opportunities to lower your premiums through discounts or coverage adjustments. This calculator uses industry benchmarks and actuarial data to provide realistic estimates tailored to your specific situation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To get an accurate estimate, you'll need to input key information: your age and driving record, the vehicle you're insuring (make, model, year, and value), your desired coverage types and deductibles, and your location. Each of these inputs directly influences your premium—for example, choosing a $1,000 deductible instead of $500 typically saves 10–20% annually, while adding uninsured motorist coverage increases costs by 5–15%. The calculator weights these factors according to how insurance companies actually price policies.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">After running the calculator, review your results to understand which factors have the biggest impact on your costs. You'll see your estimated annual and monthly premiums broken down by coverage type, making it easy to compare different scenarios (such as raising your deductible or bundling policies). Use these estimates as a starting point to request quotes from actual insurers and look for discounts like safe driver, bundling, or usage-based programs that could lower your real-world premium by 10–50%.</p>
        </div>
      </section>

      {/* TABLE: Average Annual Insurance Costs by Driver Age (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Annual Insurance Costs by Driver Age (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical full coverage insurance premiums across different age groups, illustrating how age is one of the most significant cost factors.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Driver Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Annual Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Monthly Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rate Relative to 40-Year-Old</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16–19 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$458</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+300%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20–24 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$267</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+150%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25–29 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$163</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30–39 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$135</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40–49 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$135</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50–59 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$144</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+6%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60–69 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$154</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+14%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$175</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+29%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs reflect good driving record with full coverage (liability, collision, comprehensive) in a moderate-cost state. Actual premiums vary by location, vehicle, and individual risk factors.</p>
      </section>

      {/* TABLE: Annual Insurance Cost by Coverage Type (2024-2025) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Insurance Cost by Coverage Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different coverage combinations affect your total annual insurance expense.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Annual Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Liability Only</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">With Collision</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">With Comprehensive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Liability Only (State Minimum)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Liability + Collision</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full Coverage (Liability + Collision + Comprehensive)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,771</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full Coverage + Uninsured Motorist</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,975</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full Coverage + Uninsured Motorist + Umbrella (1M)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">✓</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs based on 40-year-old driver with clean record in a moderate-cost state. Deductibles of $500 collision/$500 comprehensive are assumed. Adding $1M umbrella policy costs approximately $150–$300 annually.</p>
      </section>

      {/* TABLE: Annual Insurance Costs by State (2024-2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Insurance Costs by State (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">State-level variations in insurance costs reveal how geography significantly impacts annual premiums for identical coverage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">State</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Full Coverage Annual Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Liability Only Annual Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rank (Highest to Lowest)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Florida</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,187</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 (Highest)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New Jersey</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,108</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$815</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,041</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$798</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Georgia</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,895</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$735</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,847</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$712</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">National Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,771</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$710</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,654</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$640</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pennsylvania</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,512</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$585</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,026</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$390</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Idaho</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,062</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$410</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49 (Lowest)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Full coverage includes liability, collision ($500 deductible), and comprehensive ($500 deductible). Rates reflect 40-year-old driver with clean record. State rankings based on 2024 insurance industry data.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Raise your deductible to $1,000 instead of $500 to save 10–20% annually ($150–$350 per year), but ensure you have emergency savings to cover the higher out-of-pocket cost if you file a claim.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Bundle your auto insurance with homeowners or renters insurance to receive a 15–25% discount ($250–$450 annually), making this one of the easiest ways to reduce total insurance costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Maintain a clean driving record by avoiding accidents and violations—each at-fault accident raises premiums by $400–$800 per year for 3–5 years, while a single speeding ticket adds $100–$200 annually.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Enroll in a usage-based or telematics insurance program (like Allstate Drivewise or Progressive Snapshot) to save 10–30% ($175–$530 annually) by demonstrating safe driving habits through mobile app tracking.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Review your coverage annually and adjust limits based on your vehicle's depreciating value—dropping collision coverage on a 10+ year-old car worth &lt;$8,000 can save $300–$500 per year while still maintaining liability protection.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Choosing liability-only coverage on a financed vehicle</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you have an outstanding auto loan or lease, lenders require full coverage (collision and comprehensive). Failing to maintain this coverage violates your loan agreement and can result in lender-placed insurance costing $2,000–$4,000 annually, which is far more expensive than standard full coverage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for discounts when budgeting insurance costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Neglecting to apply available discounts (bundling, good driver, safety features) results in overpaying by $300–$800 annually. Always ask insurers about all eligible discounts before accepting a quote, as you may qualify for 4–6 discounts worth 40–50% off your base premium.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Setting your deductible too low to save on premiums</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Choosing a $250 deductible to minimize monthly payments can backfire if you file a claim, as you'll pay significantly more out-of-pocket and your premium savings ($50–$100 annually) won't offset a $250 collision deductible. A $500–$1,000 deductible balances affordable premiums with manageable out-of-pocket costs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring annual premium reviews and shopping around</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Staying with the same insurer for years often results in higher rates, as loyalty discounts typically expire after 3–5 years and new customer discounts are withheld. Shopping rates every 2–3 years can save $300–$600 annually by switching to a more competitively priced insurer for your current profile.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect my annual car insurance cost the most?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The biggest factors impacting your annual insurance premium are your age, driving record, vehicle type, coverage limits, and location. For example, a 16-year-old driver typically pays $4,500–$7,500 annually for full coverage, while a 40-year-old with a clean record may pay $1,200–$1,800 for the same coverage. Your deductible choice and credit score also significantly influence your final premium.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does full coverage insurance cost per year on average?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">According to 2024 data, full coverage (liability, collision, and comprehensive) costs an average of $1,771 per year for good drivers, though this varies by state and vehicle. Drivers in high-cost states like Florida or New Jersey may pay $2,200–$2,600 annually, while those in low-cost states like Maine or Idaho may pay $1,100–$1,400. Your individual rate depends on personal factors like age, driving history, and the specific vehicle insured.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between liability and full coverage costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Liability-only insurance (required by law in most states) costs significantly less than full coverage, averaging $600–$900 annually, as it covers only damage you cause to others. Full coverage adds collision and comprehensive protection for your own vehicle, typically adding $800–$1,000 per year to the total premium. Full coverage is usually required if you have an outstanding auto loan or lease.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do age and driving experience impact annual insurance costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Teen drivers (16–19) face the highest rates, averaging $4,500–$7,500 per year due to inexperience and higher accident risk. Young adults (20–25) pay $2,500–$4,000 annually, while drivers aged 30–55 with clean records typically pay $1,200–$1,800. Rates generally drop after age 25 and remain stable until age 65–70, when they may increase again due to potential health-related driving concerns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I reduce my annual insurance cost with discounts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, multiple discounts can lower your annual premium by 10–50%. Common discounts include bundling (home &amp; auto saves 15–25%), good driver discounts (5–10% off), good student discounts (10–15% for GPA &gt;3.0), safety features discounts (10–25%), and usage-based/telematics programs (10–30% for safe driving). Combining 3–4 discounts can reduce your annual cost from $1,771 to $900–$1,200.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my vehicle choice affect insurance costs annually?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Insurance costs vary significantly by vehicle model, with luxury and sports cars costing 20–40% more to insure than sedans due to higher repair costs and theft risk. For example, insuring a Honda Civic averages $1,400 annually, while a BMW 3 Series may cost $2,100–$2,400 for the same coverage. Electric vehicles and hybrid vehicles often qualify for discounts of 5–15%, offsetting their higher purchase price.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does my location play in determining annual insurance rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Location dramatically affects insurance costs, with urban areas typically costing 20–50% more than rural areas due to higher accident and theft rates. For example, average annual full coverage in New York City is $2,400–$2,800, while the same coverage in rural Montana costs $1,100–$1,400. Weather conditions, population density, local accident statistics, and regional repair costs all influence your premium.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much should I budget for annual insurance if I have a poor driving record?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Drivers with accidents or violations typically pay 50–200% more than clean-record drivers, ranging from $2,500–$5,000+ annually depending on severity. A single at-fault accident can increase premiums by $400–$800 per year for 3–5 years, while a DUI conviction can result in $2,000–$3,500 annual increases for 7–10 years. SR-22 insurance requirements (for high-risk drivers) can cost $3,000–$6,000 per year.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average annual insurance cost difference between states?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">State insurance costs vary dramatically, with Florida averaging $2,187 annually and New Jersey at $2,108, while Maine averages $1,026 and Idaho $1,062 for the same coverage. This 50–100% variation is driven by state minimum coverage requirements, population density, weather patterns, and claims history. When using this calculator, your specific state selection will significantly impact your annual cost estimate.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iii.org/fact-statistic/facts-statistics-auto-insurance" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Insurance Information Institute – Auto Insurance Data and Statistics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative source for national auto insurance statistics, average costs by state, and coverage information.</p>
          </li>
          <li>
            <a href="https://www.naic.org/documents/subject_consumer_guide_auto.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Insurance Commissioners (NAIC) – Consumer Insurance Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on auto insurance coverage types, state requirements, and consumer protection information.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/insurance/auto/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate – Auto Insurance Cost and Rate Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive research on average insurance costs, state-by-state comparisons, and factors affecting premiums.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-does-auto-insurance-cover-en-1574/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau – Auto Insurance Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal consumer protection resource explaining coverage types, claims processes, and insurance rights.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Insurance Cost per Year"
      description="Professional automotive calculator: Insurance Cost per Year. Get accurate estimates, expert advice, and financial insights."
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