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
  ChefHat,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type DonenessLevel =
  | "rare"
  | "medium-rare"
  | "medium"
  | "medium-well"
  | "well-done";

const USDA_SAFE_TEMP_F = 140;
const USDA_DANGER_ZONE_MIN_F = 40;
const USDA_DANGER_ZONE_MAX_F = 140;

const DONENESS_DATA: Record<
  DonenessLevel,
  {
    targetTempF: number;
    targetTempC: number;
    cookTimePerInchMin: number; // minutes per inch thickness approx.
    restingMin: number;
  }
> = {
  rare: {
    targetTempF: 125,
    targetTempC: 52,
    cookTimePerInchMin: 4,
    restingMin: 5,
  },
  "medium-rare": {
    targetTempF: 135,
    targetTempC: 57,
    cookTimePerInchMin: 5,
    restingMin: 7,
  },
  medium: {
    targetTempF: 145,
    targetTempC: 63,
    cookTimePerInchMin: 6,
    restingMin: 8,
  },
  "medium-well": {
    targetTempF: 150,
    targetTempC: 66,
    cookTimePerInchMin: 7,
    restingMin: 10,
  },
  "well-done": {
    targetTempF: 160,
    targetTempC: 71,
    cookTimePerInchMin: 8,
    restingMin: 12,
  },
};

export default function SteakDonenessTimeRestingCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    thickness: string; // inches or cm as string input
    doneness: DonenessLevel | "";
    tempUnit: "F" | "C";
  }>({
    thickness: "",
    doneness: "",
    tempUnit: "F",
  });

  // Update tempUnit when unit changes
  // (Imperial => F, Metric => C)
  // This effect is implicit in useMemo below.

  // 2. LOGIC ENGINE (ALL CALCULATIONS HERE)
  const results = useMemo(() => {
    // Parse thickness input
    const thicknessNum =
      unit === "imperial"
        ? parseFloat(inputs.thickness)
        : parseFloat(inputs.thickness) / 2.54; // cm to inches

    if (!inputs.doneness || isNaN(thicknessNum) || thicknessNum <= 0) {
      return {
        value: 0,
        label: "Enter thickness and select doneness",
        subtext: "",
        warning: null,
      };
    }

    const donenessInfo = DONENESS_DATA[inputs.doneness];
    if (!donenessInfo) {
      return {
        value: 0,
        label: "Invalid doneness selected",
        subtext: "",
        warning: null,
      };
    }

    // Calculate cook time (minutes)
    // Approximate linear scaling: cookTimePerInchMin * thickness
    const cookTimeMin = donenessInfo.cookTimePerInchMin * thicknessNum;

    // Resting time in minutes
    const restingMin = donenessInfo.restingMin;

    // Target temp for doneness in selected unit
    const targetTemp =
      unit === "imperial"
        ? donenessInfo.targetTempF
        : Math.round(donenessInfo.targetTempC * 10) / 10;

    // Safety warning if target temp is in Danger Zone (40-140°F)
    // Danger zone check always in °F
    const isDangerZone =
      donenessInfo.targetTempF >= USDA_DANGER_ZONE_MIN_F &&
      donenessInfo.targetTempF <= USDA_DANGER_ZONE_MAX_F;

    const warningMsg = isDangerZone
      ? "Warning: Target temperature is within USDA Danger Zone (40-140°F). Ensure proper handling and cooking to avoid foodborne illness."
      : null;

    // Format output strings
    const cookTimeStr =
      cookTimeMin < 1
        ? "<1 minute"
        : cookTimeMin % 1 === 0
        ? `${cookTimeMin} minutes`
        : `${cookTimeMin.toFixed(1)} minutes`;

    const restingTimeStr =
      restingMin % 1 === 0 ? `${restingMin} minutes` : `${restingMin.toFixed(1)} minutes`;

    const thicknessDisplay =
      unit === "imperial"
        ? `${thicknessNum.toFixed(2)} inch${thicknessNum > 1 ? "es" : ""}`
        : `${(thicknessNum * 2.54).toFixed(1)} cm`;

    const tempUnitLabel = unit === "imperial" ? "°F" : "°C";

    const value = `${cookTimeStr} cook time + ${restingTimeStr} resting`;

    const label = `For a ${thicknessDisplay} steak cooked to ${inputs.doneness.replace(
      "-",
      " "
    )} (${targetTemp}${tempUnitLabel})`;

    const subtext = `Resting allows juices to redistribute, enhancing tenderness and flavor.`;

    return {
      value,
      label,
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit]);

  // FAQ content
  const faqs = [
    {
      question: "Why is resting steak important after cooking?",
      answer:
        "Resting steak after cooking allows the juices, which have been driven to the center by heat, to redistribute evenly throughout the meat. This results in a juicier, more flavorful steak and prevents excessive juice loss when slicing.",
    },
    {
      question: "How does steak thickness affect cooking time?",
      answer:
        "Thicker steaks require longer cooking times to reach the desired internal temperature. Cooking time generally scales linearly with thickness, so doubling the thickness roughly doubles the cooking time needed.",
    },
    {
      question: "What is the USDA Danger Zone and why should I avoid it?",
      answer:
        "The USDA Danger Zone refers to temperatures between 40°F and 140°F where bacteria can multiply rapidly. Cooking steak to temperatures within this range increases the risk of foodborne illness, so it’s important to reach safe internal temperatures.",
    },
    {
      question: "Can I use this calculator for other meats besides steak?",
      answer:
        "This calculator is specifically designed for beef steaks and their doneness levels. Other meats have different safe cooking temperatures and resting times, so it’s best to use dedicated tools or guidelines for those.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onThicknessChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, thickness: e.target.value }));
  }
  function onDonenessChange(value: DonenessLevel) {
    setInputs((prev) => ({ ...prev, doneness: value }));
  }

  // When unit changes, update tempUnit accordingly and clear thickness input for clarity
  function onUnitChange(value: "imperial" | "metric") {
    setUnit(value);
    setInputs((prev) => ({
      thickness: "",
      doneness: prev.doneness,
      tempUnit: value === "imperial" ? "F" : "C",
    }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={onUnitChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (Inches/°F)</SelectItem>
              <SelectItem value="metric">Metric (cm/°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Thickness Input */}
      <div className="space-y-1">
        <Label htmlFor="thickness" className="text-slate-700 dark:text-slate-300">
          Steak Thickness ({unit === "imperial" ? "inches" : "cm"})
        </Label>
        <Input
          id="thickness"
          type="number"
          min={0.1}
          step={unit === "imperial" ? 0.01 : 0.1}
          placeholder={unit === "imperial" ? "e.g. 1.5" : "e.g. 4"}
          value={inputs.thickness}
          onChange={onThicknessChange}
          aria-describedby="thickness-info"
        />
        <p
          id="thickness-info"
          className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"
        >
          <Info className="w-3 h-3" /> Typical steak thickness ranges from 1 to 2 inches (2.5 to 5 cm).
        </p>
      </div>

      {/* Doneness Select */}
      <div className="space-y-1">
        <Label htmlFor="doneness" className="text-slate-700 dark:text-slate-300">
          Desired Doneness
        </Label>
        <Select
          value={inputs.doneness}
          onValueChange={(v) => onDonenessChange(v as DonenessLevel)}
          id="doneness"
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select doneness" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rare">Rare (125°F / 52°C)</SelectItem>
            <SelectItem value="medium-rare">Medium Rare (135°F / 57°C)</SelectItem>
            <SelectItem value="medium">Medium (145°F / 63°C)</SelectItem>
            <SelectItem value="medium-well">Medium Well (150°F / 66°C)</SelectItem>
            <SelectItem value="well-done">Well Done (160°F / 71°C)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; useMemo updates automatically
            // But we can force re-render by updating state if needed
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              thickness: "",
              doneness: "",
              tempUnit: unit === "imperial" ? "F" : "C",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (CLEAN JSX ONLY) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Kitchen Result
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
            <ChefHat className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Chef's Tip:</strong> Use a meat thermometer to ensure your
              steak reaches the perfect internal temperature for safety and taste.
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
          Cooking steak to the perfect doneness is both an art and a science.
          The internal temperature of the steak determines its doneness level,
          ranging from rare to well-done. Thickness plays a crucial role in
          cooking time, as thicker cuts require more heat exposure to reach the
          desired temperature. This calculator helps estimate the cooking time
          based on thickness and doneness preference.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Resting the steak after cooking is equally important. During resting,
          the meat fibers relax and the juices redistribute, resulting in a
          juicier and more flavorful steak. Skipping this step can cause the
          juices to escape when cutting, leading to a drier texture.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Safety is paramount; steaks should be cooked to temperatures that
          minimize foodborne illness risks. The USDA Danger Zone (40°F to 140°F)
          is where bacteria thrive, so reaching and maintaining safe internal
          temperatures is essential. This tool incorporates USDA guidelines to
          alert you if your selected doneness falls within this risk zone.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, first select your preferred unit system:
          Imperial (inches and °F) or Metric (centimeters and °C). Enter the
          thickness of your steak, then choose the desired doneness level. Click
          "Calculate" to see the estimated cooking time and recommended resting
          period.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your unit system (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the thickness of your steak in the
            chosen units.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your desired doneness level from rare
            to well-done.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to get cooking and resting
            times.
          </li>
          <li>
            <strong>Step 5:</strong> Use a meat thermometer to verify internal
            temperature during cooking.
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
          References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-minimum-internal-temperature-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Safe Minimum Internal Temperature Chart
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA guidelines on safe cooking temperatures for meats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-cook-steak-resting-why"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats: The Science of Resting Steak
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of why resting steak improves texture and
              juiciness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.culinaryinstitute.edu/blog/steak-doneness-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Culinary Institute: Steak Doneness Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on steak doneness levels and cooking times.
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
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Cook Time (min) = Thickness (inches) × Cook Time per Inch (min/inch) based on Doneness",
        variables: [
          {
            symbol: "Thickness",
            description: "Steak thickness in inches or cm",
          },
          {
            symbol: "Cook Time per Inch",
            description:
              "Minutes required to cook 1 inch of steak to desired doneness",
          },
          {
            symbol: "Cook Time",
            description: "Estimated total cooking time in minutes",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate cooking and resting time for a 1.5-inch thick steak cooked to medium-rare.",
        steps: [
          {
            label: "1",
            explanation:
              "Select Imperial units and enter 1.5 inches for thickness.",
          },
          {
            label: "2",
            explanation:
              "Choose 'Medium Rare' doneness, which requires about 5 minutes per inch.",
          },
          {
            label: "3",
            explanation:
              "Calculate: 1.5 inches × 5 min/inch = 7.5 minutes cooking time.",
          },
          {
            label: "4",
            explanation:
              "Add resting time of 7 minutes for optimal juiciness and flavor.",
          },
        ],
        result: "7.5 minutes cook time + 7 minutes resting",
      }}
      relatedCalculators={[
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "🍳",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🍞",
        },
        {
          title: "Rice:Water Ratio & Yield Calculator",
          url: "/cooking/rice-water-ratio-yield",
          icon: "🥩",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "🧁",
        },
        {
          title: "Dough Hydration % Calculator",
          url: "/cooking/dough-hydration-percent",
          icon: "📏",
        },
        {
          title: "Cake Pan Size & Volume Converter",
          url: "/cooking/cake-pan-size-volume-converter",
          icon: "🍰",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Steak Doneness Time & Resting Window",
        },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "Culinary FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}