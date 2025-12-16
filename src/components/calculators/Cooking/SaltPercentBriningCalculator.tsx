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

export default function SaltPercentBriningCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    meatType: string;
    meatWeight: string;
    saltPercent: string;
  }>({
    meatType: "chicken",
    meatWeight: "",
    saltPercent: "5",
  });

  // 2. CONSTANTS & DATA

  // USDA safe internal temps (°F and °C)
  const USDA_SAFE_TEMPS = {
    chicken: { f: 165, c: 74 },
    turkey: { f: 165, c: 74 },
    pork: { f: 145, c: 63 },
    beef: { f: 145, c: 63 },
    lamb: { f: 145, c: 63 },
    fish: { f: 145, c: 63 },
  };

  // Typical salt % for brining (weight of salt relative to water weight)
  // Commonly 4-8% salt in brine; 5% is a good default.
  // We will calculate salt weight based on meat weight and brine ratio.
  // Typical brine ratio: 1 gallon water per 5 lbs meat (imperial)
  // or 4 liters water per 2.27 kg meat (metric)
  // Salt weight = water weight * saltPercent

  // Water density approx 1g/ml or 8.34 lbs/gal

  // Conversion helpers
  const lbsToKg = (lbs: number) => lbs * 0.45359237;
  const kgToLbs = (kg: number) => kg / 0.45359237;
  const galToL = (gal: number) => gal * 3.78541;
  const lToGal = (l: number) => l / 3.78541;

  // 3. LOGIC ENGINE
  const results = useMemo(() => {
    const meatWeightNum = parseFloat(inputs.meatWeight);
    const saltPercentNum = parseFloat(inputs.saltPercent);

    if (
      !meatWeightNum ||
      meatWeightNum <= 0 ||
      !saltPercentNum ||
      saltPercentNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Determine brine water volume based on meat weight
    // USDA suggests about 1 gallon water per 5 lbs meat (imperial)
    // or about 4 liters water per 2.27 kg meat (metric)
    let waterWeightGrams = 0;
    let meatWeightGrams = 0;

    if (unit === "imperial") {
      // meatWeightNum in lbs
      meatWeightGrams = meatWeightNum * 453.59237;
      // water volume in gallons
      const waterGallons = meatWeightNum / 5;
      // water weight in lbs (approx 8.34 lbs/gal)
      const waterWeightLbs = waterGallons * 8.34;
      waterWeightGrams = waterWeightLbs * 453.59237;
    } else {
      // metric: meatWeightNum in kg
      meatWeightGrams = meatWeightNum * 1000;
      // water volume in liters
      const waterLiters = (meatWeightNum / 2.27) * 4;
      // water weight in grams (1L water = 1000g)
      waterWeightGrams = waterLiters * 1000;
    }

    // Salt weight = waterWeight * saltPercent%
    // saltPercentNum is % (e.g. 5 means 5%)
    const saltWeightGrams = (waterWeightGrams * saltPercentNum) / 100;

    // Convert salt weight to user units
    let saltWeightDisplay = 0;
    let saltUnit = "";

    if (unit === "imperial") {
      saltWeightDisplay = saltWeightGrams / 453.59237; // lbs
      saltUnit = "lbs";
      // For small amounts, convert to oz if < 0.1 lbs
      if (saltWeightDisplay < 0.1) {
        saltWeightDisplay = saltWeightDisplay * 16;
        saltUnit = "oz";
      }
    } else {
      saltWeightDisplay = saltWeightGrams;
      saltUnit = "g";
      if (saltWeightDisplay > 1000) {
        saltWeightDisplay = saltWeightDisplay / 1000;
        saltUnit = "kg";
      }
    }

    // Round to 2 decimals
    saltWeightDisplay = Math.round(saltWeightDisplay * 100) / 100;

    // Food safety warning: If salt % is too low (<3%), warn about insufficient preservation
    let warning: string | null = null;
    if (saltPercentNum < 3) {
      warning =
        "Warning: Salt percentage below 3% may not adequately preserve the meat during brining.";
    }

    return {
      value: `${saltWeightDisplay} ${saltUnit}`,
      label: `Salt needed for ${inputs.meatWeight} ${
        unit === "imperial" ? "lbs" : "kg"
      } of ${inputs.meatType}`,
      subtext: `Using a ${saltPercentNum}% salt brine ratio.`,
      warning,
    };
  }, [inputs, unit]);

  // 4. FAQS
  const faqs = [
    {
      question: "What is the ideal salt percentage for brining?",
      answer:
        "A typical salt concentration for brining ranges from 4% to 8%. Five percent is a balanced choice that enhances flavor and moisture retention without making the meat too salty. Adjust based on meat type and personal preference.",
    },
    {
      question: "Why is salt percentage important in brining?",
      answer:
        "Salt percentage controls the osmotic balance, allowing the meat to absorb water and flavor. Too little salt won't preserve or flavor properly, while too much can make the meat overly salty and tough.",
    },
    {
      question: "How much water should I use for brining?",
      answer:
        "A common ratio is 1 gallon of water per 5 pounds of meat (imperial) or about 4 liters per 2.27 kilograms (metric). This ensures the meat is fully submerged and brines evenly.",
    },
    {
      question: "Is it safe to brine meat at room temperature?",
      answer:
        "No. Meat should be brined in the refrigerator to prevent bacterial growth. The USDA recommends keeping meat below 40°F (4°C) during brining to avoid the danger zone where pathogens multiply rapidly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 5. HANDLERS
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleReset() {
    setInputs({
      meatType: "chicken",
      meatWeight: "",
      saltPercent: "5",
    });
  }

  // 6. UI WIDGET
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
              <SelectItem value="imperial">Imperial (lbs / °F)</SelectItem>
              <SelectItem value="metric">Metric (kg / °C)</SelectItem>
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
          name="meatType"
          value={inputs.meatType}
          onChange={handleInputChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chicken">Chicken</SelectItem>
            <SelectItem value="turkey">Turkey</SelectItem>
            <SelectItem value="pork">Pork</SelectItem>
            <SelectItem value="beef">Beef</SelectItem>
            <SelectItem value="lamb">Lamb</SelectItem>
            <SelectItem value="fish">Fish</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Meat Weight */}
      <div className="space-y-1">
        <Label
          htmlFor="meatWeight"
          className="text-slate-700 dark:text-slate-300"
        >
          Meat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="meatWeight"
          name="meatWeight"
          type="number"
          min={0}
          step="any"
          value={inputs.meatWeight}
          onChange={handleInputChange}
          placeholder={`Enter meat weight in ${unit === "imperial" ? "lbs" : "kg"}`}
        />
      </div>

      {/* Salt Percentage */}
      <div className="space-y-1">
        <Label
          htmlFor="saltPercent"
          className="text-slate-700 dark:text-slate-300"
        >
          Salt Percentage (%) for Brine
        </Label>
        <Input
          id="saltPercent"
          name="saltPercent"
          type="number"
          min={1}
          max={15}
          step="any"
          value={inputs.saltPercent}
          onChange={handleInputChange}
          placeholder="Typical 4-8%"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={(e) => e.preventDefault()}
          type="submit"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
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
              <strong>Chef's Tip:</strong> Always brine meat in the refrigerator to
              keep it safe from bacterial growth. Use a digital scale for precise
              salt measurements to ensure balanced flavor and food safety.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 7. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Salt % for Brining Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Brining is a culinary technique that involves soaking meat in a saltwater
          solution to enhance moisture retention, tenderness, and flavor. The salt
          percentage in the brine is critical because it controls the osmotic
          balance, allowing the meat to absorb water and seasoning effectively.
          Using the right salt concentration ensures your meat stays juicy and
          flavorful without becoming overly salty.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator helps you determine the precise amount of salt needed for
          your brine based on the weight of your meat and your preferred salt
          concentration. It factors in standard brine-to-meat ratios recommended by
          culinary experts and food safety authorities like the USDA. Whether you
          are preparing chicken, pork, beef, or fish, this tool ensures your brine
          is perfectly balanced for optimal results.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, select your meat type, enter the weight of the
          meat, and specify the salt percentage you want in your brine. The
          calculator will provide the exact amount of salt needed to create a
          balanced brine solution. Remember, typical salt percentages range from 4%
          to 8%, with 5% being a common choice for general use.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the unit system (Imperial or Metric)
            based on your preference.
          </li>
          <li>
            <strong>Step 2:</strong> Select the type of meat you are brining.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the weight of the meat accurately using
            a kitchen scale.
          </li>
          <li>
            <strong>Step 4:</strong> Input your desired salt percentage for the
            brine (typically 4-8%).
          </li>
          <li>
            <strong>Step 5:</strong> Review the calculated salt amount and prepare
            your brine accordingly. Always brine meat in the refrigerator.
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
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-thawing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety and Inspection Service (FSIS)
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines on safe meat handling, brining, and internal cooking
              temperatures to prevent foodborne illness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/bakers-percentage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking - Baker's Percentage Guide
            </a>
            <p className="text-slate-500 text-sm">
              Explanation of baker's math and ingredient ratios, useful for precise
              culinary calculations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/brining-meat-salt-water"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats - The Food Lab: Brining Meat
            </a>
            <p className="text-slate-500 text-sm">
              In-depth culinary science behind brining, salt percentages, and meat
              texture.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Salt % for Brining Calculator"
      description="Calculate the perfect brine ratio. Determine the exact amount of salt needed for wet brining meats to ensure flavor and moisture."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Salt Weight = (Meat Weight / Meat-to-Water Ratio) × Water Density × Salt %",
        variables: [
          { symbol: "Meat Weight", description: "Weight of meat (lbs or kg)" },
          {
            symbol: "Meat-to-Water Ratio",
            description:
              "Typical ratio: 5 lbs meat per 1 gallon water (imperial) or 2.27 kg meat per 4 L water (metric)",
          },
          { symbol: "Water Density", description: "8.34 lbs/gal or 1 kg/L" },
          { symbol: "Salt %", description: "Desired salt concentration in brine" },
          { symbol: "Salt Weight", description: "Amount of salt needed" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Calculating salt needed to brine 10 lbs of chicken with a 5% salt brine (imperial units).",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate water volume: 10 lbs ÷ 5 = 2 gallons water needed.",
          },
          {
            label: "2",
            explanation:
              "Calculate water weight: 2 gallons × 8.34 lbs/gallon = 16.68 lbs water.",
          },
          {
            label: "3",
            explanation:
              "Calculate salt weight: 16.68 lbs × 5% = 0.834 lbs salt required.",
          },
        ],
        result: "Use approximately 0.83 lbs (13.3 oz) of salt for the brine.",
      }}
      relatedCalculators={[
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "⚖️",
        },
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
        {
          title: "Turkey Size, Thaw & Cook Time Calculator",
          url: "/cooking/turkey-thaw-cook-time",
          icon: "🥩",
        },
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "🧁",
        },
        {
          title: "Oil for Frying Calculator",
          url: "/cooking/oil-for-frying-pan-depth-volume",
          icon: "📏",
        },
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Salt % for Brining Calculator" },
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