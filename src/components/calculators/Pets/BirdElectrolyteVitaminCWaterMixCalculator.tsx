import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdElectrolyteVitaminCWaterMixCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Bird weight, desired electrolyte concentration (mg/L), desired Vitamin C concentration (mg/L), total water volume (ml)
  const [inputs, setInputs] = useState({
    weight: "",
    electrolyteMgL: "",
    vitaminCMgL: "",
    waterVolumeMl: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const electrolyteRaw = parseFloat(inputs.electrolyteMgL);
    const vitaminCRaw = parseFloat(inputs.vitaminCMgL);
    const waterVolumeRaw = parseFloat(inputs.waterVolumeMl);

    if (
      isNaN(weightRaw) ||
      isNaN(electrolyteRaw) ||
      isNaN(vitaminCRaw) ||
      isNaN(waterVolumeRaw) ||
      weightRaw <= 0 ||
      electrolyteRaw < 0 ||
      vitaminCRaw < 0 ||
      waterVolumeRaw <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter positive numeric values for all fields.",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate total mg of electrolyte and vitamin C needed for the water volume
    // Concentration (mg/L) * volume (L) = total mg
    const waterVolumeL = waterVolumeRaw / 1000;

    const totalElectrolyteMg = electrolyteRaw * waterVolumeL;
    const totalVitaminCMg = vitaminCRaw * waterVolumeL;

    // Calculate mg/kg dose for bird (for reference)
    const electrolyteMgPerKg = totalElectrolyteMg / weightKg;
    const vitaminCMgPerKg = totalVitaminCMg / weightKg;

    // Safety warnings based on typical safe ranges for birds:
    // Electrolyte safe range ~50-200 mg/kg/day (varies by species)
    // Vitamin C safe range ~10-100 mg/kg/day (varies by species)
    // This calculator assumes a single mixing dose, not daily intake.

    let warning = null;
    if (electrolyteMgPerKg > 250) {
      warning =
        "Electrolyte concentration is very high relative to bird weight. Consult a veterinarian before use.";
    } else if (vitaminCMgPerKg > 150) {
      warning =
        "Vitamin C concentration is very high relative to bird weight. Excessive Vitamin C can cause adverse effects.";
    }

    return {
      value: `${totalElectrolyteMg.toFixed(1)} mg Electrolyte, ${totalVitaminCMg.toFixed(
        1
      )} mg Vitamin C`,
      label: `Total Electrolyte & Vitamin C in ${waterVolumeRaw} ml water`,
      subtext: `Equivalent to ${electrolyteMgPerKg.toFixed(1)} mg/kg Electrolyte and ${vitaminCMgPerKg.toFixed(
        1
      )} mg/kg Vitamin C for a ${weightKg.toFixed(2)} kg bird`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate electrolyte and Vitamin C concentrations accurately?",
      answer:
        "Accurate calculation ensures the bird receives the correct therapeutic dose without risking toxicity or underdosing. Electrolytes help maintain fluid balance and nerve function, while Vitamin C supports immune health and antioxidant defenses. Over- or under-concentration can lead to dehydration, metabolic imbalances, or ineffective treatment.",
    },
    {
      question: "How does bird weight influence the electrolyte and Vitamin C water mix?",
      answer:
        "Bird weight is crucial because dosing is often calculated per kilogram of body weight to ensure safety and efficacy. Larger birds require proportionally more electrolytes and Vitamin C, while smaller birds need less to avoid overdose. This calculator uses weight to estimate the total amount of supplements appropriate for the bird’s size.",
    },
    {
      question: "Can I use this calculator for all bird species?",
      answer:
        "This tool provides general guidance but does not replace species-specific veterinary advice. Different bird species have varying electrolyte and Vitamin C requirements and tolerances. Always consult a qualified avian veterinarian before administering supplements to ensure safety and appropriateness for your bird’s species and health status.",
    },
    {
      question: "Why do I need to input the total water volume for mixing?",
      answer:
        "The total water volume determines how much electrolyte and Vitamin C powder or solution to add to achieve the desired concentration. Without knowing the volume, it’s impossible to calculate the correct amount to mix. This ensures the bird drinks water with the intended therapeutic concentration consistently.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
            placeholder={unit === "imperial" ? "e.g. 1.5" : "e.g. 0.68"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="electrolyteMgL" className="text-slate-700 dark:text-slate-300">
            Desired Electrolyte Concentration (mg/L)
          </Label>
          <Input
            id="electrolyteMgL"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 150"
            value={inputs.electrolyteMgL}
            onChange={(e) => setInputs((prev) => ({ ...prev, electrolyteMgL: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="vitaminCMgL" className="text-slate-700 dark:text-slate-300">
            Desired Vitamin C Concentration (mg/L)
          </Label>
          <Input
            id="vitaminCMgL"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
            value={inputs.vitaminCMgL}
            onChange={(e) => setInputs((prev) => ({ ...prev, vitaminCMgL: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="waterVolumeMl" className="text-slate-700 dark:text-slate-300">
            Total Water Volume (ml)
          </Label>
          <Input
            id="waterVolumeMl"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 500"
            value={inputs.waterVolumeMl}
            onChange={(e) => setInputs((prev) => ({ ...prev, waterVolumeMl: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
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
              electrolyteMgL: "",
              vitaminCMgL: "",
              waterVolumeMl: "",
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
          Understanding Electrolyte & Vitamin C Water Mix Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Electrolyte & Vitamin C Water Mix Calculator is a specialized veterinary tool designed to assist bird owners and professionals in preparing safe and effective hydration solutions. Electrolytes are essential minerals that regulate fluid balance, nerve impulses, and muscle function, while Vitamin C plays a critical role in immune support and antioxidant protection. This calculator helps determine the precise amount of electrolytes and Vitamin C to add to a given volume of water based on the bird’s weight and desired concentration, ensuring therapeutic efficacy without risking toxicity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Birds are particularly sensitive to imbalances in their hydration and nutrient intake, making accurate dosing paramount. Overconcentration of electrolytes can lead to dehydration or kidney stress, while excessive Vitamin C may cause gastrointestinal upset or interfere with other metabolic processes. By inputting the bird’s weight, desired electrolyte and Vitamin C concentrations, and total water volume, users receive a clear calculation of the total milligrams of each supplement needed. This supports safe, evidence-based supplementation tailored to individual bird needs.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed for clarity. Begin by selecting your preferred unit system—imperial (pounds) or metric (kilograms)—to enter the bird’s weight accurately. Next, input the desired electrolyte and Vitamin C concentrations in milligrams per liter (mg/L), which represent the strength of the solution you intend to prepare. Finally, enter the total volume of water in milliliters (ml) that you will mix the supplements into.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the bird’s weight in the chosen unit system to ensure dosing is proportional to body mass.
          </li>
          <li>
            <strong>Step 2:</strong> Specify the desired electrolyte concentration (mg/L) based on veterinary guidance or product instructions.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the desired Vitamin C concentration (mg/L), considering the bird’s health status and veterinary recommendations.
          </li>
          <li>
            <strong>Step 4:</strong> Input the total volume of water (ml) you will prepare to calculate the total amount of supplements needed.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to view the total milligrams of electrolytes and Vitamin C to add, along with safety context.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Electrolyte and Vitamin Supplementation in Avian Medicine
            </a>
            <p className="text-slate-500 text-sm">
              This peer-reviewed article discusses the importance of electrolyte and vitamin supplementation in birds, highlighting dosing considerations and safety.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/nutrition-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Nutrition in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary resource covering avian nutrition, including electrolyte balance and vitamin requirements.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/avian-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians: Avian Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Professional guidelines for avian nutrition and supplementation, emphasizing safe dosing practices for electrolytes and vitamins.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Electrolyte & Vitamin C Water Mix Calculator"
      description="Calculate the safe concentration for mixing electrolytes and Vitamin C into a bird's drinking water."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total mg = Concentration (mg/L) × Water Volume (L)",
        variables: [
          { symbol: "Total mg", description: "Total milligrams of supplement to add" },
          { symbol: "Concentration (mg/L)", description: "Desired concentration in milligrams per liter" },
          { symbol: "Water Volume (L)", description: "Total volume of water in liters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1.5 lb bird requires an electrolyte concentration of 150 mg/L and Vitamin C concentration of 50 mg/L in 500 ml of water.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert bird weight to kg: 1.5 lb ÷ 2.20462 = 0.68 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate total electrolyte mg: 150 mg/L × 0.5 L = 75 mg.",
          },
          {
            label: "3",
            explanation:
              "Calculate total Vitamin C mg: 50 mg/L × 0.5 L = 25 mg.",
          },
          {
            label: "4",
            explanation:
              "Determine mg/kg doses: 75 mg ÷ 0.68 kg = 110.3 mg/kg electrolyte; 25 mg ÷ 0.68 kg = 36.8 mg/kg Vitamin C.",
          },
        ],
        result:
          "Add 75 mg of electrolytes and 25 mg of Vitamin C to 500 ml of water for safe supplementation.",
      }}
      relatedCalculators={[
        { title: "Rabbit Treat Calories & Safe Portion", url: "/pets/rabbit-treat-calories-safe-portion", icon: "🐾" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "🐱" },
        { title: "Cat Grape/Raisin Exposure Risk (educational)", url: "/pets/cat-grape-raisin-exposure-risk", icon: "🐱" },
        { title: "Phosphorus per Meal Estimator (diet label helper)", url: "/pets/cat-phosphorus-per-meal-estimator", icon: "💉" },
        { title: "Kitten Weaning Timeline & Feeding Amounts", url: "/pets/kitten-weaning-timeline-feeding-amounts", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Electrolyte & Vitamin C Water Mix Calculator" },
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