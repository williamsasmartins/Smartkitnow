import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdVitaminARequirementCalculator() {
  // 1. STATE
  // Unit system needed for weight input (lbs or kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (bird body weight)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Vitamin A requirement for birds is often calculated based on body weight.
  // Typical recommended daily intake: 1500 IU/kg body weight for seed-eating birds.
  // Convert weight to kg if imperial.
  // Result in IU/day.
  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw || isNaN(Number(weightRaw)) || Number(weightRaw) <= 0) {
      return {
        value: 0,
        label: "Vitamin A Requirement (IU/day)",
        subtext: "Please enter a valid positive weight.",
        warning: null,
      };
    }
    const weightNum = parseFloat(weightRaw);
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Veterinary recommended daily Vitamin A intake for seed-eating birds:
    // 1500 IU per kg body weight (based on avian nutrition literature)
    const vitaminARequirement = Math.round(weightKg * 1500);

    let warning = null;
    if (vitaminARequirement < 100) {
      warning =
        "Calculated Vitamin A requirement is very low. Ensure weight input is correct and bird species matches typical seed-eating birds.";
    }

    return {
      value: vitaminARequirement.toLocaleString(),
      label: "Vitamin A Requirement (IU/day)",
      subtext: `Based on ${weightKg.toFixed(2)} kg body weight`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is Vitamin A important for birds?",
      answer:
        "Vitamin A plays a crucial role in maintaining healthy skin, feathers, and mucous membranes in birds. It supports immune function, vision, and respiratory health, which are vital for their survival and well-being. Deficiency can lead to severe health issues such as respiratory infections and poor feather quality, making adequate intake essential.",
    },
    {
      question: "How is the Vitamin A requirement calculated for birds?",
      answer:
        "The requirement is typically based on the bird's body weight, as metabolic needs scale with size. For seed-eating birds, a standard recommendation is approximately 1500 IU of Vitamin A per kilogram of body weight daily. This calculation helps ensure birds receive sufficient Vitamin A to prevent deficiency without risking toxicity.",
    },
    {
      question: "Can I use this calculator for all bird species?",
      answer:
        "This calculator is designed primarily for seed-eating birds, which commonly suffer from Vitamin A deficiency. Different bird species have varying nutritional needs, so the results may not be accurate for insectivorous or nectarivorous birds. Always consult a veterinarian or avian nutritionist for species-specific recommendations.",
    },
    {
      question: "What are signs of Vitamin A deficiency in birds?",
      answer:
        "Signs include poor feather condition, swollen eyes, respiratory distress, and frequent infections. Birds may also exhibit lethargy and reduced appetite. Early detection and correction of deficiency through diet or supplementation are critical to prevent long-term health problems.",
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
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Weight input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Bird Body Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          className="max-w-xs"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Vitamin A Requirement Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Vitamin A is an essential nutrient for birds, playing a vital role in maintaining healthy skin, feathers, vision, and immune function. Deficiency in Vitamin A is common among seed-fed birds due to their diet lacking sufficient carotenoids and retinoids, which are precursors to Vitamin A. This calculator estimates the daily Vitamin A requirement based on the bird's body weight, helping caretakers ensure adequate supplementation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation uses a standard veterinary recommendation of 1500 International Units (IU) of Vitamin A per kilogram of body weight per day, which is widely accepted for seed-eating avian species. This approach allows for a practical and straightforward estimation that can be used to guide dietary planning and supplementation. It is important to note that requirements may vary slightly depending on species, age, and health status.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By providing a reliable estimate of Vitamin A needs, this tool supports avian health management and helps prevent the adverse effects of deficiency, such as respiratory infections, poor feather quality, and immune suppression. However, it should be used as a guide alongside professional veterinary advice, especially for birds with special dietary needs or medical conditions.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide quick, accurate estimates of Vitamin A requirements for seed-eating birds. Begin by selecting the unit system that corresponds to your measurement preference, either Imperial (pounds) or Metric (kilograms). Then, enter the bird's body weight in the chosen unit.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Input the bird's body weight accurately in the provided field.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to generate the estimated daily Vitamin A requirement in International Units (IU).
          </li>
          <li>
            <strong>Step 4:</strong> Review the result and any warnings to ensure the input data is correct and appropriate for your bird.
          </li>
          <li>
            <strong>Step 5:</strong> Use this information to guide dietary supplementation, and consult a veterinarian for personalized advice.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Klasing, K.C. (1998). Nutritional modulation of resistance to infectious diseases. Poultry Science.
            </a>
            <p className="text-slate-500 text-sm">
              This article discusses the importance of vitamins, including Vitamin A, in avian immune function and disease resistance.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/vitamins/vitamin-a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Vitamin A
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of Vitamin A metabolism, requirements, and deficiency symptoms in animals, including birds.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avianweb.com/vitamins.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. AvianWeb - Vitamins and Minerals for Birds
            </a>
            <p className="text-slate-500 text-sm">
              Practical guide on vitamin supplementation in pet birds, emphasizing the importance of Vitamin A for seed-eating species.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Vitamin A Requirement Calculator"
      description="Calculate the required daily intake of Vitamin A, deficiency of which is common in seed-fed birds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Vitamin A Requirement (IU/day) = Body Weight (kg) × 1500",
        variables: [
          { symbol: "Body Weight (kg)", description: "Bird's body weight in kilograms" },
          { symbol: "1500", description: "Recommended IU of Vitamin A per kg body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A pet parakeet weighs 0.1 kg (100 grams). The owner wants to know the daily Vitamin A requirement to prevent deficiency.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the bird's weight to kilograms if needed (already in kg here). Multiply by 1500 IU/kg to find the requirement.",
          },
          {
            label: "2",
            explanation: "0.1 kg × 1500 IU/kg = 150 IU of Vitamin A per day.",
          },
        ],
        result: "The parakeet requires approximately 150 IU of Vitamin A daily to maintain optimal health.",
      }}
      relatedCalculators={[
        { title: "Dewormer & Antibiotic Dose Reference", url: "/pets/reptile-dewormer-antibiotic-dose-reference", icon: "🐾" },
        { title: "Horse Protein & Lysine Requirement Calculator", url: "/pets/horse-protein-lysine-requirement", icon: "🐎" },
        { title: "Omega-3 Supplement Dose (for parrots)", url: "/pets/bird-omega-3-supplement-dose-parrots", icon: "🐱" },
        { title: "Horse Water Intake by Temperature & Weight", url: "/pets/horse-water-intake-temperature-weight", icon: "🐎" },
        { title: "Horse Hay Intake Calculator (per body weight %)", url: "/pets/horse-hay-intake-bodyweight-percent", icon: "🐎" },
        { title: "Daily Feeding Ratio (by Species & Age)", url: "/pets/reptile-daily-feeding-ratio-species-age", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Vitamin A Requirement Calculator" },
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