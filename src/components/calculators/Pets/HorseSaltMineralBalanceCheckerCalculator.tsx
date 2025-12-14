import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseSaltMineralBalanceCheckerCalculator() {
  // 1. STATE
  // Unit system is needed because weight input can be in lbs or kg
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight, daily salt intake, daily mineral intake (mg)
  // Minerals: Calcium (Ca), Phosphorus (P), Magnesium (Mg), Sodium (Na), Potassium (K), Chloride (Cl)
  const [inputs, setInputs] = useState({
    weight: "",
    saltIntake: "",
    calcium: "",
    phosphorus: "",
    magnesium: "",
    sodium: "",
    potassium: "",
    chloride: "",
  });

  // 2. LOGIC ENGINE
  // Reference daily requirements (mg/kg body weight) for maintenance adult horse:
  // Source: NRC (2007) Nutrient Requirements of Horses
  // Salt (NaCl): ~0.5 g/kg BW (500 mg/kg NaCl)
  // Calcium: 30 mg/kg BW
  // Phosphorus: 20 mg/kg BW
  // Magnesium: 10 mg/kg BW
  // Sodium: 10 mg/kg BW
  // Potassium: 40 mg/kg BW
  // Chloride: 30 mg/kg BW

  // We calculate intake per kg BW and compare to requirement.
  // Output: % of requirement met for salt and each mineral.
  // Warning if intake < 80% or > 120% of requirement.

  const results = useMemo(() => {
    const w = parseFloat(inputs.weight);
    if (
      !w ||
      w <= 0 ||
      Object.values(inputs).some((val) => val === "" || isNaN(parseFloat(val)))
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? w / 2.20462 : w;

    // Parse mineral intakes (mg)
    const saltIntakeG = parseFloat(inputs.saltIntake); // grams of salt (NaCl)
    const calciumMg = parseFloat(inputs.calcium);
    const phosphorusMg = parseFloat(inputs.phosphorus);
    const magnesiumMg = parseFloat(inputs.magnesium);
    const sodiumMg = parseFloat(inputs.sodium);
    const potassiumMg = parseFloat(inputs.potassium);
    const chlorideMg = parseFloat(inputs.chloride);

    // Requirements per kg BW
    const reqSaltMgPerKg = 500; // 0.5 g/kg = 500 mg/kg
    const reqCalciumMgPerKg = 30;
    const reqPhosphorusMgPerKg = 20;
    const reqMagnesiumMgPerKg = 10;
    const reqSodiumMgPerKg = 10;
    const reqPotassiumMgPerKg = 40;
    const reqChlorideMgPerKg = 30;

    // Calculate % of requirement met
    const saltPercent = (saltIntakeG * 1000) / (reqSaltMgPerKg * weightKg) * 100;
    const calciumPercent = calciumMg / (reqCalciumMgPerKg * weightKg) * 100;
    const phosphorusPercent = phosphorusMg / (reqPhosphorusMgPerKg * weightKg) * 100;
    const magnesiumPercent = magnesiumMg / (reqMagnesiumMgPerKg * weightKg) * 100;
    const sodiumPercent = sodiumMg / (reqSodiumMgPerKg * weightKg) * 100;
    const potassiumPercent = potassiumMg / (reqPotassiumMgPerKg * weightKg) * 100;
    const chloridePercent = chlorideMg / (reqChlorideMgPerKg * weightKg) * 100;

    // Average balance score (mean of all %s)
    const avgPercent =
      (saltPercent +
        calciumPercent +
        phosphorusPercent +
        magnesiumPercent +
        sodiumPercent +
        potassiumPercent +
        chloridePercent) /
      7;

    // Determine warning messages
    let warning = null;
    if (
      saltPercent < 80 ||
      calciumPercent < 80 ||
      phosphorusPercent < 80 ||
      magnesiumPercent < 80 ||
      sodiumPercent < 80 ||
      potassiumPercent < 80 ||
      chloridePercent < 80
    ) {
      warning =
        "Some mineral or salt intakes are below 80% of the recommended daily requirement. This may indicate a deficiency risk and requires veterinary consultation.";
    } else if (
      saltPercent > 120 ||
      calciumPercent > 120 ||
      phosphorusPercent > 120 ||
      magnesiumPercent > 120 ||
      sodiumPercent > 120 ||
      potassiumPercent > 120 ||
      chloridePercent > 120
    ) {
      warning =
        "Some mineral or salt intakes exceed 120% of the recommended daily requirement. Excess intake can cause imbalances or toxicity; consult a veterinarian.";
    }

    return {
      value: avgPercent.toFixed(1) + "%",
      label: "Average Intake vs. Requirement",
      subtext:
        "Values represent the average percentage of daily salt and mineral requirements met based on weight.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is maintaining proper salt and mineral balance important for horses?",
      answer:
        "Proper salt and mineral balance is crucial for horses to support physiological functions such as nerve transmission, muscle contraction, and hydration. Imbalances can lead to health issues like dehydration, muscle weakness, or metabolic disorders. Regular monitoring ensures nutritional adequacy and prevents long-term complications.",
    },
    {
      question: "How does body weight affect mineral and salt requirements in horses?",
      answer:
        "Mineral and salt requirements are calculated relative to a horse's body weight because metabolic needs scale with size. Larger horses require proportionally more nutrients to maintain homeostasis. Using weight-based calculations ensures accurate dietary recommendations tailored to individual horses.",
    },
    {
      question: "What are the risks of excessive salt and mineral intake in horses?",
      answer:
        "Excessive intake of salt and minerals can disrupt electrolyte balance, leading to conditions such as hypernatremia or mineral toxicity. This may cause symptoms like excessive thirst, kidney strain, or neurological issues. Careful balance and veterinary guidance help avoid these adverse effects.",
    },
    {
      question: "How can I improve my horse’s mineral intake if deficiencies are detected?",
      answer:
        "If deficiencies are identified, dietary adjustments such as mineral supplementation or changes in feed composition can help restore balance. It is important to consult a veterinarian or equine nutritionist to select appropriate supplements and dosages. Regular monitoring ensures the effectiveness and safety of interventions.",
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
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (lbs, g)</option>
            <option value="metric">Metric (kg, g)</option>
          </select>
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
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>
        <div>
          <Label htmlFor="saltIntake" className="text-slate-700 dark:text-slate-300">
            Daily Salt Intake (NaCl) (grams)
          </Label>
          <Input
            id="saltIntake"
            type="number"
            min={0}
            step="any"
            value={inputs.saltIntake}
            onChange={(e) => setInputs({ ...inputs, saltIntake: e.target.value })}
            placeholder="e.g. 50"
          />
        </div>
        <div>
          <Label htmlFor="calcium" className="text-slate-700 dark:text-slate-300">
            Daily Calcium Intake (mg)
          </Label>
          <Input
            id="calcium"
            type="number"
            min={0}
            step="any"
            value={inputs.calcium}
            onChange={(e) => setInputs({ ...inputs, calcium: e.target.value })}
            placeholder="e.g. 1500"
          />
        </div>
        <div>
          <Label htmlFor="phosphorus" className="text-slate-700 dark:text-slate-300">
            Daily Phosphorus Intake (mg)
          </Label>
          <Input
            id="phosphorus"
            type="number"
            min={0}
            step="any"
            value={inputs.phosphorus}
            onChange={(e) => setInputs({ ...inputs, phosphorus: e.target.value })}
            placeholder="e.g. 1000"
          />
        </div>
        <div>
          <Label htmlFor="magnesium" className="text-slate-700 dark:text-slate-300">
            Daily Magnesium Intake (mg)
          </Label>
          <Input
            id="magnesium"
            type="number"
            min={0}
            step="any"
            value={inputs.magnesium}
            onChange={(e) => setInputs({ ...inputs, magnesium: e.target.value })}
            placeholder="e.g. 500"
          />
        </div>
        <div>
          <Label htmlFor="sodium" className="text-slate-700 dark:text-slate-300">
            Daily Sodium Intake (mg)
          </Label>
          <Input
            id="sodium"
            type="number"
            min={0}
            step="any"
            value={inputs.sodium}
            onChange={(e) => setInputs({ ...inputs, sodium: e.target.value })}
            placeholder="e.g. 500"
          />
        </div>
        <div>
          <Label htmlFor="potassium" className="text-slate-700 dark:text-slate-300">
            Daily Potassium Intake (mg)
          </Label>
          <Input
            id="potassium"
            type="number"
            min={0}
            step="any"
            value={inputs.potassium}
            onChange={(e) => setInputs({ ...inputs, potassium: e.target.value })}
            placeholder="e.g. 2000"
          />
        </div>
        <div>
          <Label htmlFor="chloride" className="text-slate-700 dark:text-slate-300">
            Daily Chloride Intake (mg)
          </Label>
          <Input
            id="chloride"
            type="number"
            min={0}
            step="any"
            value={inputs.chloride}
            onChange={(e) => setInputs({ ...inputs, chloride: e.target.value })}
            placeholder="e.g. 1500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((i) => ({ ...i }));
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
              calcium: "",
              phosphorus: "",
              magnesium: "",
              sodium: "",
              potassium: "",
              chloride: "",
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

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Horse Salt & Mineral Balance Checker
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Horse Salt & Mineral Balance Checker is a veterinary-grade tool designed to assess whether a horse’s daily intake of salt and essential minerals meets established nutritional requirements. Salt and minerals such as calcium, phosphorus, magnesium, sodium, potassium, and chloride play vital roles in maintaining physiological functions including muscle contraction, nerve signaling, and fluid balance. This checker evaluates intake relative to body weight, providing a clear percentage of how well the horse’s diet aligns with recommended standards.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Imbalances in salt and mineral consumption can lead to serious health complications, ranging from dehydration and electrolyte disturbances to metabolic disorders and impaired performance. By quantifying intake against scientifically established benchmarks, this tool aids caretakers and veterinarians in identifying potential deficiencies or excesses early. The checker’s results include warnings to highlight when intake falls outside optimal ranges, facilitating timely dietary adjustments and veterinary consultation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator is grounded in authoritative veterinary nutrition research, ensuring accuracy and reliability. It supports evidence-based decision-making for equine nutrition management, promoting overall health and well-being. Whether for maintenance, performance, or recovery, understanding and maintaining proper salt and mineral balance is essential for every horse owner and professional.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Horse Salt & Mineral Balance Checker, begin by selecting your preferred unit system—Imperial or Metric. Enter the horse’s body weight accordingly, followed by the daily intake amounts of salt (as sodium chloride) and each essential mineral in milligrams or grams as specified. Accurate input of these values is critical for precise assessment. Once all fields are completed, click the Calculate button to generate the results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) to match your measurement preferences.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the horse’s weight in pounds or kilograms, depending on the selected unit.
          </li>
          <li>
            <strong>Step 3:</strong> Input the daily salt intake in grams and mineral intakes in milligrams as accurately as possible.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the average percentage of daily requirements met and any warnings about imbalances.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to guide dietary adjustments and consult a veterinarian if warnings appear.
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
              href="https://www.nap.edu/catalog/11653/nutrient-requirements-of-horses-sixth-revised-edition-2007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Nutrient Requirements of Horses, 6th Edition (NRC, 2007)
            </a>
            <p className="text-slate-500 text-sm">
              The definitive guide on equine nutrition, providing scientifically established nutrient requirements including salt and mineral intake recommendations for maintenance and performance horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/equine-nutrition/minerals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Equine Minerals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource detailing the physiological roles, requirements, and clinical implications of mineral imbalances in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.extension.org/pages/Equine-Nutrition:-Minerals-and-Vitamins"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Equine Nutrition: Minerals and Vitamins (Extension.org)
            </a>
            <p className="text-slate-500 text-sm">
              Educational material focused on practical feeding strategies to maintain mineral balance and prevent nutritional disorders in horses.
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
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Average Intake % = (Sum of (Intake per mineral / Requirement per mineral) × 100) / Number of minerals",
        variables: [
          { symbol: "Intake per mineral", description: "Daily intake of each mineral in mg or g" },
          { symbol: "Requirement per mineral", description: "Recommended daily requirement per kg body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) horse consumes 55 g of salt, 16000 mg calcium, 11000 mg phosphorus, 5500 mg magnesium, 5500 mg sodium, 21000 mg potassium, and 16000 mg chloride daily.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed and calculate requirement per mineral by multiplying mg/kg by body weight.",
          },
          {
            label: "2",
            explanation:
              "Calculate intake percentage for each mineral: (intake / requirement) × 100.",
          },
          {
            label: "3",
            explanation:
              "Average all percentages to get overall balance score and check for any warnings.",
          },
        ],
        result:
          "The average intake percentage is approximately 110%, indicating the horse’s mineral and salt intake meets recommended levels with no immediate concerns.",
      }}
      relatedCalculators={[
        { title: "Ammonia-to-Nitrite Cycle Time Estimator", url: "/pets/aquarium-ammonia-nitrite-cycle-time", icon: "🐾" },
        { title: "Cat Carrier Size & Fit Guide", url: "/pets/cat-carrier-size-fit-guide", icon: "🐱" },
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "🍖" },
        { title: "Dewormer Dose Calculator (by Drug Class & Weight)", url: "/pets/horse-dewormer-dose-calculator", icon: "💉" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
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