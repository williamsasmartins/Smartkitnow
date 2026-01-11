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
import { convertWeight, formatNumberForInput, LB_PER_KG } from "@/lib/utils";

export default function HorseHayIntakeBodyweightPercentCalculator() {
  // 1. STATE
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));

  // Inputs: weight only, since hay intake is % of body weight
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Hay intake recommended range: 1.5% to 2.5% of body weight daily (dry matter basis)
  // Convert input weight to kg internally for veterinary standard, but display results in same unit as input
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / LB_PER_KG : weightRaw;

    // Calculate hay intake range in kg
    const minHayKg = weightKg * 0.015; // 1.5%
    const maxHayKg = weightKg * 0.025; // 2.5%

    // Convert back to lbs if imperial
    const minHay = unit === "imperial" ? minHayKg * LB_PER_KG : minHayKg;
    const maxHay = unit === "imperial" ? maxHayKg * LB_PER_KG : maxHayKg;

    // Format to 2 decimals
    const minHayFormatted = minHay.toFixed(2);
    const maxHayFormatted = maxHay.toFixed(2);

    return {
      value: `${minHayFormatted} - ${maxHayFormatted}`,
      label: `Recommended Daily Hay Intake (${unit === "imperial" ? "lbs" : "kg"})`,
      subtext:
        "This range represents 1.5% to 2.5% of your horse's body weight, which is the typical daily hay intake recommended by veterinary nutritionists.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is hay intake calculated as a percentage of body weight?",
      answer:
        "Calculating hay intake as a percentage of body weight ensures that feeding amounts are tailored to the individual horse's size and nutritional needs. This method accounts for variations in metabolism, workload, and health status. Using body weight percentage helps prevent underfeeding or overfeeding, promoting optimal digestive health and weight maintenance.",
    },
    {
      question: "What factors can influence a horse's hay intake requirements?",
      answer:
        "Several factors affect hay intake including the horse's age, activity level, metabolic rate, and physiological status such as pregnancy or lactation. Environmental conditions like temperature and humidity also play a role. Additionally, the quality and nutrient density of the hay can alter how much a horse needs to consume to meet its energy requirements.",
    },
    {
      question: "Can feeding more than 2.5% of body weight in hay be harmful?",
      answer:
        "Feeding hay beyond 2.5% of body weight is generally unnecessary and may lead to excessive calorie intake, resulting in unwanted weight gain or digestive upset. However, some horses with high energy demands, such as performance or lactating horses, might require more. It is important to consult a veterinarian or equine nutritionist to tailor feeding plans safely.",
    },
    {
      question: "How often should hay intake be adjusted for a horse?",
      answer:
        "Hay intake should be regularly reassessed based on changes in the horse’s weight, workload, health status, and forage quality. Seasonal changes and growth phases also necessitate adjustments. Frequent monitoring helps maintain ideal body condition and prevents nutritional imbalances or digestive issues.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "imperial" && next !== "metric") return;
              setInputs((prev) => {
                const num = parseFloat(prev.weight);
                if (!prev.weight || Number.isNaN(num) || num <= 0) return prev;
                const fromUnit = unit === "imperial" ? "lb" : "kg";
                const toUnit = next === "imperial" ? "lb" : "kg";
                const converted = convertWeight(num, fromUnit, toUnit);
                return { ...prev, weight: formatNumberForInput(converted, 2) };
              });
              setUnit(next);
              setPreferredWeightUnit(next === "imperial" ? "lb" : "kg");
            }}
          >
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

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Horse Body Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weightHelp"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating inputs state (already done onChange)
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

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Horse Hay Intake Calculator (per body weight %)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Horse Hay Intake Calculator estimates the daily amount of hay a horse should consume based on its body weight. Hay is a primary source of fiber and nutrients essential for equine digestive health and overall well-being. By calculating intake as a percentage of body weight, this tool provides a personalized feeding guideline that aligns with veterinary nutritional standards.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Typically, horses require between 1.5% to 2.5% of their body weight in hay daily, depending on factors such as age, workload, and physiological status. This range ensures adequate fiber intake to maintain gut motility and prevent digestive disorders like colic or gastric ulcers. Feeding within this range supports optimal body condition and energy balance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator simplifies complex nutritional recommendations into an easy-to-use format for horse owners, trainers, and veterinarians. It emphasizes the importance of adjusting hay intake according to individual horse needs rather than relying on generic feeding amounts. Proper hay management is a cornerstone of equine health and performance.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires only one input: your horse's current body weight. Select the appropriate unit system (Imperial or Metric) and enter the weight accurately. The calculator will then provide a recommended daily hay intake range expressed in the same unit system.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the unit system that matches how you measure your horse’s weight (pounds or kilograms).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the horse’s body weight in the input field. Ensure the weight is current and accurate for best results.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to see the recommended daily hay intake range, which reflects 1.5% to 2.5% of the horse’s body weight.
          </li>
          <li>
            <strong>Step 4:</strong> Use this range as a guideline to adjust your horse’s feeding plan, and consult a veterinarian for personalized advice.
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
              href="https://aaep.org/guidelines/nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. AAEP Guidelines on Equine Nutrition
            </a>
            <p className="text-slate-500 text-sm">
              The American Association of Equine Practitioners provides comprehensive guidelines on feeding practices, including hay intake recommendations based on body weight and physiological needs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.extension.umn.edu/agriculture/equine/nutrition/feeding-horses/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. University of Minnesota Extension: Feeding Horses
            </a>
            <p className="text-slate-500 text-sm">
              This resource outlines practical feeding strategies for horses, emphasizing the importance of forage intake as a percentage of body weight to maintain digestive health and energy balance.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/management-and-nutrition/nutrition-horses/feeding-horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual: Feeding Horses
            </a>
            <p className="text-slate-500 text-sm">
              A detailed veterinary manual discussing nutritional requirements for horses, including recommended hay intake ranges and factors influencing dietary needs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Hay Intake Calculator (per body weight %)"
      description="Determine the recommended minimum and maximum hay intake as a percentage of the horse's body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Hay Intake (kg) = Body Weight (kg) × Intake Percentage (0.015 to 0.025)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Horse's body weight in kilograms" },
          { symbol: "Intake Percentage", description: "Recommended hay intake as a decimal percentage of body weight (1.5% to 2.5%)" },
          { symbol: "Hay Intake (kg)", description: "Daily hay intake in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) horse requires daily hay intake estimation to maintain optimal health and energy balance.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert body weight to kilograms if needed (1100 lb ÷ 2.20462 = 499 kg).",
          },
          {
            label: "2",
            explanation:
              "Calculate minimum hay intake: 499 kg × 0.015 = 7.49 kg.",
          },
          {
            label: "3",
            explanation:
              "Calculate maximum hay intake: 499 kg × 0.025 = 12.48 kg.",
          },
          {
            label: "4",
            explanation:
              "Convert hay intake back to pounds if desired (7.49 kg × 2.20462 = 16.5 lb to 12.48 kg × 2.20462 = 27.5 lb).",
          },
        ],
        result:
          "The horse should consume between 16.5 and 27.5 pounds (7.5 to 12.5 kg) of hay daily to meet its nutritional needs.",
      }}
      relatedCalculators={[
        { title: "Calcium Intake Limit (Bladder Stone Prevention)", url: "/pets/small-mammal-calcium-intake-limit", icon: "🐾" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs", url: "/pets/dog-omega-3-epa-dha-supplement", icon: "🐶" },
        { title: "Cat Pregnancy (Gestation) Due-Date Calculator", url: "/pets/cat-pregnancy-gestation-due-date", icon: "🐱" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats", url: "/pets/cat-omega-3-epa-dha-supplement", icon: "🐱" },
        { title: "Multi-Cat Litter Box Count Calculator", url: "/pets/multi-cat-litter-box-count-calculator", icon: "🐱" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Hay Intake Calculator (per body weight %)" },
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
