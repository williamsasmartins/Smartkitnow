import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Activity, Timer, TrendingUp, Dumbbell, Trophy, Medal, Flag, Flame, Zap, Heart, Scale, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Waves, Gauge } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const PLATE_SIZES = [
  { label: "45 lb (20.4 kg)", value: 45 },
  { label: "35 lb (15.9 kg)", value: 35 },
  { label: "25 lb (11.3 kg)", value: 25 },
  { label: "10 lb (4.5 kg)", value: 10 },
  { label: "5 lb (2.3 kg)", value: 5 },
  { label: "2.5 lb (1.1 kg)", value: 2.5 },
];

const BARBELL_WEIGHT_OPTIONS = [
  { label: "45 lb (20.4 kg) Standard Barbell", value: 45 },
  { label: "35 lb (15.9 kg) Women's Barbell", value: 35 },
  { label: "15 lb (6.8 kg) Technique Bar", value: 15 },
  { label: "Other", value: 0 },
];

export default function PlateLoadingCalculator() {
  const [inputs, setInputs] = useState({
    targetWeight: "",
    barbellWeight: 45,
    unit: "lb",
  });
  const [customBarbellWeight, setCustomBarbellWeight] = useState("");

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Convert input strings to numbers safely
  const targetWeightNum = parseFloat(inputs.targetWeight);
  const barbellWeightNum =
    inputs.barbellWeight === 0
      ? parseFloat(customBarbellWeight)
      : inputs.barbellWeight;

  // Core logic: Calculate plates needed to reach target weight on barbell
  const results = useMemo(() => {
    if (
      isNaN(targetWeightNum) ||
      isNaN(barbellWeightNum) ||
      targetWeightNum <= 0 ||
      barbellWeightNum <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for weights.",
        warning: null,
        formulaUsed: "",
        plates: null,
      };
    }

    if (targetWeightNum < barbellWeightNum) {
      return {
        value: null,
        label: "",
        subtext:
          "Target weight must be greater than or equal to the barbell weight.",
        warning: null,
        formulaUsed: "",
        plates: null,
      };
    }

    // Weight to be loaded on plates (total weight minus barbell)
    let weightToLoad = targetWeightNum - barbellWeightNum;

    // Plates are loaded symmetrically on each side
    let weightPerSide = weightToLoad / 2;

    // Sort plates descending for greedy algorithm
    const platesDesc = PLATE_SIZES.map((p) => p.value).sort((a, b) => b - a);

    const platesCount = {};

    for (const plate of platesDesc) {
      platesCount[plate] = 0;
      while (weightPerSide >= plate - 0.0001) {
        weightPerSide -= plate;
        weightPerSide = Math.round(weightPerSide * 1000) / 1000; // Avoid floating errors
        platesCount[plate]++;
      }
    }

    // Check if exact loading possible (weightPerSide should be zero or very close)
    const isExact = weightPerSide < 0.001;

    const platesUsed = Object.entries(platesCount)
      .filter(([, count]) => count > 0)
      .map(([plate, count]) => ({
        plate: parseFloat(plate),
        count: count * 2, // total plates (both sides)
      }));

    return {
      value: `${targetWeightNum} ${inputs.unit}`,
      label: "Total Weight to Load",
      subtext: isExact
        ? "Exact plate loading found."
        : "Approximate plate loading; some rounding may be necessary.",
      warning: !isExact
        ? "Note: Exact loading not possible with available plates."
        : null,
      formulaUsed:
        "Total Weight = Barbell Weight + 2 × (Sum of Plates per Side)",
      plates: platesUsed,
    };
  }, [targetWeightNum, barbellWeightNum, inputs.unit]);

  const faqs = [
    {
      question: "What is a plate loading calculator?",
      answer:
        "A plate loading calculator helps lifters determine the exact combination of weight plates needed on a barbell to reach a desired total weight. It accounts for the barbell's weight and distributes plates evenly on both sides to ensure balance and safety during lifts.",
    },
    {
      question: "Why is it important to know the barbell weight?",
      answer:
        "Knowing the barbell weight is essential because the total target weight includes both the plates and the barbell itself. Different barbells have different weights (e.g., standard men's barbell is 45 lb, women's barbell is 35 lb), so accurate calculation requires this input to avoid underloading or overloading.",
    },
    {
      question: "Can I use this calculator for kilograms?",
      answer:
        "Yes, this calculator supports both pounds (lb) and kilograms (kg). Simply select your preferred unit and enter the weights accordingly. The plate sizes shown correspond to common plates in pounds, but you can adapt the logic or use the calculator as a guide for kilograms by converting plate sizes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="targetWeight" className="mb-1 font-semibold">
              Target Total Weight
            </Label>
            <Input
              id="targetWeight"
              type="number"
              min={0}
              step="any"
              placeholder={`Enter target weight (${inputs.unit})`}
              value={inputs.targetWeight}
              onChange={(e) => handleInputChange("targetWeight", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="unit" className="mb-1 font-semibold">
              Unit
            </Label>
            <Select
              value={inputs.unit}
              onValueChange={(v) => handleInputChange("unit", v)}
            >
              <SelectTrigger id="unit" className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lb">Pounds (lb)</SelectItem>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="barbellWeight" className="mb-1 font-semibold">
              Barbell Weight
            </Label>
            <Select
              value={inputs.barbellWeight}
              onValueChange={(v) => handleInputChange("barbellWeight", parseFloat(v))}
            >
              {BARBELL_WEIGHT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            {inputs.barbellWeight === 0 && (
              <Input
                id="customBarbellWeight"
                type="number"
                min={0}
                step="any"
                placeholder={`Enter custom barbell weight (${inputs.unit})`}
                value={customBarbellWeight}
                onChange={(e) => setCustomBarbellWeight(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No additional action needed, results update automatically
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({ targetWeight: "", barbellWeight: 45, unit: "lb" });
            setCustomBarbellWeight("");
          }}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
              {results.label}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{results.subtext}</p>
            {results.warning && (
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                <AlertTriangle className="inline-block mr-1 w-4 h-4" />
                {results.warning}
              </p>
            )}
            {results.plates && results.plates.length > 0 && (
              <div className="mt-4 text-left max-w-md mx-auto">
                <h4 className="font-bold mb-2 text-blue-800 dark:text-blue-400">
                  Plates to Load (Total count, both sides)
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-800 dark:text-slate-300">
                  {results.plates.map(({ plate, count }) => (
                    <li key={plate}>
                      {count} × {plate} {inputs.unit} plate{count > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          The Plate Loading Calculator is an essential tool for strength athletes,
          coaches, and gym enthusiasts who want to accurately load a barbell to a
          specific target weight. It takes into account the barbell's weight and
          calculates the exact combination of weight plates needed on each side to
          reach the desired total. This ensures balanced loading, safety, and
          efficiency during lifts such as squats, deadlifts, and bench presses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper plate loading is critical not only for achieving training goals but
          also for injury prevention. Uneven or incorrect loading can cause barbell
          instability, leading to poor lifting mechanics or accidents. This calculator
          uses a greedy algorithm to distribute plates starting from the heaviest to
          the lightest, ensuring the most practical and realistic plate setup.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the calculator supports both imperial (pounds) and metric
          (kilograms) units, accommodating lifters worldwide. By inputting your
          target weight and barbell type, you receive a clear plate loading scheme
          tailored to your equipment and goals.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Plate Loading Calculator is straightforward and designed for
          accuracy. Begin by selecting your preferred unit of measurement, either
          pounds (lb) or kilograms (kg). Next, enter your target total weight, which
          includes the barbell and plates combined. Then, select your barbell weight
          from the preset options or enter a custom value if your barbell differs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total weight you want to lift (target
            weight).
          </li>
          <li>
            <strong>Step 2:</strong> Select the barbell weight from the dropdown or
            input a custom barbell weight.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to generate the
            plate loading scheme.
          </li>
          <li>
            <strong>Step 4:</strong> Review the recommended plates to load on each
            side of the barbell.
          </li>
          <li>
            <strong>Step 5:</strong> Load the plates symmetrically on both sides to
            ensure balance and safety.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          If the calculator cannot find an exact plate combination, it will notify
          you with a warning. In such cases, consider adjusting your target weight or
          using smaller plates to achieve the closest possible load.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When loading plates, always prioritize safety and proper technique. Use
          collars or clamps to secure plates firmly on the barbell to prevent
          slipping during lifts. Start with manageable weights and progressively
          increase load to avoid injury and promote strength gains.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate microloading plates (e.g., 1.25 lb or 0.5 kg) if available to
          make smaller incremental increases, especially when nearing personal
          records. This approach helps in overcoming plateaus and allows for
          consistent progress.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, always double-check your plate loading before lifting and ensure
          the total weight matches your training plan. Using this calculator regularly
          can streamline your gym sessions and enhance your lifting efficiency.
        </p>
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on strength training, plate loading, and exercise
          science, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The ACSM is a global leader in sports medicine and exercise science,
              providing evidence-based guidelines for strength training and
              conditioning.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA){" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NSCA offers comprehensive resources on strength training techniques,
              programming, and safety, widely respected in the sports science community.
            </p>
          </li>
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
              The official governing body for Olympic weightlifting in the United States,
              providing rules, standards, and educational materials on plate loading and
              barbell use.
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
        formula: "Total Weight = Barbell Weight + 2 × (Sum of Plates per Side)",
        variables: [
          { symbol: "Total Weight", description: "Desired total weight on barbell" },
          { symbol: "Barbell Weight", description: "Weight of the empty barbell" },
          { symbol: "Plates per Side", description: "Sum of plates loaded on one side" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You want to load a standard 45 lb barbell to a total of 225 lb for your squat session.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 225 as the target total weight and select 45 lb as the barbell weight.",
          },
          {
            label: "Step 2",
            explanation:
              "Click Calculate to find the plate combination needed on each side.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator shows 2 × 45 lb plates and 1 × 25 lb plate per side, totaling 180 lb in plates plus 45 lb barbell.",
          },
        ],
        result:
          "Load two 45 lb plates and one 25 lb plate on each side of the barbell to reach 225 lb total.",
      }}
      relatedCalculators={[
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "Flame" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "Activity" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "Trophy" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "Activity" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "Waves" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "Waves" },
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