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

export default function CatOnionGarlicToxicityCalculator() {
  // 1. STATE
  // Unit system needed for weight input (imperial or metric)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and amount of onion/garlic ingested (grams)
  const [inputs, setInputs] = useState({
    weight: "",
    onionGarlicAmount: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose threshold for cats: ~5 g/kg of onion/garlic ingestion can cause hemolytic anemia
  // Calculate dose in g/kg and risk level
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const amountRaw = parseFloat(inputs.onionGarlicAmount);

    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(amountRaw) ||
      amountRaw <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(weightRaw, unit);

    // Dose in g/kg
    const dose = amountRaw / weightKg;

    // Risk interpretation
    // <1 g/kg: Low risk
    // 1-5 g/kg: Moderate risk
    // >5 g/kg: High risk of toxicity

    let riskLabel = "";
    let warning = null;

    if (dose < 1) {
      riskLabel = "Low Risk: Unlikely to cause toxicity.";
    } else if (dose < 5) {
      riskLabel =
        "Moderate Risk: Potential for mild to moderate hemolytic anemia.";
      warning =
        "Monitor your cat closely and seek veterinary advice if symptoms appear.";
    } else {
      riskLabel =
        "High Risk: Significant risk of hemolytic anemia and requires immediate veterinary attention.";
      warning =
        "This dose is toxic. Contact your veterinarian immediately for treatment.";
    }

    return {
      value: dose.toFixed(2),
      label: "Estimated Onion/Garlic Dose (g/kg body weight)",
      subtext: riskLabel,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why are onions and garlic toxic to cats?",
      answer:
        "Onions and garlic contain compounds called thiosulfates, which cats cannot metabolize effectively. These compounds cause oxidative damage to red blood cells, leading to hemolytic anemia. This condition reduces oxygen delivery to tissues and can be life-threatening if not treated promptly.",
    },
    {
      question: "How does the amount ingested affect toxicity risk?",
      answer:
        "The severity of toxicity depends on the dose relative to the cat's body weight. Small amounts may cause mild symptoms or no symptoms at all, while larger doses increase the risk of severe anemia. This calculator estimates the dose in grams per kilogram to help assess risk levels.",
    },
    {
      question: "What symptoms should I watch for after ingestion?",
      answer:
        "Symptoms of onion or garlic toxicity often appear within a few days and include weakness, lethargy, pale gums, rapid breathing, and dark-colored urine. If you notice any of these signs, it is crucial to seek veterinary care immediately to prevent serious complications.",
    },
    {
      question: "Can cooked onions or garlic still be toxic to cats?",
      answer:
        "Yes, cooking does not eliminate the toxic thiosulfates in onions and garlic. Both raw and cooked forms can cause toxicity. Therefore, any exposure should be considered potentially harmful and evaluated accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // UI widget
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.weight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({ ...prev, weight: formatNumberForInput(nextWeight, 2) }));
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

      {/* Weight input */}
      <div className="space-y-1">
        <Label className="text-slate-700 dark:text-slate-300" htmlFor="weight">
          Cat Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
          value={inputs.weight || ""}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, weight: e.target.value }))
          }
        />
      </div>

      {/* Onion/Garlic amount input */}
      <div className="space-y-1">
        <Label
          className="text-slate-700 dark:text-slate-300"
          htmlFor="onionGarlicAmount"
        >
          Onion/Garlic Amount Ingested (grams)
        </Label>
        <Input
          id="onionGarlicAmount"
          type="number"
          min="0"
          step="any"
          placeholder="Enter amount in grams"
          value={inputs.onionGarlicAmount || ""}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, onionGarlicAmount: e.target.value }))
          }
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", onionGarlicAmount: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only.
              Consult a veterinarian for diagnosis and treatment.
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
          Understanding Cat Onion/Garlic Toxicity Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Onion and garlic toxicity in cats is a serious veterinary concern due to
          the presence of thiosulfates, compounds that cats cannot effectively
          metabolize. When ingested, these compounds cause oxidative damage to red
          blood cells, leading to hemolytic anemia—a condition where red blood cells
          are destroyed faster than they can be produced. This calculator estimates
          the relative dose of onion or garlic ingested based on your cat's weight
          and the amount consumed, helping to assess the potential risk of toxicity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The dose is expressed in grams of onion or garlic per kilogram of body
          weight, which is the standard veterinary measure to evaluate toxic risk.
          Lower doses typically pose minimal risk, while higher doses can cause
          severe anemia requiring immediate veterinary intervention. This tool is
          designed to provide an evidence-based estimate to guide pet owners in
          understanding the urgency of the situation and whether veterinary care is
          needed.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, enter your cat's weight and the estimated amount
          of onion or garlic ingested in grams. Select the appropriate unit system
          for weight input (imperial or metric). After entering these values,
          click the Calculate button to receive an estimate of the toxic dose per
          kilogram of body weight and an interpretation of the risk level.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat's weight in pounds or kilograms,
            depending on the selected unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the amount of onion or garlic ingested in
            grams. This includes raw, cooked, or powdered forms.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to view the estimated dose in
            grams per kilogram and the associated toxicity risk.
          </li>
          <li>
            <strong>Step 4:</strong> Follow the guidance provided by the risk
            interpretation. If the risk is moderate or high, seek veterinary care
            promptly.
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
              href="https://www.merckvetmanual.com/toxicology/food-hazards/onion-and-garlic-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Onion and Garlic Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of onion and garlic toxicity in companion
              animals, including clinical signs and treatment options.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/garlic-and-onion-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell Feline Health Center: Garlic and Onion Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of the toxic effects of Allium species on cats,
              including prevention and emergency care advice.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/12010167/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Clinical Toxicology Study on Allium Species in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed research article analyzing the dose-dependent effects of
              onion and garlic ingestion in feline patients.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Onion/Garlic Toxicity Calculator"
      description="Determine the potential risk of red blood cell damage from ingesting Allium species (onions, garlic)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Toxic Dose (g/kg) = Onion/Garlic Amount (g) ÷ Cat Weight (kg)",
        variables: [
          {
            symbol: "Onion/Garlic Amount (g)",
            description: "The weight of onion or garlic ingested in grams",
          },
          {
            symbol: "Cat Weight (kg)",
            description: "The body weight of the cat in kilograms",
          },
          {
            symbol: "Toxic Dose (g/kg)",
            description:
              "Calculated dose of onion/garlic per kilogram of cat body weight",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat ingests approximately 15 grams of cooked onion.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert cat weight to kilograms if needed (10 lb = 4.54 kg).",
          },
          {
            label: "2",
            explanation:
              "Calculate dose: 15 g onion ÷ 4.54 kg = 3.31 g/kg.",
          },
          {
            label: "3",
            explanation:
              "Interpret dose: 3.31 g/kg indicates moderate risk of toxicity; veterinary evaluation recommended.",
          },
        ],
        result:
          "The cat has ingested a moderate toxic dose of onion, warranting close monitoring and veterinary consultation.",
      }}
      relatedCalculators={[
        {
          title: "Fluid Intake vs. Urine Output Balance Checker",
          url: "/pets/cat-fluid-intake-urine-output-balance",
          icon: "🐾",
        },
        {
          title: "Horse Hay Intake Calculator (per body weight %)",
          url: "/pets/horse-hay-intake-bodyweight-percent",
          icon: "🐎",
        },
        {
          title: "Cat Grape/Raisin Exposure Risk (educational)",
          url: "/pets/cat-grape-raisin-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Multi-Cat Litter Box Count Calculator",
          url: "/pets/multi-cat-litter-box-count-calculator",
          icon: "🐱",
        },
        {
          title: "Meloxicam Dose Calculator for Cats",
          url: "/pets/cat-meloxicam-dose",
          icon: "🐱",
        },
        {
          title: "Play Session Planner (Feather/Chase Time Targets)",
          url: "/pets/cat-play-session-planner",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Onion/Garlic Toxicity Calculator" },
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
