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
      question: "How accurate is the depreciation estimate?",
      answer:
        "The depreciation estimate is based on generalized automotive depreciation curves and average mileage assumptions. Individual vehicle condition, brand, model, market demand, and maintenance history can significantly affect actual depreciation. This calculator provides a reliable baseline but should be supplemented with professional appraisals for precise valuations."
    },
    {
      question: "Why does mileage affect depreciation so much?",
      answer:
        "Mileage is a critical factor because it directly correlates with vehicle wear and tear. Higher mileage typically means more usage, which can lead to increased maintenance costs and reduced reliability. Therefore, vehicles with mileage above average tend to depreciate faster, while those with lower mileage retain value better."
    },
    {
      question: "Can I use this calculator for commercial vehicles or trucks?",
      answer:
        "This calculator is designed primarily for passenger cars and SUVs. Commercial vehicles and trucks often have different depreciation patterns due to usage intensity, maintenance schedules, and market demand. For commercial vehicles, specialized depreciation models or industry-specific calculators are recommended."
    },
    {
      question: "How does the calculator handle different units for mileage?",
      answer:
        "You can input mileage in either miles or kilometers. The calculator automatically converts kilometers to miles internally to maintain consistency with average mileage benchmarks. This ensures accurate depreciation adjustments regardless of the unit selected."
    },
    {
      question: "What if my vehicle is older than 6 years?",
      answer:
        "For vehicles older than 6 years, the calculator applies a floor depreciation value of 25% of the original purchase price, reflecting typical market behavior where older cars stabilize in value. However, actual values can vary widely based on condition, rarity, and market trends."
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
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Enter the original purchase price of your vehicle in US dollars.
          </li>
          <li>
            <strong>Step 2:</strong> Input the current age of the vehicle in years, including decimals for partial years.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the current mileage of the vehicle and select the appropriate unit (miles or kilometers).
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to estimate the current market value based on depreciation.
          </li>
          <li>
            <strong>Step 5:</strong> Review the estimated depreciation percentage and current value displayed below the calculator.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Depreciation Curve Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Vehicle depreciation is the reduction in a car's value over time due to factors like age, mileage, wear and tear, and market demand. Understanding depreciation is crucial for buyers, sellers, and financial planners to make informed decisions about vehicle purchases, sales, and financing. This calculator estimates depreciation by combining a standard automotive depreciation curve with mileage adjustments, providing a realistic estimate of a vehicle's current market value.
          </p>
          <p>
            The depreciation curve used here reflects typical market behavior where a new vehicle loses a significant portion of its value within the first few years—often around 30% in the first year and up to 60% by the third year. After this initial steep decline, the depreciation rate slows down, stabilizing around 25% of the original value after six years. Mileage plays a pivotal role as well; vehicles driven more than the average annual mileage tend to depreciate faster, while those with lower mileage retain value better.
          </p>
          <p>
            This estimator assumes an average annual mileage of 12,000 miles (approximately 19,312 kilometers). For every 1,000 miles driven above this average, the vehicle's value decreases by 0.5%, reflecting increased wear. Conversely, vehicles with mileage below average can see a slight increase in value, capped at 5%, acknowledging their better condition. While this model provides a solid baseline, actual depreciation can vary based on brand reputation, vehicle condition, market trends, and geographic location.
          </p>
          <p>
            Using this calculator helps you anticipate your vehicle’s resale value, plan for trade-ins, or evaluate financing options. Always consider supplementing this estimate with professional appraisals or market research for the most accurate valuation.
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
            <strong>1. Ignoring vehicle condition:</strong> Depreciation calculators estimate based on age and mileage but do not account for specific vehicle conditions like accidents, maintenance, or modifications, which can greatly affect value.
          </p>
          <p>
            <strong>2. Using incorrect mileage units:</strong> Inputting mileage in kilometers without selecting the correct unit can lead to inaccurate depreciation estimates.
          </p>
          <p>
            <strong>3. Overlooking market fluctuations:</strong> External factors such as fuel prices, economic conditions, and new model releases can impact depreciation but are not reflected in this model.
          </p>
          <p>
            <strong>4. Assuming linear depreciation:</strong> Depreciation is nonlinear, especially in the first few years; assuming a constant rate can mislead valuation.
          </p>
          <p>
            <strong>5. Not updating inputs:</strong> Using outdated purchase price or mileage data will yield inaccurate results.
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