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

export default function PorkBeefSmokingTimePerLbCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    meatType?: "pork" | "beef";
    weight?: string;
    smokerTemp?: string;
  }>({
    meatType: "pork",
    weight: "",
    smokerTemp: "225",
  });

  // USDA recommended safe internal temps (°F and °C)
  const USDA_SAFE_TEMP_F = 145; // For pork and beef (rested)
  const USDA_SAFE_TEMP_C = 63;

  // Danger zone temps (°F and °C)
  const DANGER_ZONE_LOW_F = 40;
  const DANGER_ZONE_HIGH_F = 140;
  const DANGER_ZONE_LOW_C = 4.4;
  const DANGER_ZONE_HIGH_C = 60;

  // Smoking time per lb based on meat type and smoker temp range (approximate)
  // Source: USDA, Serious Eats, Meat Smoking Guides
  // Times are in hours per pound at ~225°F (107°C)
  // Adjust time by smoker temp ratio (e.g. higher temp = less time)
  // Formula: baseTimePerLb * (225 / smokerTemp)
  // Base times:
  // Pork Shoulder: 1.5 to 2 hours per lb at 225°F
  // Beef Brisket: 1 to 1.5 hours per lb at 225°F

  // We'll use average base times:
  // Pork: 1.75 hr/lb
  // Beef: 1.25 hr/lb

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightLb = parseFloat(inputs.weight || "0");
    const smokerTempInput = parseFloat(inputs.smokerTemp || "0");

    if (
      !inputs.meatType ||
      isNaN(weightLb) ||
      weightLb <= 0 ||
      isNaN(smokerTempInput) ||
      smokerTempInput < 180 ||
      smokerTempInput > 300
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Calculate base time per lb
    let baseTimePerLb = 0;
    if (inputs.meatType === "pork") baseTimePerLb = 1.75;
    else if (inputs.meatType === "beef") baseTimePerLb = 1.25;

    // Adjust time based on smoker temp (inverse proportional)
    // Clamp smokerTempInput between 180 and 300 for safety
    const smokerTemp = Math.min(Math.max(smokerTempInput, 180), 300);
    const timePerLb = baseTimePerLb * (225 / smokerTemp);

    // Total smoking time in hours
    const totalTimeHours = timePerLb * weightLb;

    // Format time as hours and minutes
    const hours = Math.floor(totalTimeHours);
    const minutes = Math.round((totalTimeHours - hours) * 60);

    // Food safety warning if smoker temp is in danger zone (40-140°F)
    let warning: string | null = null;
    if (
      smokerTemp >= DANGER_ZONE_LOW_F &&
      smokerTemp <= DANGER_ZONE_HIGH_F
    ) {
      warning =
        "Warning: Smoker temperature is in the USDA 'Danger Zone' (40°F - 140°F). Cooking at this temperature risks bacterial growth and unsafe meat.";
    }

    // Result label and subtext
    const label = `Estimated Smoking Time for ${inputs.meatType === "pork" ? "Pork Shoulder" : "Beef Brisket"}`;
    const subtext = `At ${smokerTemp}°${unit === "imperial" ? "F" : "C"}, smoking ${weightLb} ${unit === "imperial" ? "lbs" : "kg"} will take approximately ${hours} hour${hours !== 1 ? "s" : ""}${minutes > 0 ? ` and ${minutes} minute${minutes !== 1 ? "s" : ""}` : ""}.`;

    // Convert weight to kg if metric
    const weightDisplay =
      unit === "imperial"
        ? weightLb.toFixed(2) + " lbs"
        : (weightLb * 0.453592).toFixed(2) + " kg";

    return {
      value: `${hours}h ${minutes}m`,
      label,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the ideal smoker temperature for pork shoulder and beef brisket?",
      answer:
        "The ideal smoker temperature for both pork shoulder and beef brisket is typically around 225°F (107°C). This low and slow method ensures tender, juicy meat with a flavorful smoke ring. Temperatures between 225°F and 250°F are common for consistent results.",
    },
    {
      question: "Why is it important to avoid the 'danger zone' temperature range when smoking meat?",
      answer:
        "The USDA defines the 'danger zone' as 40°F to 140°F (4.4°C to 60°C), where bacteria can multiply rapidly. Smoking meat within this range for extended periods risks foodborne illness. Maintaining smoker temps above 140°F ensures safe cooking and proper pathogen destruction.",
    },
    {
      question: "How does meat weight affect smoking time?",
      answer:
        "Smoking time scales roughly linearly with meat weight. Larger cuts require more time to reach safe internal temperatures. This calculator estimates time per pound to help plan your smoking session accurately, but always verify doneness with a meat thermometer.",
    },
    {
      question: "Can I speed up smoking by increasing the temperature?",
      answer:
        "Increasing smoker temperature will reduce cooking time but may compromise tenderness and smoke flavor. High temps risk drying out the meat or uneven cooking. It's best to stay within recommended ranges (225°F-250°F) for optimal results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(
    field: keyof typeof inputs,
    value: string | undefined
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Convert weight input placeholder based on unit
  const weightPlaceholder = unit === "imperial" ? "Weight in lbs" : "Weight in kg";

  // Convert smoker temp placeholder based on unit
  const smokerTempPlaceholder = unit === "imperial" ? "Smoker Temp °F (180-300)" : "Smoker Temp °C (82-149)";

  // Convert smoker temp input to Fahrenheit internally if metric
  // For calculation, convert °C to °F if unit is metric
  // For display, keep input in selected unit

  // On Calculate button click, parse inputs and trigger calculation (already memoized)

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={(val) => setUnit(val as "imperial" | "metric")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (°F / lbs)</SelectItem>
              <SelectItem value="metric">Metric (°C / kg)</SelectItem>
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
          onValueChange={(val) => onInputChange("meatType", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Meat Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pork">Pork Shoulder</SelectItem>
            <SelectItem value="beef">Beef Brisket</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="0.01"
          placeholder={weightPlaceholder}
          value={inputs.weight || ""}
          onChange={(e) => onInputChange("weight", e.target.value)}
          aria-describedby="weightHelp"
        />
      </div>

      {/* Smoker Temperature Input */}
      <div className="space-y-2">
        <Label htmlFor="smokerTemp" className="text-slate-700 dark:text-slate-300">
          Smoker Temperature ({unit === "imperial" ? "°F" : "°C"})
        </Label>
        <Input
          id="smokerTemp"
          type="number"
          min={unit === "imperial" ? 180 : 82}
          max={unit === "imperial" ? 300 : 149}
          step="1"
          placeholder={smokerTempPlaceholder}
          value={inputs.smokerTemp || ""}
          onChange={(e) => onInputChange("smokerTemp", e.target.value)}
          aria-describedby="tempHelp"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger calculation by updating state (already reactive)
            // No extra action needed here
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              meatType: "pork",
              weight: "",
              smokerTemp: unit === "imperial" ? "225" : "107",
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
              <strong>Chef's Tip:</strong> Always use a reliable meat thermometer to
              verify internal temperature. Smoking times vary by smoker,
              weather, and meat thickness.
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
          Understanding Pork/Beef Smoking Time per lb
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Smoking pork shoulder and beef brisket is a time-honored culinary
          tradition that requires patience and precision. The smoking time
          depends primarily on the weight of the meat and the temperature of
          your smoker. Low and slow cooking at around 225°F (107°C) allows the
          connective tissues to break down, resulting in tender, flavorful
          meat.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The USDA recommends cooking pork and beef to a safe internal
          temperature of at least 145°F (63°C) followed by a rest period. Smoking
          times typically range from 1 to 2 hours per pound depending on the cut
          and smoker temperature. This calculator helps estimate your smoking
          time based on these factors to plan your BBQ session effectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember that factors such as meat thickness, smoker consistency, and
          ambient weather conditions can affect cooking times. Always use a
          meat thermometer to ensure food safety and optimal doneness.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, select your meat type (pork shoulder or beef
          brisket), enter the weight of the meat, and input your smoker
          temperature. The calculator will estimate the total smoking time based
          on these inputs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the meat type you are smoking.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the weight of your meat in pounds or
            kilograms depending on your unit preference.
          </li>
          <li>
            <strong>Step 3:</strong> Input your smoker temperature. Typical
            smoking temps range from 180°F to 300°F (82°C to 149°C).
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to get your estimated
            smoking time. Use a meat thermometer to confirm doneness.
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
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-minimum-internal-temperature-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Safe Minimum Internal Temperature Chart
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA guidelines on safe cooking temperatures for pork,
              beef, and other meats to ensure food safety.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-smoke-pork-shoulder-brisket"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats Smoking Guides
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on smoking techniques, times, and temperatures for
              pork shoulder and beef brisket.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/bakers-percentage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. King Arthur Baking - Baker's Math (for reference)
            </a>
            <p className="text-slate-500 text-sm">
              While focused on baking, this resource explains ratios and
              percentages useful for culinary calculations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pork/Beef Smoking Time per lb"
      description="Plan your BBQ smoking session. Calculate cooking time per pound for pork shoulders or beef briskets at low temperatures."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Smoking Time (hours) = Weight (lbs) × Base Time per lb (hr) × (225 / Smoker Temp °F)",
        variables: [
          { symbol: "Weight (lbs)", description: "Weight of meat in pounds" },
          {
            symbol: "Base Time per lb (hr)",
            description:
              "1.75 hr/lb for pork shoulder, 1.25 hr/lb for beef brisket at 225°F",
          },
          {
            symbol: "Smoker Temp (°F)",
            description: "Temperature of smoker (typically 180°F - 300°F)",
          },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Calculate smoking time for a 6 lb pork shoulder at 225°F smoker temperature.",
        steps: [
          {
            label: "1",
            explanation:
              "Use base time per lb for pork shoulder: 1.75 hours.",
          },
          {
            label: "2",
            explanation:
              "Calculate: 6 lbs × 1.75 hr/lb × (225 / 225) = 10.5 hours.",
          },
        ],
        result: "Estimated smoking time is 10 hours and 30 minutes.",
      }}
      relatedCalculators={[
        {
          title: "Sugar/Butter/Flour Density Lookup",
          url: "/cooking/sugar-butter-flour-density-lookup",
          icon: "🍰",
        },
        {
          title: "Pasta Dry ↔ Cooked Yield & Portions",
          url: "/cooking/pasta-dry-cooked-yield-portions",
          icon: "🍞",
        },
        {
          title: "Whole Chicken/Roast Cook Time Estimator",
          url: "/cooking/whole-chicken-roast-cook-time",
          icon: "🥩",
        },
        {
          title: "Icing/Frosting Coverage by Cake Size",
          url: "/cooking/icing-frosting-coverage-cake-size",
          icon: "🍰",
        },
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Pork/Beef Smoking Time per lb" },
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