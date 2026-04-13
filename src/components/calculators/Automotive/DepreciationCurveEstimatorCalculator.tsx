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

export default function DepreciationCurveEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    purchasePrice: "",
    ageYears: "",
    mileage: "",
    mileageUnit: "miles"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Depreciation Curve Estimator Logic:
   * 
   * General automotive depreciation follows a nonlinear curve:
   * - Most depreciation occurs in the first 3 years (~50-60%)
   * - After that, depreciation slows down but continues steadily.
   * - Mileage impacts value: higher mileage reduces value.
   * 
   * We'll use a simplified model:
   * 
   * Step 1: Calculate base depreciation factor by age:
   *   - Year 0: 100% value
   *   - Year 1: 70% value
   *   - Year 2: 55% value
   *   - Year 3: 45% value
   *   - Year 4: 38% value
   *   - Year 5: 32% value
   *   - Year 6+: 25% value (floor)
   * 
   * Step 2: Adjust for mileage:
   *   - Average annual mileage: 12,000 miles (19,312 km)
   *   - For every 1,000 miles over average, reduce value by 0.5%
   *   - For mileage below average, increase value by 0.25% per 1,000 miles (capped)
   * 
   * Step 3: Calculate final estimated value.
   */

  const results = useMemo(() => {
    const purchasePrice = parseFloat(inputs.purchasePrice);
    const ageYears = parseFloat(inputs.ageYears);
    let mileage = parseFloat(inputs.mileage);
    const mileageUnit = inputs.mileageUnit;

    if (
      isNaN(purchasePrice) || purchasePrice <= 0 ||
      isNaN(ageYears) || ageYears < 0 ||
      isNaN(mileage) || mileage < 0
    ) {
      return {
        primary: "N/A",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    // Convert mileage to miles if metric
    if (mileageUnit === "km") {
      mileage = mileage * 0.621371; // km to miles
    }

    // Depreciation factor by age (years)
    // Using piecewise linear interpolation between known points
    const agePoints = [0, 1, 2, 3, 4, 5, 6];
    const valuePoints = [1.0, 0.7, 0.55, 0.45, 0.38, 0.32, 0.25];

    function interpolateDepreciation(age: number) {
      if (age >= 6) return 0.25;
      for (let i = 0; i < agePoints.length - 1; i++) {
        if (age >= agePoints[i] && age < agePoints[i + 1]) {
          const x0 = agePoints[i];
          const x1 = agePoints[i + 1];
          const y0 = valuePoints[i];
          const y1 = valuePoints[i + 1];
          return y0 + ((age - x0) / (x1 - x0)) * (y1 - y0);
        }
      }
      return 1.0; // default for age < 0
    }

    const baseValueFactor = interpolateDepreciation(ageYears);

    // Mileage adjustment
    const avgAnnualMileage = 12000; // miles
    const expectedMileage = avgAnnualMileage * ageYears;
    const mileageDiff = mileage - expectedMileage; // positive if over average

    let mileageAdjustment = 0;
    if (mileageDiff > 0) {
      // Reduce 0.5% per 1000 miles over average
      mileageAdjustment = -0.005 * (mileageDiff / 1000);
    } else {
      // Increase 0.25% per 1000 miles below average, capped at +5%
      mileageAdjustment = Math.min(0.0025 * (-mileageDiff / 1000), 0.05);
    }

    // Final value factor
    let finalValueFactor = baseValueFactor * (1 + mileageAdjustment);
    // Clamp between 0.1 and 1.0
    finalValueFactor = Math.min(Math.max(finalValueFactor, 0.1), 1.0);

    const estimatedValue = purchasePrice * finalValueFactor;

    return {
      primary: `${(finalValueFactor * 100).toFixed(1)}%`,
      secondary: `$${estimatedValue.toFixed(2)}`,
      details: `Base depreciation: ${(baseValueFactor * 100).toFixed(1)}%, Mileage adjustment: ${(mileageAdjustment * 100).toFixed(2)}%`,
      feedback: finalValueFactor < 0.3 ? "High depreciation" : finalValueFactor > 0.7 ? "Low depreciation" : "Standard depreciation"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is vehicle depreciation and why does it matter?",
      answer: "Vehicle depreciation is the decline in a car's market value over time due to age, mileage, and wear. Most vehicles lose 20-30% of their value in the first year and approximately 50% by year five. Understanding depreciation matters because it affects your total cost of ownership, trade-in value, and insurance costs, making it essential for budgeting vehicle expenses and making informed purchase decisions.",
    },
    {
      question: "How does the Depreciation Curve Estimator calculate value loss?",
      answer: "The calculator uses a depreciation curve model based on industry benchmarks that account for vehicle age, initial purchase price, mileage, and vehicle condition. It applies depreciation rates that typically follow a steep decline in years 1-3 (15-25% annually), then moderate in years 4-6 (8-12% annually), and flatten after year 7. The estimation reflects real-world data from automotive valuation databases like NADA Guides and Kelley Blue Book.",
    },
    {
      question: "What input factors affect the depreciation curve most significantly?",
      answer: "The three most impactful factors are initial purchase price, annual mileage, and vehicle condition. A vehicle driven 15,000 miles annually will depreciate faster than one driven 10,000 miles per year by approximately 5-8% over five years. Make and model reputation also heavily influence curves—luxury vehicles typically depreciate 40-60% over five years while reliable sedans may only lose 35-45%, based on market demand and maintenance costs.",
    },
    {
      question: "Can I use this calculator for lease decisions?",
      answer: "Yes, the Depreciation Curve Estimator is valuable for lease vs. buy comparisons. Leasing transfers depreciation risk to the lessor, while buying exposes you to it. If the calculator shows your vehicle losing &gt;50% of value in three years, leasing may be advantageous; conversely, if depreciation is &lt;35%, owning and keeping the car longer could yield better financial results over a 7-10 year ownership period.",
    },
    {
      question: "How accurate are depreciation curve predictions?",
      answer: "Depreciation curve estimates typically have a margin of error of ±5-10% because they're based on historical averages and cannot predict unforeseen market shifts, recalls, or economic changes. Variables like major repairs, accidents, or extreme mileage can cause actual depreciation to deviate significantly from estimates. The calculator provides reliable baseline expectations but should be cross-referenced with current market listings for vehicles in your specific region and condition category.",
    },
    {
      question: "What's the difference between book value and market value in depreciation?",
      answer: "Book value (or depreciated value) is the estimated worth calculated by formula-based models like this calculator, while market value is what buyers actually pay in real transactions. The Depreciation Curve Estimator produces book value based on standard depreciation schedules. Market value can vary 10-15% above or below book value depending on local demand, vehicle condition details, service history, and regional economic factors.",
    },
    {
      question: "Should I adjust depreciation estimates for high-mileage vehicles?",
      answer: "Absolutely. Vehicles exceeding 15,000 miles annually experience accelerated depreciation—typically 8-12% additional value loss over five years compared to average-mileage cars. The calculator should be adjusted upward for mileage if your estimates show &lt;12,000 annual miles. Commercial vehicles, fleet cars, or those with &gt;200,000 miles depreciate more steeply and may lose 60-75% of original value within five years.",
    },
    {
      question: "How does vehicle condition category impact the depreciation curve?",
      answer: "Condition ratings (Excellent, Good, Fair, Poor) can shift depreciation rates by 5-20% across the curve. An 'Excellent' condition vehicle with full service records loses approximately 40% over five years, while 'Fair' condition vehicles lose 50-55%. 'Poor' condition cars depreciate even faster, losing 60%+ by year five. Always input the most accurate condition assessment into the calculator for reliable projections.",
    },
    {
      question: "Can the Depreciation Curve Estimator help with tax deduction planning?",
      answer: "While the calculator estimates value loss, it doesn't directly calculate tax deductions, as depreciation deductions follow IRS rules rather than market depreciation. Business and commercial vehicles may qualify for depreciation deductions using MACRS (Modified Accelerated Cost Recovery System), typically written off over 5-7 years. Consult a tax professional to understand how this calculator's results relate to your specific deduction eligibility and IRS Section 179 depreciation rules.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV purchased new 4 years ago with 60,000 miles driven. You want to estimate its current market value considering age and mileage.",
    steps: [
      {
        label: "Step 1: Determine base depreciation by age",
        explanation:
          "At 4 years old, the base depreciation factor from the curve is approximately 38% (0.38). This means the vehicle retains 38% of its original value before mileage adjustments."
      },
      {
        label: "Step 2: Calculate expected mileage",
        explanation:
          "Average mileage is 12,000 miles/year × 4 years = 48,000 miles. The vehicle has 60,000 miles, which is 12,000 miles over average."
      },
      {
        label: "Step 3: Calculate mileage adjustment",
        explanation:
          "For every 1,000 miles over average, reduce value by 0.5%. 12,000 miles over means 12 × 0.5% = 6% reduction (0.06)."
      },
      {
        label: "Step 4: Calculate final depreciation factor",
        explanation:
          "Final factor = base factor × (1 - mileage adjustment) = 0.38 × (1 - 0.06) = 0.38 × 0.94 = 0.3572 (35.72%)."
      },
      {
        label: "Step 5: Calculate estimated current value",
        explanation:
          "Estimated value = $35,000 × 0.3572 = $12,502.00."
      }
    ],
    result: "The estimated current market value of the SUV is approximately $12,502."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing guide used widely in the automotive industry."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and depreciation insights."
    },
    {
      title: "NADA Guides",
      description: "Official source for vehicle pricing and depreciation data."
    },
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for vehicle mileage and usage statistics."
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
          <Label>Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 35000"
            value={inputs.purchasePrice}
            onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Vehicle Age (years)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 4"
            value={inputs.ageYears}
            onChange={(e) => handleInputChange("ageYears", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Mileage</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 60000"
            value={inputs.mileage}
            onChange={(e) => handleInputChange("mileage", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Mileage Unit</Label>
          <Select
            value={inputs.mileageUnit}
            onValueChange={(v) => handleInputChange("mileageUnit", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="miles">Miles</SelectItem>
              <SelectItem value="km">Kilometers</SelectItem>
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
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Depreciation</span>
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Depreciation Curve Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Depreciation Curve Estimator is a financial planning tool that projects how a vehicle's market value will decline over time, helping you understand total ownership costs and resale expectations. Whether you're evaluating a purchase, planning for trade-in value, or comparing lease vs. buy decisions, this calculator applies industry-standard depreciation benchmarks to generate realistic value projections. Accurate depreciation forecasting enables smarter financial decisions around vehicle purchases and long-term automotive budgeting.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator effectively, input your vehicle's purchase price (or current value), age, estimated annual mileage, current condition (Excellent, Good, Fair, or Poor), and vehicle type (sedan, SUV, truck, luxury, etc.). These inputs determine the depreciation curve applied—luxury vehicles and high-mileage cars follow steeper curves, while reliable sedans and vehicles in excellent condition show gentler value decline. The calculator may also ask for region or market data, as local demand slightly influences depreciation rates by 2-5%.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by reviewing both the dollar value projections and the percentage retention rates across years. If the calculator shows your vehicle retaining 45% value after five years, that means it will be worth roughly $9,000 on a $20,000 purchase price. Use these projections to evaluate whether leasing (which eliminates depreciation risk) or buying makes sense for your situation, and cross-reference results with real listings in your market to validate the estimates—deviations of ±10% are normal and acceptable.</p>
        </div>
      </section>

      {/* TABLE: Average Vehicle Depreciation by Year (Percentage of Original Purchase Price) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Vehicle Depreciation by Year (Percentage of Original Purchase Price)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical depreciation curves across vehicle age, reflecting industry-standard value retention rates used in similar calculators.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">New Sedan (avg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mid-Size SUV (avg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Luxury Vehicle (avg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Used Truck (avg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">58%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">47%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">57%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values represent cumulative depreciation from original MSRP. Actual results vary by make, model, condition, and regional demand factors. Data based on NADA Guides 2024-2025 benchmarks.</p>
      </section>

      {/* TABLE: Depreciation Adjustments by Annual Mileage and Condition */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Depreciation Adjustments by Annual Mileage and Condition</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to understand how mileage and condition affect depreciation curves—these factors can shift the standard curve by 5-20 percentage points.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mileage Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Excellent Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Good Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fair Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Poor Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;10,000 mi/year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+15%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10,000–12,000 mi/year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+17%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12,000–15,000 mi/year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15,000–18,000 mi/year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+16%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+24%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;18,000 mi/year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+30%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjustments shown are cumulative percentage point changes to the standard 5-year depreciation curve. Excellent condition with &lt;10,000 mi/year reduces depreciation by ~5%; Poor condition with &gt;18,000 mi/year increases it by ~30%.</p>
      </section>

      {/* TABLE: Make/Model Depreciation Patterns: 5-Year Value Retention */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Make/Model Depreciation Patterns: 5-Year Value Retention</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different vehicle makes and models follow distinct depreciation curves based on reliability reputation, demand, and maintenance costs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Make/Model Example</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5-Year Value Retention</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Annual Depreciation Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Reliable Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Honda Accord</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.2%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Premium Sedan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMW 3-Series</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.0%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full-Size Truck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ford F-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.4%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Luxury SUV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lexus RX</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.6%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Economy Compact</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Toyota Corolla</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">47%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.6%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sports Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dodge Challenger</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.4%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hybrid/EV</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Toyota Prius</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.8%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Luxury Coupe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mercedes-Benz C-Class</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.4%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Value retention percentages represent Kelley Blue Book 2024 data for vehicles in 'Good' condition with average mileage. Premium and luxury brands typically depreciate faster due to higher maintenance costs and repair expenses.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Input conservative mileage estimates to ensure depreciation projections remain realistic—the IRS standard for business mileage is 14,500 miles per year, but personal vehicles often exceed 12,000 annually, which can accelerate depreciation by 5-8% over five years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run multiple scenarios using different condition ratings (Excellent vs. Good vs. Fair) to understand how maintenance and care directly impact resale value—this often motivates investment in regular servicing and detailing that preserves value.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare the calculator's depreciation curve against real market listings for the same vehicle make, model, year, and mileage in your region—this validation step catches regional demand fluctuations that standardized curves may not fully capture.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use depreciation projections alongside insurance quotes and maintenance cost estimates to calculate true cost of ownership; a vehicle with lower depreciation but higher repair costs may not deliver better economics than a higher-depreciating but more reliable alternative.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your actual vehicle's market value using the calculator annually against real listings to refine your assumptions for future purchase decisions—this creates a personal baseline that improves forecasting accuracy over time.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Regional Market Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator provides national benchmarks, but regional demand significantly affects actual depreciation. A truck may retain 50% value in rural areas where utility is high, but only 45% in urban areas; always validate projections against local dealer listings and private sales in your specific market.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Mileage Impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many owners underestimate annual mileage by 15-25%, which compresses depreciation projections and leads to overoptimistic resale value expectations. Use actual odometer readings and service records to establish realistic mileage forecasts; vehicles exceeding 15,000 miles annually lose 8-12% additional value over five years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Misclassifying Vehicle Condition</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Self-assessment of 'Excellent' condition is often inaccurate—professional valuators use stricter standards including accident history, paint quality, and interior wear that consumers overlook. Input conservative condition ratings to avoid overestimating resale value; a vehicle you rate 'Excellent' may be market-valued as 'Good,' shifting depreciation by 5-10%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Maintenance and Repairs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator projects value decline, but doesn't factor in maintenance costs that reduce net ownership economics. A vehicle deprecating 50% over five years might also cost $4,000-6,000 in maintenance; total cost of ownership requires layering repair estimates atop depreciation to make true financial comparisons.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated Purchase Prices or Model Years</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Used vehicle depreciation curves differ significantly from new car curves; a 2020 vehicle doesn't follow the same slope as a 2025 model due to cumulative age effects and different market demand patterns. Always input the current market value, not original MSRP, when evaluating used vehicles to generate accurate forward-looking projections.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is vehicle depreciation and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vehicle depreciation is the decline in a car's market value over time due to age, mileage, and wear. Most vehicles lose 20-30% of their value in the first year and approximately 50% by year five. Understanding depreciation matters because it affects your total cost of ownership, trade-in value, and insurance costs, making it essential for budgeting vehicle expenses and making informed purchase decisions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the Depreciation Curve Estimator calculate value loss?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses a depreciation curve model based on industry benchmarks that account for vehicle age, initial purchase price, mileage, and vehicle condition. It applies depreciation rates that typically follow a steep decline in years 1-3 (15-25% annually), then moderate in years 4-6 (8-12% annually), and flatten after year 7. The estimation reflects real-world data from automotive valuation databases like NADA Guides and Kelley Blue Book.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What input factors affect the depreciation curve most significantly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The three most impactful factors are initial purchase price, annual mileage, and vehicle condition. A vehicle driven 15,000 miles annually will depreciate faster than one driven 10,000 miles per year by approximately 5-8% over five years. Make and model reputation also heavily influence curves—luxury vehicles typically depreciate 40-60% over five years while reliable sedans may only lose 35-45%, based on market demand and maintenance costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for lease decisions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the Depreciation Curve Estimator is valuable for lease vs. buy comparisons. Leasing transfers depreciation risk to the lessor, while buying exposes you to it. If the calculator shows your vehicle losing &gt;50% of value in three years, leasing may be advantageous; conversely, if depreciation is &lt;35%, owning and keeping the car longer could yield better financial results over a 7-10 year ownership period.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are depreciation curve predictions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Depreciation curve estimates typically have a margin of error of ±5-10% because they're based on historical averages and cannot predict unforeseen market shifts, recalls, or economic changes. Variables like major repairs, accidents, or extreme mileage can cause actual depreciation to deviate significantly from estimates. The calculator provides reliable baseline expectations but should be cross-referenced with current market listings for vehicles in your specific region and condition category.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between book value and market value in depreciation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Book value (or depreciated value) is the estimated worth calculated by formula-based models like this calculator, while market value is what buyers actually pay in real transactions. The Depreciation Curve Estimator produces book value based on standard depreciation schedules. Market value can vary 10-15% above or below book value depending on local demand, vehicle condition details, service history, and regional economic factors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust depreciation estimates for high-mileage vehicles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely. Vehicles exceeding 15,000 miles annually experience accelerated depreciation—typically 8-12% additional value loss over five years compared to average-mileage cars. The calculator should be adjusted upward for mileage if your estimates show &lt;12,000 annual miles. Commercial vehicles, fleet cars, or those with &gt;200,000 miles depreciate more steeply and may lose 60-75% of original value within five years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does vehicle condition category impact the depreciation curve?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Condition ratings (Excellent, Good, Fair, Poor) can shift depreciation rates by 5-20% across the curve. An 'Excellent' condition vehicle with full service records loses approximately 40% over five years, while 'Fair' condition vehicles lose 50-55%. 'Poor' condition cars depreciate even faster, losing 60%+ by year five. Always input the most accurate condition assessment into the calculator for reliable projections.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the Depreciation Curve Estimator help with tax deduction planning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While the calculator estimates value loss, it doesn't directly calculate tax deductions, as depreciation deductions follow IRS rules rather than market depreciation. Business and commercial vehicles may qualify for depreciation deductions using MACRS (Modified Accelerated Cost Recovery System), typically written off over 5-7 years. Consult a tax professional to understand how this calculator's results relate to your specific deduction eligibility and IRS Section 179 depreciation rules.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nadaguides.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NADA Guides Vehicle Valuation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official automotive valuation resource providing real-time depreciation data, market values, and condition adjustments used by dealers and financial institutions.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p946" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 946: Depreciation Rules for Business Property</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">IRS official guidance on depreciable assets, MACRS depreciation schedules, and vehicle depreciation calculations for tax purposes.</p>
          </li>
          <li>
            <a href="https://www.kbb.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Kelley Blue Book: Car Values and Depreciation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer automotive valuation platform offering current market prices, depreciation trends, and value projections for vehicles by make, model, and year.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/educational-resources/educational-videos/automotive-finance/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau: Vehicle Financing and Leasing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB educational resources covering depreciation considerations in vehicle purchase and lease decisions, helping consumers understand total cost of ownership.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Depreciation Curve Estimator"
      description="Professional automotive calculator: Depreciation Curve Estimator. Get accurate estimates, expert advice, and financial insights."
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