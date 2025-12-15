import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const TOXIC_FOODS_MG_PER_KG = {
  "chocolate": 20, // Theobromine toxic dose mg/kg
  "grapes": 5, // Approximate toxic dose mg/kg (variable)
  "onion": 5, // Approximate toxic dose mg/kg (variable)
  "xylitol": 0.1, // Very low toxic dose mg/kg
  "macadamia": 10, // Approximate toxic dose mg/kg
};

export default function SmallMammalCommonToxicFoodsReferenceCalculator() {
  // 1. STATE
  // Unit system for weight input (imperial or metric)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and food type, amount ingested (grams)
  const [inputs, setInputs] = useState({
    weight: "",
    foodType: "",
    amount: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const amountNum = parseFloat(inputs.amount);
    const foodType = inputs.foodType.toLowerCase();

    if (
      !weightNum ||
      weightNum <= 0 ||
      !amountNum ||
      amountNum <= 0 ||
      !foodType ||
      !(foodType in TOXIC_FOODS_MG_PER_KG)
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Convert amount ingested from grams to mg
    const amountMg = amountNum * 1000;

    // Calculate mg/kg dose ingested
    const doseMgPerKg = amountMg / weightKg;

    // Toxic threshold mg/kg for the food
    const toxicThreshold = TOXIC_FOODS_MG_PER_KG[foodType];

    // Risk assessment
    let riskLevel = "Low Risk";
    let warning = null;

    if (doseMgPerKg >= toxicThreshold) {
      riskLevel = "High Risk";
      warning = `The ingested dose of ${doseMgPerKg.toFixed(
        2
      )} mg/kg exceeds the toxic threshold for ${foodType} (${toxicThreshold} mg/kg). Immediate veterinary attention is recommended.`;
    } else if (doseMgPerKg >= toxicThreshold * 0.5) {
      riskLevel = "Moderate Risk";
      warning = `The ingested dose of ${doseMgPerKg.toFixed(
        2
      )} mg/kg is approaching the toxic threshold for ${foodType} (${toxicThreshold} mg/kg). Monitor your pet closely and consult a veterinarian if symptoms develop.`;
    }

    return {
      value: doseMgPerKg.toFixed(2),
      label: `Estimated Dose (mg/kg) of ${foodType}`,
      subtext: `Toxic Threshold: ${toxicThreshold} mg/kg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate the dose of toxic food ingested in mg/kg?",
      answer:
        "Calculating the dose in mg/kg allows veterinarians and pet owners to understand the relative amount of toxin ingested based on the pet's body weight. This is crucial because toxicity depends not only on the amount consumed but also on the size of the animal. By standardizing the dose per kilogram, we can better assess the risk and determine the urgency of medical intervention.",
    },
    {
      question: "How accurate are toxic dose thresholds for different foods?",
      answer:
        "Toxic dose thresholds are based on veterinary research and clinical case reports but can vary due to individual pet sensitivity, species differences, and the form of the food ingested. These thresholds serve as general guidelines rather than absolute values. Therefore, even doses below the threshold may cause adverse effects in some pets, and any ingestion of toxic foods should be treated cautiously.",
    },
    {
      question: "What should I do if my pet ingests a potentially toxic food?",
      answer:
        "If your pet ingests a potentially toxic food, first calculate the estimated dose using their weight and the amount ingested. Regardless of the calculated risk, it is important to contact your veterinarian immediately for advice. Prompt veterinary evaluation can prevent serious complications and improve outcomes, especially for high-risk substances like xylitol or chocolate.",
    },
    {
      question: "Can this calculator replace professional veterinary advice?",
      answer:
        "No, this calculator is designed as an educational tool to provide an initial risk assessment based on known toxic doses. It cannot replace a thorough clinical evaluation by a veterinarian. Always seek professional veterinary care if you suspect your pet has ingested a toxic substance, as symptoms and severity can vary widely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[180px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Pet Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g. 10" : "e.g. 4.5"}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="foodType" className="text-slate-700 dark:text-slate-300">
            Toxic Food Type
          </Label>
          <select
            id="foodType"
            value={inputs.foodType}
            onChange={(e) => setInputs({ ...inputs, foodType: e.target.value })}
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select a food</option>
            {Object.keys(TOXIC_FOODS_MG_PER_KG).map((food) => (
              <option key={food} value={food}>
                {food.charAt(0).toUpperCase() + food.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300">
            Amount Ingested (grams)
          </Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.amount}
            onChange={(e) => setInputs({ ...inputs, amount: e.target.value })}
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
          onClick={() => setInputs({ weight: "", foodType: "", amount: "" })}
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

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Common Toxic Foods Reference
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Common Toxic Foods Reference is a vital veterinary tool designed to help pet owners and professionals assess the potential risk posed by ingestion of certain foods known to be toxic to small mammals and other pets. These foods, such as chocolate, grapes, onions, xylitol, and macadamia nuts, contain compounds that can cause severe physiological disturbances, ranging from gastrointestinal upset to life-threatening organ damage. Understanding the toxic dose relative to the pet’s body weight is essential for timely and appropriate intervention.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Toxicity thresholds are typically expressed in milligrams of toxin per kilogram of body weight (mg/kg), which allows for standardized risk assessment across different sizes and species. This reference consolidates these thresholds and provides a straightforward method to estimate the dose ingested based on the amount of food consumed and the pet’s weight. It empowers caregivers to make informed decisions about when to seek veterinary care, potentially improving outcomes through early detection and treatment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While this tool offers valuable guidance, it is important to recognize that individual sensitivity to toxins can vary widely among pets. Factors such as age, breed, health status, and concurrent medications may influence the severity of toxicity. Therefore, this reference should be used as a supplement to, not a replacement for, professional veterinary advice and clinical evaluation.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the relative toxic dose your pet has ingested based on their weight, the type of toxic food consumed, and the amount ingested. By inputting these values, you receive an estimated dose in mg/kg, which is then compared to known toxic thresholds to assess risk. This helps you understand whether the ingestion is likely to be harmful and whether immediate veterinary attention is necessary.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your pet’s weight in pounds or kilograms, depending on your preferred unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Select the toxic food type from the dropdown menu. Only foods with established toxic dose data are listed.
          </li>
          <li>
            <strong>Step 3:</strong> Input the estimated amount of the toxic food your pet ingested in grams.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the estimated dose in mg/kg and the associated risk level. Follow any warnings or recommendations provided.
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
              href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. ASPCA Animal Poison Control Center: Toxic and Non-Toxic Plants and Foods
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource detailing common toxic foods and plants for pets, including toxic dose information and clinical signs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/poisoning-in-small-animals/food-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Food Toxicity in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary manual covering pathophysiology, clinical signs, and treatment of food toxicities in small animals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/chocolate-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center: Chocolate Toxicity in Cats and Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of the toxic effects of theobromine in chocolate ingestion, including toxic doses and clinical management.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Common Toxic Foods Reference"
      description="Reference guide for common toxic or dangerous foods for small pets (e.g., certain seeds, nuts, or sugary items)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg/kg) = (Amount Ingested in mg) ÷ (Pet Weight in kg)",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Estimated toxin dose per kilogram of pet body weight" },
          { symbol: "Amount Ingested in mg", description: "Mass of toxic food ingested converted to milligrams" },
          { symbol: "Pet Weight in kg", description: "Body weight of the pet in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb dog ingests 5 grams of chocolate. The toxic threshold for theobromine in chocolate is approximately 20 mg/kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the dog's weight to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Convert the amount ingested to milligrams: 5 g × 1000 = 5000 mg.",
          },
          {
            label: "3",
            explanation:
              "Calculate the dose: 5000 mg ÷ 4.54 kg = 1101 mg/kg, which far exceeds the toxic threshold.",
          },
        ],
        result:
          "The dog has ingested a highly toxic dose of theobromine and requires immediate veterinary care.",
      }}
      relatedCalculators={[
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Feather Plucking & Stress Risk Index",
          url: "/pets/bird-feather-plucking-stress-risk-index",
          icon: "🐶",
        },
        {
          title: "Horse Selenium Toxicity Threshold (ppm)",
          url: "/pets/horse-selenium-toxicity-threshold",
          icon: "🐎",
        },
        {
          title: "Horse Gestation (Due Date) Calculator",
          url: "/pets/horse-gestation-due-date",
          icon: "🐎",
        },
        {
          title: "Laminitis Risk Index (BCS + NSC intake)",
          url: "/pets/horse-laminitis-risk-index",
          icon: "💉",
        },
        {
          title: "Resting vs. Active Hours Balance Tracker (owner input)",
          url: "/pets/cat-resting-active-hours-balance-tracker",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Common Toxic Foods Reference" },
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