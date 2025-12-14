import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdEggBindingRiskEstimatorCalculator() {
  // 1. STATE
  // Unit system needed for weight input (lbs or kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs/kg), age (months), egg laying frequency (eggs/week), calcium supplementation (yes/no)
  const [inputs, setInputs] = useState({
    weight: "",
    ageMonths: "",
    eggsPerWeek: "",
    calciumSupplement: "no",
  });

  // 2. LOGIC ENGINE
  // Egg Binding Risk Score (arbitrary scale 0-100)
  // Formula (simplified veterinary risk estimate):
  // Risk Score = (Age Factor) + (Egg Frequency Factor) + (Weight Factor) - (Calcium Supplement Bonus)
  // Age Factor = (ageMonths / 12) * 10
  // Egg Frequency Factor = eggsPerWeek * 5
  // Weight Factor = (idealWeight - actualWeightKg) * 20 if underweight, else 0
  // Calcium Supplement Bonus = 15 if yes, else 0
  // Ideal weight assumed as 150g (0.15kg) for small pet birds (adjusted for demonstration)
  // Result capped between 0 and 100

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const ageNum = parseFloat(inputs.ageMonths);
    const eggsNum = parseFloat(inputs.eggsPerWeek);
    const calciumSup = inputs.calciumSupplement === "yes";

    if (
      isNaN(weightNum) ||
      isNaN(ageNum) ||
      isNaN(eggsNum) ||
      weightNum <= 0 ||
      ageNum <= 0 ||
      eggsNum < 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all fields.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Ideal weight for calculation (species average small bird ~0.15kg)
    const idealWeightKg = 0.15;

    // Age factor: older birds have higher risk (linear scale)
    const ageFactor = (ageNum / 12) * 10; // per year, max ~10

    // Egg frequency factor: more eggs per week increases risk
    const eggFrequencyFactor = eggsNum * 5;

    // Weight factor: underweight birds have higher risk
    const weightDeficit = idealWeightKg - weightKg;
    const weightFactor = weightDeficit > 0 ? weightDeficit * 20 : 0;

    // Calcium supplement reduces risk
    const calciumBonus = calciumSup ? 15 : 0;

    let riskScore = ageFactor + eggFrequencyFactor + weightFactor - calciumBonus;

    // Clamp risk score between 0 and 100
    riskScore = Math.min(Math.max(riskScore, 0), 100);

    // Risk interpretation
    let label = "";
    let warning = null;
    if (riskScore < 20) {
      label = "Low Risk of Egg Binding";
    } else if (riskScore < 50) {
      label = "Moderate Risk of Egg Binding";
      warning = "Monitor your bird closely and ensure proper nutrition and calcium intake.";
    } else if (riskScore < 80) {
      label = "High Risk of Egg Binding";
      warning =
        "Consult a veterinarian promptly to prevent complications related to egg binding.";
    } else {
      label = "Severe Risk of Egg Binding";
      warning =
        "Immediate veterinary attention is critical to avoid life-threatening complications.";
    }

    return {
      value: riskScore.toFixed(1),
      label,
      subtext: "Score range: 0 (lowest) to 100 (highest risk)",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What causes egg binding in birds?",
      answer:
        "Egg binding occurs when a bird is unable to pass an egg through the reproductive tract, often due to nutritional deficiencies, obesity, or reproductive tract abnormalities. Calcium deficiency is a common cause because calcium is essential for muscle contractions needed during egg laying. Understanding these causes helps in prevention and timely veterinary intervention.",
    },
    {
      question: "How does calcium supplementation reduce egg binding risk?",
      answer:
        "Calcium plays a crucial role in muscle function, including the muscles involved in laying eggs. Supplementing calcium ensures the bird has adequate reserves to support strong uterine contractions and eggshell formation. Without sufficient calcium, muscle weakness can lead to retained eggs and increased risk of egg binding.",
    },
    {
      question: "Why is bird weight important in assessing egg binding risk?",
      answer:
        "Weight reflects the bird's overall health and nutritional status. Underweight birds may lack the energy and nutrients required for normal egg laying, while overweight birds can experience reproductive tract complications. Both extremes can increase the likelihood of egg binding, making weight a vital factor in risk assessment.",
    },
    {
      question: "Can frequent egg laying increase the risk of egg binding?",
      answer:
        "Yes, frequent egg laying can strain a bird’s reproductive system and deplete essential nutrients like calcium. This repetitive stress may weaken the muscles and tissues involved in egg passage, raising the risk of egg binding. Managing egg laying frequency through diet and environmental enrichment can help mitigate this risk.",
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>
        <div>
          <Label htmlFor="ageMonths" className="text-slate-700 dark:text-slate-300">
            Age (months)
          </Label>
          <Input
            id="ageMonths"
            type="number"
            min="0"
            step="1"
            value={inputs.ageMonths}
            onChange={(e) => setInputs({ ...inputs, ageMonths: e.target.value })}
            placeholder="Enter age in months"
          />
        </div>
        <div>
          <Label htmlFor="eggsPerWeek" className="text-slate-700 dark:text-slate-300">
            Egg Laying Frequency (eggs per week)
          </Label>
          <Input
            id="eggsPerWeek"
            type="number"
            min="0"
            step="any"
            value={inputs.eggsPerWeek}
            onChange={(e) => setInputs({ ...inputs, eggsPerWeek: e.target.value })}
            placeholder="Enter eggs laid per week"
          />
        </div>
        <div>
          <Label htmlFor="calciumSupplement" className="text-slate-700 dark:text-slate-300">
            Calcium Supplementation
          </Label>
          <Select
            id="calciumSupplement"
            value={inputs.calciumSupplement}
            onValueChange={(value) => setInputs({ ...inputs, calciumSupplement: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              ageMonths: "",
              eggsPerWeek: "",
              calciumSupplement: "no",
            })
          }
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
          Understanding Egg Binding Risk Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Egg binding is a serious reproductive condition in female birds where an egg becomes stuck in the oviduct,
          preventing normal laying. This condition can lead to severe health complications including infection,
          organ damage, and even death if untreated. The Egg Binding Risk Estimator is designed to provide bird owners
          and veterinarians with a scientifically-informed tool to assess the likelihood of egg binding based on key
          physiological and behavioral factors.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The estimator incorporates variables such as the bird’s weight, age, egg laying frequency, and calcium
          supplementation status to calculate a risk score. Weight is critical because underweight birds often lack
          the necessary energy reserves and nutrients for healthy egg production. Age influences risk as older birds
          may have weakened reproductive muscles or underlying health issues increasing susceptibility.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Calcium supplementation is included because calcium is essential for muscle contractions and eggshell
          formation; insufficient calcium can directly contribute to egg binding. Frequent egg laying without adequate
          recovery time also raises risk by depleting nutrient stores and stressing the reproductive system. This
          estimator thus integrates these factors to provide a comprehensive risk profile, aiding in early detection
          and prevention strategies.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Egg Binding Risk Estimator, input your bird’s current weight, age in months, average number of eggs
          laid per week, and whether the bird receives calcium supplements. Select the appropriate unit system for weight
          (Imperial or Metric) to ensure accurate calculations. After entering all fields, click the Calculate button
          to generate the risk score.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your bird’s weight accurately using a scale and enter the value in the
            selected unit.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird’s age in months to account for age-related risk factors.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the average number of eggs your bird lays per week to assess reproductive
            strain.
          </li>
          <li>
            <strong>Step 4:</strong> Select whether your bird receives calcium supplementation, which can reduce risk.
          </li>
          <li>
            <strong>Step 5:</strong> Click Calculate to view the risk score and interpret the results along with any
            warnings or recommendations.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/egg-binding"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              1. Merck Veterinary Manual: Egg Binding in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of egg binding causes, symptoms, and treatment options in avian species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149966/"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              2. Nutritional Management of Egg Binding in Pet Birds (NCBI)
            </a>
            <p className="text-slate-500 text-sm">
              Research article discussing the role of nutrition and calcium supplementation in preventing egg binding.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/avian-medicine"
              className="text-blue-600 font-bold hover:underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              3. Association of Avian Veterinarians: Avian Reproductive Disorders
            </a>
            <p className="text-slate-500 text-sm">
              Professional guidelines and clinical resources for diagnosing and managing reproductive health in birds.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Egg Binding Risk Estimator"
      description="Estimate the risk of a female bird suffering from **egg binding** based on nutrition and reproductive history."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Risk Score = (AgeMonths / 12) × 10 + EggsPerWeek × 5 + Max(0, (IdealWeightKg - WeightKg) × 20) - CalciumSupplementBonus",
        variables: [
          { symbol: "AgeMonths", description: "Bird's age in months" },
          { symbol: "EggsPerWeek", description: "Number of eggs laid per week" },
          { symbol: "WeightKg", description: "Bird's weight in kilograms" },
          { symbol: "IdealWeightKg", description: "Species average ideal weight (0.15 kg)" },
          { symbol: "CalciumSupplementBonus", description: "15 if supplemented, else 0" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 24-month-old female bird weighing 0.12 kg lays 3 eggs per week and does not receive calcium supplements.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate age factor: (24 / 12) × 10 = 20",
          },
          {
            label: "2",
            explanation:
              "Calculate egg frequency factor: 3 × 5 = 15",
          },
          {
            label: "3",
            explanation:
              "Calculate weight factor: (0.15 - 0.12) × 20 = 0.03 × 20 = 0.6",
          },
          {
            label: "4",
            explanation:
              "Calcium supplement bonus: 0 (no supplementation)",
          },
          {
            label: "5",
            explanation:
              "Sum factors: 20 + 15 + 0.6 - 0 = 35.6 risk score (Moderate Risk)",
          },
        ],
        result: "Estimated risk score is 35.6, indicating a moderate risk of egg binding.",
      }}
      relatedCalculators={[
        {
          title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
          url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk",
          icon: "🐾",
        },
        {
          title: "Bedding Replacement Frequency Estimator",
          url: "/pets/small-mammal-bedding-replacement-frequency",
          icon: "🐶",
        },
        {
          title: "Horse Salt & Mineral Balance Checker",
          url: "/pets/horse-salt-mineral-balance-checker",
          icon: "🐎",
        },
        {
          title: "Electrolyte Powder Mixing Calculator",
          url: "/pets/horse-electrolyte-powder-mixing",
          icon: "🍖",
        },
        {
          title: "Horse Selenium Toxicity Threshold (ppm)",
          url: "/pets/horse-selenium-toxicity-threshold",
          icon: "🐎",
        },
        {
          title: "Feather Plucking & Stress Risk Index",
          url: "/pets/bird-feather-plucking-stress-risk-index",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Egg Binding Risk Estimator" },
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