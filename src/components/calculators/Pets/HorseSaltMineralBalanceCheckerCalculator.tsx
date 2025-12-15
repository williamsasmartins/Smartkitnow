import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseSaltMineralBalanceCheckerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight, salt intake, calcium intake, phosphorus intake, magnesium intake, sodium intake, potassium intake (all daily intake in grams or mg)
  // We will ask for weight and daily intake of salt and minerals in grams (or mg for micro-minerals)
  // For simplicity, all mineral intakes will be in grams (converted internally to mg/kg BW)
  const [inputs, setInputs] = useState({
    weight: "",
    saltIntake: "",
    calciumIntake: "",
    phosphorusIntake: "",
    magnesiumIntake: "",
    sodiumIntake: "",
    potassiumIntake: "",
  });

  // 2. LOGIC ENGINE
  // Reference requirements (mg/kg BW/day) for adult horses (approximate values from NRC and veterinary sources):
  // Salt (NaCl): 0.5 g/kg BW/day (500 mg/kg)
  // Calcium: 30 mg/kg BW/day
  // Phosphorus: 20 mg/kg BW/day
  // Magnesium: 10 mg/kg BW/day
  // Sodium: 50 mg/kg BW/day
  // Potassium: 60 mg/kg BW/day
  //
  // Calculate intake per kg BW and compare to requirement, then calculate balance %
  // Balance % = (Intake / Requirement) * 100
  // Warning if < 90% or > 110% (deficiency or excess)
  //
  // Output: For each mineral, show balance % and status (Deficient, Adequate, Excess)

  const results = useMemo(() => {
    const parseInput = (val: string) => {
      const n = parseFloat(val);
      return isNaN(n) || n < 0 ? null : n;
    };

    const weightRaw = parseInput(inputs.weight);
    if (!weightRaw) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: null,
        warning: null,
        details: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Parse mineral intakes in grams (salt, Ca, P, Mg, Na, K)
    // If any input missing, treat as 0
    const saltIntake = parseInput(inputs.saltIntake) ?? 0; // grams
    const calciumIntake = parseInput(inputs.calciumIntake) ?? 0; // grams
    const phosphorusIntake = parseInput(inputs.phosphorusIntake) ?? 0; // grams
    const magnesiumIntake = parseInput(inputs.magnesiumIntake) ?? 0; // grams
    const sodiumIntake = parseInput(inputs.sodiumIntake) ?? 0; // grams
    const potassiumIntake = parseInput(inputs.potassiumIntake) ?? 0; // grams

    // Convert grams to mg
    const gToMg = (g: number) => g * 1000;

    // Requirements mg/kg BW/day
    const req = {
      salt: 500, // mg/kg
      calcium: 30,
      phosphorus: 20,
      magnesium: 10,
      sodium: 50,
      potassium: 60,
    };

    // Intake mg/kg BW/day
    const intakeMgPerKg = {
      salt: gToMg(saltIntake) / weightKg,
      calcium: gToMg(calciumIntake) / weightKg,
      phosphorus: gToMg(phosphorusIntake) / weightKg,
      magnesium: gToMg(magnesiumIntake) / weightKg,
      sodium: gToMg(sodiumIntake) / weightKg,
      potassium: gToMg(potassiumIntake) / weightKg,
    };

    // Calculate balance %
    const balancePercent = {
      salt: (intakeMgPerKg.salt / req.salt) * 100,
      calcium: (intakeMgPerKg.calcium / req.calcium) * 100,
      phosphorus: (intakeMgPerKg.phosphorus / req.phosphorus) * 100,
      magnesium: (intakeMgPerKg.magnesium / req.magnesium) * 100,
      sodium: (intakeMgPerKg.sodium / req.sodium) * 100,
      potassium: (intakeMgPerKg.potassium / req.potassium) * 100,
    };

    // Status helper
    const getStatus = (pct: number) => {
      if (pct < 90) return "Deficient";
      if (pct > 110) return "Excess";
      return "Adequate";
    };

    // Compose details string for UI
    const details = Object.entries(balancePercent).map(([mineral, pct]) => {
      const status = getStatus(pct);
      return {
        mineral,
        percent: pct.toFixed(0),
        status,
      };
    });

    // Check if any mineral is deficient or excess to show warning
    const deficient = details.filter((d) => d.status === "Deficient");
    const excess = details.filter((d) => d.status === "Excess");

    let warning = null;
    if (deficient.length > 0 && excess.length > 0) {
      warning =
        "Some minerals are deficient while others are in excess. Adjust diet carefully to balance all minerals.";
    } else if (deficient.length > 0) {
      warning = `Deficiency detected in: ${deficient
        .map((d) => d.mineral)
        .join(", ")}. Consult a veterinarian for dietary adjustments.`;
    } else if (excess.length > 0) {
      warning = `Excess intake detected in: ${excess
        .map((d) => d.mineral)
        .join(", ")}. Excess minerals can be harmful; seek veterinary advice.`;
    }

    return {
      value: 1,
      label: "Mineral Balance Summary",
      subtext: "Percent of daily requirement per kg body weight",
      warning,
      details,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is maintaining salt and mineral balance important for horses?",
      answer:
        "Salt and mineral balance is crucial for horses because these nutrients regulate vital physiological functions such as nerve transmission, muscle contraction, and hydration. An imbalance can lead to health issues like dehydration, muscle weakness, or metabolic disorders. Proper balance ensures optimal performance, growth, and overall well-being.",
    },
    {
      question: "How does body weight affect mineral requirements in horses?",
      answer:
        "Mineral requirements are typically calculated per kilogram of body weight to tailor nutrition to the individual horse's size. Larger horses need proportionally more minerals to support their metabolic needs, while smaller horses require less. This scaling helps prevent deficiencies or toxicities by providing accurate daily intake recommendations.",
    },
    {
      question: "What are the risks of excess mineral intake in horses?",
      answer:
        "Excess mineral intake can disrupt the delicate balance of electrolytes, potentially causing toxicity or interfering with the absorption of other nutrients. For example, too much calcium can impair phosphorus absorption, leading to skeletal problems. Monitoring intake prevents adverse effects and supports long-term health.",
    },
    {
      question: "How can I adjust my horse’s diet based on this mineral balance checker?",
      answer:
        "Use the checker results to identify which minerals are deficient or in excess relative to your horse’s needs. Adjust feed types, supplements, or salt blocks accordingly, aiming for a balanced intake. Always consult a veterinarian or equine nutritionist before making significant dietary changes to ensure safety and effectiveness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. INPUT HANDLERS
  const onChangeInput = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            value={inputs.weight}
            onChange={(e) => onChangeInput("weight", e.target.value)}
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>
        <div>
          <Label htmlFor="saltIntake" className="text-slate-700 dark:text-slate-300">
            Salt Intake (grams/day)
          </Label>
          <Input
            id="saltIntake"
            type="number"
            min={0}
            step="any"
            value={inputs.saltIntake}
            onChange={(e) => onChangeInput("saltIntake", e.target.value)}
            placeholder="e.g. 50"
          />
        </div>
        <div>
          <Label htmlFor="calciumIntake" className="text-slate-700 dark:text-slate-300">
            Calcium Intake (grams/day)
          </Label>
          <Input
            id="calciumIntake"
            type="number"
            min={0}
            step="any"
            value={inputs.calciumIntake}
            onChange={(e) => onChangeInput("calciumIntake", e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
        <div>
          <Label htmlFor="phosphorusIntake" className="text-slate-700 dark:text-slate-300">
            Phosphorus Intake (grams/day)
          </Label>
          <Input
            id="phosphorusIntake"
            type="number"
            min={0}
            step="any"
            value={inputs.phosphorusIntake}
            onChange={(e) => onChangeInput("phosphorusIntake", e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
        <div>
          <Label htmlFor="magnesiumIntake" className="text-slate-700 dark:text-slate-300">
            Magnesium Intake (grams/day)
          </Label>
          <Input
            id="magnesiumIntake"
            type="number"
            min={0}
            step="any"
            value={inputs.magnesiumIntake}
            onChange={(e) => onChangeInput("magnesiumIntake", e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
        <div>
          <Label htmlFor="sodiumIntake" className="text-slate-700 dark:text-slate-300">
            Sodium Intake (grams/day)
          </Label>
          <Input
            id="sodiumIntake"
            type="number"
            min={0}
            step="any"
            value={inputs.sodiumIntake}
            onChange={(e) => onChangeInput("sodiumIntake", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
        <div>
          <Label htmlFor="potassiumIntake" className="text-slate-700 dark:text-slate-300">
            Potassium Intake (grams/day)
          </Label>
          <Input
            id="potassiumIntake"
            type="number"
            min={0}
            step="any"
            value={inputs.potassiumIntake}
            onChange={(e) => onChangeInput("potassiumIntake", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              saltIntake: "",
              calciumIntake: "",
              phosphorusIntake: "",
              magnesiumIntake: "",
              sodiumIntake: "",
              potassiumIntake: "",
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
                {results.label}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-md mx-auto">
                {results.details?.map(({ mineral, percent, status }) => (
                  <div key={mineral} className="p-2 rounded-md border border-slate-300 dark:border-slate-700">
                    <p className="font-semibold capitalize text-blue-900 dark:text-blue-300">{mineral}</p>
                    <p className="text-lg font-extrabold text-blue-900 dark:text-white">{percent}%</p>
                    <p
                      className={`font-medium ${
                        status === "Adequate"
                          ? "text-green-700 dark:text-green-400"
                          : status === "Deficient"
                          ? "text-red-700 dark:text-red-400"
                          : "text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                ))}
              </div>
              {results.subtext && <p className="text-sm text-slate-500 mt-4">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
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
          Understanding Horse Salt & Mineral Balance Checker
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Horse Salt & Mineral Balance Checker is a specialized veterinary tool designed to evaluate the adequacy of a horse’s daily intake of essential salts and minerals relative to its body weight. Proper mineral balance is fundamental for maintaining physiological functions such as muscle contraction, nerve impulses, hydration, and bone health. This tool helps caretakers and veterinarians identify potential deficiencies or excesses that could impact equine health and performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting the horse’s weight and daily intake of key minerals including salt, calcium, phosphorus, magnesium, sodium, and potassium, the calculator compares these values against established veterinary nutritional requirements expressed per kilogram of body weight. This approach ensures personalized assessment tailored to the individual horse’s size and metabolic demands. The results provide a clear percentage balance and highlight areas requiring dietary adjustment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Maintaining an optimal mineral balance is critical to prevent health complications such as electrolyte imbalances, skeletal disorders, or metabolic dysfunctions. This checker serves as an educational and practical resource to guide feeding strategies, supplement use, and veterinary consultations, ultimately supporting the horse’s long-term health, athletic ability, and welfare.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use the Horse Salt & Mineral Balance Checker, begin by selecting the unit system that corresponds to your measurement preference: Imperial (pounds) or Metric (kilograms). Enter the horse’s current body weight accurately, as this is essential for calculating mineral requirements on a per kilogram basis. Next, input the daily intake amounts of salt and each mineral in grams, based on feed analysis or supplement labels.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) and enter the horse’s weight.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the daily intake of salt, calcium, phosphorus, magnesium, sodium, and potassium in grams.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to view the percentage balance of each mineral relative to recommended daily requirements.
          </li>
          <li>
            <strong>Step 4:</strong> Review the results and any warnings indicating deficiencies or excesses, then adjust the horse’s diet or supplements accordingly.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Always consult a qualified veterinarian or equine nutritionist before making significant changes to your horse’s diet based on these results. This calculator is intended as a guide to support informed decision-making and promote optimal equine health.
        </p>
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
              href="https://www.nap.edu/read/11653/chapter/12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Nutrient Requirements of Horses, 6th Edition - National Research Council (NRC)
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on equine nutrition including detailed mineral requirements and feeding recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/management-and-nutrition/nutrition/equine-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Equine Nutrition - Merck Veterinary Manual
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource covering mineral metabolism, dietary needs, and clinical considerations in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.extension.org/pages/Equine-Nutrition:-Minerals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Equine Nutrition: Minerals - eXtension Foundation
            </a>
            <p className="text-slate-500 text-sm">
              Practical insights into mineral nutrition, deficiency signs, and supplementation strategies for horses.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Salt & Mineral Balance Checker"
      description="Check the daily intake of salt and essential macro/micro-minerals against required nutritional levels."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Mineral Balance (%) = (Daily Intake mg/kg BW ÷ Requirement mg/kg BW) × 100",
        variables: [
          { symbol: "Daily Intake mg/kg BW", description: "Amount of mineral consumed per kilogram of body weight" },
          { symbol: "Requirement mg/kg BW", description: "Recommended daily mineral requirement per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) horse consumes 55 g of salt, 15 g calcium, 10 g phosphorus, 5 g magnesium, 6 g sodium, and 8 g potassium daily. Assess the mineral balance.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (1100 lb ≈ 500 kg). Calculate intake per kg BW (e.g., salt: 55,000 mg ÷ 500 kg = 110 mg/kg).",
          },
          {
            label: "2",
            explanation:
              "Compare intake per kg BW to requirements (salt requirement = 500 mg/kg). Calculate balance % (110 ÷ 500 × 100 = 22%).",
          },
          {
            label: "3",
            explanation:
              "Repeat for each mineral and interpret results to identify deficiencies or excesses.",
          },
        ],
        result:
          "Salt intake is deficient at 22% of requirement, indicating supplementation is needed. Other minerals can be similarly evaluated for balanced nutrition.",
      }}
      relatedCalculators={[
        { title: "Basking Temperature & Gradient Planner", url: "/pets/reptile-basking-temperature-gradient-planner", icon: "🐾" },
        { title: "Puppy Adult Size Predictor (Weight Curve)", url: "/pets/puppy-adult-size-predictor-weight-curve", icon: "🐶" },
        { title: "Prednisolone Dose Calculator for Cats", url: "/pets/cat-prednisolone-dose", icon: "🐱" },
        { title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)", url: "/pets/dog-human-medication-exposure-alert", icon: "🐶" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Dog Pregnancy (Gestation) Due-Date Calculator", url: "/pets/dog-pregnancy-gestation-due-date", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Salt & Mineral Balance Checker" },
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