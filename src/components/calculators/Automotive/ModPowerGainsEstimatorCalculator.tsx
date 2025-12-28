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

export default function ModPowerGainsEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    baselinePower: "", // Baseline engine power (hp or kW)
    modType: "", // Modification type
    modLevel: "", // Level or extent of modification
    price: "" // Optional cost of modification ($)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Define power gain factors for common mods (approximate % gain)
  // Values are average expected gains relative to baseline power
  const modPowerGainFactors: Record<string, number> = {
    "Cold Air Intake": 0.05, // 5%
    "Cat-Back Exhaust": 0.07, // 7%
    "Performance ECU Tune": 0.15, // 15%
    "Turbocharger / Supercharger": 0.40, // 40%
    "Headers": 0.10, // 10%
    "High-Flow Fuel Injectors": 0.08, // 8%
    "Camshaft Upgrade": 0.12, // 12%
    "Intercooler Upgrade": 0.05, // 5%
    "Throttle Body Upgrade": 0.04, // 4%
    "Nitrous Oxide System": 0.30 // 30%
  };

  // Some mods can have levels (e.g. mild, moderate, aggressive) affecting gain
  // We'll map levels to multipliers
  const modLevelMultipliers: Record<string, number> = {
    "Mild": 0.75,
    "Moderate": 1,
    "Aggressive": 1.25
  };

  const results = useMemo(() => {
    const baselinePower = parseFloat(inputs.baselinePower);
    const price = parseFloat(inputs.price);
    const modType = inputs.modType;
    const modLevel = inputs.modLevel || "Moderate";

    if (!baselinePower || baselinePower <= 0 || !modType || !(modType in modPowerGainFactors)) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid baseline power and select a modification type.",
        feedback: "Input required"
      };
    }

    // Base gain factor for selected mod
    const baseGainFactor = modPowerGainFactors[modType];

    // Level multiplier
    const levelMultiplier = modLevelMultipliers[modLevel] || 1;

    // Calculate estimated power gain
    const powerGain = baselinePower * baseGainFactor * levelMultiplier;

    // New power after mod
    const newPower = baselinePower + powerGain;

    // Calculate cost efficiency if price is provided
    // Cost per horsepower gained
    let costPerHp = 0;
    if (price && price > 0) {
      costPerHp = price / powerGain;
    }

    // Format results
    const primary = newPower.toFixed(1) + (inputs.unit === "imperial" ? " hp" : " kW");
    const secondary = price && price > 0 ? `$${price.toFixed(2)} (Cost per hp: $${costPerHp.toFixed(2)})` : "Price not provided";
    const details = `Baseline: ${baselinePower.toFixed(1)}${inputs.unit === "imperial" ? " hp" : " kW"}, Gain: +${powerGain.toFixed(1)}${inputs.unit === "imperial" ? " hp" : " kW"} (${(baseGainFactor * 100 * levelMultiplier).toFixed(1)}%)`;

    let feedback = "Estimated power gain within typical range.";
    if (powerGain / baselinePower > 0.5) {
      feedback = "Significant power gain expected; ensure supporting mods and tuning.";
    } else if (powerGain / baselinePower < 0.03) {
      feedback = "Minimal power gain expected; consider more extensive modifications.";
    }

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
      question: "How accurate are the power gain estimates from this calculator?",
      answer:
        "The power gain estimates provided by this calculator are based on typical average gains reported for common automotive modifications. Actual gains can vary significantly depending on the vehicle make, model, engine condition, and quality of installation. This tool should be used as a general guide rather than an exact prediction. For precise tuning and performance results, professional dyno testing is recommended."
    },
    {
      question: "Can I combine multiple modifications and estimate total power gains?",
      answer:
        "This calculator estimates power gains for individual modifications only. Combining multiple mods can lead to additive or sometimes multiplicative effects, but also potential diminishing returns or conflicts. For combined mods, it’s best to consult a performance specialist or use a dyno to measure actual gains. Always consider supporting upgrades to maintain reliability."
    },
    {
      question: "Why does the calculator ask for modification level?",
      answer:
        "Modification level (e.g., mild, moderate, aggressive) reflects the extent or quality of the upgrade. For example, a mild ECU tune might offer smaller gains than an aggressive race tune. This input helps refine the estimated power gain by scaling the typical percentage increase accordingly, providing a more tailored estimate."
    },
    {
      question: "How does the cost input affect the results?",
      answer:
        "Entering the cost of the modification allows the calculator to estimate the cost efficiency of the power gain, expressed as dollars spent per horsepower gained. This helps users evaluate whether a modification offers good value for money. If no cost is entered, the calculator will omit this analysis."
    },
    {
      question: "Can this calculator be used for electric vehicles?",
      answer:
        "This calculator is primarily designed for internal combustion engine vehicles where power gains come from airflow, fuel, and tuning modifications. Electric vehicles have different performance characteristics and upgrade paths, so this tool may not provide meaningful estimates for EV power gains."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "A car owner has a 2015 Subaru WRX with a baseline engine power of 268 hp. They want to install a Performance ECU Tune at a moderate level, costing $800. They want to estimate the expected power gain and cost efficiency.",
    steps: [
      {
        label: "Step 1: Identify baseline power",
        explanation: "Baseline power is 268 hp as per manufacturer specs."
      },
      {
        label: "Step 2: Select modification and level",
        explanation:
          "Modification chosen is Performance ECU Tune with a moderate level, which corresponds to a 15% base gain factor and a 1.0 multiplier."
      },
      {
        label: "Step 3: Calculate power gain",
        explanation:
          "Power gain = 268 hp × 0.15 × 1.0 = 40.2 hp."
      },
      {
        label: "Step 4: Calculate new power",
        explanation:
          "New power = 268 hp + 40.2 hp = 308.2 hp."
      },
      {
        label: "Step 5: Calculate cost efficiency",
        explanation:
          "Cost per horsepower gained = $800 / 40.2 hp ≈ $19.90 per hp."
      }
    ],
    result: "Final Result: Estimated power after modification is 308.2 hp, costing $800 with approximately $19.90 spent per horsepower gained."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and vehicle performance data."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, buying advice, and automotive insights."
    },
    {
      title: "Dynojet Research",
      description: "Industry leader in dynamometer testing and performance measurement."
    },
    {
      title: "Car and Driver - Performance Mods",
      description: "Expert articles on automotive modifications and expected gains."
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
            <SelectItem value="imperial">Imperial (hp)</SelectItem>
            <SelectItem value="metric">Metric (kW)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Baseline Engine Power ({inputs.unit === "imperial" ? "hp" : "kW"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 250" : "e.g. 186"}
            value={inputs.baselinePower}
            onChange={(e) => handleInputChange("baselinePower", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Modification Type</Label>
          <Select
            value={inputs.modType}
            onValueChange={(v) => handleInputChange("modType", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select modification" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(modPowerGainFactors).map((mod) => (
                <SelectItem key={mod} value={mod}>
                  {mod}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Modification Level</Label>
          <Select
            value={inputs.modLevel}
            onValueChange={(v) => handleInputChange("modLevel", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(modLevelMultipliers).map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Modification Cost (USD, optional)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 800"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
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
            <strong>Step 1:</strong> Enter your vehicle's baseline engine power in horsepower (hp) or kilowatts (kW), depending on your preferred unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Select the type of modification you plan to install from the dropdown list, such as a cold air intake or ECU tune.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the modification level (mild, moderate, or aggressive) to reflect the extent of the upgrade.
          </li>
          <li>
            <strong>Step 4:</strong> Optionally, enter the cost of the modification in US dollars to evaluate cost efficiency.
          </li>
          <li>
            <strong>Step 5:</strong> Click the Calculate button to see the estimated new engine power, power gain, and cost per horsepower gained if cost was provided.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Power Gains from Modifications Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the potential power gains from automotive modifications is essential for enthusiasts and professionals aiming to enhance vehicle performance. This calculator provides a practical estimate of horsepower or kilowatt increases based on common modifications and their typical impact on engine output. It factors in the baseline engine power and adjusts the expected gain according to the modification type and its level of aggressiveness.
          </p>
          <p>
            Modifications such as cold air intakes and cat-back exhausts generally offer modest gains, typically in the range of 5-10%. More substantial upgrades like turbochargers or superchargers can boost power by 30-40% or more, but often require supporting modifications and tuning to ensure reliability and drivability. The modification level input allows users to specify whether the upgrade is mild, moderate, or aggressive, scaling the expected gains accordingly.
          </p>
          <p>
            Additionally, by entering the cost of the modification, users can assess the cost-effectiveness of their investment, expressed as dollars spent per horsepower gained. This insight helps prioritize upgrades that offer the best value. While this tool provides useful estimates, actual results can vary widely based on vehicle specifics, installation quality, and tuning. For precise measurement, professional dynamometer testing is recommended.
          </p>
          <p>
            Always consider the overall vehicle system when planning modifications. Power gains should be balanced with upgrades to the drivetrain, suspension, brakes, and cooling systems to maintain safety and performance. This calculator is a valuable starting point for planning your automotive upgrade journey.
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
            <strong>1. Overestimating Gains:</strong> Users often expect maximum advertised gains without considering vehicle-specific factors or installation quality. This calculator provides average estimates; real-world results may be lower.
          </p>
          <p>
            <strong>2. Ignoring Supporting Mods:</strong> Significant power increases require upgrades to fuel delivery, cooling, and drivetrain components. Neglecting these can lead to reliability issues.
          </p>
          <p>
            <strong>3. Combining Gains Incorrectly:</strong> Simply adding percentage gains from multiple mods can overstate total power increase. Gains often have diminishing returns or require tuning synergy.
          </p>
          <p>
            <strong>4. Not Accounting for Tuning:</strong> Many modifications require professional ECU tuning to realize full potential. Without tuning, gains may be minimal or nonexistent.
          </p>
          <p>
            <strong>5. Using Incorrect Units:</strong> Ensure baseline power is entered in the correct unit (hp or kW) matching your selection to avoid calculation errors.
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

  const example = {
    title: "Real World Example",
    scenario:
      "A car owner has a 2015 Subaru WRX with a baseline engine power of 268 hp. They want to install a Performance ECU Tune at a moderate level, costing $800. They want to estimate the expected power gain and cost efficiency.",
    steps: [
      {
        label: "Step 1: Identify baseline power",
        explanation: "Baseline power is 268 hp as per manufacturer specs."
      },
      {
        label: "Step 2: Select modification and level",
        explanation:
          "Modification chosen is Performance ECU Tune with a moderate level, which corresponds to a 15% base gain factor and a 1.0 multiplier."
      },
      {
        label: "Step 3: Calculate power gain",
        explanation: "Power gain = 268 hp × 0.15 × 1.0 = 40.2 hp."
      },
      {
        label: "Step 4: Calculate new power",
        explanation: "New power = 268 hp + 40.2 hp = 308.2 hp."
      },
      {
        label: "Step 5: Calculate cost efficiency",
        explanation: "Cost per horsepower gained = $800 / 40.2 hp ≈ $19.90 per hp."
      }
    ],
    result:
      "Final Result: Estimated power after modification is 308.2 hp, costing $800 with approximately $19.90 spent per horsepower gained."
  };

  return (
    <CalculatorVerticalLayout
      title="Power Gains from Modifications Estimator"
      description="Professional automotive calculator: Power Gains from Modifications Estimator. Get accurate estimates, expert advice, and financial insights."
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