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
    let depreciatedValue = priceNum * Math.pow(0.85, age);

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
      question: "How accurate is the Used Car Value Estimator?",
      answer:
        "The estimator provides a reliable ballpark figure based on general depreciation rates, mileage, and condition adjustments. However, actual market values can vary due to factors like location, demand, vehicle history, and specific model desirability. For precise valuation, consider professional appraisals or trusted vehicle pricing guides."
    },
    {
      question: "Why does mileage affect the car's value so much?",
      answer:
        "Mileage is a key indicator of a vehicle's wear and tear. Higher mileage typically means more usage, which can lead to increased maintenance costs and reduced reliability. Therefore, cars with mileage significantly above average for their age usually have lower market values."
    },
    {
      question: "Can I use this estimator for any car make and model?",
      answer:
        "Yes, this estimator uses general automotive depreciation logic applicable across most makes and models. However, some vehicles, like classic cars or highly sought-after models, may not follow typical depreciation patterns, so results should be interpreted accordingly."
    },
    {
      question: "How does the car's condition impact its value?",
      answer:
        "Condition adjustments reflect the vehicle's physical and mechanical state. Excellent condition vehicles command a premium, while fair or poor condition cars see significant value reductions due to potential repair costs and reduced appeal to buyers."
    },
    {
      question: "Why do I need to select units (imperial or metric)?",
      answer:
        "Selecting the correct unit system ensures mileage inputs are interpreted correctly. For example, 12,000 miles per year is average in the US (imperial), whereas 19,312 kilometers per year is typical in metric-using countries. This affects depreciation calculations based on mileage."
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
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial for miles or Metric for kilometers) to ensure mileage input is interpreted correctly.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the vehicle's year of manufacture. This helps calculate the vehicle's age and base depreciation.
          </li>
          <li>
            <strong>Step 3:</strong> Input the current mileage on the vehicle in the selected unit system.
          </li>
          <li>
            <strong>Step 4:</strong> Choose the vehicle's condition from the dropdown menu: Excellent, Good, Fair, or Poor.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the original purchase price of the vehicle when new.
          </li>
          <li>
            <strong>Step 6:</strong> Click the "Calculate" button to get the estimated current market value of your used car.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Used Car Value Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Estimating the value of a used car involves understanding how various factors influence depreciation and market demand. The primary driver of value loss is age, with most vehicles depreciating approximately 15% per year after purchase. Mileage is another critical factor, as it reflects the extent of use and potential wear on the vehicle. Average annual mileage is typically around 12,000 miles (or 19,312 kilometers), and deviations from this average can either increase or decrease the vehicle's value accordingly.
          </p>
          <p>
            Condition plays a significant role as well. Vehicles in excellent condition with minimal wear and no mechanical issues command higher prices, while those in fair or poor condition may require costly repairs, reducing their market value. This calculator combines these factors into a straightforward formula that adjusts the original purchase price based on age, mileage, and condition to provide a realistic estimate of the current value.
          </p>
          <p>
            It's important to note that this tool provides an estimate based on general automotive depreciation trends. Specific makes, models, and market conditions can cause actual values to vary. For example, classic cars, limited editions, or vehicles with unique features may appreciate or depreciate differently. Always consider additional factors such as vehicle history, maintenance records, and regional demand when evaluating a used car's worth.
          </p>
          <p>
            By using this estimator, buyers and sellers can gain a clearer understanding of a vehicle's fair market value, helping them make informed financial decisions whether negotiating a sale, trade-in, or purchase.
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
            <strong>1. Ignoring the vehicle's condition:</strong> Many users overlook how condition drastically affects value. A car in poor condition can be worth significantly less than one in good or excellent shape, regardless of mileage or age.
          </p>
          <p>
            <strong>2. Using incorrect mileage units:</strong> Entering mileage in miles when the calculator is set to metric (kilometers), or vice versa, leads to inaccurate estimates. Always ensure the unit system matches your input.
          </p>
          <p>
            <strong>3. Overlooking market variations:</strong> This estimator uses general depreciation logic and may not reflect local market trends, special editions, or collector's value. Use it as a guide, not an absolute.
          </p>
          <p>
            <strong>4. Inputting unrealistic original prices:</strong> Entering an incorrect or outdated original purchase price can skew results. Use the vehicle's actual purchase price or a reasonable estimate.
          </p>
          <p>
            <strong>5. Not updating the current year:</strong> Although the calculator uses the system date, manually entered years in the future or far past can cause errors. Always double-check the year input.
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