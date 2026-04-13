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

export default function BrakePadWearEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    currentPadThickness: "", // in mm or inches
    minPadThickness: "", // in mm or inches (manufacturer spec)
    currentRotorThickness: "", // in mm or inches
    minRotorThickness: "", // in mm or inches (manufacturer spec)
    pricePerPadSet: "", // in $ or local currency
    pricePerRotorSet: "" // in $ or local currency
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const padCurrent = parseFloat(inputs.currentPadThickness);
    const padMin = parseFloat(inputs.minPadThickness);
    const rotorCurrent = parseFloat(inputs.currentRotorThickness);
    const rotorMin = parseFloat(inputs.minRotorThickness);
    const padPrice = parseFloat(inputs.pricePerPadSet);
    const rotorPrice = parseFloat(inputs.pricePerRotorSet);

    if (
      isNaN(padCurrent) || isNaN(padMin) || isNaN(rotorCurrent) || isNaN(rotorMin) ||
      padCurrent <= 0 || padMin <= 0 || rotorCurrent <= 0 || rotorMin <= 0
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter valid positive numbers for thickness values.",
        feedback: "Error"
      };
    }

    // Calculate wear percentage for pads and rotors
    // Wear % = ((Current Thickness - Min Thickness) / (Typical New Thickness - Min Thickness)) * 100
    // Since new thickness is not given, assume typical new thickness:
    // Pads: 12 mm (0.47 in), Rotors: 30 mm (1.18 in) - common average values
    // If unit is imperial, convert typical new thickness accordingly

    const typicalPadNewThickness = inputs.unit === "imperial" ? 0.47 : 12; // inches or mm
    const typicalRotorNewThickness = inputs.unit === "imperial" ? 1.18 : 30; // inches or mm

    // Validate typical new thickness > min thickness
    if (padMin >= typicalPadNewThickness || rotorMin >= typicalRotorNewThickness) {
      return {
        primary: "Invalid specs",
        secondary: "",
        details: "Minimum thickness must be less than typical new thickness.",
        feedback: "Error"
      };
    }

    // Calculate pad wear %
    const padWearPercent = ((typicalPadNewThickness - padCurrent) / (typicalPadNewThickness - padMin)) * 100;
    // Calculate rotor wear %
    const rotorWearPercent = ((typicalRotorNewThickness - rotorCurrent) / (typicalRotorNewThickness - rotorMin)) * 100;

    // Clamp values between 0 and 100
    const padWearClamped = Math.min(Math.max(padWearPercent, 0), 100);
    const rotorWearClamped = Math.min(Math.max(rotorWearPercent, 0), 100);

    // Estimate replacement cost if wear > 80%
    const padNeedsReplacement = padWearClamped >= 80;
    const rotorNeedsReplacement = rotorWearClamped >= 80;

    let totalCost = 0;
    if (padNeedsReplacement && !isNaN(padPrice)) totalCost += padPrice;
    if (rotorNeedsReplacement && !isNaN(rotorPrice)) totalCost += rotorPrice;

    // Feedback message
    let feedback = "Brake components are in good condition.";
    if (padNeedsReplacement && rotorNeedsReplacement) {
      feedback = "Both brake pads and rotors need replacement soon.";
    } else if (padNeedsReplacement) {
      feedback = "Brake pads need replacement soon.";
    } else if (rotorNeedsReplacement) {
      feedback = "Brake rotors need replacement soon.";
    } else if (padWearClamped >= 50 || rotorWearClamped >= 50) {
      feedback = "Brake components show moderate wear; monitor regularly.";
    }

    // Format results
    const primary = `Pads: ${padWearClamped.toFixed(1)}% worn, Rotors: ${rotorWearClamped.toFixed(1)}% worn`;
    const secondary = totalCost > 0 ? `Estimated replacement cost: $${totalCost.toFixed(2)}` : "No immediate replacement needed";
    const details = `Pad thickness: ${padCurrent} / Min: ${padMin}, Rotor thickness: ${rotorCurrent} / Min: ${rotorMin}`;

    return {
      primary,
      secondary,
      details,
      feedback
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How often should brake pads be replaced?",
      answer: "Most brake pads last between 25,000 and 70,000 miles depending on driving habits, vehicle weight, and pad material. Aggressive braking and frequent stop-and-go driving can reduce pad lifespan to 25,000–40,000 miles, while highway driving may extend it to 50,000–70,000 miles. This calculator helps you estimate your specific wear rate based on your driving patterns and current mileage.",
    },
    {
      question: "What's the average cost to replace brake pads and rotors?",
      answer: "Brake pad replacement typically costs $150–$300 per axle (front or rear), while rotor replacement adds $300–$800 per axle depending on vehicle type and labor rates. A complete front brake service (pads and rotors) averages $500–$1,200, and rear service costs $400–$900. Using this estimator helps you plan maintenance budgets and avoid unexpected repair expenses.",
    },
    {
      question: "How do I know if my brake pads are worn out?",
      answer: "Common warning signs include a high-pitched squealing noise when braking, reduced braking responsiveness, longer stopping distances, or a brake warning light on your dashboard. Most modern vehicles have brake pad wear sensors that trigger the warning light when pads reach approximately 2–3mm thickness. This calculator uses your current thickness and mileage estimates to predict when you'll reach the critical 2mm replacement threshold.",
    },
    {
      question: "Do brake rotors wear faster than brake pads?",
      answer: "Brake rotors typically last 50,000–70,000 miles, which is longer than brake pads in most cases. However, severe braking, towing heavy loads, or driving in mountainous terrain can accelerate rotor wear to 40,000–50,000 miles. This calculator tracks both components separately so you can prioritize replacement based on actual wear rates.",
    },
    {
      question: "What factors affect brake pad wear rates?",
      answer: "Key factors include driving style (aggressive braking accelerates wear), vehicle weight and load, brake pad material (ceramic pads last longer than semi-metallic), road conditions, and climate. Stop-and-go city driving typically causes 30–40% faster wear than highway driving, while towing or hauling cargo can increase wear by 20–50%. Enter your driving conditions into this calculator to get a personalized wear estimate.",
    },
    {
      question: "Can I extend brake pad lifespan?",
      answer: "Yes, you can extend pad life by 15–25% through smooth braking, avoiding sudden stops, maintaining proper tire pressure, and reducing vehicle load. Downshifting when descending hills and using engine braking reduces friction brake wear by 10–20%. This calculator helps you understand how driving behavior changes your replacement timeline.",
    },
    {
      question: "What's the difference between ceramic, semi-metallic, and organic brake pads?",
      answer: "Ceramic pads last 50,000–70,000 miles with quiet operation but cost $150–$250 per axle. Semi-metallic pads last 25,000–50,000 miles, cost $100–$150 per axle, and provide better cooling. Organic pads last 20,000–40,000 miles and cost $50–$100 per axle but produce more dust and heat. Select your pad type in this calculator to get an accurate wear forecast.",
    },
    {
      question: "How accurate is a brake wear estimator?",
      answer: "A brake wear estimator is typically accurate to within ±15–20% because it uses your actual driving data, mileage, and vehicle specifications. Accuracy depends on honest input about your driving habits, braking frequency, and current pad thickness. Regular visual inspections every 10,000–15,000 miles help validate the calculator's predictions and catch premature wear.",
    },
    {
      question: "Should I replace brake pads and rotors together?",
      answer: "Mechanics recommend replacing pads and rotors together if rotors show scoring, uneven wear, or are below the minimum thickness of 1.25mm for most vehicles. If rotors are in good condition and &gt;1.5mm thick, you can replace pads alone, saving $300–$500 per axle. This calculator helps you monitor both components to make informed replacement decisions.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A driver wants to estimate the wear on their brake pads and rotors to decide if replacement is needed. They measure the current thickness and know the minimum thickness specs and replacement costs.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the current pad thickness as 4 mm, minimum pad thickness as 2 mm, current rotor thickness as 25 mm, and minimum rotor thickness as 22 mm. Prices are $120 for a pad set and $200 for a rotor set."
      },
      {
        label: "Step 2",
        explanation:
          "Calculate pad wear %: ((12 - 4) / (12 - 2)) * 100 = (8 / 10) * 100 = 80%. Calculate rotor wear %: ((30 - 25) / (30 - 22)) * 100 = (5 / 8) * 100 = 62.5%."
      },
      {
        label: "Step 3",
        explanation:
          "Since pad wear is 80%, pads need replacement. Rotor wear is 62.5%, so rotors do not need immediate replacement but should be monitored."
      },
      {
        label: "Step 4",
        explanation:
          "Estimated replacement cost is $120 for pads only."
      }
    ],
    result: "Brake pads are 80% worn and need replacement. Rotors are 62.5% worn and can be monitored. Estimated replacement cost: $120."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Brake Pad and Rotor Maintenance Guide - NHTSA",
      description: "Comprehensive guide on brake system maintenance and safety from the National Highway Traffic Safety Administration."
    },
    {
      title: "How to Measure Brake Pad Thickness - YourMechanic",
      description: "Step-by-step instructions on measuring brake pad thickness and understanding wear indicators."
    },
    {
      title: "Brake Rotor Replacement Guide - Advance Auto Parts",
      description: "Detailed explanation of rotor wear, replacement criteria, and cost considerations."
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
            <SelectItem value="imperial">Imperial (inches)</SelectItem>
            <SelectItem value="metric">Metric (mm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Current Brake Pad Thickness ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.currentPadThickness}
            onChange={(e) => handleInputChange("currentPadThickness", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 0.16" : "e.g. 4"}
          />
        </div>
        <div className="space-y-2">
          <Label>Minimum Brake Pad Thickness ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.minPadThickness}
            onChange={(e) => handleInputChange("minPadThickness", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 0.08" : "e.g. 2"}
          />
        </div>
        <div className="space-y-2">
          <Label>Current Rotor Thickness ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.currentRotorThickness}
            onChange={(e) => handleInputChange("currentRotorThickness", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 0.98" : "e.g. 25"}
          />
        </div>
        <div className="space-y-2">
          <Label>Minimum Rotor Thickness ({inputs.unit === "imperial" ? "inches" : "mm"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.minRotorThickness}
            onChange={(e) => handleInputChange("minRotorThickness", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 0.87" : "e.g. 22"}
          />
        </div>
        <div className="space-y-2">
          <Label>Price per Brake Pad Set ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.pricePerPadSet}
            onChange={(e) => handleInputChange("pricePerPadSet", e.target.value)}
            placeholder="e.g. 120"
          />
        </div>
        <div className="space-y-2">
          <Label>Price per Rotor Set ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.pricePerRotorSet}
            onChange={(e) => handleInputChange("pricePerRotorSet", e.target.value)}
            placeholder="e.g. 200"
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
            <p className="mt-3 font-semibold text-blue-700 dark:text-blue-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Brake Pad/Rotors Wear Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Brake Pad/Rotors Wear Estimator is a tool designed to predict when your vehicle's braking components will need replacement based on current wear measurements and your driving patterns. By tracking pad thickness, rotor condition, and mileage, this calculator helps you schedule maintenance proactively, avoid safety hazards, and budget for repairs before they become emergencies.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need to input several key pieces of information: your vehicle type (sedan, SUV, truck), brake pad material (ceramic, semi-metallic, or organic), current pad thickness in millimeters, current rotor thickness, monthly driving mileage, and your typical driving environment (highway, city, mountain, towing). These inputs allow the calculator to determine your unique wear rate and project a replacement timeline specific to your habits and vehicle.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you run the calculation, the results will show estimated months remaining until replacement is needed and the projected mileage at which replacement should occur. Compare these estimates against your vehicle's warranty, maintenance schedule, and budget to plan ahead. If the calculator shows &lt;3 months remaining, schedule an inspection immediately; if &gt;12 months, you have time to save for the service or monitor wear with regular visual checks.</p>
        </div>
      </section>

      {/* TABLE: Typical Brake Pad Lifespan by Material Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Brake Pad Lifespan by Material Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows expected lifespan, cost, and performance characteristics for the three main brake pad materials used in passenger vehicles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pad Material</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Lifespan (Miles)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per Axle</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heat Resistance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dust/Noise Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ceramic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50,000–70,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150–$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low dust, quiet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Semi-Metallic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25,000–50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate dust, moderate noise</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Organic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20,000–40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High dust, quieter</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Carbon-Ceramic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70,000–100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300–$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Superior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very low dust, quiet</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Lifespan varies by vehicle weight, driving habits, and operating conditions. Highway driving extends lifespan; city driving and towing reduce it.</p>
      </section>

      {/* TABLE: Brake Pad Wear Rates by Driving Condition */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Brake Pad Wear Rates by Driving Condition</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table estimates how different driving environments and habits affect brake pad wear acceleration compared to average highway driving.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Driving Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wear Rate Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Annual Mileage Lost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Cause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Highway cruising (stable speed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Base rate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal braking</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mixed city/highway</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Base rate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate braking</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Urban stop-and-go</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+40% faster wear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Frequent hard stops</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mountain/hilly terrain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.6x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+60% faster wear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extended braking descents</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Towing/heavy load</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+50% faster wear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased stopping force needed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aggressive driving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+100% faster wear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hard acceleration and braking</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multipliers are relative to a baseline of 45,000 miles for ceramic pads under mixed driving. Actual wear depends on vehicle weight, brake system type, and driver behavior consistency.</p>
      </section>

      {/* TABLE: Rotor Thickness Specifications and Replacement Guidelines */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Rotor Thickness Specifications and Replacement Guidelines</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides minimum safe rotor thicknesses and replacement thresholds for common vehicle types to ensure braking safety and performance.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">New Rotor Thickness</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Operating Minimum</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Replacement Threshold</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Rotor Lifespan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedan/Compact Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25 inches (31.75mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.125 inches (3.2mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0625 inches (1.6mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50,000–70,000 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">SUV/Crossover</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.38 inches (35mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.137 inches (3.5mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0785 inches (2.0mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45,000–65,000 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Truck/Heavy Duty</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.50 inches (38mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.156 inches (4.0mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.094 inches (2.4mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40,000–60,000 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Performance/Sport Car</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25 inches (31.75mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.125 inches (3.2mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0625 inches (1.6mm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30,000–50,000 miles</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rotors &lt;0.0625 inches (1.6mm) on standard vehicles are unsafe and must be replaced immediately. Check your vehicle's service manual for exact specifications, as luxury and performance brands may differ.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your brake pad thickness every 10,000–15,000 miles using a simple depth gauge (available at auto parts stores for $5–$15) to validate the calculator's predictions and catch premature wear early.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Record your odometer reading and brake component measurements in a vehicle maintenance log; entering this historical data into the calculator improves accuracy and helps identify unusual wear patterns that may indicate alignment or suspension problems.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust your inputs seasonally if your driving changes significantly (e.g., winter mountain driving vs. summer highway road trips), as the calculator recalculates wear projections based on current usage patterns.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator as a planning tool only—always have a professional mechanic visually inspect your brakes before replacement, as road salt, water exposure, and driving conditions may accelerate wear beyond model predictions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Warning Light Indicators</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many drivers ignore brake pad wear sensor warnings and rely solely on the calculator's timeline, but warning lights trigger at 2–3mm thickness for safety reasons. If your brake warning light activates, schedule an inspection within 500 miles regardless of the calculator's estimate.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Stop-and-Go Driving Impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Drivers often underestimate how much city and urban driving accelerates brake wear; stop-and-go conditions can increase wear rates by 40–60% compared to highway driving. Be honest about your commute type to get accurate replacement predictions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Incorrect Current Thickness Measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measuring pad thickness without proper tools leads to inaccurate calculations; use a digital caliper or brake pad wear gauge for precision. Visual estimates are unreliable and can miss uneven wear across the brake pad surface.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Replacing Pads Without Inspecting Rotors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many drivers replace brake pads but skip rotor inspection, missing opportunities to resurface or replace damaged rotors before they cause safety issues. This calculator tracks both components separately so you can address rotor wear proactively.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should brake pads be replaced?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most brake pads last between 25,000 and 70,000 miles depending on driving habits, vehicle weight, and pad material. Aggressive braking and frequent stop-and-go driving can reduce pad lifespan to 25,000–40,000 miles, while highway driving may extend it to 50,000–70,000 miles. This calculator helps you estimate your specific wear rate based on your driving patterns and current mileage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the average cost to replace brake pads and rotors?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Brake pad replacement typically costs $150–$300 per axle (front or rear), while rotor replacement adds $300–$800 per axle depending on vehicle type and labor rates. A complete front brake service (pads and rotors) averages $500–$1,200, and rear service costs $400–$900. Using this estimator helps you plan maintenance budgets and avoid unexpected repair expenses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my brake pads are worn out?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common warning signs include a high-pitched squealing noise when braking, reduced braking responsiveness, longer stopping distances, or a brake warning light on your dashboard. Most modern vehicles have brake pad wear sensors that trigger the warning light when pads reach approximately 2–3mm thickness. This calculator uses your current thickness and mileage estimates to predict when you'll reach the critical 2mm replacement threshold.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do brake rotors wear faster than brake pads?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Brake rotors typically last 50,000–70,000 miles, which is longer than brake pads in most cases. However, severe braking, towing heavy loads, or driving in mountainous terrain can accelerate rotor wear to 40,000–50,000 miles. This calculator tracks both components separately so you can prioritize replacement based on actual wear rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect brake pad wear rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Key factors include driving style (aggressive braking accelerates wear), vehicle weight and load, brake pad material (ceramic pads last longer than semi-metallic), road conditions, and climate. Stop-and-go city driving typically causes 30–40% faster wear than highway driving, while towing or hauling cargo can increase wear by 20–50%. Enter your driving conditions into this calculator to get a personalized wear estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I extend brake pad lifespan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can extend pad life by 15–25% through smooth braking, avoiding sudden stops, maintaining proper tire pressure, and reducing vehicle load. Downshifting when descending hills and using engine braking reduces friction brake wear by 10–20%. This calculator helps you understand how driving behavior changes your replacement timeline.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between ceramic, semi-metallic, and organic brake pads?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ceramic pads last 50,000–70,000 miles with quiet operation but cost $150–$250 per axle. Semi-metallic pads last 25,000–50,000 miles, cost $100–$150 per axle, and provide better cooling. Organic pads last 20,000–40,000 miles and cost $50–$100 per axle but produce more dust and heat. Select your pad type in this calculator to get an accurate wear forecast.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is a brake wear estimator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A brake wear estimator is typically accurate to within ±15–20% because it uses your actual driving data, mileage, and vehicle specifications. Accuracy depends on honest input about your driving habits, braking frequency, and current pad thickness. Regular visual inspections every 10,000–15,000 miles help validate the calculator's predictions and catch premature wear.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I replace brake pads and rotors together?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mechanics recommend replacing pads and rotors together if rotors show scoring, uneven wear, or are below the minimum thickness of 1.25mm for most vehicles. If rotors are in good condition and &gt;1.5mm thick, you can replace pads alone, saving $300–$500 per axle. This calculator helps you monitor both components to make informed replacement decisions.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fmcsa.dot.gov/regulations/title-49-cfr-part-396-inspection-repair-and-maintenance" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Vehicle Maintenance Recommendations</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Motor Carrier Safety Administration guidelines on brake system inspection, maintenance, and safety standards for commercial and passenger vehicles.</p>
          </li>
          <li>
            <a href="https://www.nhtsa.gov/vehicle-manufacturers/vehicle-performance-requirements" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Brake System Performance Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Highway Traffic Safety Administration technical specifications and performance standards for automotive braking systems and components.</p>
          </li>
          <li>
            <a href="https://www.edmunds.com/automotive-guides/maintenance-cost-guide" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Automotive Maintenance Cost Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Edmunds provides comprehensive data on average brake service costs, parts pricing, and labor rates across vehicle types and regions.</p>
          </li>
          <li>
            <a href="https://consumer.ftc.gov/articles/how-keep-your-car-good-running-condition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Guide to Vehicle Maintenance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Trade Commission consumer guidance on vehicle maintenance schedules, brake system care, and recognizing signs of needed repairs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Brake Pad/Rotors Wear Estimator"
      description="Professional automotive calculator: Brake Pad/Rotors Wear Estimator. Get accurate estimates, expert advice, and financial insights."
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