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
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (bird body weight)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Vitamin A requirement for birds is typically expressed as IU per kg body weight.
  // For seed-fed birds, recommended daily intake is about 4000 IU/kg BW.
  // Formula: Vitamin A Requirement (IU) = 4000 × Body Weight (kg)
  // Convert weight input to kg if imperial.
  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw || isNaN(Number(weightRaw)) || Number(weightRaw) <= 0) {
      return {
        value: 0,
        label: "Vitamin A Requirement (IU/day)",
        subtext: "Enter a valid positive weight",
        warning: null,
      };
    }
    const weightKg = unit === "imperial" ? Number(weightRaw) / 2.20462 : Number(weightRaw);
    const vitaminARequirement = Math.round(4000 * weightKg);

    let warning = null;
    if (weightKg < 0.05) {
      warning =
        "Weight entered is very low; ensure this is accurate for small bird species to avoid dosing errors.";
    } else if (weightKg > 10) {
      warning =
        "Weight entered is high for typical pet birds; consult a veterinarian for large or exotic species.";
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
        "Vitamin A plays a crucial role in maintaining healthy skin, mucous membranes, and immune function in birds. Deficiency can lead to respiratory infections, poor feather quality, and vision problems. Ensuring adequate intake supports overall health and disease resistance in avian species.",
    },
    {
      question: "How is the Vitamin A requirement calculated for birds?",
      answer:
        "The requirement is calculated based on the bird's body weight, typically expressed in International Units (IU) per kilogram. For seed-fed birds, a standard recommendation is 4000 IU per kg of body weight daily. This calculation helps tailor supplementation to the bird's size and nutritional needs.",
    },
    {
      question: "Can I use this calculator for all bird species?",
      answer:
        "This calculator is designed primarily for common pet seed-fed birds and may not be accurate for all species, especially exotic or large birds. Different species have varying nutritional requirements, so consulting a veterinarian for specialized diets is essential. Use this tool as a general guideline rather than a definitive prescription.",
    },
    {
      question: "What are the risks of Vitamin A overdose in birds?",
      answer:
        "Excessive Vitamin A intake can cause toxicity, leading to symptoms like bone deformities, liver damage, and neurological issues. Over-supplementation should be avoided by adhering to recommended dosages based on body weight. Always consult a veterinary professional before making significant dietary changes or adding supplements.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Bird Body Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
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
            // Trigger recalculation by updating state (already handled by useMemo)
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
          Vitamin A is an essential nutrient for birds, playing a vital role in maintaining healthy epithelial tissues,
          supporting immune function, and ensuring proper vision. Deficiencies in Vitamin A are common in seed-fed birds,
          as their natural diets often lack sufficient amounts of this nutrient. This calculator estimates the daily Vitamin
          A requirement based on the bird's body weight, helping caretakers provide appropriate supplementation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation uses a standardized dosage of 4000 International Units (IU) of Vitamin A per kilogram of body
          weight, which is widely accepted in avian veterinary nutrition. This approach allows for a tailored recommendation
          that considers the size of the bird, ensuring neither deficiency nor toxicity. Proper Vitamin A intake supports
          feather quality, respiratory health, and resistance to infections.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While this tool provides a general guideline, individual birds may have unique requirements based on species,
          health status, and diet. It is important to consult with a qualified avian veterinarian for precise nutritional
          planning, especially for exotic or large bird species. This calculator serves as an educational resource to
          promote optimal avian health through informed supplementation.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Vitamin A Requirement Calculator is straightforward and designed to provide quick, reliable estimates
          for daily Vitamin A needs in birds. Begin by selecting the unit system that corresponds to your measurement of the
          bird's weight—either imperial (pounds) or metric (kilograms). Enter the bird's body weight accurately to ensure
          the calculation reflects its true nutritional needs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) from the dropdown menu to match your
            measurement preference.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird's body weight in the input field. Ensure the value is positive and
            realistic for the species.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to generate the estimated daily Vitamin A requirement
            in International Units (IU).
          </li>
          <li>
            <strong>Step 4:</strong> Review the result and any warnings provided. Use this information to guide dietary
            supplementation, and consult a veterinarian for personalized advice.
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
              href="https://www.merckvetmanual.com/nutrition/vitamins/vitamin-a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Vitamin A
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of Vitamin A's role in animal health, deficiency symptoms, and dietary requirements.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Institutes of Health - Vitamin A and Immune Function
            </a>
            <p className="text-slate-500 text-sm">
              Research article detailing the immunological importance of Vitamin A in various species, including birds.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/avian-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians - Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidelines for avian nutrition, including vitamin supplementation and dietary management.
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
        formula: "Vitamin A Requirement (IU) = 4000 × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Bird's body weight in kilograms" },
          { symbol: "Vitamin A Requirement (IU)", description: "Daily Vitamin A needed in International Units" },
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
              "Convert the bird's weight to kilograms if necessary (already in kg here). Then multiply by 4000 IU/kg.",
          },
          {
            label: "2",
            explanation: "0.1 kg × 4000 IU/kg = 400 IU daily Vitamin A requirement.",
          },
        ],
        result: "The parakeet requires approximately 400 IU of Vitamin A daily to maintain optimal health.",
      }}
      relatedCalculators={[
        { title: "Calcium-to-Phosphorus Ratio Calculator", url: "/pets/reptile-calcium-to-phosphorus-ratio", icon: "🐾" },
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Dog Pregnancy (Gestation) Due-Date Calculator", url: "/pets/dog-pregnancy-gestation-due-date", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
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