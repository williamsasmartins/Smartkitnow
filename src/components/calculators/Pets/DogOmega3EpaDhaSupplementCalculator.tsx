import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogOmega3EpaDhaSupplementCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Veterinary recommended EPA/DHA dose for dogs varies by condition:
  // For general skin and coat health: 30-55 mg EPA+DHA per kg body weight daily (often 30 mg/kg)
  // For anti-inflammatory/joint support: up to 100 mg/kg daily
  // Here, we provide a default moderate dose of 50 mg/kg for general supplementation.
  // User can adjust dose if needed in future versions.

  const EPA_DHA_DOSAGE_MG_PER_KG = 50; // mg per kg body weight daily

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0)
      return { value: 0, label: "Enter valid dog weight to calculate dosage." };

    // Convert weight to kg if input is imperial (lbs)
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate daily EPA/DHA dose in mg
    const doseMg = weightKg * EPA_DHA_DOSAGE_MG_PER_KG;

    // Round to nearest whole number for clarity
    const doseRounded = Math.round(doseMg);

    // Warning if weight is extremely low or high (outside typical dog weights)
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Weight is very low; consult your veterinarian for precise dosing for puppies or very small dogs.";
    } else if (weightKg > 90) {
      warning =
        "Weight is very high; large breed dosing may require veterinary supervision.";
    }

    return {
      value: doseRounded.toLocaleString(),
      label: "Daily EPA/DHA Supplement Dose (mg)",
      subtext: `Based on a dose of ${EPA_DHA_DOSAGE_MG_PER_KG} mg per kg of body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is Omega-3 supplementation important for dogs?",
      answer:
        "Omega-3 fatty acids, particularly EPA and DHA, play a crucial role in maintaining canine health by supporting skin integrity, reducing inflammation, and promoting joint mobility. These essential fats cannot be synthesized efficiently by dogs and must be obtained through diet or supplements. Supplementing Omega-3s helps manage chronic conditions like arthritis and allergies by modulating inflammatory pathways and enhancing cellular function.",
    },
    {
      question: "How is the correct Omega-3 dose calculated for my dog?",
      answer:
        "The dosage is calculated based on your dog’s body weight in kilograms, using a scientifically supported mg/kg dosing strategy. This calculator multiplies the dog’s weight by a recommended dose of 50 mg of combined EPA and DHA per kg daily, ensuring an accurate, weight-adjusted supplement amount. This method aligns with veterinary guidelines to optimize efficacy and safety.",
    },
    {
      question: "Can I give human Omega-3 supplements to my dog?",
      answer:
        "Human Omega-3 supplements are not formulated for dogs and may contain additives or dosages inappropriate for canine metabolism. Additionally, the concentration of EPA and DHA can vary widely. It is safer to use veterinary-specific supplements or consult your veterinarian to ensure the correct formulation and dose, minimizing risks of toxicity or ineffective treatment.",
    },
    {
      question: "Are there any risks or side effects of Omega-3 supplementation in dogs?",
      answer:
        "While Omega-3 supplements are generally safe, excessive dosing can lead to side effects such as gastrointestinal upset, blood thinning, or immune suppression. It is important to adhere to recommended dosages and consult a veterinarian before starting supplementation, especially if your dog is on medications like anticoagulants or has underlying health conditions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET UI
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Omega-3 (EPA/DHA) Supplement Calculator for Dogs
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Omega-3 fatty acids, specifically eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA), are essential nutrients that play a vital role in maintaining canine health. These long-chain polyunsaturated fatty acids contribute significantly to reducing inflammation, supporting cardiovascular function, enhancing skin and coat quality, and promoting cognitive health in dogs. Since dogs cannot efficiently synthesize EPA and DHA, supplementation through diet or targeted supplements is often necessary, especially in cases of chronic inflammatory conditions or skin disorders.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator is designed to provide an evidence-based estimate of the daily EPA/DHA supplement dose tailored to your dog’s body weight. Veterinary research supports dosing based on milligrams of EPA and DHA per kilogram of body weight to ensure efficacy and safety. By inputting your dog’s weight and selecting the appropriate unit system, this tool calculates the optimal daily dose, helping pet owners and veterinary professionals make informed decisions about supplementation strategies for joint health, skin conditions, and overall wellness.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Omega-3 (EPA/DHA) Supplement Calculator is straightforward and designed to provide accurate dosing recommendations based on your dog’s weight. Begin by selecting the unit system that corresponds to your preferred measurement—either Imperial (pounds) or Metric (kilograms). Next, enter your dog’s current body weight in the input field. Once the weight is entered, click the “Calculate” button to generate the recommended daily dose of EPA and DHA in milligrams.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog’s weight accurately, as the dosage calculation is weight-dependent. Use pounds if you selected Imperial or kilograms if Metric.
          </li>
          <li>
            <strong>Calculate:</strong> Press the calculate button to see the daily recommended EPA/DHA dose. The result is based on a scientifically supported dose of 50 mg per kg of body weight.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4808856/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Bauer JE. Therapeutic use of fish oils in companion animals. J Am Vet Med Assoc. 2011.
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review of fish oil supplementation benefits and dosing in dogs and cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wsu.edu/outreach/Pet-Health-Topics/categories/nutrition/omega-3-fatty-acids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Washington State University. Omega-3 Fatty Acids in Canine Nutrition.
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource detailing the role and dosing of omega-3 fatty acids in dog diets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6266233/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Freeman LM, et al. Nutritional Management of Canine Osteoarthritis. Vet Clin North Am Small Anim Pract. 2018.
            </a>
            <p className="text-slate-500 text-sm">
              Discusses omega-3 fatty acid supplementation as part of multimodal osteoarthritis management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines-for-dogs-and-cats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. American Animal Hospital Association (AAHA) Nutrition Guidelines for Dogs and Cats.
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines including recommendations for omega-3 fatty acid supplementation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // 6. FORMULA & EXAMPLE
  const formula = {
    title: "Scientific Formula",
    formula: "Dose (mg) = Weight (kg) × 50 mg/kg",
    variables: [
      { symbol: "Dose (mg)", description: "Daily EPA + DHA supplement dose in milligrams" },
      { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
      { symbol: "50 mg/kg", description: "Recommended dose of EPA + DHA per kilogram body weight" },
    ],
  };

  const example = {
    title: "Case Study",
    scenario:
      "A dog weighing 44 lbs (20 kg) requires an Omega-3 supplement for skin and joint health.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert the dog's weight to kilograms if necessary. Here, 44 lbs ÷ 2.20462 = 20 kg.",
      },
      {
        label: "Step 2",
        explanation:
          "Multiply the weight by the recommended dose: 20 kg × 50 mg/kg = 1000 mg daily EPA/DHA.",
      },
    ],
    result: "The dog should receive approximately 1000 mg of combined EPA and DHA daily for optimal benefits.",
  };

  return (
    <CalculatorVerticalLayout
      title="Omega-3 (EPA/DHA) Supplement Calculator for Dogs"
      description="Determine the correct daily supplement dosage of **Omega-3 fatty acids (EPA/DHA)** for joint and skin health."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Omega-3 (EPA/DHA) Supplement Calculator for Dogs" },
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