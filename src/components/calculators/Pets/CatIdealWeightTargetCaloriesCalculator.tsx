import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatIdealWeightTargetCaloriesCalculator() {
  // 1. STATE
  // Weight is involved in formulas, so keep unit switcher
  const [unit, setUnit] = useState("metric"); // default metric (kg)

  // Inputs: current weight only, since ideal weight is often estimated by body condition score or breed,
  // but here we provide a calculator for target calories based on current weight.
  // For ideal weight, we can provide a range based on typical healthy weight percentages.
  const [inputs, setInputs] = useState({
    weight: "", // cat's current weight
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = inputs.weight.trim();
    if (!weightRaw) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Parse weight input
    let weight = parseFloat(weightRaw);
    if (isNaN(weight) || weight <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive weight.",
      };
    }

    // Convert weight to kg if imperial
    if (unit === "imperial") {
      weight = weight * 0.453592; // lbs to kg
    }

    // Ideal Weight Range:
    // Since ideal weight varies by breed and body condition,
    // a common veterinary approach is to estimate ideal weight as current weight adjusted by body condition score.
    // Without BCS input, we can provide a general healthy weight range:
    // For adult cats, ideal weight range is roughly 3.5 to 5.5 kg (7.7 to 12.1 lbs).
    // But since user inputs current weight, we can show +/- 10-15% range as target ideal weight range.
    // Here, we provide a ±15% range around current weight as an estimate.

    const idealWeightMin = +(weight * 0.85).toFixed(2);
    const idealWeightMax = +(weight * 1.15).toFixed(2);

    // Calculate Resting Energy Requirement (RER):
    // RER = 70 * (weight in kg) ^ 0.75
    const RER = 70 * Math.pow(weight, 0.75);

    // Maintenance Energy Requirement (MER) for adult cats:
    // MER = RER * 1.2 to 1.4 (depending on activity, neuter status)
    // We'll use 1.3 as an average multiplier.
    const MER = RER * 1.3;

    // Format output values:
    // Display ideal weight range in selected units
    let idealMinDisplay = idealWeightMin;
    let idealMaxDisplay = idealWeightMax;
    let weightUnitLabel = "kg";
    const caloriesDisplay = Math.round(MER);

    if (unit === "imperial") {
      idealMinDisplay = +(idealWeightMin / 0.453592).toFixed(2);
      idealMaxDisplay = +(idealWeightMax / 0.453592).toFixed(2);
      weightUnitLabel = "lbs";
    }

    return {
      value: caloriesDisplay.toLocaleString(),
      label: `Target Daily Calories (kcal)`,
      subtext: `Estimated ideal weight range: ${idealMinDisplay} - ${idealMaxDisplay} ${weightUnitLabel}`,
      warning: null,
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "How is the ideal weight range for cats determined?",
      answer:
        "The ideal weight range for cats is generally estimated based on their current weight adjusted by a percentage to account for healthy body condition. Since breed and body condition score (BCS) vary, this calculator provides a ±15% range around the current weight as a practical estimate of ideal weight. For precise assessment, a veterinarian's evaluation is recommended.",
    },
    {
      question: "What is the Resting Energy Requirement (RER) and why is it important?",
      answer:
        "Resting Energy Requirement (RER) represents the energy a cat needs at rest to maintain vital bodily functions. It is calculated using the cat's weight raised to the 0.75 power, multiplied by 70. RER serves as the foundation for determining daily calorie needs, which are then adjusted for activity and other factors to estimate maintenance energy requirements.",
    },
    {
      question: "Why does the calculator use a multiplier of 1.3 for maintenance calories?",
      answer:
        "The multiplier of 1.3 applied to RER estimates the Maintenance Energy Requirement (MER), reflecting the average daily energy needs of an adult cat considering typical activity levels and neuter status. This value can vary between 1.2 and 1.4 depending on individual factors, but 1.3 is a widely accepted average for healthy adult cats.",
    },
    {
      question: "Can this calculator replace veterinary advice for my cat's diet?",
      answer:
        "No, this calculator is an educational tool designed to provide general estimates of ideal weight and calorie needs. Individual cats may have unique health conditions, activity levels, or dietary requirements. Always consult a qualified veterinarian for personalized nutrition and health advice tailored to your cat.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
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

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Current Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight || ""}
            onChange={onInputChange}
            aria-describedby="weight-desc"
            className="mt-1"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Please enter your cat's current weight to estimate ideal weight range and daily calorie needs.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Ideal Weight & Target Calories for Cats
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining an ideal weight is crucial for a cat’s overall health and longevity. Unlike humans, cats do not have a standardized body mass index (BMI), so veterinarians rely on body condition scores and weight ranges tailored to breed, age, and activity level. This calculator estimates your cat’s ideal weight range by adjusting their current weight by a healthy margin, providing a practical guideline for maintaining optimal body condition.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Caloric needs for cats are calculated based on their Resting Energy Requirement (RER), which accounts for the energy required to maintain vital bodily functions at rest. This value is then multiplied by a factor reflecting activity level and neuter status to estimate the Maintenance Energy Requirement (MER), or the daily calories needed to maintain weight. Proper calorie management helps prevent obesity and related health issues such as diabetes and arthritis.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool provides an evidence-based estimate of your cat’s daily calorie needs and ideal weight range, helping you make informed decisions about feeding and nutrition. However, individual variations exist, and it is always best to consult with a veterinarian for personalized advice tailored to your cat’s unique health status.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, simply enter your cat’s current weight and select the appropriate unit system (metric or imperial). The calculator will then estimate an ideal weight range based on a healthy margin around the current weight and calculate the daily calorie intake needed to maintain your cat’s weight.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s current weight in kilograms or pounds.
          </li>
          <li>
            <strong>Step 2:</strong> Click the "Calculate" button to view the estimated ideal weight range and target daily calories.
          </li>
          <li>
            <strong>Step 3:</strong> Use the results as a guideline for feeding and consult your veterinarian for personalized nutrition plans.
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
              href="https://www.merckvetmanual.com/nutrition/feeding-and-nutrition-of-cats/energy-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Energy Requirements of Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of energy requirements and nutritional needs for cats, including RER and MER calculations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines-for-healthy-adult-dogs-and-cats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Animal Hospital Association (AAHA) Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based guidelines for feeding and maintaining ideal body condition in cats and dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149329/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information (NCBI): Feline Nutrition and Energy Metabolism
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article discussing feline energy metabolism and nutritional requirements.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ideal Weight & Target Calories for Cats"
      description="Determine your cat's optimal weight and the necessary daily calorie intake for maintenance."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: (
          <>
            <p>
              <strong>Resting Energy Requirement (RER):</strong> <br />
              RER = 70 × (Weight in kg)<sup>0.75</sup>
            </p>
            <p className="mt-2">
              <strong>Maintenance Energy Requirement (MER):</strong> <br />
              MER = RER × Activity Factor (typically 1.3 for adult cats)
            </p>
            <p className="mt-2">
              <strong>Ideal Weight Range:</strong> <br />
              Current Weight × 0.85 to Current Weight × 1.15
            </p>
          </>
        ),
        variables: [
          { symbol: "Weight", description: "Current weight of the cat in kilograms" },
          { symbol: "RER", description: "Resting Energy Requirement in kcal/day" },
          { symbol: "MER", description: "Maintenance Energy Requirement in kcal/day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4.5 kg adult cat is brought in for nutritional assessment. The owner wants to know the ideal weight range and daily calorie needs for maintenance.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate RER: 70 × (4.5)^0.75 ≈ 197 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Calculate MER: 197 × 1.3 ≈ 256 kcal/day needed to maintain weight.",
          },
          {
            label: "3",
            explanation:
              "Estimate ideal weight range: 4.5 × 0.85 = 3.83 kg to 4.5 × 1.15 = 5.18 kg.",
          },
        ],
        result:
          "The cat's ideal weight range is approximately 3.8 to 5.2 kg, with a target daily calorie intake of about 256 kcal to maintain weight.",
      }}
      relatedCalculators={[
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🐾" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
        { title: "Kitten Adult Weight Predictor", url: "/pets/kitten-adult-weight-predictor", icon: "🐱" },
        { title: "Gabapentin Dose Calculator for Cats", url: "/pets/cat-gabapentin-dose", icon: "🐱" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Ideal Weight & Target Calories for Cats" },
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