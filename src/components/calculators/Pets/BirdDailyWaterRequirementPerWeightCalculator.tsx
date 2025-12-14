import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdDailyWaterRequirementPerWeightCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight only
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Daily Water Requirement (ml) = 150 ml × Body Weight (kg)
  // Source: Typical avian daily water intake ~150 ml/kg body weight
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate daily water requirement in ml
    const waterMl = 150 * weightKg;

    // Format result with commas and one decimal place
    const formattedValue = waterMl.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    return {
      value: formattedValue,
      label: "Daily Water Requirement (ml)",
      subtext: `Based on weight of ${weightNum} ${unit === "imperial" ? "lbs" : "kg"}`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is daily water intake important for birds?",
      answer:
        "Water is essential for all physiological processes in birds, including digestion, temperature regulation, and waste elimination. Insufficient water intake can lead to dehydration, which may cause serious health issues such as kidney failure or impaired metabolism. Understanding and providing the correct daily water volume ensures optimal health and wellbeing for avian patients.",
    },
    {
      question: "How does body weight influence water requirements in birds?",
      answer:
        "A bird's daily water requirement is directly proportional to its body weight because larger birds have greater metabolic demands and surface area for water loss. The standard veterinary guideline estimates approximately 150 ml of water per kilogram of body weight daily. This relationship helps veterinarians tailor hydration plans accurately for different bird sizes.",
    },
    {
      question: "Can environmental factors affect a bird’s water needs?",
      answer:
        "Yes, environmental conditions such as temperature, humidity, and activity level significantly impact a bird's hydration needs. Hotter climates or increased physical activity elevate water loss through respiration and evaporation, increasing daily water requirements. Therefore, adjustments to water provision should be made considering these external factors to prevent dehydration.",
    },
    {
      question: "How can I ensure my bird drinks enough water daily?",
      answer:
        "Providing fresh, clean water in accessible containers encourages regular drinking behavior in birds. Monitoring water consumption daily and observing for signs of dehydration, such as lethargy or dry mucous membranes, is crucial. Additionally, incorporating water-rich foods and maintaining a comfortable environment supports adequate hydration.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET UI
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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Bird Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ weight: e.target.value })}
          aria-describedby="weightHelp"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs (already reactive)
            setInputs((prev) => ({ ...prev }));
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Daily Water Requirement per Weight
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Water is a fundamental nutrient for birds, playing a critical role in maintaining cellular function, regulating body temperature, and facilitating digestion. Unlike mammals, birds have a higher metabolic rate and lose water rapidly through respiration and excretion, making adequate hydration essential for their survival. Calculating daily water requirements based on body weight helps ensure that birds receive sufficient hydration tailored to their physiological needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The standard veterinary guideline estimates that birds require approximately 150 milliliters of water per kilogram of body weight each day. This value accounts for normal metabolic water loss and environmental factors under typical conditions. However, individual needs may vary depending on species, age, health status, and environmental stressors such as heat or activity level.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding this relationship between weight and water intake allows veterinarians and bird owners to monitor hydration status effectively and prevent complications associated with dehydration. Providing fresh, clean water daily and adjusting intake based on observed behavior and clinical signs are key components of avian health management.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the minimum daily water volume a bird requires based on its body weight. To use it effectively, enter the bird's weight in the selected unit system—either pounds (lbs) or kilograms (kg). The calculator will then compute the estimated water requirement in milliliters, providing a practical guideline for hydration management.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system that corresponds to your measurement preference (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird’s weight accurately in the input field. Ensure the value is positive and realistic.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to view the estimated daily water requirement in milliliters.
          </li>
          <li>
            <strong>Step 4:</strong> Use this value as a baseline to provide fresh water daily, adjusting as needed for environmental or health factors.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/nutrition-of-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Nutrition of Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource detailing avian nutritional requirements, including water intake guidelines and factors influencing hydration.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466057/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Center for Biotechnology Information - Avian Hydration Physiology
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article exploring water balance, metabolism, and hydration strategies in birds under various environmental conditions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/resources/avian-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians - Avian Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Professional guidelines and best practices for maintaining optimal hydration and nutrition in captive and wild birds.
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
        formula: "Daily Water Requirement (ml) = 150 × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "The bird's weight in kilograms" },
          { symbol: "Daily Water Requirement (ml)", description: "Estimated daily water intake in milliliters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A pet parrot weighs 2.2 lbs (1 kg). The owner wants to know how much water to provide daily to maintain proper hydration.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the bird's weight to kilograms if needed (2.2 lbs ≈ 1 kg). Then multiply by 150 ml/kg to estimate daily water needs.",
          },
          {
            label: "2",
            explanation: "Calculate: 150 ml × 1 kg = 150 ml daily water requirement.",
          },
          {
            label: "3",
            explanation: "Provide at least 150 ml of fresh water daily, adjusting for environmental factors.",
          },
        ],
        result: "The parrot requires approximately 150 ml of water per day to stay properly hydrated.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator", url: "/pets/dog-onion-garlic-exposure-risk", icon: "🐶" },
        { title: "CO₂ Injection Rate Calculator (Planted Tank)", url: "/pets/aquarium-co2-injection-rate-planted-tank", icon: "🐱" },
        { title: "Dog Life Expectancy Estimator (lifestyle factors)", url: "/pets/dog-life-expectancy-estimator", icon: "🐶" },
        { title: "Puppy Adult Size Predictor (Weight Curve)", url: "/pets/puppy-adult-size-predictor-weight-curve", icon: "💉" },
        { title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)", url: "/pets/dog-human-medication-exposure-alert", icon: "🐶" },
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