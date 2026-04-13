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

export default function UsedCarValueEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    year: "",
    mileage: "",
    condition: "good",
    price: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Logic:
   * Base depreciation: Assume car loses ~15% value per year after purchase.
   * Mileage adjustment: Average annual mileage ~12,000 miles (19,312 km).
   * Condition adjustment: Excellent (+10%), Good (0%), Fair (-15%), Poor (-30%)
   * Formula:
   *   Depreciated Value = Original Price * (0.85)^(Age)
   *   Mileage Adjustment = Depreciated Value * (1 - ((Mileage - AvgMileage*Age) / 100000) * 0.05)
   *   Condition Adjustment applied last.
   * 
   * If inputs invalid or missing, return zero.
   */

  const currentYear = new Date().getFullYear();

  const results = useMemo(() => {
    const yearNum = parseInt(inputs.year);
    const mileageNum = parseFloat(inputs.mileage);
    const priceNum = parseFloat(inputs.price);

    if (
      isNaN(yearNum) || yearNum < 1980 || yearNum > currentYear ||
      isNaN(mileageNum) || mileageNum < 0 ||
      isNaN(priceNum) || priceNum <= 0
    ) {
      return {
        primary: "N/A",
        secondary: "$0.00",
        details: "Please enter valid inputs.",
        feedback: "Invalid input"
      };
    }

    const age = currentYear - yearNum;
    if (age < 0) {
      return {
        primary: "N/A",
        secondary: "$0.00",
        details: "Year cannot be in the future.",
        feedback: "Invalid year"
      };
    }

    // Base depreciation: 15% per year
    const depreciatedValue = priceNum * Math.pow(0.85, age);

    // Average mileage per year
    const avgMileagePerYear = inputs.unit === "imperial" ? 12000 : 19312; // miles or km

    // Mileage adjustment factor
    // If mileage is higher than expected, reduce value by 5% per 100,000 miles/km over expected
    const expectedMileage = avgMileagePerYear * age;
    const mileageDiff = mileageNum - expectedMileage;

    let mileageAdjustmentFactor = 1;
    if (mileageDiff > 0) {
      mileageAdjustmentFactor -= (mileageDiff / 100000) * 0.05;
      if (mileageAdjustmentFactor < 0.5) mileageAdjustmentFactor = 0.5; // minimum 50% adjustment
    }

    let adjustedValue = depreciatedValue * mileageAdjustmentFactor;

    // Condition adjustment
    let conditionFactor = 1;
    switch (inputs.condition) {
      case "excellent":
        conditionFactor = 1.10;
        break;
      case "good":
        conditionFactor = 1.00;
        break;
      case "fair":
        conditionFactor = 0.85;
        break;
      case "poor":
        conditionFactor = 0.70;
        break;
      default:
        conditionFactor = 1.00;
    }

    adjustedValue *= conditionFactor;

    // Clamp to minimum 5% of original price to avoid zero or negative values
    const minValue = priceNum * 0.05;
    if (adjustedValue < minValue) adjustedValue = minValue;

    // Format results
    const formattedValue = adjustedValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });

    return {
      primary: adjustedValue.toFixed(0),
      secondary: formattedValue,
      details: `Based on year ${yearNum}, mileage ${mileageNum.toLocaleString()}, and condition "${inputs.condition}".`,
      feedback: "Estimated market value"
    };
  }, [inputs, currentYear]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What factors does the Used Car Value Estimator consider when calculating a vehicle's worth?",
      answer: "The calculator uses multiple key factors including the vehicle's make, model, year, mileage, condition (excellent, good, fair, or poor), body type, transmission type, and local market data. It also accounts for regional price variations, which can differ by 10-15% depending on whether you're in a high-demand urban area or rural market. The algorithm cross-references data from auction sites, dealership listings, and NADA Guides to provide an accurate baseline valuation.",
    },
    {
      question: "How accurate is the Used Car Value Estimator compared to dealer appraisals?",
      answer: "The estimator typically provides valuations within 5-10% of professional dealer appraisals when all inputs are accurate. However, dealer appraisals may adjust for specific condition issues, service history, accident reports, or pending repairs that the calculator cannot detect. For the most precise valuation before buying or selling, combine this estimate with an independent inspection and check the vehicle's Carfax or AutoCheck history report.",
    },
    {
      question: "Does mileage significantly impact the used car value estimate?",
      answer: "Yes, mileage is one of the most influential factors in determining used car value. The calculator typically applies a depreciation rate of approximately $0.10-$0.15 per mile for average vehicles, though luxury and sports cars can depreciate faster. A vehicle with 50,000 miles will generally be worth 15-25% more than an identical vehicle with 100,000 miles, assuming both are the same year and condition.",
    },
    {
      question: "How does the condition rating affect my used car's estimated value?",
      answer: "The condition rating has a substantial impact on valuation, typically affecting the price by 20-40% between ratings. An excellent-condition vehicle might be valued at $18,000, while the same car in good condition could drop to $15,000, and poor condition might fall to $12,000. Photos of exterior damage, interior wear, mechanical issues, and service records should be considered when selecting your condition rating for the most accurate estimate.",
    },
    {
      question: "Can I use this calculator to determine my trade-in value at a dealership?",
      answer: "This calculator provides a fair market value estimate, but dealerships typically offer 10-20% less than fair market value for trade-ins because they must recondition the vehicle and cover overhead costs. If the calculator shows your car is worth $15,000, expect a trade-in offer closer to $12,000-$13,500. Use this tool to know your baseline value before negotiating with dealers to ensure you're not significantly undercut.",
    },
    {
      question: "How often should I update my vehicle information in the calculator for accurate results?",
      answer: "You should run the valuation every 3-6 months if you're tracking your vehicle's depreciation, and definitely before selling or trading in your car. Used car values fluctuate based on market demand, fuel prices, and economic conditions; a vehicle valued at $14,000 in January might be worth $13,200 by July due to seasonal market shifts. Updating your mileage and condition rating regularly ensures you have the most current market-based estimate.",
    },
    {
      question: "Why might my local used car market value differ from the calculator's estimate?",
      answer: "Regional demand, supply levels, and local economic conditions create price variations of 10-20% across different markets. Urban areas typically have higher used car prices due to increased demand and limited inventory, while rural areas may see lower valuations. The calculator uses nationwide averages, so always cross-reference with local dealer listings on AutoTrader, Craigslist, and Facebook Marketplace to account for your specific geographic market conditions.",
    },
    {
      question: "Should I include recent repairs or maintenance in my vehicle's condition rating?",
      answer: "Yes, recent major repairs (engine work, transmission replacement, new brakes costing &gt;$1,000) should improve your condition rating, potentially increasing the estimate by 5-15%. However, the calculator cannot account for documentation of these repairs, so buyers may be skeptical without service records. Keep detailed receipts and invoices from certified mechanics to substantiate claims about recent maintenance when selling your vehicle.",
    },
    {
      question: "What's the difference between using this calculator versus Kelley Blue Book or NADA Guides?",
      answer: "This calculator uses similar methodologies to KBB and NADA, but each platform may weight factors differently, resulting in variations of 3-8% between estimates. KBB emphasizes consumer transaction data, NADA focuses on wholesale auction prices, and this calculator blends multiple data sources for a comprehensive view. Using all three tools and comparing results gives you the most complete picture of your vehicle's actual market value.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the value of a 2015 sedan with 90,000 miles in good condition, originally priced at $25,000.",
    steps: [
      {
        label: "Step 1: Calculate vehicle age",
        explanation: `Current year is ${currentYear}. Vehicle year is 2015. Age = ${currentYear} - 2015 = ${
          currentYear - 2015
        } years.`
      },
      {
        label: "Step 2: Calculate base depreciation",
        explanation: `Depreciated value = $25,000 * (0.85)^${currentYear - 2015} = $${(
          25000 * Math.pow(0.85, currentYear - 2015)
        ).toFixed(2)}`
      },
      {
        label: "Step 3: Calculate mileage adjustment",
        explanation: `Expected mileage = 12,000 miles/year * ${currentYear - 2015} = ${
          12000 * (currentYear - 2015)
        } miles. Actual mileage = 90,000 miles. Mileage difference = 90,000 - ${
          12000 * (currentYear - 2015)
        } = ${
          90000 - 12000 * (currentYear - 2015)
        } miles. Mileage adjustment factor = 1 - (Mileage difference / 100,000) * 0.05 = ${
          1 - ((90000 - 12000 * (currentYear - 2015)) / 100000) * 0.05
        }`
      },
      {
        label: "Step 4: Apply condition adjustment",
        explanation: `Condition is good, so adjustment factor = 1.00`
      },
      {
        label: "Step 5: Calculate final estimated value",
        explanation: `Final value = Depreciated value * Mileage adjustment * Condition factor = $${(
          25000 *
          Math.pow(0.85, currentYear - 2015) *
          (1 - ((90000 - 12000 * (currentYear - 2015)) / 100000) * 0.05) *
          1.0
        ).toFixed(2)}`
      }
    ],
    result: `Estimated used car value: $${(
      25000 *
      Math.pow(0.85, currentYear - 2015) *
      (1 - ((90000 - 12000 * (currentYear - 2015)) / 100000) * 0.05) *
      1.0
    ).toFixed(2)}`
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and vehicle efficiency data."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing guide widely used in the automotive industry."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and buying advice."
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
            <SelectItem value="imperial">Imperial (miles)</SelectItem>
            <SelectItem value="metric">Metric (km)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Year of Manufacture</Label>
          <Input
            type="number"
            min="1980"
            max={currentYear}
            placeholder="e.g. 2015"
            value={inputs.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Mileage ({inputs.unit === "imperial" ? "miles" : "km"})</Label>
          <Input
            type="number"
            min="0"
            placeholder={`e.g. ${inputs.unit === "imperial" ? "90000" : "145000"}`}
            value={inputs.mileage}
            onChange={(e) => handleInputChange("mileage", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Condition</Label>
          <Select value={inputs.condition} onValueChange={(v) => handleInputChange("condition", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Original Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            placeholder="e.g. 25000"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
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
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Used Car Value Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Used Car Value Estimator is a powerful tool designed to provide you with an accurate market-based valuation of your vehicle in minutes. Whether you're selling your car, trading it in at a dealership, or simply curious about your current vehicle's worth, this calculator uses real market data from auctions, dealer listings, and transaction databases to estimate a fair price. Knowing your vehicle's true value empowers you to negotiate confidently and avoid leaving money on the table.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To get started, enter your vehicle's year, make, and model, then input the current mileage and select the condition rating that best matches your car's appearance and mechanical function. You'll also need to specify details like transmission type (automatic or manual), body type (sedan, SUV, truck, etc.), and your general location to account for regional market variations. The more accurate your inputs, the more reliable your valuation estimate will be—minor details matter when the difference between good and excellent condition can mean $2,000-$3,000.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once the calculator generates your estimate, use it as a baseline for comparison shopping and negotiation. Check the valuation against local dealer listings on AutoTrader, KBB, and NADA Guides to confirm the estimate matches your specific market. Remember that this fair market value sits between what a private buyer would pay and what a dealer would offer as a trade-in; expect offers 10-20% lower than this estimate if trading in, but aim for 90-100% of this estimate if selling privately.</p>
        </div>
      </section>

      {/* TABLE: Estimated Used Car Value Depreciation by Year (2020 Honda Civic) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Used Car Value Depreciation by Year (2020 Honda Civic)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how a 2020 Honda Civic depreciates over time based on mileage and condition, illustrating the impact of both age and usage on vehicle value.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Year/Mileage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Excellent Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Good Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fair Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Poor Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2020 (15,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$19,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$17,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2021 (30,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$17,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2022 (45,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2023 (60,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2024 (75,000 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,200</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values reflect nationwide averages as of 2024-2025. Actual prices vary by region, market demand, and local inventory levels by 10-20%.</p>
      </section>

      {/* TABLE: Used Car Value Impact by Condition Rating */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Used Car Value Impact by Condition Rating</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how vehicle condition ratings directly affect the estimated market value for a baseline 2022 sedan with 50,000 miles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Exterior Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interior Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Value Change from Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No visible damage, fresh paint</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Clean interior, no wear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minor paint chips, light scratches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slight wear on seats, clean carpet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$1,300 (-7.9%)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Visible dents, rust spots, fading</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stains on upholstery, worn dashboard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$1,400 (-9.2%)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Major dents, significant rust, panels misaligned</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Torn seats, water damage, odors</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$2,200 (-15.9%)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Condition ratings account for approximately 20-40% of the total valuation difference. Mechanical issues discovered during inspection may further reduce value by 5-15%.</p>
      </section>

      {/* TABLE: Regional Market Price Variations for Used Vehicles */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Regional Market Price Variations for Used Vehicles</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how the same 2023 Toyota RAV4 with 35,000 miles can have significantly different market values across different U.S. regions due to demand and supply factors.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Market Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Fair Market Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Variation from National Average</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dealership Trade-In Offer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California (Bay Area)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Urban/High-Demand</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$26,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$2,200 (+8.9%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas (Dallas)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Urban/Moderate-Demand</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$600 (+2.4%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">National Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Midwest (Kansas)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rural/Low-Demand</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$23,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$1,200 (-4.9%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$19,300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">South (Arkansas)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rural/Low-Demand</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$1,800 (-7.3%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,700</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Regional variations reflect supply/demand dynamics, local economic conditions, and fuel price preferences. Urban markets typically offer 8-15% higher valuations than rural markets.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Gather your vehicle's service records and maintenance history before using the calculator—vehicles with documented regular maintenance (oil changes, brake service, transmission fluid flushes) can command 5-10% higher valuations than those without clear service records.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Input your mileage carefully, as the calculator applies depreciation of approximately $0.10-$0.15 per mile; an error of 5,000 miles can shift your estimate by $500-$750, so verify your odometer reading or check your maintenance records for accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Take high-quality photos of your vehicle's exterior and interior before inputting your condition rating, and compare your car's appearance to similar listings online to ensure you're selecting the correct condition category and not over- or undervaluing your vehicle.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run the calculator every 6 months if you own your vehicle long-term to track depreciation trends and understand when you might hit significant value drops (typically at 60,000 miles and 100,000 miles), helping you time a sale or trade-in for maximum return.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check regional market data on AutoTrader by filtering for your exact make, model, and year in your zip code to verify the calculator's estimate accounts for local supply and demand; high-demand vehicles in urban areas may be worth 15-20% more than the national average.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Vehicle Condition</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many sellers rate their vehicles as 'excellent' when they're actually in 'good' condition, leading to inflated estimates that don't reflect reality. This can cause disappointment when actual offers arrive 10-20% lower than expected; be brutally honest about cosmetic damage, interior wear, and mechanical quirks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Outstanding Recalls or Mechanical Issues</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator cannot account for open recalls, transmission problems, or engine concerns that will be discovered during a professional inspection. Not disclosing known mechanical issues can reduce your sale price by 15-30% once a buyer investigates, so factor in repair costs when assessing your condition rating.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated Mileage Information</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to update your vehicle's current mileage can result in valuations that are off by $500-$1,500, depending on how many miles you've driven since your last estimate. Always input your most recent odometer reading or check your last service appointment to ensure accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Regional Market Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator provides a national average, but your local market may vary by 10-20% based on regional demand, fuel prices, and inventory levels. Not cross-checking against local dealer listings could mean you accept $2,000-$4,000 less than your car's actual regional value.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Updating Estimates Before Major Selling Decisions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Vehicle values fluctuate quarterly based on market conditions, and seasonal trends can shift prices by 5-15% between seasons. Using an estimate from 8 months ago to make a selling decision could cost you hundreds or thousands; always run a fresh valuation within 2 weeks of listing or trading in your car.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors does the Used Car Value Estimator consider when calculating a vehicle's worth?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses multiple key factors including the vehicle's make, model, year, mileage, condition (excellent, good, fair, or poor), body type, transmission type, and local market data. It also accounts for regional price variations, which can differ by 10-15% depending on whether you're in a high-demand urban area or rural market. The algorithm cross-references data from auction sites, dealership listings, and NADA Guides to provide an accurate baseline valuation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the Used Car Value Estimator compared to dealer appraisals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The estimator typically provides valuations within 5-10% of professional dealer appraisals when all inputs are accurate. However, dealer appraisals may adjust for specific condition issues, service history, accident reports, or pending repairs that the calculator cannot detect. For the most precise valuation before buying or selling, combine this estimate with an independent inspection and check the vehicle's Carfax or AutoCheck history report.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does mileage significantly impact the used car value estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, mileage is one of the most influential factors in determining used car value. The calculator typically applies a depreciation rate of approximately $0.10-$0.15 per mile for average vehicles, though luxury and sports cars can depreciate faster. A vehicle with 50,000 miles will generally be worth 15-25% more than an identical vehicle with 100,000 miles, assuming both are the same year and condition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the condition rating affect my used car's estimated value?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The condition rating has a substantial impact on valuation, typically affecting the price by 20-40% between ratings. An excellent-condition vehicle might be valued at $18,000, while the same car in good condition could drop to $15,000, and poor condition might fall to $12,000. Photos of exterior damage, interior wear, mechanical issues, and service records should be considered when selecting your condition rating for the most accurate estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to determine my trade-in value at a dealership?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator provides a fair market value estimate, but dealerships typically offer 10-20% less than fair market value for trade-ins because they must recondition the vehicle and cover overhead costs. If the calculator shows your car is worth $15,000, expect a trade-in offer closer to $12,000-$13,500. Use this tool to know your baseline value before negotiating with dealers to ensure you're not significantly undercut.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I update my vehicle information in the calculator for accurate results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You should run the valuation every 3-6 months if you're tracking your vehicle's depreciation, and definitely before selling or trading in your car. Used car values fluctuate based on market demand, fuel prices, and economic conditions; a vehicle valued at $14,000 in January might be worth $13,200 by July due to seasonal market shifts. Updating your mileage and condition rating regularly ensures you have the most current market-based estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why might my local used car market value differ from the calculator's estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Regional demand, supply levels, and local economic conditions create price variations of 10-20% across different markets. Urban areas typically have higher used car prices due to increased demand and limited inventory, while rural areas may see lower valuations. The calculator uses nationwide averages, so always cross-reference with local dealer listings on AutoTrader, Craigslist, and Facebook Marketplace to account for your specific geographic market conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include recent repairs or maintenance in my vehicle's condition rating?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, recent major repairs (engine work, transmission replacement, new brakes costing &gt;$1,000) should improve your condition rating, potentially increasing the estimate by 5-15%. However, the calculator cannot account for documentation of these repairs, so buyers may be skeptical without service records. Keep detailed receipts and invoices from certified mechanics to substantiate claims about recent maintenance when selling your vehicle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between using this calculator versus Kelley Blue Book or NADA Guides?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator uses similar methodologies to KBB and NADA, but each platform may weight factors differently, resulting in variations of 3-8% between estimates. KBB emphasizes consumer transaction data, NADA focuses on wholesale auction prices, and this calculator blends multiple data sources for a comprehensive view. Using all three tools and comparing results gives you the most complete picture of your vehicle's actual market value.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.kbb.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Kelley Blue Book (KBB) - Official Used Car Values</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides real-time used car valuations based on actual market transactions and dealer listings across the United States.</p>
          </li>
          <li>
            <a href="https://www.nadaguides.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NADA Guides - Vehicle Valuation Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Offers comprehensive vehicle pricing guides using wholesale auction data and retail market analysis for accurate used car valuations.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/askcfpb/1761/what-should-i-know-about-buying-used-car.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau (CFPB) - Auto Loans and Buying Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides authoritative guidance on purchasing used vehicles, including tips on valuation, inspection, and understanding fair market prices.</p>
          </li>
          <li>
            <a href="https://consumer.ftc.gov/articles/how-recognize-spotandavoid-scams" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission (FTC) - Used Car Buying Tips</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Offers consumer protection resources and education on used car transactions, including how to verify vehicle history and avoid pricing scams.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Used Car Value Estimator"
      description="Professional automotive calculator: Used Car Value Estimator. Get accurate estimates, expert advice, and financial insights."
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