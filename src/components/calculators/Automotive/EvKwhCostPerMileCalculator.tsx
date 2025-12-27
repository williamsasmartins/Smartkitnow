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

export default function EvKwhCostPerMileCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    kwhPer100mi: "", // EV consumption in kWh per 100 miles
    ratePerKwh: "",  // Electricity cost in $ per kWh
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const kwh = parseFloat(inputs.kwhPer100mi);
    const rate = parseFloat(inputs.ratePerKwh);

    if (isNaN(kwh) || kwh <= 0 || isNaN(rate) || rate <= 0) {
      return {
        primary: "0.00",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for both inputs.",
        feedback: "Awaiting valid inputs"
      };
    }

    // Cost per mile = (kWh per 100 miles * $ per kWh) / 100
    const costPerMile = (kwh * rate) / 100;

    // Time to drive 100 miles at average speed (optional, not requested but can be added)
    // For now, just cost per mile and cost per 100 miles

    return {
      primary: costPerMile.toFixed(3), // cost per mile in dollars
      secondary: `$${(costPerMile * 100).toFixed(2)} per 100 miles`,
      details: `Based on ${kwh.toFixed(1)} kWh/100mi and $${rate.toFixed(3)}/kWh`,
      feedback: costPerMile < 0.05 ? "Excellent efficiency" : costPerMile < 0.10 ? "Good efficiency" : "Standard range"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does kWh per 100 miles affect the cost per mile for an EV?",
      answer:
        "The kWh per 100 miles metric indicates how much electrical energy an EV consumes to travel 100 miles. A lower kWh/100mi means the vehicle is more energy-efficient, resulting in a lower cost per mile when multiplied by the electricity rate. Understanding this relationship helps EV owners estimate their driving costs accurately."
    },
    {
      question: "Why is electricity rate important in calculating cost per mile?",
      answer:
        "Electricity rate, usually expressed in dollars per kilowatt-hour ($/kWh), directly impacts how much you pay to charge your EV. Even if your vehicle is efficient, a high electricity rate can increase your cost per mile. This calculator helps you factor in your local electricity costs for precise budgeting."
    },
    {
      question: "Can I use this calculator for different units or countries?",
      answer:
        "This calculator uses kWh per 100 miles and dollars per kWh, which are common in the US and some other countries. If you use metric units like kWh per 100 kilometers, you may need to convert values accordingly. The calculator currently supports imperial units but can be adapted for metric with proper conversions."
    },
    {
      question: "How accurate are the cost estimates from this calculator?",
      answer:
        "The estimates are based on your inputs for energy consumption and electricity rates, so accuracy depends on the precision of those values. Real-world factors like driving habits, terrain, temperature, and charging efficiency can cause variations. Use this as a reliable baseline for budgeting rather than an exact figure."
    },
    {
      question: "Can this calculator help me compare EV models?",
      answer:
        "Yes, by inputting the kWh per 100 miles for different EV models and your local electricity rate, you can compare their estimated cost per mile. This helps in evaluating which EV might be more economical to operate over time, aiding your purchase decision."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the cost per mile for a 2023 Tesla Model 3 Standard Range Plus with an average consumption of 24 kWh per 100 miles and an electricity rate of $0.13 per kWh.",
    steps: [
      {
        label: "Step 1: Identify EV consumption",
        explanation: "The Tesla Model 3 consumes approximately 24 kWh to travel 100 miles."
      },
      {
        label: "Step 2: Identify electricity rate",
        explanation: "The local electricity rate is $0.13 per kWh."
      },
      {
        label: "Step 3: Calculate cost per mile",
        explanation:
          "Cost per mile = (24 kWh/100 miles * $0.13/kWh) / 100 = $0.0312 per mile."
      },
      {
        label: "Step 4: Calculate cost per 100 miles",
        explanation:
          "Cost per 100 miles = 24 kWh * $0.13 = $3.12."
      }
    ],
    result: "Final Result: The Tesla Model 3 costs approximately $0.031 per mile or $3.12 per 100 miles to operate based on the given inputs."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for electric vehicle energy consumption and efficiency ratings."
    },
    {
      title: "U.S. Energy Information Administration (EIA)",
      description: "Provides average residential electricity rates by state."
    },
    {
      title: "InsideEVs",
      description: "Comprehensive EV reviews and real-world consumption data."
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
            <SelectItem value="metric">Metric (Coming Soon)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>EV Consumption (kWh per 100 miles)</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 24"
            value={inputs.kwhPer100mi}
            onChange={(e) => handleInputChange("kwhPer100mi", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($ per kWh)</Label>
          <Input
            type="number"
            min="0"
            step="0.001"
            placeholder="e.g. 0.13"
            value={inputs.ratePerKwh}
            onChange={(e) => handleInputChange("ratePerKwh", e.target.value)}
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
            <p className="mt-1 text-sm font-medium text-blue-700">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter your EV's energy consumption in kilowatt-hours per 100 miles (kWh/100mi). This value is often found in your vehicle's specifications or EPA ratings.
          </li>
          <li>
            <strong>Step 2:</strong> Input your local electricity rate in dollars per kilowatt-hour ($/kWh). Check your utility bill or local energy provider for accurate rates.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to see your estimated cost per mile and cost per 100 miles based on your inputs.
          </li>
          <li>
            <strong>Step 4:</strong> Review the results and use them to budget your EV driving costs or compare different EV models.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV kWh per 100 mi ↔ Cost per Mile
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electric vehicles (EVs) have transformed the automotive landscape by offering a cleaner and often more economical alternative to traditional gasoline-powered cars. One of the key metrics to understand when evaluating EV operating costs is the energy consumption rate, typically expressed as kilowatt-hours per 100 miles (kWh/100mi). This figure represents how much electrical energy the vehicle uses to travel 100 miles and is crucial for estimating your charging expenses.
          </p>
          <p>
            To calculate the cost per mile of driving an EV, you multiply the energy consumption by the cost of electricity per kilowatt-hour, then divide by 100. For example, if your EV consumes 30 kWh per 100 miles and your electricity rate is $0.15 per kWh, your cost per mile is (30 * 0.15) / 100 = $0.045, or 4.5 cents per mile. This simple calculation helps you budget your driving expenses and compare the efficiency of different EV models.
          </p>
          <p>
            It's important to note that actual consumption can vary based on driving habits, terrain, temperature, and other factors. Additionally, electricity rates differ by region and time of day, especially if you have time-of-use pricing. This calculator provides a baseline estimate to help you understand and plan your EV costs effectively.
          </p>
          <p>
            By regularly monitoring your EV's energy consumption and electricity rates, you can optimize your charging strategy, choose more efficient routes, and ultimately save money while reducing your carbon footprint.
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
            <strong>1. Using incorrect consumption values:</strong> Many users confuse miles per kWh with kWh per 100 miles. Always ensure you use kWh per 100 miles for this calculator to get accurate results.
          </p>
          <p>
            <strong>2. Ignoring electricity rate variations:</strong> Electricity costs can vary by time of day or season. Using an average rate may not reflect your actual charging costs if you have time-of-use rates.
          </p>
          <p>
            <strong>3. Forgetting to convert units:</strong> This calculator currently uses imperial units. If you have consumption data in kWh per 100 kilometers, convert it to kWh per 100 miles by multiplying by 1.609.
          </p>
          <p>
            <strong>4. Overlooking real-world factors:</strong> Weather, terrain, and driving style affect energy consumption. Use this calculator as a baseline, not an exact predictor.
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
      title="EV kWh per 100 mi ↔ Cost per Mile"
      description="Professional automotive calculator: EV kWh per 100 mi ↔ Cost per Mile. Get accurate estimates, expert advice, and financial insights."
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