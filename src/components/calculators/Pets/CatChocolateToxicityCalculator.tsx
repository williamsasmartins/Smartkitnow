import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function CatChocolateToxicityCalculator() {
  // 1. STATE
  // Unit system needed because weight input can be in lbs or kg
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and chocolate type (to get theobromine content mg/g)
  // Chocolate types: White, Milk, Dark, Baking
  const [inputs, setInputs] = useState({
    weight: "",
    chocolateType: "milk",
    amountChocolate: "",
  });

  // Theobromine content in mg per gram of chocolate by type (veterinary toxicology references)
  const theobromineContentMap: Record<string, number> = {
    white: 0.1, // negligible but not zero
    milk: 1.5,
    dark: 5.0,
    baking: 16.0,
  };

  // Toxic dose threshold for cats (theobromine mg/kg)
  // Cats are less commonly affected but toxic dose is estimated around 20 mg/kg theobromine
  const toxicDoseMgPerKg = 20;

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const amountRaw = parseFloat(inputs.amountChocolate);
    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(amountRaw) ||
      amountRaw <= 0 ||
      !theobromineContentMap[inputs.chocolateType]
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Theobromine content per gram chocolate
    const theobromineMgPerGram = theobromineContentMap[inputs.chocolateType];

    // Total theobromine ingested (mg)
    const totalTheobromineMg = amountRaw * theobromineMgPerGram;

    // Calculate toxic dose threshold for this cat (mg)
    const toxicDoseMg = toxicDoseMgPerKg * weightKg;

    // Calculate risk ratio (ingested / toxic threshold)
    const riskRatio = totalTheobromineMg / toxicDoseMg;

    // Interpret risk
    let label = "";
    let warning: string | null = null;
    if (riskRatio < 0.1) {
      label = "Minimal Risk";
    } else if (riskRatio < 0.5) {
      label = "Low Risk - Monitor Closely";
      warning =
        "Although the dose is below toxic threshold, some cats may be sensitive. Watch for symptoms.";
    } else if (riskRatio < 1) {
      label = "Moderate Risk - Veterinary Attention Recommended";
      warning =
        "Potential toxicity present. Contact your veterinarian promptly for advice.";
    } else {
      label = "High Risk - Emergency Veterinary Care Needed";
      warning =
        "The ingested theobromine exceeds toxic dose. Immediate veterinary intervention is critical.";
    }

    return {
      value: riskRatio.toFixed(2),
      label,
      subtext: `Theobromine ingested: ${totalTheobromineMg.toFixed(
        1
      )} mg; Toxic dose threshold: ${toxicDoseMg.toFixed(1)} mg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is chocolate toxic to cats, and how does theobromine affect them?",
      answer:
        "Chocolate contains theobromine, a stimulant that cats metabolize very slowly, leading to toxic accumulation. Theobromine affects the central nervous system, cardiovascular system, and kidneys, causing symptoms like vomiting, tremors, and seizures. Because cats are less likely to consume chocolate, toxicity is rarer but still dangerous when it occurs.",
    },
    {
      question: "How accurate is this calculator in predicting chocolate toxicity in cats?",
      answer:
        "This calculator estimates risk based on known toxic doses of theobromine relative to a cat’s weight and chocolate type. Individual sensitivity can vary, and factors like age, health status, and metabolism influence toxicity. Therefore, it should be used as a guide, not a definitive diagnosis, and veterinary consultation is essential for suspected poisoning.",
    },
    {
      question: "What should I do if my cat ingests chocolate, regardless of the calculator result?",
      answer:
        "If your cat has ingested chocolate, monitor for symptoms such as vomiting, restlessness, or rapid breathing. Even small amounts can be harmful, so contacting a veterinarian immediately is crucial for proper assessment and treatment. Early intervention improves outcomes and can prevent serious complications.",
    },
    {
      question: "Why does the type of chocolate matter in assessing toxicity risk for cats?",
      answer:
        "Different chocolates contain varying levels of theobromine; for example, baking chocolate has much higher concentrations than milk chocolate. This means smaller amounts of dark or baking chocolate can be more toxic than larger amounts of milk chocolate. Understanding the chocolate type helps accurately estimate the toxic dose and risk level.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.weight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({
                  ...prev,
                  weight: formatNumberForInput(nextWeight, 2),
                }));
              }
              setUnit(next);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="chocolateType"
            className="text-slate-700 dark:text-slate-300"
          >
            Chocolate Type
          </Label>
          <select
            id="chocolateType"
            name="chocolateType"
            value={inputs.chocolateType}
            onChange={onInputChange}
            className="w-full mt-1 border rounded px-3 py-2 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="white">White Chocolate (0.1 mg/g theobromine)</option>
            <option value="milk">Milk Chocolate (1.5 mg/g theobromine)</option>
            <option value="dark">Dark Chocolate (5.0 mg/g theobromine)</option>
            <option value="baking">Baking Chocolate (16.0 mg/g theobromine)</option>
          </select>
        </div>

        <div>
          <Label
            htmlFor="amountChocolate"
            className="text-slate-700 dark:text-slate-300"
          >
            Amount of Chocolate Ingested (grams)
          </Label>
          <Input
            id="amountChocolate"
            name="amountChocolate"
            type="number"
            min="0"
            step="any"
            placeholder="Enter amount in grams"
            value={inputs.amountChocolate}
            onChange={onInputChange}
            className="mt-1"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ weight: "", chocolateType: "milk", amountChocolate: "" })
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
              vet for diagnosis.
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
          Understanding Cat Chocolate Toxicity Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Chocolate toxicity in cats, although less common than in dogs, poses a
          significant health risk due to the presence of theobromine, a bitter alkaloid
          stimulant. Cats metabolize theobromine much more slowly than humans, which
          allows toxic levels to accumulate in their system. This calculator estimates
          the risk of toxicity based on the cat’s weight, the type of chocolate ingested,
          and the amount consumed, providing a scientific approach to assessing danger.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The severity of chocolate poisoning depends largely on the theobromine content,
          which varies widely among chocolate types—from negligible amounts in white
          chocolate to very high concentrations in baking chocolate. By inputting these
          variables, the calculator helps pet owners and veterinarians quickly evaluate
          potential toxicity. It is important to remember that even small amounts can
          cause symptoms, and individual sensitivity varies, so this tool serves as a
          guide rather than a definitive diagnostic.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Cat Chocolate Toxicity Calculator effectively, start by selecting
          the unit system that corresponds to your preference or location—imperial (lbs)
          or metric (kg). Next, enter your cat’s current weight accurately, as this is
          critical for calculating the toxic dose threshold. Then, choose the type of
          chocolate ingested from the dropdown menu, which reflects varying theobromine
          concentrations.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s weight in pounds or kilograms,
            depending on the selected unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Select the chocolate type your cat ingested to
            account for theobromine content differences.
          </li>
          <li>
            <strong>Step 3:</strong> Input the estimated amount of chocolate consumed
            in grams.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to receive an estimated risk
            ratio and interpretation, including any necessary warnings.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results as a guide and consult your
            veterinarian immediately if toxicity is suspected.
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
              href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/chocolate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. ASPCA Animal Poison Control: Chocolate Toxicity in Pets
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource detailing the toxic effects of chocolate and
              treatment recommendations for cats and dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/chocolate-toxicity-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell Feline Health Center: Chocolate Toxicity in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of theobromine metabolism in cats and clinical
              signs of toxicity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/chocolate-and-theobromine-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual: Chocolate and Theobromine Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary manual covering toxic doses, clinical signs,
              and treatment protocols.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Chocolate Toxicity Calculator"
      description="Calculate the toxic dose of chocolate for cats (though less common than in dogs)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Risk Ratio = (Theobromine Ingested mg) ÷ (Toxic Dose Threshold mg/kg × Cat Weight kg)",
        variables: [
          { symbol: "Risk Ratio", description: "Relative toxicity risk" },
          { symbol: "Theobromine Ingested mg", description: "Total theobromine consumed" },
          { symbol: "Toxic Dose Threshold mg/kg", description: "Toxic dose per kg body weight (20 mg/kg)" },
          { symbol: "Cat Weight kg", description: "Weight of the cat in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat ingests 30 grams of dark chocolate (5 mg/g theobromine).",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate total theobromine ingested: 30 g × 5 mg/g = 150 mg.",
          },
          {
            label: "2",
            explanation:
              "Calculate toxic dose threshold: 20 mg/kg × 4.54 kg = 90.8 mg.",
          },
          {
            label: "3",
            explanation:
              "Calculate risk ratio: 150 mg ÷ 90.8 mg = 1.65 (high risk).",
          },
        ],
        result:
          "The cat has ingested a potentially toxic dose exceeding the threshold, requiring immediate veterinary care.",
      }}
      relatedCalculators={[
        {
          title: "Electrolyte Powder Mixing Calculator",
          url: "/pets/horse-electrolyte-powder-mixing",
          icon: "🐾",
        },
        {
          title: "Stress Score & Playtime Offset Planner (owner input)",
          url: "/pets/cat-stress-score-playtime-offset-planner",
          icon: "🐶",
        },
        {
          title: "Gabapentin Dose Calculator for Cats",
          url: "/pets/cat-gabapentin-dose",
          icon: "🐱",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)",
          url: "/pets/dog-human-medication-exposure-alert",
          icon: "🐶",
        },
        {
          title: "Daily Water Intake Checker for Cats",
          url: "/pets/cat-daily-water-intake-checker",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Chocolate Toxicity Calculator" },
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
