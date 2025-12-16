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

export default function PorkBeefSmokingTimePerLbCalculator() {
  // Inputs:
  // - Meat Type: Pork Shoulder or Beef Brisket
  // - Weight (number)
  // - Weight Unit: lb or kg
  // - Smoker Temperature (°F or °C depending on unit system)
  // Output:
  // - Estimated total smoking time
  // - Warnings if smoker temp in danger zone (40-140°F)
  // - Chef tip about resting meat or temp monitoring

  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    meatType?: "pork" | "beef";
    weight?: string;
    weightUnit?: "lb" | "kg";
    smokerTemp?: string;
  }>({
    meatType: "pork",
    weightUnit: "lb",
  });

  // Constants for cooking time per lb at recommended smoker temps:
  // Source: USDA and BBQ culinary standards
  // Pork shoulder: ~1.5 to 2 hours per lb at 225°F (107°C)
  // Beef brisket: ~1 to 1.5 hours per lb at 225°F (107°C)
  // We'll use average values and scale time linearly with smoker temp deviation.
  // If smoker temp is lower than 225°F, time increases proportionally.
  // If higher, time decreases but warn if > 300°F (too hot for low and slow).

  // Danger zone for meat safety: 40°F - 140°F (4.4°C - 60°C)
  // Smoker temp should be above 140°F for safe cooking.

  // Conversion helpers
  const lbToKg = 0.45359237;
  const kgToLb = 1 / lbToKg;
  const fToC = (f: number) => ((f - 32) * 5) / 9;
  const cToF = (c: number) => (c * 9) / 5 + 32;

  // Cooking time base per lb at 225°F (107°C)
  const baseTempsF = 225;
  const baseTempsC = fToC(baseTempsF);

  // Time per lb in hours for pork and beef at base temp
  const baseTimePerLb = {
    pork: 1.75, // average 1.5-2 hours
    beef: 1.25, // average 1-1.5 hours
  };

  // Danger zone constants
  const dangerZoneF = { low: 40, high: 140 };
  const dangerZoneC = { low: 4.4, high: 60 };

  // Max recommended smoker temp for low and slow
  const maxRecommendedF = 300;
  const maxRecommendedC = fToC(maxRecommendedF);

  // Parse inputs safely
  const weightNum = inputs.weight ? parseFloat(inputs.weight) : NaN;
  const smokerTempNum = inputs.smokerTemp ? parseFloat(inputs.smokerTemp) : NaN;

  // Calculate results
  const results = useMemo(() => {
    // Validate inputs
    if (
      !inputs.meatType ||
      !inputs.weightUnit ||
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(smokerTempNum)
    ) {
      return {
        value: 0,
        label: "Enter all inputs to calculate",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to lb if needed
    let weightLb: number;
    if (inputs.weightUnit === "kg") {
      weightLb = weightNum * kgToLb;
    } else {
      weightLb = weightNum;
    }

    // Convert smoker temp to °F for calculation if metric
    let smokerTempF: number;
    if (unit === "metric") {
      smokerTempF = cToF(smokerTempNum);
    } else {
      smokerTempF = smokerTempNum;
    }

    // Safety warning if smoker temp in danger zone
    let warningMsg: string | null = null;
    if (
      smokerTempF >= dangerZoneF.low &&
      smokerTempF <= dangerZoneF.high
    ) {
      warningMsg =
        "Warning: Smoker temperature is in the USDA Danger Zone (40-140°F). Cooking may be unsafe.";
    } else if (smokerTempF < dangerZoneF.low) {
      warningMsg =
        "Warning: Smoker temperature is below 40°F. Cooking will not proceed safely.";
    } else if (smokerTempF > maxRecommendedF) {
      warningMsg =
        "Warning: Smoker temperature is above 300°F. This is too hot for low and slow smoking and may dry out the meat.";
    }

    // Calculate time multiplier based on smoker temp relative to base 225°F
    // Linear scale: time ∝ (225 / smokerTempF)
    // Clamp smokerTempF to minimum 100°F to avoid extreme values
    const effectiveTempF = Math.max(smokerTempF, 100);
    const timeMultiplier = baseTempsF / effectiveTempF;

    // Calculate total smoking time in hours
    const baseTime = baseTimePerLb[inputs.meatType];
    const totalTimeHours = weightLb * baseTime * timeMultiplier;

    // Format time nicely: hours and minutes
    const hours = Math.floor(totalTimeHours);
    const minutes = Math.round((totalTimeHours - hours) * 60);

    const timeStr =
      hours > 0
        ? minutes > 0
          ? `${hours} hr ${minutes} min`
          : `${hours} hr`
        : `${minutes} min`;

    // Label text
    const labelText = `Estimated Smoking Time for ${weightNum} ${
      inputs.weightUnit === "kg" ? "kg" : "lb"
    } of ${inputs.meatType === "pork" ? "Pork Shoulder" : "Beef Brisket"}`;

    // Subtext with recommended smoker temp and note
    const recommendedTempStr =
      unit === "imperial"
        ? `${baseTempsF}°F`
        : `${baseTempsC.toFixed(1)}°C`;

    const subtext = `Based on a smoker temperature of ${smokerTempNum.toFixed(
      1
    )}°${unit === "imperial" ? "F" : "C"}. Recommended smoker temp is ${recommendedTempStr}.`;

    return {
      value: timeStr,
      label: labelText,
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit, weightNum, smokerTempNum]);

  // FAQs
  const faqs = [
    {
      question: "What is the ideal smoker temperature for pork shoulder and beef brisket?",
      answer:
        "The ideal smoker temperature for low and slow cooking pork shoulder and beef brisket is around 225°F (107°C). This temperature allows the meat to cook evenly and become tender without drying out. Cooking at this temperature typically results in the best flavor and texture.",
    },
    {
      question: "Why is it important to avoid the USDA Danger Zone during smoking?",
      answer:
        "The USDA Danger Zone (40-140°F or 4.4-60°C) is the temperature range where bacteria can rapidly multiply, increasing the risk of foodborne illness. Maintaining smoker temperatures above 140°F ensures that the meat cooks safely and reduces the risk of harmful bacteria growth.",
    },
    {
      question: "How does smoker temperature affect smoking time?",
      answer:
        "Smoking time is inversely proportional to smoker temperature. If the smoker temperature is lower than the recommended 225°F, the cooking time increases to ensure the meat reaches a safe internal temperature. Conversely, higher temperatures reduce cooking time but may risk drying out the meat if too high.",
    },
    {
      question: "Can I use this calculator for other types of meat?",
      answer:
        "This calculator is specifically designed for pork shoulder and beef brisket due to their similar low and slow cooking profiles. For other meats, cooking times and temperatures vary significantly, so it's best to consult specific guidelines or use a dedicated calculator.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(
    field: keyof typeof inputs,
    value: string | "pork" | "beef" | "lb" | "kg"
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Reset inputs
  function onReset() {
    setInputs({
      meatType: "pork",
      weightUnit: "lb",
      weight: "",
      smokerTemp: "",
    });
  }

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
              <SelectItem value="imperial">Imperial (lb, °F)</SelectItem>
              <SelectItem value="metric">Metric (kg, °C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meat Type */}
      <div className="space-y-1">
        <Label htmlFor="meatType" className="text-slate-700 dark:text-slate-300">
          Meat Type
        </Label>
        <Select
          id="meatType"
          value={inputs.meatType}
          onValueChange={(val) => onInputChange("meatType", val as "pork" | "beef")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select meat type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pork">Pork Shoulder</SelectItem>
            <SelectItem value="beef">Beef Brisket</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight and Unit */}
      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-1">
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lb" : "kg"}`}
            value={inputs.weight ?? ""}
            onChange={(e) => onInputChange("weight", e.target.value)}
          />
        </div>
        <div className="w-[100px] space-y-1">
          <Label htmlFor="weightUnit" className="text-slate-700 dark:text-slate-300">
            Unit
          </Label>
          <Select
            id="weightUnit"
            value={inputs.weightUnit}
            onValueChange={(val) => onInputChange("weightUnit", val as "lb" | "kg")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unit === "imperial" ? (
                <SelectItem value="lb">lb</SelectItem>
              ) : (
                <SelectItem value="kg">kg</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Smoker Temperature */}
      <div className="space-y-1">
        <Label htmlFor="smokerTemp" className="text-slate-700 dark:text-slate-300">
          Smoker Temperature (°{unit === "imperial" ? "F" : "C"})
        </Label>
        <Input
          id="smokerTemp"
          type="number"
          min={0}
          step="any"
          placeholder={`Enter smoker temperature in °${unit === "imperial" ? "F" : "C"}`}
          value={inputs.smokerTemp ?? ""}
          onChange={(e) => onInputChange("smokerTemp", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          aria-label="Calculate smoking time"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
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
            <ChefHat className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Chef's Tip:</strong> Use a digital meat thermometer to monitor internal temperature for perfect doneness and food safety.
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
          Smoking pork shoulder and beef brisket is a culinary art that requires patience and precision. These cuts are best cooked low and slow, typically at around 225°F (107°C), to break down connective tissues and render fat, resulting in tender, flavorful meat. The smoking time depends largely on the weight of the meat and the consistency of the smoker temperature.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator helps you estimate the total smoking time based on your meat's weight and smoker temperature. It adjusts the time proportionally if your smoker temperature deviates from the ideal 225°F, ensuring you can plan your cooking session accurately. Remember, maintaining a steady smoker temperature is crucial for the best results.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this tool, select your preferred unit system (Imperial or Metric), choose the type of meat you are smoking, enter the weight of the meat, and input your smoker's current temperature. The calculator will provide an estimated smoking time tailored to your inputs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the meat type (Pork Shoulder or Beef Brisket).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the weight of your meat in pounds or kilograms.
          </li>
          <li>
            <strong>Step 3:</strong> Input the smoker temperature in °F or °C.
          </li>
          <li>
            <strong>Step 4:</strong> Review the estimated smoking time and any safety warnings.
          </li>
          <li>
            <strong>Step 5:</strong> Use a meat thermometer during cooking to ensure safe internal temperatures.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Culinary FAQ</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
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
              Official guidelines on safe cooking temperatures for various meats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://amazingribs.com/tested-recipes/pork-recipes/pork-shoulder-smoke-time-temperature"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. AmazingRibs.com - Pork Shoulder Smoke Time & Temperature
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on smoking pork shoulder low and slow.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.smoking-meat.com/beef-brisket-smoking-time-temperature/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Smoking-Meat.com - Beef Brisket Smoking Time & Temperature
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on smoking beef brisket safely and deliciously.
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
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula: "Total Time (hours) = Weight (lb) × Base Time per lb (hours) × (225°F / Smoker Temp °F)",
        variables: [
          { symbol: "Weight (lb)", description: "Weight of meat in pounds" },
          {
            symbol: "Base Time per lb (hours)",
            description: "Standard cooking time per pound at 225°F (1.75 for pork, 1.25 for beef)",
          },
          {
            symbol: "Smoker Temp °F",
            description: "Actual smoker temperature in degrees Fahrenheit",
          },
          {
            symbol: "Total Time (hours)",
            description: "Estimated total smoking time in hours",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have a 5 lb pork shoulder and your smoker is steady at 200°F. Calculate the smoking time.",
        steps: [
          {
            label: "1",
            explanation:
              "Base time per lb for pork is 1.75 hours. Calculate time multiplier: 225 / 200 = 1.125.",
          },
          {
            label: "2",
            explanation:
              "Total time = 5 lb × 1.75 hr/lb × 1.125 = 9.84 hours (~9 hr 50 min).",
          },
        ],
        result: "Estimated smoking time is approximately 9 hours and 50 minutes.",
      }}
      relatedCalculators={[
        {
          title: "Chocolate/Butter Tempering Temperature",
          url: "/cooking/chocolate-butter-tempering-temperature",
          icon: "🌡️",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🍞",
        },
        {
          title: "Rice:Water Ratio & Yield Calculator",
          url: "/cooking/rice-water-ratio-yield",
          icon: "🥩",
        },
        {
          title: "Sugar/Butter/Flour Density Lookup",
          url: "/cooking/sugar-butter-flour-density-lookup",
          icon: "🍰",
        },
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "📏",
        },
        {
          title: "Volume ↔ Weight Converter",
          url: "/cooking/volume-weight-food-density",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Pork/Beef Smoking Time per lb" },
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