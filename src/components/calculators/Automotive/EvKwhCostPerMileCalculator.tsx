import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Ruler, Hammer, HardHat, Box, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Lightbulb } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EvKwhCostPerMileCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric: kWh per 100 km, cost per km; imperial: kWh per 100 mi, cost per mi
    kwhPer100: "",
    costPerUnit: "",
    direction: "kwh-to-cost" // "kwh-to-cost" or "cost-to-kwh"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const kwh = parseFloat(inputs.kwhPer100);
    const cost = parseFloat(inputs.costPerUnit);
    if (isNaN(kwh) && isNaN(cost)) {
      return null;
    }
    if (inputs.direction === "kwh-to-cost") {
      // Calculate cost per mile/km from kWh per 100 mi/km and cost per kWh
      if (isNaN(kwh) || isNaN(cost) || cost <= 0) return null;
      // cost per mile = (kWh per 100 mi) / 100 * cost per kWh
      const costPerDistance = (kwh / 100) * cost;
      return {
        mainQty: costPerDistance.toFixed(4),
        unitLabel: inputs.unit === "imperial" ? "per mile" : "per km",
        cost: `$${costPerDistance.toFixed(4)}`,
        details: `Based on ${kwh} kWh per 100 ${inputs.unit === "imperial" ? "miles" : "km"} and $${cost.toFixed(2)} per kWh.`,
        wasteInfo: ""
      };
    } else {
      // Calculate kWh per 100 mi/km from cost per mile/km and cost per kWh
      if (isNaN(cost) || isNaN(kwh) || kwh <= 0) return null;
      // kWh per 100 mi = (cost per mile / cost per kWh) * 100
      const kwhPer100 = (cost / kwh) * 100;
      return {
        mainQty: kwhPer100.toFixed(2),
        unitLabel: `kWh per 100 ${inputs.unit === "imperial" ? "mi" : "km"}`,
        cost: `$${cost.toFixed(4)}`,
        details: `Based on $${cost.toFixed(4)} ${inputs.unit === "imperial" ? "per mile" : "per km"} and $${kwh.toFixed(2)} per kWh.`,
        wasteInfo: ""
      };
    }
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What factors influence the calculation of EV kWh per 100 miles to cost per mile?",
      answer:
        "The calculation of EV kWh per 100 miles to cost per mile depends on several critical factors including the vehicle's energy consumption rate, the cost of electricity per kilowatt-hour, and driving conditions. Energy consumption varies with speed, terrain, and climate control usage, affecting the kWh per 100 miles metric. Additionally, electricity rates fluctuate by region and time of day, influencing the cost per mile. Accurate calculations must consider these variables to ensure precise budgeting and energy efficiency assessments."
    },
    {
      question: "How does the waste factor impact my budget when estimating EV charging costs?",
      answer:
        "While 'waste' is a term more common in construction, in the context of EV charging cost estimation, it can be likened to inefficiencies such as energy loss during charging, battery degradation, and auxiliary power consumption. These factors cause the actual energy used to be higher than theoretical calculations. Accounting for such inefficiencies by adding a margin ensures that budgets are realistic and prevent underestimation of charging expenses. Professional estimators often include a 10-15% contingency to cover these operational variances."
    },
    {
      question: "What are the differences between standard and high-efficiency EVs in terms of kWh per 100 miles?",
      answer:
        "Standard EVs typically consume between 25 to 40 kWh per 100 miles, depending on size and driving conditions. High-efficiency EVs, often equipped with advanced battery management systems and aerodynamic designs, can reduce consumption to below 20 kWh per 100 miles. Choosing between these depends on usage patterns and budget constraints. High-efficiency models offer lower operating costs but may come with higher upfront prices, making precise kWh per 100 miles calculations essential for cost-benefit analysis."
    },
    {
      question: "What installation tips should I consider for EV charging infrastructure to optimize cost per mile?",
      answer:
        "Proper installation of EV charging infrastructure involves selecting the right charger type, ensuring adequate electrical capacity, and positioning for convenient access. Site preparation must include compliance with local electrical codes and safety standards to maintain structural integrity and prevent hazards. Additionally, using smart chargers with load management can optimize charging times and reduce electricity costs, directly impacting the cost per mile. Consulting with certified electricians ensures efficient and safe installation."
    },
    {
      question: "How do environmental factors affect EV energy consumption and cost per mile?",
      answer:
        "Environmental factors such as temperature, terrain, and weather conditions significantly influence EV energy consumption. Cold weather increases battery resistance and heating demands, raising kWh per 100 miles, while hilly terrain requires more power for elevation changes. Rain and wind resistance also add to energy use. These factors elevate the cost per mile by increasing electricity consumption, making it crucial to factor in local climate and driving conditions for accurate cost estimations."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Alternative Fuels Data Center",
      description: "Comprehensive data on electric vehicle energy consumption and charging costs.",
      url: "https://afdc.energy.gov/"
    },
    {
      title: "EPA Fuel Economy Guide",
      description: "Official guide providing detailed EV efficiency ratings and cost estimates.",
      url: "https://www.fueleconomy.gov/feg/evtech.shtml"
    },
    {
      title: "International Energy Agency - Global EV Outlook",
      description: "Annual report analyzing global trends in electric vehicle adoption and energy use.",
      url: "https://www.iea.org/reports/global-ev-outlook-2023"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (kWh/100 km)</SelectItem>
            <SelectItem value="imperial">Imperial (kWh/100 mi)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={inputs.direction} onValueChange={(v) => handleInputChange("direction", v)}>
          <SelectTrigger className="w-[180px]">
            <Lightbulb className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kwh-to-cost">kWh per 100 mi → Cost per Mile</SelectItem>
            <SelectItem value="cost-to-kwh">Cost per Mile → kWh per 100 mi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputs.direction === "kwh-to-cost" ? (
          <>
            <div className="space-y-2">
              <Label>{inputs.unit === "imperial" ? "kWh per 100 miles" : "kWh per 100 km"}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={inputs.kwhPer100}
                onChange={(e) => handleInputChange("kwhPer100", e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
            <div className="space-y-2">
              <Label>Electricity Cost per kWh ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.001"
                value={inputs.costPerUnit}
                onChange={(e) => handleInputChange("costPerUnit", e.target.value)}
                placeholder="e.g. 0.13"
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label>{inputs.unit === "imperial" ? "Cost per Mile ($)" : "Cost per Km ($)"}</Label>
              <Input
                type="number"
                min="0"
                step="0.0001"
                value={inputs.kwhPer100}
                onChange={(e) => handleInputChange("kwhPer100", e.target.value)}
                placeholder="e.g. 0.04"
              />
            </div>
            <div className="space-y-2">
              <Label>Electricity Cost per kWh ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.001"
                value={inputs.costPerUnit}
                onChange={(e) => handleInputChange("costPerUnit", e.target.value)}
                placeholder="e.g. 0.13"
              />
            </div>
          </>
        )}
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No explicit action needed, calculation is reactive
        }}
      >
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-bold mt-2">Value: {results.cost}</div>
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
            <strong>Step 1: Select Units and Calculation Direction:</strong> Choose between metric (kWh per 100 km) or imperial (kWh per 100 miles) units. Then select whether you want to convert from energy consumption to cost per distance or vice versa.
          </li>
          <li>
            <strong>Step 2: Enter Inputs:</strong> Input the known values based on your selection. For example, if converting kWh per 100 miles to cost per mile, enter your vehicle’s energy consumption and your local electricity rate.
          </li>
          <li>
            <strong>Step 3: Calculate:</strong> Click the calculate button to instantly see the estimated cost per mile or energy consumption per 100 miles, depending on your inputs.
          </li>
          <li>
            <strong>Step 4: Analyze Results:</strong> Use the results to budget your EV operating costs or to compare efficiency between different vehicles or electricity rates.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to EV kWh per 100 mi ↔ Cost per Mile
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Understanding the relationship between electric vehicle (EV) energy consumption, measured in kilowatt-hours (kWh) per 100 miles, and the cost per mile is essential for accurate budgeting and efficient vehicle operation. This calculation is grounded in fundamental engineering principles of energy conversion and consumption, where the vehicle’s battery capacity, motor efficiency, and driving conditions determine the kWh used over a given distance. Precision in these calculations ensures that users can forecast operating expenses, optimize charging strategies, and make informed decisions about vehicle selection and usage.
          </p>
          <p>
            The materials involved in this context are primarily the lithium-ion batteries and the electrical grid supplying the energy. Battery performance depends on factors such as state of charge, temperature, and degradation over time, which affect the effective energy available for propulsion. Additionally, the cost of electricity varies by region and time, influenced by generation sources and grid demand. These nuances must be considered when calculating cost per mile, as they directly impact the economic and environmental footprint of EV usage.
          </p>
          <p>
            Economically, overestimating energy consumption or electricity costs can lead to inflated budgets, while underestimating them risks unexpected expenses and reduced operational efficiency. Accurate calculations allow for optimized charging schedules, leveraging off-peak rates, and minimizing battery wear through controlled charging. This balance between precision and contingency is vital for maximizing the return on investment in EV technology and ensuring sustainable transportation solutions.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring Unit Consistency:</strong> Mixing metric and imperial units without proper conversion leads to inaccurate results. Always ensure that kWh per 100 miles is paired with cost per mile, and kWh per 100 km with cost per km.
          </p>
          <p>
            <strong>2. Overlooking Electricity Rate Variability:</strong> Electricity prices fluctuate by region and time of day. Using a flat rate without considering peak and off-peak pricing can misrepresent true operating costs.
          </p>
          <p>
            <strong>3. Neglecting Real-World Driving Conditions:</strong> Laboratory-rated kWh per 100 miles often differ from actual consumption due to terrain, weather, and driving style. Always factor in a margin for real-world variability.
          </p>
        </div>
      </section>

      {/* 4. FAQ (FULL TEXT) */}
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
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
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
      description="Calculate EV kWh per 100 mi ↔ Cost per Mile with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}