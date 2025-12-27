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

export default function EvHybridCo2SavingsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    batteryCapacity: "", // kWh
    electricityRate: "", // $/kWh
    annualMileage: "", // miles or km
    hybridMpg: "", // MPG or L/100km
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Assumptions and constants:
   * - EV efficiency: 0.3 kWh/mile (typical average)
   * - Hybrid fuel consumption: user input in MPG (imperial) or L/100km (metric)
   * - Gasoline CO2 emissions: 8.887 kg CO2/gallon (EPA)
   * - Electricity CO2 emissions: 0.45 kg CO2/kWh (US average, can vary)
   * - Fuel price not included, focus on CO2 savings and electricity cost
   */

  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.batteryCapacity);
    const electricityRate = parseFloat(inputs.electricityRate);
    const annualMileage = parseFloat(inputs.annualMileage);
    const hybridMpgOrLPer100km = parseFloat(inputs.hybridMpg);
    const unit = inputs.unit;

    if (
      isNaN(batteryCapacity) || batteryCapacity <= 0 ||
      isNaN(electricityRate) || electricityRate <= 0 ||
      isNaN(annualMileage) || annualMileage <= 0 ||
      isNaN(hybridMpgOrLPer100km) || hybridMpgOrLPer100km <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers in all fields.",
        feedback: "Awaiting input"
      };
    }

    // Constants
    const EV_EFFICIENCY_KWH_PER_MILE = 0.3; // average kWh per mile for EV
    const CO2_PER_GALLON_GAS = 8.887; // kg CO2 per gallon gasoline
    const CO2_PER_KWH_ELECTRICITY = 0.45; // kg CO2 per kWh (US average)

    // Convert units if metric
    // 1 mile = 1.60934 km
    // MPG to L/100km conversion: L/100km = 235.215 / MPG
    // For metric, annualMileage is in km, hybridMpgOrLPer100km is L/100km
    let annualMiles = annualMileage;
    let hybridFuelConsumptionGalPerMile = 0; // gallons per mile
    if (unit === "imperial") {
      // hybridMpgOrLPer100km is MPG
      hybridFuelConsumptionGalPerMile = 1 / hybridMpgOrLPer100km;
    } else {
      // metric: convert km to miles, L/100km to gallons/mile
      annualMiles = annualMileage / 1.60934;
      const litersPer100km = hybridMpgOrLPer100km;
      const gallonsPer100km = litersPer100km / 3.78541;
      hybridFuelConsumptionGalPerMile = gallonsPer100km / 62.1371; // 100 km = 62.1371 miles
    }

    // Calculate annual CO2 emissions for hybrid
    const hybridAnnualCO2 = annualMiles * hybridFuelConsumptionGalPerMile * CO2_PER_GALLON_GAS; // kg CO2/year

    // Calculate annual CO2 emissions for EV
    const evAnnualKWh = annualMiles * EV_EFFICIENCY_KWH_PER_MILE;
    const evAnnualCO2 = evAnnualKWh * CO2_PER_KWH_ELECTRICITY; // kg CO2/year

    // CO2 savings
    const co2SavingsKg = hybridAnnualCO2 - evAnnualCO2;
    const co2SavingsTons = co2SavingsKg / 1000;

    // Electricity cost for EV annual driving
    const evAnnualCost = evAnnualKWh * electricityRate;

    // Battery full charge cost (for reference)
    const batteryFullChargeCost = batteryCapacity * electricityRate;

    return {
      primary: `${co2SavingsTons.toFixed(2)} tons CO₂ saved/year`,
      secondary: `$${evAnnualCost.toFixed(2)} annual electricity cost`,
      details: `EV uses approx. ${evAnnualKWh.toFixed(0)} kWh/year. Battery full charge costs $${batteryFullChargeCost.toFixed(2)}.`,
      feedback: co2SavingsTons > 0 ? "Significant CO₂ savings" : "Check inputs for accuracy"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does this calculator estimate CO2 emissions savings between EVs and hybrids?",
      answer:
        "This calculator estimates CO2 emissions savings by comparing the annual carbon footprint of driving an electric vehicle (EV) versus a hybrid vehicle. It uses inputs such as battery capacity, electricity rate, annual mileage, and hybrid fuel efficiency to calculate the total CO2 emissions from electricity consumption for the EV and gasoline consumption for the hybrid. The difference between these values represents the CO2 emissions savings when choosing an EV over a hybrid."
    },
    {
      question: "Why does the calculator use a fixed EV efficiency of 0.3 kWh per mile?",
      answer:
        "The EV efficiency of 0.3 kWh per mile is an average value representing typical energy consumption for modern electric vehicles under mixed driving conditions. While actual efficiency varies by model, driving style, and terrain, this standard value provides a reasonable baseline for estimating electricity use and CO2 emissions. Users seeking more precise results can adjust inputs accordingly or use specific vehicle data."
    },
    {
      question: "Can I use this calculator if I live outside the US?",
      answer:
        "Yes, the calculator supports both imperial and metric units. You can switch between miles and kilometers as well as MPG and liters per 100 kilometers for fuel efficiency. However, CO2 emission factors and electricity carbon intensity may vary by region, so results are approximate and based on average US values. For more accurate regional estimates, adjust inputs or consult local data sources."
    },
    {
      question: "Does this calculator account for the CO2 emissions from battery manufacturing?",
      answer:
        "No, this calculator focuses solely on operational CO2 emissions from driving, comparing tailpipe emissions of hybrids with electricity-related emissions of EVs. It does not include embedded emissions from battery manufacturing or vehicle production, which can be significant but vary widely depending on manufacturing processes and supply chains."
    },
    {
      question: "How can I improve the accuracy of my CO2 savings estimate?",
      answer:
        "To improve accuracy, input your actual annual mileage and your hybrid vehicle’s precise fuel efficiency. Use your local electricity rate and, if possible, adjust the CO2 emissions per kWh to reflect your region’s electricity generation mix. Additionally, consider using your specific EV’s energy consumption if known instead of the default 0.3 kWh/mile."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a 2024 electric SUV with a 75 kWh battery, driving 12,000 miles annually, comparing CO2 emissions and electricity cost to a hybrid SUV with 35 MPG fuel efficiency.",
    steps: [
      {
        label: "Step 1: Calculate annual electricity consumption for EV",
        explanation:
          "Annual miles driven: 12,000 miles. EV efficiency: 0.3 kWh/mile. Annual electricity use = 12,000 × 0.3 = 3,600 kWh."
      },
      {
        label: "Step 2: Calculate annual CO2 emissions for EV",
        explanation:
          "Electricity CO2 factor: 0.45 kg CO2/kWh. EV annual CO2 = 3,600 × 0.45 = 1,620 kg CO2."
      },
      {
        label: "Step 3: Calculate annual CO2 emissions for hybrid",
        explanation:
          "Hybrid fuel efficiency: 35 MPG. Gasoline CO2 factor: 8.887 kg CO2/gallon. Fuel used = 12,000 / 35 = 342.86 gallons. Hybrid annual CO2 = 342.86 × 8.887 = 3,045 kg CO2."
      },
      {
        label: "Step 4: Calculate CO2 savings",
        explanation:
          "CO2 savings = Hybrid CO2 - EV CO2 = 3,045 - 1,620 = 1,425 kg CO2 = 1.43 tons CO2 saved per year."
      },
      {
        label: "Step 5: Calculate annual electricity cost",
        explanation:
          "Electricity rate: $0.13/kWh. Annual cost = 3,600 × 0.13 = $468."
      }
    ],
    result: "The EV saves approximately 1.43 tons of CO2 annually compared to the hybrid, with an estimated annual electricity cost of $468."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel consumption data for vehicles."
    },
    {
      title: "US Environmental Protection Agency - Greenhouse Gas Emissions from a Typical Passenger Vehicle",
      description: "Provides data on CO2 emissions per gallon of gasoline burned."
    },
    {
      title: "US Energy Information Administration - Electricity Emissions Factors",
      description: "Information on average CO2 emissions per kWh of electricity generated in the US."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Car reviews, advice, and detailed vehicle specifications."
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
            step="any"
            value={inputs.batteryCapacity}
            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
            placeholder="e.g. 75"
          />
        </div>
        <div className="space-y-2">
          <Label>Electricity Rate ($/kWh)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.electricityRate}
            onChange={(e) => handleInputChange("electricityRate", e.target.value)}
            placeholder="e.g. 0.13"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Mileage {inputs.unit === "imperial" ? "(miles)" : "(km)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.annualMileage}
            onChange={(e) => handleInputChange("annualMileage", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 12000" : "e.g. 19300"}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Hybrid Fuel Efficiency {inputs.unit === "imperial" ? "(MPG)" : "(L/100km)"}
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.hybridMpg}
            onChange={(e) => handleInputChange("hybridMpg", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 35" : "e.g. 6.7"}
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
            <p className="mt-2 font-medium text-blue-700">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (miles, MPG) or Metric (kilometers, L/100km).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the battery capacity of your electric vehicle in kilowatt-hours (kWh).
          </li>
          <li>
            <strong>Step 3:</strong> Input your local electricity rate in dollars per kilowatt-hour ($/kWh).
          </li>
          <li>
            <strong>Step 4:</strong> Provide your estimated annual driving distance in miles or kilometers.
          </li>
          <li>
            <strong>Step 5:</strong> Enter your hybrid vehicle’s fuel efficiency (MPG or L/100km).
          </li>
          <li>
            <strong>Step 6:</strong> Click the Calculate button to view your estimated annual CO2 emissions savings and electricity cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to CO2 Emissions Savings: EV vs Hybrid
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Choosing between an electric vehicle (EV) and a hybrid vehicle involves understanding not only the upfront costs but also the environmental impact of each option. This calculator helps you estimate the annual carbon dioxide (CO2) emissions savings by comparing the operational emissions of an EV versus a hybrid. It factors in your vehicle’s battery capacity, electricity costs, annual mileage, and your hybrid’s fuel efficiency to provide a clear picture of potential environmental benefits.
          </p>
          <p>
            The calculator assumes an average EV energy consumption of 0.3 kWh per mile, which is typical for many modern electric vehicles. It also uses average US emission factors for gasoline and electricity generation to estimate CO2 emissions. By inputting your specific data, you can see how much CO2 you could save annually by driving an EV instead of a hybrid, along with the estimated electricity cost for your EV usage.
          </p>
          <p>
            This tool is valuable for consumers, fleet managers, and policymakers aiming to understand the environmental trade-offs between vehicle types. While it focuses on operational emissions, remember that full lifecycle emissions—including manufacturing and disposal—also contribute to a vehicle’s total environmental footprint. Adjusting inputs to reflect your local electricity grid’s carbon intensity and your actual driving habits will yield the most accurate results.
          </p>
          <p>
            Ultimately, this calculator empowers you to make informed decisions about vehicle choice by quantifying CO2 savings and operational costs, supporting your commitment to sustainability and cost efficiency.
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
            <strong>1. Ignoring unit selection:</strong> Ensure you select the correct unit system (Imperial or Metric) before entering values. Mixing units can lead to inaccurate results.
          </p>
          <p>
            <strong>2. Using default EV efficiency without adjustment:</strong> The calculator uses an average EV efficiency of 0.3 kWh/mile. If you know your EV’s specific consumption, adjust inputs accordingly for better accuracy.
          </p>
          <p>
            <strong>3. Not updating electricity rate:</strong> Electricity prices vary widely by location and time. Use your current local rate to estimate costs accurately.
          </p>
          <p>
            <strong>4. Overlooking hybrid fuel efficiency variations:</strong> Hybrid fuel economy can vary significantly by model and driving conditions. Use your vehicle’s actual MPG or L/100km rating.
          </p>
          <p>
            <strong>5. Assuming CO2 emissions factors are universal:</strong> The calculator uses average US emission factors. For other regions, consider local data to refine estimates.
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
              <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
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
      title="CO2 Emissions Savings: EV vs Hybrid"
      description="Professional automotive calculator: CO2 Emissions Savings: EV vs Hybrid. Get accurate estimates, expert advice, and financial insights."
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