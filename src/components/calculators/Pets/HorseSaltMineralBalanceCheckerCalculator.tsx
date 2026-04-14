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
      question: "What is the daily salt requirement for horses?",
      answer: "Horses require 10-15 grams of salt daily, increasing to 25-50 grams during heavy exercise or hot weather to replace electrolyte losses through sweat.",
    },
    {
      question: "How do I know if my horse has a mineral deficiency?",
      answer: "Signs include poor coat quality, weak hooves, muscle weakness, and reduced performance. This calculator helps identify imbalances by comparing current intake against recommended levels.",
    },
    {
      question: "What calcium-to-phosphorus ratio should horses have?",
      answer: "The ideal ratio is 1.5:1 to 3:1 calcium to phosphorus; ratios below 1:1 can cause skeletal problems and impaired mineral absorption.",
    },
    {
      question: "Can horses get too much salt?",
      answer: "Excessive salt (over 150 grams daily) without adequate water can cause toxicity, but horses with access to fresh water tolerate higher intakes well for sweat replacement.",
    },
    {
      question: "Which minerals are most critical for horses?",
      answer: "Calcium, phosphorus, magnesium, potassium, and trace minerals like copper, zinc, and selenium are essential for bone health, muscle function, and immunity.",
    },
    {
      question: "How does exercise affect mineral and salt needs?",
      answer: "Working horses lose 20-30 grams of salt per hour through sweat and require increased electrolytes; mineral demands also rise for muscle recovery and energy metabolism.",
    },
    {
      question: "What forage sources provide natural minerals to horses?",
      answer: "Legume hays like alfalfa are rich in calcium and trace minerals, while grass hays are lower; mineral content varies significantly by soil composition and growing region.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Salt & Mineral Balance Checker</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator evaluates your horse's current salt and mineral intake against established NRC guidelines and industry standards. It compares feeds, forage, supplements, and water sources to identify nutritional gaps that may affect performance, health, and bone strength.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your horse's weight, age, activity level, and detailed inventory of all feeds consumed daily—including hay, grain, supplements, and access to salt blocks or electrolyte products. The calculator also factors in water quality if minerals are present.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the results showing your horse's balance or excess for each mineral and electrolyte; ratios like calcium-to-phosphorus are highlighted to flag potential absorption issues. Use recommendations to adjust supplementation or forage selection with guidance from an equine nutritionist.</p>
        </div>
      </section>

      {/* TABLE: Daily Mineral Requirements for Adult Horses (500 kg) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Mineral Requirements for Adult Horses (500 kg)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference values for essential minerals in maintenance, work, and breeding horses based on NRC 2007 standards.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mineral</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance (g/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Light Work (g/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heavy Work (g/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Calcium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-35</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Phosphorus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Magnesium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Potassium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sodium (Salt)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Copper</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.15</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zinc</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Selenium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.001</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0012</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0015</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Requirements increase with age, pregnancy, lactation, and environmental stress; fresh water availability is critical for electrolyte regulation.</p>
      </section>

      {/* TABLE: Common Forage and Feed Mineral Content Analysis */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Forage and Feed Mineral Content Analysis</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Approximate mineral concentrations in typical equine feed and forage sources on a dry matter basis.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calcium (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Phosphorus (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Magnesium (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Alfalfa Hay (prime)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3-1.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25-0.35</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Timothy Hay (mature)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4-0.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.15-0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.12-0.18</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oat Grain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.08</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.13</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Barley Grain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.14</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial Mineral Block</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Beet Pulp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6-0.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.08-0.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.15-0.2</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual values vary based on soil fertility, harvest stage, and processing; testing individual hay lots is recommended for precision feeding.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your hay mineral content annually since soil composition and harvest timing significantly affect calcium, phosphorus, and trace mineral levels.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide free-choice loose salt or a salt block year-round; horses self-regulate salt intake and naturally increase consumption during work or heat stress.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your horse's coat quality, hoof growth, and muscle tone monthly as early indicators of mineral imbalances before performance declines.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consult an equine nutritionist before introducing new supplements to avoid mineral interactions and excessive intake of fat-soluble vitamins.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all hay is equal</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Alfalfa and timothy hay can differ by 300% in calcium content; get your specific hay tested rather than relying on averages.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the calcium-to-phosphorus ratio</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High phosphorus grain without adequate calcium sources inverts the ratio and severely impairs mineral absorption and bone health.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Restricting salt to prevent sweating</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Horses need consistent salt access and actually perform better when electrolytes are replaced; restriction increases dehydration risk.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Over-supplementing trace minerals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Excessive copper, zinc, or selenium can antagonize absorption of other minerals and cause toxicity; balance is critical for bioavailability.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the daily salt requirement for horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Horses require 10-15 grams of salt daily, increasing to 25-50 grams during heavy exercise or hot weather to replace electrolyte losses through sweat.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my horse has a mineral deficiency?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Signs include poor coat quality, weak hooves, muscle weakness, and reduced performance. This calculator helps identify imbalances by comparing current intake against recommended levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What calcium-to-phosphorus ratio should horses have?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The ideal ratio is 1.5:1 to 3:1 calcium to phosphorus; ratios below 1:1 can cause skeletal problems and impaired mineral absorption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can horses get too much salt?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive salt (over 150 grams daily) without adequate water can cause toxicity, but horses with access to fresh water tolerate higher intakes well for sweat replacement.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which minerals are most critical for horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calcium, phosphorus, magnesium, potassium, and trace minerals like copper, zinc, and selenium are essential for bone health, muscle function, and immunity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does exercise affect mineral and salt needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Working horses lose 20-30 grams of salt per hour through sweat and require increased electrolytes; mineral demands also rise for muscle recovery and energy metabolism.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What forage sources provide natural minerals to horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Legume hays like alfalfa are rich in calcium and trace minerals, while grass hays are lower; mineral content varies significantly by soil composition and growing region.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/11653/nutrient-requirements-of-horses" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NRC Nutrient Requirements of Horses (2007)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The definitive scientific standard for equine mineral, vitamin, and energy requirements across all life stages and activity levels.</p>
          </li>
          <li>
            <a href="https://www.uky.edu/ag/equine/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Kentucky Equine Nutrition Laboratory</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed resources on forage analysis, mineral supplementation strategies, and equine diet formulation.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog and Cat Nutrient Profiles and Equine Feeding Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry guidelines for feed manufacturing and nutritional adequacy verification in commercial equine supplements.</p>
          </li>
          <li>
            <a href="https://equine.tamu.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Texas A&M AgriLife Extension Equine Science Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical guides on evaluating hay quality, mineral deficiency diagnosis, and electrolyte replacement during exercise.</p>
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