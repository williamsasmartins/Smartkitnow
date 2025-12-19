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

const BARBELL_TYPES = [
  { label: "Standard Barbell (20 kg / 45 lbs)", value: "standard", weightKg: 20, weightLbs: 45 },
  { label: "Women's Barbell (15 kg / 33 lbs)", value: "women", weightKg: 15, weightLbs: 33 },
  { label: "Technique Barbell (5 kg / 11 lbs)", value: "technique", weightKg: 5, weightLbs: 11 },
];

const PLATE_SETS_KG = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5];
const PLATE_SETS_LBS = [45, 35, 25, 10, 5, 2.5, 1.25];

export default function PlateLoadingCalculator() {
  // Inputs: target weight, barbell type, unit (kg/lbs)
  const [inputs, setInputs] = useState({
    targetWeight: "",
    unit: "kg",
    barbellType: "standard",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parse input weight as number or NaN
  const targetWeightNum = useMemo(() => {
    const val = parseFloat(inputs.targetWeight);
    return isNaN(val) || val <= 0 ? null : val;
  }, [inputs.targetWeight]);

  // Get barbell weight based on selection and unit
  const barbellWeight = useMemo(() => {
    const bar = BARBELL_TYPES.find((b) => b.value === inputs.barbellType);
    if (!bar) return null;
    return inputs.unit === "kg" ? bar.weightKg : bar.weightLbs;
  }, [inputs.barbellType, inputs.unit]);

  // Plates available based on unit
  const platesAvailable = useMemo(() => {
    return inputs.unit === "kg" ? PLATE_SETS_KG : PLATE_SETS_LBS;
  }, [inputs.unit]);

  // Calculation logic: Determine plates needed on each side to reach target weight
  // Formula: (targetWeight - barbellWeight) / 2 = weight per side
  // Then greedily select plates from largest to smallest
  const results = useMemo(() => {
    if (!targetWeightNum || !barbellWeight) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
        plates: null,
      };
    }

    if (targetWeightNum < barbellWeight) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: `Target weight must be at least the barbell weight (${barbellWeight} ${inputs.unit}).`,
        formulaUsed: "",
        plates: null,
      };
    }

    // Calculate weight to load on plates total
    const platesTotal = targetWeightNum - barbellWeight;

    // Weight per side
    const weightPerSide = platesTotal / 2;

    // Because plates come in pairs, weightPerSide must be achievable with available plates
    // We'll do a greedy algorithm to find the minimal plate count combination

    let remaining = weightPerSide;
    const platesCount: Record<number, number> = {};

    for (const plate of platesAvailable) {
      // Count how many pairs of this plate fit into remaining
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        platesCount[plate] = count;
        remaining = +(remaining - count * plate).toFixed(3); // avoid floating point errors
      }
    }

    // If remaining is not zero (or very close), no exact match found
    const tolerance = inputs.unit === "kg" ? 0.01 : 0.01; // 10 grams or less tolerance
    const canLoadExactly = remaining <= tolerance;

    // Prepare plate list string for display
    const platesList = Object.entries(platesCount)
      .filter(([, count]) => count > 0)
      .map(([plate, count]) => {
        return `${count} × ${plate} ${inputs.unit}`;
      });

    const warning = !canLoadExactly
      ? `Exact plate loading not possible with available plates. Approximate loading shown.`
      : null;

    return {
      value: `${targetWeightNum.toFixed(2)} ${inputs.unit}`,
      label: "Target Weight",
      subtext: `Barbell weight: ${barbellWeight} ${inputs.unit} | Plates per side: ${weightPerSide.toFixed(2)} ${inputs.unit}`,
      warning,
      formulaUsed: `Target Weight = Barbell Weight + 2 × Sum of Plates per Side`,
      plates: platesList.length > 0 ? platesList : ["No plates needed (bar only)"],
    };
  }, [targetWeightNum, barbellWeight, platesAvailable, inputs.unit]);

  const faqs = [
    {
      question: "What is the purpose of a plate loading calculator?",
      answer:
        "A plate loading calculator helps lifters determine the exact combination of weight plates needed to reach a desired total weight on a barbell. This ensures efficient loading, prevents errors, and saves time during training sessions. It is especially useful for competitive lifters who must adhere to precise weight increments.",
    },
    {
      question: "Why do I need to select the barbell type and unit?",
      answer:
        "Different barbells have different weights, such as the standard men's barbell (20 kg) or women's barbell (15 kg). Selecting the correct barbell type ensures accurate total weight calculations. Additionally, choosing the unit (kilograms or pounds) aligns the calculator with your gym's equipment and measurement preferences.",
    },
    {
      question: "What if the exact target weight cannot be loaded with available plates?",
      answer:
        "Due to the discrete nature of weight plates, some target weights may not be achievable exactly. In such cases, the calculator will provide the closest possible plate combination and warn you. You may need to adjust your target weight slightly or use fractional plates if available.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="targetWeight" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Target Weight
          </Label>
          <Input
            id="targetWeight"
            type="number"
            min="0"
            step="0.01"
            placeholder={`Enter weight in ${inputs.unit}`}
            value={inputs.targetWeight}
            onChange={(e) => handleInputChange("targetWeight", e.target.value)}
            aria-describedby="targetWeightHelp"
          />
          <p id="targetWeightHelp" className="text-xs text-slate-500 mt-1">
            Total weight including barbell.
          </p>
        </div>

        <div>
          <Label htmlFor="unit" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Unit
          </Label>
          <Select
            value={inputs.unit}
            onValueChange={(v) => handleInputChange("unit", v)}
            id="unit"
            aria-label="Select unit"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kilograms (kg)</SelectItem>
              <SelectItem value="lbs">Pounds (lbs)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="barbellType" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Barbell Type
          </Label>
          <Select
            value={inputs.barbellType}
            onValueChange={(v) => handleInputChange("barbellType", v)}
            id="barbellType"
            aria-label="Select barbell type"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select barbell" />
            </SelectTrigger>
            <SelectContent>
              {BARBELL_TYPES.map((bar) => (
                <SelectItem key={bar.value} value={bar.value}>
                  {bar.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; calculation is memoized
            // But we can validate inputs here if needed
          }}
          aria-label="Calculate plate loading"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ targetWeight: "", unit: "kg", barbellType: "standard" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
              </p>
            )}
            {results.plates && (
              <div className="mt-6 text-left max-w-md mx-auto">
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">Plate Loading per Side:</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  {results.plates.map((plate, i) => (
                    <li key={i}>{plate}</li>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Plate Loading Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Plate Loading Calculator is an essential tool for athletes, coaches, and strength enthusiasts who want to accurately load barbells for training or competition. It calculates the precise combination of weight plates required on each side of the barbell to reach a target total weight, considering the barbell's own weight and the available plate denominations. This calculator eliminates guesswork and reduces the risk of loading errors, which can compromise training effectiveness or violate competition rules. By providing a clear plate loading scheme, it also helps lifters save time during workouts and maintain consistent progression.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Plate Loading Calculator is straightforward and intuitive. Begin by entering your desired total weight, which includes the barbell and plates. Next, select the unit of measurement you prefer—kilograms or pounds—to match your gym equipment. Then, choose the type of barbell you are using, as barbells vary in weight depending on gender specifications or training purposes. Once all inputs are set, click the calculate button to see the exact plate combination needed on each side of the barbell.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your target total weight (e.g., 100 kg or 225 lbs).
          </li>
          <li>
            <strong>Step 2:</strong> Select the unit of measurement (kg or lbs).
          </li>
          <li>
            <strong>Step 3:</strong> Choose the barbell type that matches your equipment.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view the plate loading per side.
          </li>
          <li>
            <strong>Step 5:</strong> Load the plates on the barbell as indicated, ensuring safety and balance.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your training efficiency, always double-check the plate loading before lifting to avoid imbalances or incorrect weights. When progressing in weight, consider small increments using fractional plates if available, as this allows for gradual overload and reduces injury risk. Additionally, familiarize yourself with your gym's plate inventory to know which plates are accessible for loading. For competitive lifters, adhere strictly to competition barbell and plate specifications to ensure compliance with rules and fair play.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, barbell specifications, and strength training best practices, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides evidence-based resources and certifications for strength coaches and athletes.
            </p>
          </li>
          <li>
            <a
              href="https://iwf.sport/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              International Weightlifting Federation (IWF) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official rules and standards for Olympic weightlifting equipment and competitions.
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
        formula: "Target Weight = Barbell Weight + 2 × Sum of Plates per Side",
        variables: [
          { symbol: "Target Weight", description: "Total weight on the barbell including plates and bar" },
          { symbol: "Barbell Weight", description: "Weight of the empty barbell" },
          { symbol: "Plates per Side", description: "Sum of weight plates loaded on one side of the barbell" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You want to load a total of 100 kg on a standard 20 kg barbell using kilogram plates available at your gym.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 100 as the target weight, select 'kg' as the unit, and choose 'Standard Barbell (20 kg)' as the barbell type.",
          },
          {
            label: "Step 2",
            explanation:
              "Click 'Calculate' to see the plate loading per side. The calculator will subtract the barbell weight and divide the remaining weight by two.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator suggests loading 40 kg per side, which can be achieved by 1 × 20 kg plate and 1 × 10 kg plate and 2 × 5 kg plates per side.",
          },
        ],
        result: "Load the plates as indicated on each side to reach exactly 100 kg total weight.",
      }}
      relatedCalculators={[
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
        { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏆" },
        { title: "Body Fat Percentage Calculator (Athletes)", url: "/sports/body-fat-percentage", icon: "🔥" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
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