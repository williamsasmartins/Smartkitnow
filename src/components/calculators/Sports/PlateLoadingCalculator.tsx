import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Activity,
  Timer,
  TrendingUp,
  Dumbbell,
  Trophy,
  Medal,
  Flag,
  Flame,
  Zap,
  Heart,
  Scale,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Waves,
  Gauge,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const PLATE_SIZES_LBS = [45, 35, 25, 10, 5, 2.5];
const PLATE_SIZES_KG = [25, 20, 15, 10, 5, 2.5, 1.25];

export default function PlateLoadingCalculator() {
  const [inputs, setInputs] = useState({
    targetWeight: "",
    barWeight: "",
    unit: "lbs",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate plate loading breakdown
  const results = useMemo(() => {
    const targetWeight = parseFloat(inputs.targetWeight);
    const barWeight = parseFloat(inputs.barWeight);
    const unit = inputs.unit;

    if (isNaN(targetWeight) || isNaN(barWeight) || targetWeight <= 0 || barWeight <= 0) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for target and bar weight.",
        formulaUsed: null,
        plates: null,
      };
    }

    if (barWeight >= targetWeight) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Target weight must be greater than bar weight.",
        formulaUsed: null,
        plates: null,
      };
    }

    // Weight to load on each side of the bar
    const weightToLoad = (targetWeight - barWeight) / 2;

    if (weightToLoad <= 0) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Target weight must be greater than bar weight.",
        formulaUsed: null,
        plates: null,
      };
    }

    // Select plate sizes based on unit
    const plateSizes = unit === "lbs" ? PLATE_SIZES_LBS : PLATE_SIZES_KG;

    let remaining = weightToLoad;
    const platesCount = {};

    for (const plate of plateSizes) {
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        platesCount[plate] = count;
        remaining -= plate * count;
        // Fix floating point precision issues
        remaining = Math.round(remaining * 100) / 100;
      }
    }

    // If remaining weight is not zero, loading is not exact
    const isExact = remaining === 0;

    const platesArray = Object.entries(platesCount)
      .map(([plate, count]) => ({ plate: parseFloat(plate), count }))
      .sort((a, b) => b.plate - a.plate);

    return {
      value: `${targetWeight} ${unit.toUpperCase()}`,
      label: `Bar Weight: ${barWeight} ${unit.toUpperCase()}`,
      subtext: isExact
        ? "Exact plate loading calculated."
        : `Approximate loading. ${remaining} ${unit} cannot be matched with available plates.`,
      warning: null,
      formulaUsed:
        "Weight to load on each side = (Target Weight - Bar Weight) / 2; Plates chosen from largest to smallest to match load.",
      plates: platesArray,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is the bar weight important in plate loading calculations?",
      answer:
        "The bar weight is essential because the total target weight includes both the bar and the plates. To calculate the correct plates to load, you must subtract the bar weight from the target weight and then divide the remainder by two (for each side of the bar). Ignoring the bar weight will result in inaccurate plate loading and potentially unsafe lifting.",
    },
    {
      question: "What should I do if the calculator shows a remaining weight that cannot be matched?",
      answer:
        "If the calculator indicates a remaining weight that cannot be matched with available plates, it means the exact target weight is not achievable with your current plate set. You can either adjust your target weight to the nearest achievable weight or consider acquiring plates of smaller denominations to improve precision.",
    },
    {
      question: "Can I use this calculator for both pounds and kilograms?",
      answer:
        "Yes, this calculator supports both pounds (lbs) and kilograms (kg). Simply select your preferred unit from the dropdown menu. The plate sizes will adjust accordingly to standard plates used in each measurement system, ensuring accurate plate loading recommendations.",
    },
    {
      question: "How does the calculator handle fractional plate weights?",
      answer:
        "The calculator uses standard fractional plate sizes such as 2.5 lbs or 1.25 kg to achieve precise loading. It attempts to minimize the remaining unmatched weight by selecting plates from largest to smallest. However, due to plate availability, some fractional weights may not be perfectly matched, which will be indicated in the results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="targetWeight" className="flex items-center gap-1">
                Target Weight <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="targetWeight"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 225"
                value={inputs.targetWeight}
                onChange={(e) => handleInputChange("targetWeight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="barWeight" className="flex items-center gap-1">
                Bar Weight <Dumbbell className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="barWeight"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 45"
                value={inputs.barWeight}
                onChange={(e) => handleInputChange("barWeight", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="unit" className="flex items-center gap-1">
                Unit <Calculator className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.unit}
                onValueChange={(v) => handleInputChange("unit", v)}
                id="unit"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation by updating state with same values
            setInputs((p) => ({ ...p }));
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ targetWeight: "", barWeight: "", unit: "lbs" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700">
          <CardContent className="text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="inline-block mr-2 w-5 h-5" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm italic text-blue-600 dark:text-blue-400 mt-1">{results.subtext}</p>

            {results.plates && results.plates.length > 0 && (
              <div className="mt-6 text-left max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-300">
                  <Scale className="w-5 h-5" /> Plates per side:
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-900 dark:text-blue-200">
                  {results.plates.map(({ plate, count }) => (
                    <li key={plate}>
                      {count} × {plate} {inputs.unit.toUpperCase()} plate{count > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-6 text-xs text-blue-700 dark:text-blue-400 italic">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Plate Loading Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Plate Loading Calculator is an essential tool for lifters, coaches, and strength athletes who want to
          determine the exact combination of weight plates needed to reach a specific target weight on a barbell.
          Whether you are preparing for a competition, training session, or just want to optimize your lifting setup,
          this calculator simplifies the process by breaking down the total weight into manageable plate increments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator takes into account the weight of the barbell itself, which is a critical factor often
          overlooked. Since the total target weight includes both the bar and the plates, subtracting the bar weight
          ensures that the plates loaded on each side are balanced and accurate. This prevents underloading or
          overloading, which can affect performance and safety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          It supports both pounds (lbs) and kilograms (kg), adapting plate sizes accordingly to standard gym equipment.
          The calculator uses a greedy algorithm to select plates from the largest available to the smallest, aiming
          to minimize leftover weight that cannot be matched with available plates.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By providing a clear breakdown of plates per side, this tool helps lifters load their bars quickly and
          confidently, reducing setup time and allowing more focus on training and performance.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Plate Loading Calculator is straightforward and designed for both beginners and experienced lifters.
          Start by entering your target total weight — this is the combined weight of the barbell and plates you want
          to lift. Next, input the weight of your barbell, which is typically 45 lbs for standard Olympic bars or 20 kg
          for standard metric bars, but may vary depending on your equipment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Select your preferred unit of measurement, either pounds (lbs) or kilograms (kg). The calculator will then
          automatically adjust the plate sizes it considers based on your selection. After entering these values,
          click the "Calculate" button to generate the plate loading breakdown.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The results will display the total target weight, the bar weight, and a detailed list of plates to load on
          each side of the barbell. If the exact target weight cannot be matched with your available plates, the
          calculator will indicate the remaining unmatched weight, helping you decide whether to adjust your target or
          acquire additional plates.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your desired total target weight (bar + plates).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your barbell weight.
          </li>
          <li>
            <strong>Step 3:</strong> Select the unit of measurement (lbs or kg).
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the plate loading breakdown per side.
          </li>
          <li>
            <strong>Step 5:</strong> Load the plates as indicated, ensuring safety and balance.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Efficient plate loading not only saves time but also helps maintain focus and safety during training.
          Always double-check your plate loading before lifting to ensure balance and accuracy. Using collars or clamps
          to secure plates is essential to prevent shifting during lifts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When training for strength progression, consider rounding your target weights to the nearest achievable plate
          combination to avoid frustration and maintain consistent overload. If your gym has limited plate sizes,
          acquiring fractional plates (e.g., 1.25 kg or 2.5 lbs) can help you make smaller incremental jumps.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For competitive lifters, practicing plate loading with your coach or training partners can improve efficiency
          during meets. Familiarity with your equipment and plate sizes reduces setup time and mental load.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Lastly, always prioritize safety: use spotters when lifting heavy, and never sacrifice form or control for
          heavier weights.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.usaweightlifting.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Weightlifting <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official governing body for Olympic weightlifting in the United States, providing resources on
              equipment standards and training.
            </p>
          </li>
          <li>
            <a
              href="https://www.strengthlevel.com/plate-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              StrengthLevel Plate Calculator <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A popular online tool for calculating plate loading, useful for comparison and understanding plate
              combinations.
            </p>
          </li>
          <li>
            <a
              href="https://www.exrx.net/WeightExercises/WeightliftingEquipment"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              ExRx Weightlifting Equipment Guide <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide on weightlifting equipment, including barbell and plate specifications.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plate Loading Calculator"
      description="Calculate barbell plate loading. Find the exact combination of plates needed to reach a specific target weight on the bar."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "Weight to load on each side = (Target Weight - Bar Weight) / 2; Plates selected from largest to smallest to match load.",
        variables: [
          { symbol: "Target Weight", description: "Total desired weight including bar and plates" },
          { symbol: "Bar Weight", description: "Weight of the barbell alone" },
          { symbol: "Weight to load", description: "Weight to be loaded on each side of the barbell" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You want to load a total of 225 lbs on a standard 45 lb barbell. What plates do you need on each side?",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Subtract the bar weight from the target weight: 225 - 45 = 180 lbs to be loaded on plates.",
          },
          {
            label: "Step 2",
            explanation:
              "Divide by two to get the weight per side: 180 / 2 = 90 lbs per side.",
          },
          {
            label: "Step 3",
            explanation:
              "Select plates starting from the largest: 2 × 45 lbs plates per side equals 90 lbs.",
          },
        ],
        result: "Load two 45 lbs plates on each side of the barbell to reach 225 lbs total.",
      }}
      relatedCalculators={[
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "Macronutrient Calculator (Sports)", url: "/sports/macronutrient-calculator", icon: "🏆" },
        { title: "Baseball OPS / SLG / OBP Calculator", url: "/sports/baseball-ops-slg-obp", icon: "⚽" },
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}