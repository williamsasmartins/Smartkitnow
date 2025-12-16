import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  RotateCcw,
  AlertTriangle,
  ChefHat,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type UnitSystem = "imperial" | "metric";

type MeatType = "beef" | "lamb" | "pork" | "veal";

type DonenessLevel =
  | "rare"
  | "medium_rare"
  | "medium"
  | "medium_well"
  | "well_done";

const USDA_SAFE_TEMPS_F = {
  beef: 145,
  lamb: 145,
  pork: 145,
  veal: 145,
};

const USDA_SAFE_TEMPS_C = {
  beef: 63,
  lamb: 63,
  pork: 63,
  veal: 63,
};

// Internal temps for doneness (°F)
const DONENESS_TEMPS_F: Record<DonenessLevel, number> = {
  rare: 125,
  medium_rare: 135,
  medium: 145,
  medium_well: 150,
  well_done: 160,
};

// Internal temps for doneness (°C)
const DONENESS_TEMPS_C: Record<DonenessLevel, number> = {
  rare: 52,
  medium_rare: 57,
  medium: 63,
  medium_well: 66,
  well_done: 71,
};

// Resting time windows in minutes (varies by weight)
function restingTimeMinutes(weightLbs: number): [number, number] {
  // General rule: 5-10 minutes for steaks 1-2 inches thick (~0.5-1.5 lbs)
  // Larger steaks/rest times scale slightly
  if (weightLbs <= 0.5) return [3, 5];
  if (weightLbs <= 1) return [5, 7];
  if (weightLbs <= 1.5) return [7, 10];
  if (weightLbs <= 2) return [10, 12];
  return [12, 15];
}

// Approximate cooking time per side (minutes per pound) for pan-seared or grilled steak
// This is a rough average; actual time depends on thickness, heat, and steak cut.
// We use a base multiplier and adjust by doneness level.
const BASE_COOK_TIME_PER_LB = 6; // minutes per pound total cooking time approx

const DONENESS_TIME_MULTIPLIER: Record<DonenessLevel, number> = {
  rare: 0.6,
  medium_rare: 0.75,
  medium: 1,
  medium_well: 1.15,
  well_done: 1.3,
};

export default function SteakDonenessTimeRestingCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    meatType?: MeatType;
    weight?: string; // lbs or kg as string input
    doneness?: DonenessLevel;
  }>({
    meatType: "beef",
    weight: "",
    doneness: "medium_rare",
  });

  // Input handlers
  function onInputChange<K extends keyof typeof inputs>(
    key: K,
    value: string | MeatType | DonenessLevel
  ) {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { meatType, weight, doneness } = inputs;
    if (!meatType || !weight || !doneness) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Parse weight input
    let weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "Invalid weight",
        subtext: "Please enter a valid positive number for weight.",
        warning: null,
      };
    }

    // Convert weight to lbs if metric
    if (unit === "metric") {
      // kg to lbs
      weightNum = weightNum * 2.20462;
    }

    // Calculate target internal temp based on doneness and unit
    const targetTempF = DONENESS_TEMPS_F[doneness];
    const targetTempC = DONENESS_TEMPS_C[doneness];
    const targetTemp = unit === "imperial" ? targetTempF : targetTempC;

    // USDA safe temp for meat type
    const safeTempF = USDA_SAFE_TEMPS_F[meatType];
    const safeTempC = USDA_SAFE_TEMPS_C[meatType];
    const safeTemp = unit === "imperial" ? safeTempF : safeTempC;

    // Check if target temp is below USDA safe temp (food safety)
    let warning: string | null = null;
    if (
      (unit === "imperial" &&
        targetTempF < 140 /* Danger zone upper limit */) ||
      (unit === "metric" && targetTempC < 60)
    ) {
      warning =
        "Warning: Cooking below USDA recommended safe internal temperature (145°F/63°C) may pose food safety risks. Use caution and ensure proper handling.";
    }

    // Calculate estimated cook time (total minutes)
    // Base cook time per lb * weight * doneness multiplier
    const cookTimeMinutes =
      BASE_COOK_TIME_PER_LB * weightNum * DONENESS_TIME_MULTIPLIER[doneness];

    // Calculate resting window (minutes)
    const [restMin, restMax] = restingTimeMinutes(weightNum);

    // Format results strings
    const cookTimeStr = cookTimeMinutes.toFixed(1);
    const restTimeStr = `${restMin} - ${restMax}`;

    // Compose result label and subtext
    const label = `Estimated Cook Time: ${cookTimeStr} minutes`;
    const subtext = `Rest your steak for ${restTimeStr} minutes to allow juices to redistribute and reach optimal tenderness. Target internal temperature: ${targetTemp}°${unit === "imperial" ? "F" : "C"}.`;

    return {
      value: cookTimeStr,
      label,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is resting steak important after cooking?",
      answer:
        "Resting steak allows the juices to redistribute evenly throughout the meat, resulting in a juicier and more flavorful bite. Cutting into steak immediately causes juices to run out, leading to dryness. Typically, resting for 5-10 minutes depending on steak size is recommended.",
    },
    {
      question: "What is the USDA recommended safe internal temperature for steak?",
      answer:
        "The USDA recommends cooking whole cuts of beef, lamb, veal, and pork to a minimum internal temperature of 145°F (63°C) followed by a 3-minute rest. This ensures harmful bacteria are destroyed while maintaining optimal tenderness.",
    },
    {
      question: "How does steak weight affect cooking and resting times?",
      answer:
        "Heavier steaks require longer cooking times to reach the desired internal temperature and longer resting periods to allow heat and juices to evenly distribute. Smaller steaks cook faster and need shorter resting windows.",
    },
    {
      question: "Can I cook steak below USDA safe temperatures for doneness?",
      answer:
        "Cooking steak below USDA safe temperatures, such as rare or medium-rare, is common but carries some risk. Ensure meat is sourced safely and handled properly. Use a food thermometer and avoid prolonged exposure in the danger zone (40°F-140°F).",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (°F / Lbs)</SelectItem>
              <SelectItem value="metric">Metric (°C / Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meat Type Select */}
      <div className="space-y-2">
        <Label htmlFor="meatType" className="text-slate-700 dark:text-slate-300">
          Meat Type
        </Label>
        <Select
          id="meatType"
          value={inputs.meatType}
          onValueChange={(val) => onInputChange("meatType", val as MeatType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select meat type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beef">Beef</SelectItem>
            <SelectItem value="lamb">Lamb</SelectItem>
            <SelectItem value="pork">Pork</SelectItem>
            <SelectItem value="veal">Veal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Steak Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={unit === "imperial" ? "e.g. 1.5" : "e.g. 0.7"}
          value={inputs.weight || ""}
          onChange={(e) => onInputChange("weight", e.target.value)}
        />
      </div>

      {/* Doneness Select */}
      <div className="space-y-2">
        <Label htmlFor="doneness" className="text-slate-700 dark:text-slate-300">
          Desired Doneness
        </Label>
        <Select
          id="doneness"
          value={inputs.doneness}
          onValueChange={(val) => onInputChange("doneness", val as DonenessLevel)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select doneness" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rare">Rare (125°F / 52°C)</SelectItem>
            <SelectItem value="medium_rare">Medium Rare (135°F / 57°C)</SelectItem>
            <SelectItem value="medium">Medium (145°F / 63°C)</SelectItem>
            <SelectItem value="medium_well">Medium Well (150°F / 66°C)</SelectItem>
            <SelectItem value="well_done">Well Done (160°F / 71°C)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              meatType: "beef",
              weight: "",
              doneness: "medium_rare",
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
                Kitchen Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value} min
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
            <ChefHat className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Chef's Tip:</strong> Use a reliable instant-read meat
              thermometer to check internal temperature for perfect doneness.
              Resting your steak is as important as cooking it to ensure juicy,
              tender results.
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
          Understanding Steak Doneness Time & Resting Window
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cooking steak to the perfect doneness requires understanding the
          relationship between internal temperature, cooking time, and resting
          period. Each doneness level corresponds to a specific internal
          temperature range that affects the steak's texture, juiciness, and
          flavor. Using a meat thermometer ensures precision and safety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The USDA recommends cooking whole cuts of beef to a minimum internal
          temperature of 145°F (63°C) with a 3-minute rest to ensure food
          safety. However, many chefs prefer lower temps for rare or medium-rare
          steaks, balancing flavor and texture with safety considerations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Resting steak after cooking is critical. It allows the juices to
          redistribute throughout the meat, preventing them from spilling out
          when sliced. The resting window varies with steak size but generally
          ranges from 5 to 15 minutes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps estimate the cooking time and resting window
          based on your steak's weight, type, and desired doneness. Follow these
          steps for best results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your steak's meat type (beef, lamb,
            pork, or veal).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the steak's weight in pounds or
            kilograms depending on your preferred unit system.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your desired doneness level.
          </li>
          <li>
            <strong>Step 4:</strong> Review the estimated cook time and resting
            window. Use a meat thermometer to verify internal temperature.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Culinary FAQ
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
          Standard Ratios & References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.usda.gov/media/blog/2012/06/27/food-safety-and-steak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety Guidelines for Steak
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA recommendations on safe internal temperatures and
              resting times for whole cuts of meat.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-cook-steak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats: The Science of Steak Doneness
            </a>
            <p className="text-slate-500 text-sm">
              In-depth culinary science on steak cooking times, temperatures,
              and resting.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/baking-conversions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. King Arthur Baking: Cooking Temperature Conversions
            </a>
            <p className="text-slate-500 text-sm">
              Useful temperature conversions and culinary math references.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Steak Doneness Time & Resting Window"
      description="Time your steak to perfection. Estimate cooking time for rare, medium, or well-done steaks and calculate the vital resting period."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Cook Time (min) = Weight (lbs) × 6 × Doneness Multiplier (0.6 to 1.3)",
        variables: [
          { symbol: "Weight", description: "Steak weight in pounds" },
          {
            symbol: "Doneness Multiplier",
            description:
              "Multiplier based on desired doneness: Rare=0.6, Medium Rare=0.75, Medium=1, Medium Well=1.15, Well Done=1.3",
          },
          {
            symbol: "Cook Time",
            description: "Estimated total cooking time in minutes",
          },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Calculate cook time for a 1.5 lb beef steak cooked to medium rare.",
        steps: [
          {
            label: "1",
            explanation:
              "Use base cook time per pound (6 min) and doneness multiplier (0.75 for medium rare).",
          },
          {
            label: "2",
            explanation:
              "Multiply: 1.5 × 6 × 0.75 = 6.75 minutes total cook time.",
          },
          {
            label: "3",
            explanation:
              "Rest steak for 7-10 minutes after cooking for optimal juiciness.",
          },
        ],
        result: "Estimated cook time: 6.75 minutes; Resting window: 7-10 minutes.",
      }}
      relatedCalculators={[
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🍳",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🍞",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "⚖️",
        },
        {
          title: "Whole Chicken/Roast Cook Time Estimator",
          url: "/cooking/whole-chicken-roast-cook-time",
          icon: "🧁",
        },
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "📏",
        },
        {
          title: "Dough Hydration % Calculator",
          url: "/cooking/dough-hydration-percent",
          icon: "🍞",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Steak Doneness Time & Resting Window",
        },
        { id: "how-to-use", label: "Chef's Tips" },
        { id: "faq", label: "Culinary FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}