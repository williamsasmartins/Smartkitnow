import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalDailyCalorieNeedsCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: species, weight (lbs or kg)
  const [inputs, setInputs] = useState({
    species: "",
    weight: "",
  });

  // Species-specific multipliers for Maintenance Energy Requirement (MER)
  // MER (kcal/day) = RER * factor
  // RER = 70 * (weight_kg)^0.75
  // Factors based on species and life stage/activity (simplified here)
  const speciesFactors: Record<
    string,
    { label: string; factor: number }
  > = {
    rabbit: { label: "Rabbit (adult maintenance)", factor: 2.5 },
    guinea_pig: { label: "Guinea Pig (adult maintenance)", factor: 2.0 },
    hamster: { label: "Hamster (adult maintenance)", factor: 3.0 },
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (
      !inputs.species ||
      !weightNum ||
      isNaN(weightNum) ||
      weightNum <= 0 ||
      !speciesFactors[inputs.species]
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate RER (Resting Energy Requirement)
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Get species factor
    const factor = speciesFactors[inputs.species].factor;

    // Calculate MER (Maintenance Energy Requirement)
    const MER = RER * factor;

    // Format result to nearest kcal
    const MERrounded = Math.round(MER);

    return {
      value: MERrounded,
      label: "Daily Calorie Needs (kcal/day)",
      subtext: `Based on species: ${speciesFactors[inputs.species].label} and weight: ${weightNum} ${
        unit === "imperial" ? "lbs" : "kg"
      }`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate daily calorie needs specific to species?",
      answer:
        "Different small mammal species have unique metabolic rates and nutritional requirements, which influence their daily calorie needs. Calculating species-specific calorie requirements ensures that dietary plans meet their energy demands without causing obesity or malnutrition. This tailored approach supports optimal health, longevity, and disease prevention in these animals.",
    },
    {
      question: "How does body weight influence the daily calorie requirements in small mammals?",
      answer:
        "Body weight directly affects the resting energy requirement (RER), which is the baseline energy needed for vital functions. Since metabolic rate scales to body weight raised to the 0.75 power, heavier animals require more calories, but not in a linear fashion. Accurate weight measurement is essential to avoid underfeeding or overfeeding, both of which can lead to health complications.",
    },
    {
      question: "Can activity level or life stage change the calorie needs for these species?",
      answer:
        "Yes, factors such as growth, reproduction, lactation, and activity level significantly increase energy demands beyond maintenance needs. For example, pregnant or lactating rabbits require more calories to support fetal development and milk production. This calculator provides a baseline maintenance estimate, but adjustments should be made based on individual life stages and activity.",
    },
    {
      question: "Why do we use the formula RER = 70 * (weight_kg)^0.75 in veterinary nutrition?",
      answer:
        "The formula for Resting Energy Requirement (RER) is widely accepted in veterinary medicine because it accurately reflects the metabolic rate across different species and sizes. The exponent 0.75 accounts for the non-linear relationship between body mass and metabolism, providing a scientifically validated method to estimate baseline energy needs. This foundational calculation allows for precise dietary planning tailored to each animal.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Species Selector */}
      <div className="space-y-2">
        <Label htmlFor="species" className="text-slate-700 dark:text-slate-300">
          Select Species
        </Label>
        <Select
          value={inputs.species}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, species: value }))}
        >
          <SelectTrigger id="species">
            <SelectValue placeholder="Choose species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rabbit">Rabbit</SelectItem>
            <SelectItem value="guinea_pig">Guinea Pig</SelectItem>
            <SelectItem value="hamster">Hamster</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ species: "", weight: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Daily Calorie Needs (Species Specific)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Daily calorie needs vary significantly among small mammal species due to differences in metabolism, physiology, and activity levels. Unlike generic calorie calculators, species-specific calculations take into account these unique factors to provide accurate energy requirements. This ensures that dietary plans support healthy body weight, optimal organ function, and overall well-being tailored to each species’ biology.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The foundational calculation used is the Resting Energy Requirement (RER), which estimates the baseline energy needed for vital physiological functions at rest. This is then adjusted by a species-specific factor to account for maintenance energy requirements (MER), reflecting typical daily activity and metabolic demands. For example, rabbits have a different MER multiplier compared to guinea pigs or hamsters, reflecting their distinct energy expenditures.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these differences is crucial for preventing common nutritional issues such as obesity, malnutrition, or metabolic disorders. Providing the correct calorie intake supports healthy growth, reproduction, and longevity. This calculator empowers veterinarians and pet owners to make informed dietary decisions based on scientific principles and species-specific data.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the daily calorie needs for small mammals such as rabbits, guinea pigs, and hamsters based on their species and body weight. Begin by selecting the species from the dropdown menu, then enter the animal’s weight in the chosen unit system (imperial or metric). The calculator will compute the estimated daily calorie requirement using validated veterinary formulas.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the species of your small mammal (rabbit, guinea pig, or hamster) to apply the correct metabolic factor.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the animal’s weight in pounds or kilograms, depending on your preferred unit system.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to view the estimated daily calorie needs expressed in kilocalories per day.
          </li>
          <li>
            <strong>Step 4:</strong> Use this estimate as a baseline for feeding plans, adjusting as needed for life stage, activity, or health status in consultation with a veterinarian.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-small-mammals/energy-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Energy Requirements of Small Mammals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of energy metabolism and nutritional needs in small mammal species, including rabbits, guinea pigs, and hamsters.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149867/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Center for Biotechnology Information (NCBI): Nutritional Requirements of Small Mammals
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article detailing metabolic rates and dietary energy needs specific to common small mammal pets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aavmc.org/assets/1/6/Small_Mammal_Nutrition.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Veterinary Medical Colleges (AAVMC): Small Mammal Nutrition Guide
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource for veterinary professionals on calculating and managing energy requirements in small mammal patients.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Calorie Needs (Species Specific)"
      description="Calculate the specific daily calorie and energy requirements for species like rabbits, guinea pigs, and hamsters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Calorie Needs (kcal/day) = 70 × (Weight_kg)^0.75 × Species Factor",
        variables: [
          { symbol: "Weight_kg", description: "Body weight in kilograms" },
          { symbol: "Species Factor", description: "Species-specific metabolic multiplier" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4.4 lb (2 kg) adult rabbit requires an estimate of daily calorie needs for maintenance.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (4.4 lb = 2 kg). Calculate RER = 70 × (2)^0.75 ≈ 124 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Apply species factor for rabbit (2.5): MER = 124 × 2.5 = 310 kcal/day.",
          },
        ],
        result: "The estimated daily calorie need for this rabbit is approximately 310 kcal/day.",
      }}
      relatedCalculators={[
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
        {
          title: "Phosphorus per Meal Estimator (diet label helper)",
          url: "/pets/cat-phosphorus-per-meal-estimator",
          icon: "🐱",
        },
        {
          title: "Xylitol Exposure Risk for Cats (rare but educational)",
          url: "/pets/cat-xylitol-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Gabapentin Dose Calculator for Cats",
          url: "/pets/cat-gabapentin-dose",
          icon: "🐱",
        },
        {
          title: "Dog Age in Human Years (Breed-Aware)",
          url: "/pets/dog-age-human-years-breed-aware",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Daily Calorie Needs (Species Specific)" },
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
