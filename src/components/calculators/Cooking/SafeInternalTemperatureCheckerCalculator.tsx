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

const USDA_SAFE_TEMPS_F = {
  beef_steak: 145,
  ground_beef: 160,
  pork: 145,
  poultry: 165,
  fish: 145,
  leftovers: 165,
};

const USDA_SAFE_TEMPS_C = {
  beef_steak: 63,
  ground_beef: 71,
  pork: 63,
  poultry: 74,
  fish: 63,
  leftovers: 74,
};

const DANGER_ZONE_F = { min: 40, max: 140 };
const DANGER_ZONE_C = { min: 4, max: 60 };

const MEAT_TYPES = [
  { value: "beef_steak", label: "Beef Steak" },
  { value: "ground_beef", label: "Ground Beef" },
  { value: "pork", label: "Pork" },
  { value: "poultry", label: "Poultry (Chicken, Turkey)" },
  { value: "fish", label: "Fish" },
  { value: "leftovers", label: "Leftovers" },
];

export default function SafeInternalTemperatureCheckerCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    meatType?: string;
    temperature?: string;
  }>({});

  // 2. LOGIC ENGINE (ALL CALCULATIONS HERE)
  const results = useMemo(() => {
    const meatType = inputs.meatType ?? "";
    const tempInput = inputs.temperature ?? "";
    if (!meatType || tempInput.trim() === "") {
      return {
        value: 0,
        label: "Enter meat type and temperature",
        subtext: "",
        warning: null,
      };
    }

    // Parse temperature input
    const temp = Number(tempInput);
    if (isNaN(temp)) {
      return {
        value: 0,
        label: "Invalid temperature input",
        subtext: "",
        warning: null,
      };
    }

    // Select safe temp based on unit and meat type
    const safeTemps =
      unit === "imperial" ? USDA_SAFE_TEMPS_F : USDA_SAFE_TEMPS_C;
    const safeTemp = safeTemps[meatType as keyof typeof safeTemps];
    if (safeTemp === undefined) {
      return {
        value: 0,
        label: "Select a valid meat type",
        subtext: "",
        warning: null,
      };
    }

    // Danger zone limits
    const dangerZone =
      unit === "imperial" ? DANGER_ZONE_F : DANGER_ZONE_C;

    // Determine status
    let labelText = "";
    let subtext = "";
    let warningMsg: string | null = null;

    if (temp < dangerZone.min) {
      labelText = "Too Cold";
      subtext =
        "Food is below safe holding temperature. Risk of bacterial growth.";
      warningMsg =
        "Temperature is below the safe holding range. Keep food refrigerated.";
    } else if (temp >= dangerZone.min && temp <= dangerZone.max) {
      labelText = "Danger Zone";
      subtext =
        "Food is in the temperature danger zone where bacteria multiply rapidly.";
      warningMsg =
        "Warning: Food temperature is in the danger zone (40-140°F or 4-60°C). Cook or refrigerate promptly.";
    } else if (temp >= safeTemp) {
      labelText = "Safe to Eat";
      subtext = `Meets or exceeds USDA recommended internal temperature of ${safeTemp}°${unit === "imperial" ? "F" : "C"}.`;
      warningMsg = null;
    } else {
      labelText = "Almost Safe";
      subtext = `Cook until internal temperature reaches ${safeTemp}°${unit === "imperial" ? "F" : "C"}.`;
      warningMsg = null;
    }

    const displayValue = `${temp}°${unit === "imperial" ? "F" : "C"}`;

    return {
      value: displayValue,
      label: labelText,
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit]);

  const faqs = [
    {
      question: "Why is it important to check internal food temperature?",
      answer:
        "Checking the internal temperature ensures that harmful bacteria are destroyed, preventing foodborne illnesses. It is the most reliable way to confirm food safety beyond appearance or cooking time.",
    },
    {
      question: "What is the 'danger zone' in food safety?",
      answer:
        "The danger zone refers to temperatures between 40°F and 140°F (4°C and 60°C) where bacteria grow rapidly. Keeping food out of this range by proper cooking or refrigeration is essential for safety.",
    },
    {
      question: "Can I use the same safe temperature for all meats?",
      answer:
        "No, different meats require different minimum internal temperatures according to USDA guidelines. For example, poultry requires 165°F (74°C), while beef steaks require 145°F (63°C).",
    },
    {
      question: "How do I measure internal temperature accurately?",
      answer:
        "Use a calibrated digital food thermometer inserted into the thickest part of the meat, avoiding bones and fat. Wait for the reading to stabilize before recording the temperature.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (°F)</SelectItem>
              <SelectItem value="metric">Metric (°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meat Type Select */}
      <div className="space-y-1">
        <Label htmlFor="meatType" className="text-slate-700 dark:text-slate-300">
          Meat Type
        </Label>
        <Select
          id="meatType"
          value={inputs.meatType ?? ""}
          onValueChange={(v) => setInputs((i) => ({ ...i, meatType: v }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select meat type" />
          </SelectTrigger>
          <SelectContent>
            {MEAT_TYPES.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Temperature Input */}
      <div className="space-y-1">
        <Label
          htmlFor="temperature"
          className="text-slate-700 dark:text-slate-300"
        >
          Measured Internal Temperature (°{unit === "imperial" ? "F" : "C"})
        </Label>
        <Input
          id="temperature"
          type="number"
          min={unit === "imperial" ? 0 : -10}
          max={unit === "imperial" ? 250 : 120}
          step="0.1"
          value={inputs.temperature ?? ""}
          onChange={(e) =>
            setInputs((i) => ({ ...i, temperature: e.target.value }))
          }
          placeholder={`Enter temperature in °${unit === "imperial" ? "F" : "C"}`}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
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
              <strong>Chef's Tip:</strong> Always insert the thermometer into
              the thickest part of the meat, avoiding bone or fat, for an
              accurate reading.
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
          Understanding Safe Internal Temperature Checker
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ensuring that food reaches a safe internal temperature is critical to
          preventing foodborne illnesses caused by harmful bacteria such as
          Salmonella, E. coli, and Listeria. Visual cues like color or texture
          are unreliable indicators of doneness. Instead, using a food
          thermometer to measure the internal temperature provides a precise
          and dependable method to confirm safety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The USDA has established minimum safe internal temperatures for
          various types of meat, poultry, fish, and leftovers. Cooking food to
          these temperatures ensures that pathogens are effectively destroyed.
          Additionally, food held between 40°F and 140°F (4°C and 60°C) enters
          the "danger zone," where bacteria multiply rapidly, increasing the
          risk of illness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This Safe Internal Temperature Checker helps you verify if your food
          has reached the recommended temperature or if it remains in the danger
          zone. By selecting the type of meat and entering the measured
          temperature, you receive clear guidance on food safety status,
          helping you cook confidently and protect your health.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this tool is straightforward and designed for accuracy. Begin by
          selecting the type of meat or food item you are checking. Then, enter
          the internal temperature measured with a food thermometer. Choose your
          preferred unit system, either Imperial (°F) or Metric (°C), to match
          your thermometer.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the meat type from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the internal temperature reading from
            your food thermometer.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the unit system (Imperial or Metric).
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see if your food is
            safe to eat or if it requires further cooking or refrigeration.
          </li>
          <li>
            <strong>Step 5:</strong> Follow the guidance provided to ensure food
            safety.
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
              Official guidelines from the United States Department of
              Agriculture on safe cooking temperatures for various foods.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/foodsafety/keep-food-safe.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. CDC Food Safety: Keep Food Safe
            </a>
            <p className="text-slate-500 text-sm">
              Centers for Disease Control and Prevention resources on food
              safety practices and temperature danger zones.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Safe Internal Temperature Checker"
      description="Check safe internal food temperatures. Reference USDA guidelines for meat, poultry, and fish to prevent foodborne illness."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula: "Safe if Measured Temperature ≥ USDA Recommended Temperature",
        variables: [
          { symbol: "Measured Temperature", description: "Food internal temperature" },
          { symbol: "USDA Recommended Temperature", description: "Safe minimum internal temperature for meat type" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You cooked a chicken breast and measured its internal temperature as 160°F. You want to check if it is safe to eat.",
        steps: [
          {
            label: "1",
            explanation:
              "Select 'Poultry' as the meat type and enter 160°F as the measured temperature.",
          },
          {
            label: "2",
            explanation:
              "Click Calculate. The tool compares 160°F to the USDA recommended 165°F for poultry.",
          },
          {
            label: "3",
            explanation:
              "Since 160°F is below 165°F, the tool advises to cook further until 165°F is reached.",
          },
        ],
        result:
          "The chicken is almost safe but needs to be cooked a bit longer to reach the safe internal temperature of 165°F.",
      }}
      relatedCalculators={[
        { title: "Serving Size Multiplier", url: "/cooking/serving-size-multiplier", icon: "🍳" },
        { title: "Defrost Time Estimator", url: "/cooking/defrost-time-fridge-cold-water", icon: "🍞" },
        { title: "Salt % for Brining Calculator", url: "/cooking/salt-percent-brining", icon: "🥩" },
        { title: "Baker’s Percentage Calculator", url: "/cooking/bakers-percentage", icon: "🧁" },
        { title: "Dough Hydration % Calculator", url: "/cooking/dough-hydration-percent", icon: "📏" },
        { title: "Recipe Scaler (x0.5, x2, x3…)", url: "/cooking/recipe-scaler", icon: "🌡️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Safe Internal Temperature Checker" },
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