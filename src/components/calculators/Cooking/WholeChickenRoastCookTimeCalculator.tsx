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
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function WholeChickenRoastCookTimeCalculator() {
  // State for unit system and inputs
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    weight?: number; // pounds or grams depending on unit
    ovenTemp?: number; // °F or °C depending on unit
  }>({});

  // Constants for density (not needed here as weight input directly)
  // USDA safe temp for poultry: 165°F (74°C)
  // Danger zone: 40°F - 140°F (4.4°C - 60°C)

  // Conversion helpers
  const lbsToGrams = (lbs: number) => lbs * 453.59237;
  const gramsToLbs = (g: number) => g / 453.59237;
  const fToC = (f: number) => ((f - 32) * 5) / 9;
  const cToF = (c: number) => (c * 9) / 5 + 32;

  // Calculation logic inside useMemo
  const results = useMemo(() => {
    // Destructure inputs
    const weightInput = inputs.weight;
    const ovenTempInput = inputs.ovenTemp;

    // Validation
    if (
      weightInput === undefined ||
      weightInput <= 0 ||
      ovenTempInput === undefined ||
      ovenTempInput <= 0
    ) {
      return {
        value: 0,
        label: "Enter weight and oven temperature",
        subtext: "",
        warning: null,
      };
    }

    // Convert inputs to consistent units for calculation:
    // Weight in pounds, oven temp in °F
    const weightLbs = unit === "imperial" ? weightInput : gramsToLbs(weightInput);
    const ovenTempF = unit === "imperial" ? ovenTempInput : cToF(ovenTempInput);

    // Validate oven temp range (typical roasting temps 250°F - 500°F)
    const ovenTempValid =
      ovenTempF >= 250 && ovenTempF <= 500 ? true : false;

    // USDA safe internal temp for whole chicken: 165°F (74°C)
    // Danger zone for food safety: 40°F - 140°F

    // Cooking time estimation:
    // Common rule: 20 minutes per pound at 350°F oven temp
    // Adjust time based on oven temp using a rough factor:
    // Time ∝ 350 / ovenTempF * 20 * weightLbs
    // Clamp ovenTempF to minimum 250°F for calculation to avoid extreme times

    const ovenTempForCalc = ovenTempF < 250 ? 250 : ovenTempF;

    // Calculate cook time in minutes
    const cookTimeMinutes =
      (350 / ovenTempForCalc) * 20 * weightLbs;

    // Round cook time to nearest minute
    const cookTimeRounded = Math.round(cookTimeMinutes);

    // Format cook time as hours and minutes string
    const hours = Math.floor(cookTimeRounded / 60);
    const minutes = cookTimeRounded % 60;
    const cookTimeStr =
      hours > 0
        ? `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min`
        : `${minutes} min`;

    // Warning if oven temp in danger zone (40-140°F)
    const warningMsg =
      ovenTempF > 40 && ovenTempF < 140
        ? "Warning: Oven temperature is in the food safety danger zone (40-140°F). Cooking at this temperature is unsafe."
        : null;

    // Label and subtext
    const labelText = `Estimated Roast Time for ${weightLbs.toFixed(
      2
    )} lb${weightLbs !== 1 ? "s" : ""} at ${Math.round(ovenTempF)}°F`;
    const subtext = ovenTempValid
      ? "Ensure internal temperature reaches 165°F (74°C) for safe consumption."
      : "Note: Oven temperature is outside typical roasting range (250°F - 500°F). Cooking time may be inaccurate.";

    // Display value formatted according to unit system
    const displayValue = cookTimeStr;

    return {
      value: displayValue,
      label: labelText,
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit]);

  // FAQ content
  const faqs = [
    {
      question: "How do I know when my whole chicken is fully cooked?",
      answer:
        "The safest way to ensure your whole chicken is fully cooked is to use a meat thermometer. The USDA recommends an internal temperature of 165°F (74°C) measured at the thickest part of the thigh without touching bone. This guarantees harmful bacteria are destroyed and the meat is safe to eat.",
    },
    {
      question: "Can I roast a chicken at a lower temperature for longer?",
      answer:
        "Yes, roasting at a lower temperature will take longer but can result in juicier meat. However, cooking below 250°F is not recommended as it may keep the chicken in the danger zone (40-140°F) too long, increasing food safety risks. Always ensure the internal temperature reaches 165°F.",
    },
    {
      question: "Why does oven temperature affect cooking time?",
      answer:
        "Oven temperature directly influences how quickly heat penetrates the chicken. Higher temperatures cook the meat faster but risk drying it out, while lower temperatures cook slower and can retain moisture. Adjusting cooking time based on oven temperature helps achieve perfect doneness.",
    },
    {
      question: "Is weight the only factor affecting roast time?",
      answer:
        "Weight is the primary factor for estimating roast time, but other factors like oven accuracy, chicken shape, and whether it’s stuffed can affect cooking duration. Always verify doneness with a thermometer rather than relying solely on time estimates.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInputs((prev) => ({
      ...prev,
      weight: isNaN(val) ? undefined : val,
    }));
  };
  const onOvenTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInputs((prev) => ({
      ...prev,
      ovenTemp: isNaN(val) ? undefined : val,
    }));
  };

  // Widget JSX (clean, no inline logic)
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs/°F)</SelectItem>
              <SelectItem value="metric">Metric (grams/°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Whole Chicken Weight ({unit === "imperial" ? "lbs" : "grams"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 4.5" : "e.g. 2000"}
            value={inputs.weight ?? ""}
            onChange={onWeightChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the weight of the whole chicken or roast.
          </p>
        </div>

        <div>
          <Label htmlFor="ovenTemp" className="text-slate-700 dark:text-slate-300">
            Oven Temperature ({unit === "imperial" ? "°F" : "°C"})
          </Label>
          <Input
            id="ovenTemp"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 375" : "e.g. 190"}
            value={inputs.ovenTemp ?? ""}
            onChange={onOvenTempChange}
            aria-describedby="ovenTemp-desc"
          />
          <p id="ovenTemp-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Typical roasting temps range from 250°F to 500°F (120°C to 260°C).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation updates automatically
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <strong>Chef's Tip:</strong> Always verify doneness with a meat
              thermometer to ensure safety and juiciness.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content with SEO and detailed explanations
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Whole Chicken/Roast Cook Time Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Roasting a whole chicken or a large cut of meat requires precise timing
          to ensure it is cooked thoroughly without drying out. This estimator
          calculates the approximate roasting time based on the weight of the
          chicken and the oven temperature. By inputting these values, home cooks
          can plan their cooking schedule more effectively and achieve consistent
          results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculation uses a standard culinary rule of thumb — approximately 20
          minutes per pound at 350°F — and adjusts the time proportionally based on
          the actual oven temperature. This approach helps accommodate different
          roasting temperatures while maintaining food safety standards.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to remember that this tool provides an estimate. Factors
          such as oven calibration, chicken shape, and whether the bird is stuffed
          can influence actual cooking times. Always use a meat thermometer to
          verify that the internal temperature reaches the USDA recommended 165°F
          (74°C) for poultry.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Whole Chicken/Roast Cook Time Estimator, follow these simple
          steps:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system — Imperial
            (pounds and °F) or Metric (grams and °C).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the weight of your whole chicken or
            roast in the selected units.
          </li>
          <li>
            <strong>Step 3:</strong> Input your oven’s roasting temperature.
            Typical roasting temperatures range between 250°F and 500°F (120°C to
            260°C).
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the estimated roast
            time. Use this as a guideline and always confirm doneness with a meat
            thermometer.
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
              Official USDA guidelines on safe cooking temperatures for poultry and
              other meats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-roast-a-chicken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats: How to Roast a Chicken
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on roasting techniques and timing considerations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.culinarynutrition.com/roasting-chicken/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Culinary Nutrition: Roasting Chicken Safely and Deliciously
            </a>
            <p className="text-slate-500 text-sm">
              Insights on balancing safety and flavor when roasting whole chickens.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Whole Chicken/Roast Cook Time Estimator"
      description="Estimate roasting time for whole chickens. Ensure perfectly cooked poultry by calculating oven time based on weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Cook Time (min) = 20 × Weight (lbs) × (350 / Oven Temperature (°F))",
        variables: [
          { symbol: "Weight (lbs)", description: "Weight of the whole chicken" },
          { symbol: "Oven Temperature (°F)", description: "Oven roasting temperature" },
          { symbol: "Cook Time (min)", description: "Estimated roasting time" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have a 5 lb whole chicken and your oven is set to 375°F. How long should you roast it?",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the time using the formula: 20 × 5 × (350 / 375) = 93.3 minutes.",
          },
          {
            label: "2",
            explanation:
              "Round to the nearest minute: approximately 93 minutes or 1 hr 33 min.",
          },
          {
            label: "3",
            explanation:
              "Use a meat thermometer to confirm the internal temperature reaches 165°F.",
          },
        ],
        result: "Estimated roast time is about 1 hour and 33 minutes.",
      }}
      relatedCalculators={[
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Dough Hydration % Calculator",
          url: "/cooking/dough-hydration-percent",
          icon: "🍞",
        },
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "🥩",
        },
        {
          title: "Volume ↔ Weight Converter",
          url: "/cooking/volume-weight-food-density",
          icon: "🧁",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "📏",
        },
        {
          title: "Turkey Size, Thaw & Cook Time Calculator",
          url: "/cooking/turkey-thaw-cook-time",
          icon: "🥩",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Whole Chicken/Roast Cook Time Estimator" },
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