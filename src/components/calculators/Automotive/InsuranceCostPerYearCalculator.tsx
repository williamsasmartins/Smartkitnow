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
      question: "What factors influence the insurance cost per year?",
      answer:
        "Insurance cost per year depends on multiple factors including the vehicle's value, the driver's age, location risk factors such as accident rates or theft prevalence, and the chosen coverage level. Younger drivers typically pay more due to higher risk, while safer locations and lower coverage reduce costs. Understanding these variables helps in estimating accurate insurance premiums."
    },
    {
      question: "How does driver age affect insurance premiums?",
      answer:
        "Driver age significantly impacts insurance premiums because younger drivers, especially those under 25, statistically have higher accident rates. This increased risk leads insurers to charge higher rates. Conversely, middle-aged drivers often receive discounts, while senior drivers may see slight increases due to age-related risk factors."
    },
    {
      question: "Why is the vehicle value important in calculating insurance cost?",
      answer:
        "The vehicle's value is crucial because insurance premiums are often calculated as a percentage of the car's worth. More expensive vehicles cost more to repair or replace, leading to higher insurance costs. This ensures that the coverage amount aligns with the potential financial risk to the insurer."
    },
    {
      question: "What is a location risk factor and how does it affect insurance?",
      answer:
        "Location risk factor reflects the likelihood of claims based on geographic area, considering factors like crime rates, weather hazards, and traffic density. Areas with higher risks lead to increased premiums as insurers anticipate more frequent or costly claims. Accurately assessing this factor helps in tailoring insurance costs to real-world conditions."
    },
    {
      question: "Can I reduce my insurance cost by choosing a different coverage level?",
      answer:
        "Yes, selecting a lower coverage level, such as basic instead of premium, reduces your annual insurance cost because it limits the insurer's liability. However, this also means less protection in case of accidents or damages. It's important to balance cost savings with adequate coverage to avoid financial risks."
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
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Enter the current market value of your vehicle in the appropriate currency.
          </li>
          <li>
            <strong>Step 2:</strong> Input the driver's age to account for age-related risk adjustments.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the location risk factor, which reflects the insurance risk in your area.
          </li>
          <li>
            <strong>Step 4:</strong> Select the desired coverage level: basic, standard, or premium.
          </li>
          <li>
            <strong>Step 5:</strong> Click the Calculate button to see your estimated annual insurance cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Insurance Cost per Year
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Calculating your annual insurance cost involves understanding several key factors that insurers use to assess risk and determine premiums. The primary component is the vehicle's value, as insurance typically covers repair or replacement costs. Higher-value vehicles generally incur higher premiums due to increased potential payout.
          </p>
          <p>
            Driver age is another critical factor. Younger drivers, especially those under 25, are statistically more likely to be involved in accidents, leading to higher insurance costs. Middle-aged drivers often benefit from lower premiums, while senior drivers may face increased rates due to age-related risks.
          </p>
          <p>
            Location risk factor accounts for geographic variables such as crime rates, weather conditions, and traffic density. Living in an area with high theft or accident rates will increase your insurance cost. This factor is expressed as a multiplier, adjusting the base premium accordingly.
          </p>
          <p>
            Lastly, the coverage level you select influences your premium. Basic coverage offers minimal protection at a lower cost, while premium coverage provides extensive protection but at a higher price. Balancing coverage needs with budget constraints is essential for optimal insurance planning.
          </p>
          <p>
            By inputting these variables into this calculator, you can obtain a realistic estimate of your yearly insurance expenses, helping you budget effectively and make informed decisions about your vehicle insurance.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring driver age impact:</strong> Many users overlook how significantly age affects insurance costs, especially for younger drivers who face steep premiums.
          </p>
          <p>
            <strong>2. Using inaccurate vehicle value:</strong> Underestimating or overestimating your car’s value can lead to incorrect insurance cost estimates.
          </p>
          <p>
            <strong>3. Neglecting location risk factor:</strong> Not accounting for your area's risk multiplier can cause large discrepancies in premium calculations.
          </p>
          <p>
            <strong>4. Choosing inappropriate coverage level:</strong> Selecting coverage without understanding its implications may result in insufficient protection or unnecessary expenses.
          </p>
          <p>
            <strong>5. Input errors:</strong> Entering invalid or incomplete data will prevent accurate calculations and mislead budgeting decisions.
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