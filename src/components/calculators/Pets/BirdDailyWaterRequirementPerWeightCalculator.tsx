import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function BirdDailyWaterRequirementPerWeightCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Formula source: Birds typically require 50-100 ml water per kg body weight daily.
  // We'll use a common veterinary estimate: Daily Water Requirement (ml) = 80 ml × weight (kg)
  // Convert weight input to kg internally if imperial.
  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw || isNaN(Number(weightRaw)) || Number(weightRaw) <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightNum = parseFloat(weightRaw);
    const weightKg = weightToKg(weightNum, unit);

    // Veterinary standard: 80 ml water per kg body weight per day
    const waterMl = 80 * weightKg;

    // Convert result back to preferred unit for display
    // We'll show ml and also oz if imperial
    let displayValue = "";
    let label = "";
    if (unit === "lb") {
      // 1 ml = 0.033814 oz
      const waterOz = waterMl * 0.033814;
      displayValue = `${waterMl.toFixed(0)} ml (${waterOz.toFixed(2)} fl oz)`;
      label = "Daily Water Requirement";
    } else {
      displayValue = `${waterMl.toFixed(0)} ml`;
      label = "Daily Water Requirement";
    }

    // Warning if weight is very low or very high (common bird weights)
    let warning = null;
    if (weightKg < 0.05) {
      warning =
        "Entered weight is very low; ensure this is correct as it may affect accuracy.";
    } else if (weightKg > 10) {
      warning =
        "Entered weight is high for most pet birds; consult a veterinarian for tailored advice.";
    }

    return {
      value: displayValue,
      label,
      subtext: `Based on a standard of 80 ml water per kg body weight daily.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is water intake important for birds?",
      answer:
        "Water is essential for birds to maintain hydration, regulate body temperature, and support metabolic processes. Insufficient water intake can lead to dehydration, which may cause serious health issues including organ failure. Understanding daily water requirements helps owners provide adequate hydration to ensure their bird's well-being and longevity.",
    },
    {
      question: "How does body weight affect a bird's water needs?",
      answer:
        "A bird's water requirement is directly proportional to its body weight because larger birds have higher metabolic demands and lose more water through respiration and excretion. Calculating water needs per kilogram allows for precise hydration management tailored to individual birds. This ensures neither under- nor over-hydration, both of which can negatively impact health.",
    },
    {
      question: "Can environmental factors influence daily water requirements?",
      answer:
        "Yes, environmental conditions such as temperature, humidity, and activity level significantly impact a bird's water needs. Hot or dry climates increase water loss through respiration and evaporation, requiring higher intake. Similarly, active or breeding birds may need more water to compensate for increased metabolic activity and physiological demands.",
    },
    {
      question: "How accurate is this calculator for all bird species?",
      answer:
        "This calculator provides a general estimate based on average water requirements per kilogram of body weight, suitable for many common pet bird species. However, individual species, health status, diet, and environment can alter water needs. For precise hydration plans, especially for exotic or ill birds, consulting a veterinarian is recommended.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Bird Weight ({unit})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "lb" : "kg"}`}
          value={inputs.weight}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, weight: e.target.value }))
          }
          aria-describedby="weight-desc"
        />
        <p
          id="weight-desc"
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          Enter the bird's body weight to calculate daily water needs.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed; calculation is reactive
          }}
          aria-label="Calculate daily water requirement"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              veterinarian for diagnosis and personalized advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Daily Water Requirement per Weight
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Water is a fundamental nutrient for all living organisms, and birds are no exception. Their daily water requirement is closely tied to their body weight because water supports vital physiological functions such as thermoregulation, digestion, and cellular metabolism. Unlike mammals, birds have a higher metabolic rate and respiratory water loss, making adequate hydration critical to their health and survival.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating water needs based on body weight allows for a tailored approach that considers the unique metabolic demands of each bird. Veterinary science commonly estimates that birds require approximately 80 milliliters of water per kilogram of body weight daily, though this can vary with species, age, and environmental conditions. This calculation helps owners and veterinarians ensure birds receive sufficient hydration to maintain optimal physiological balance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these requirements is especially important for pet bird owners, breeders, and avian veterinarians to prevent dehydration-related complications. Providing the right amount of water supports immune function, promotes healthy skin and feathers, and aids in the elimination of metabolic waste. This component aims to empower users with an evidence-based tool to estimate daily water needs accurately.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the daily water requirement for a bird based on its body weight. Begin by selecting the unit system you prefer—Imperial (pounds) or Metric (kilograms). Next, enter the bird’s current weight in the chosen unit. The calculator will then compute the estimated volume of water your bird needs daily, presented in milliliters and fluid ounces for convenience.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that matches how you measure your bird’s weight.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird’s weight accurately in the input field. Use a precise scale if possible.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to view the estimated daily water requirement. Review the result and any warnings provided.
          </li>
          <li>
            <strong>Step 4:</strong> Use this information to ensure your bird’s water supply meets or exceeds this volume daily, adjusting for environmental or health factors as needed.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/nutrition-of-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Nutrition of Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of avian nutrition requirements including water intake guidelines.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Institutes of Health: Water Requirements in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Scientific study detailing water metabolism and hydration needs in various bird species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/avian-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians: Avian Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Professional guidelines for avian dietary and hydration management from veterinary experts.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Water Requirement per Weight"
      description="Calculate the minimum daily water volume needed for a bird based on its weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Water Requirement (ml) = 80 × Weight (kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Bird's body weight in kilograms" },
          { symbol: "Daily Water Requirement (ml)", description: "Estimated daily water volume in milliliters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A pet parakeet weighs 0.1 kg (100 grams). The owner wants to know how much water to provide daily.",
        steps: [
          {
            label: "1",
            explanation:
              "Multiply the bird's weight by 80 ml/kg: 0.1 kg × 80 ml = 8 ml daily water requirement.",
          },
        ],
        result: "The parakeet needs approximately 8 ml of water daily to stay properly hydrated.",
      }}
      relatedCalculators={[
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
        {
          title: "Kitten Adult Weight Predictor",
          url: "/pets/kitten-adult-weight-predictor",
          icon: "🐶",
        },
        {
          title: "Stress Score & Playtime Offset Planner (owner input)",
          url: "/pets/cat-stress-score-playtime-offset-planner",
          icon: "🐱",
        },
        {
          title: "Ammonia-to-Nitrite Cycle Time Estimator",
          url: "/pets/aquarium-ammonia-nitrite-cycle-time",
          icon: "🍖",
        },
        {
          title: "Weight Trend Tracker (Weekly Log)",
          url: "/pets/bird-weight-trend-tracker-weekly",
          icon: "💉",
        },
        {
          title: "Horse Hay Intake Calculator (per body weight %)",
          url: "/pets/horse-hay-intake-bodyweight-percent",
          icon: "🐎",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Daily Water Requirement per Weight" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
