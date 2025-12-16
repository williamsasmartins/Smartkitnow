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

type ChocolateType = "dark" | "milk" | "white";
type ButterType = "unsalted" | "salted";

const CHOCOLATE_TEMPS = {
  dark: {
    melting: { c: 45, f: 113 },
    cooling: { c: 27, f: 80.6 },
    working: { c: 31, f: 87.8 },
  },
  milk: {
    melting: { c: 40, f: 104 },
    cooling: { c: 26, f: 78.8 },
    working: { c: 29, f: 84.2 },
  },
  white: {
    melting: { c: 40, f: 104 },
    cooling: { c: 26, f: 78.8 },
    working: { c: 29, f: 84.2 },
  },
};

const BUTTER_TEMPS = {
  unsalted: {
    melting: { c: 32, f: 90 },
    cooling: { c: 20, f: 68 },
    working: { c: 22, f: 72 },
  },
  salted: {
    melting: { c: 32, f: 90 },
    cooling: { c: 20, f: 68 },
    working: { c: 22, f: 72 },
  },
};

export default function ChocolateButterTemperingTemperatureCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    ingredientType: "chocolate" | "butter" | "";
    chocolateType: ChocolateType | "";
    butterType: ButterType | "";
  }>({
    ingredientType: "",
    chocolateType: "",
    butterType: "",
  });

  // 2. LOGIC ENGINE (ALL CALCULATIONS HERE)
  const results = useMemo(() => {
    // Validation
    if (!inputs.ingredientType) {
      return {
        value: 0,
        label: "Please select ingredient type",
        subtext: "",
        warning: null,
      };
    }

    // Determine temperature sets based on ingredient and subtype
    let temps:
      | typeof CHOCOLATE_TEMPS.dark
      | typeof BUTTER_TEMPS.unsalted
      | null = null;

    if (inputs.ingredientType === "chocolate") {
      if (
        inputs.chocolateType === "dark" ||
        inputs.chocolateType === "milk" ||
        inputs.chocolateType === "white"
      ) {
        temps = CHOCOLATE_TEMPS[inputs.chocolateType];
      } else {
        return {
          value: 0,
          label: "Please select chocolate type",
          subtext: "",
          warning: null,
        };
      }
    } else if (inputs.ingredientType === "butter") {
      if (inputs.butterType === "unsalted" || inputs.butterType === "salted") {
        temps = BUTTER_TEMPS[inputs.butterType];
      } else {
        return {
          value: 0,
          label: "Please select butter type",
          subtext: "",
          warning: null,
        };
      }
    }

    if (!temps) {
      return {
        value: 0,
        label: "Invalid selection",
        subtext: "",
        warning: null,
      };
    }

    // Prepare display strings based on unit
    const meltingTemp =
      unit === "imperial" ? temps.melting.f : temps.melting.c;
    const coolingTemp =
      unit === "imperial" ? temps.cooling.f : temps.cooling.c;
    const workingTemp =
      unit === "imperial" ? temps.working.f : temps.working.c;

    const unitLabel = unit === "imperial" ? "°F" : "°C";

    const displayValue = (
      <>
        <div>
          <strong>Melting Point:</strong> {meltingTemp}
          {unitLabel}
        </div>
        <div>
          <strong>Cooling Point:</strong> {coolingTemp}
          {unitLabel}
        </div>
        <div>
          <strong>Working Temperature:</strong> {workingTemp}
          {unitLabel}
        </div>
      </>
    );

    const labelText =
      inputs.ingredientType === "chocolate"
        ? `${inputs.chocolateType.charAt(0).toUpperCase() +
            inputs.chocolateType.slice(1)} Chocolate Tempering Temps`
        : `${inputs.butterType.charAt(0).toUpperCase() +
            inputs.butterType.slice(1)} Butter Tempering Temps`;

    // No safety warnings needed here since temps are safe for chocolate/butter

    const subtext =
      "Temper chocolate or butter carefully to achieve the best texture and shine.";

    return {
      value: displayValue,
      label: labelText,
      subtext,
      warning: null,
    };
  }, [inputs, unit]);

  const faqs = [
    {
      question: "Why is tempering chocolate important?",
      answer:
        "Tempering chocolate ensures that the cocoa butter crystals are stable, resulting in a glossy finish, firm snap, and smooth texture. Without tempering, chocolate can become dull, soft, or develop white streaks called bloom.",
    },
    {
      question: "Can I temper butter the same way as chocolate?",
      answer:
        "Butter tempering involves controlling temperature to maintain its structure and spreadability, but it differs from chocolate tempering. Butter requires careful cooling and working temperatures to prevent separation and maintain texture.",
    },
    {
      question: "What happens if chocolate is overheated during tempering?",
      answer:
        "Overheating chocolate can destroy the stable cocoa butter crystals, causing it to lose its temper. This leads to a dull appearance, grainy texture, and poor snap. Always follow recommended melting temperatures.",
    },
    {
      question: "How do I know when chocolate is properly tempered?",
      answer:
        "Properly tempered chocolate will harden quickly at room temperature with a shiny surface and a firm snap when broken. It should not be sticky or soft to the touch.",
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
          <Select value={unit} onValueChange={setUnit}>
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

      {/* Ingredient Type */}
      <div className="space-y-2">
        <Label htmlFor="ingredientType" className="text-slate-700 dark:text-slate-300">
          Ingredient Type
        </Label>
        <Select
          id="ingredientType"
          value={inputs.ingredientType}
          onValueChange={(value) =>
            setInputs((prev) => ({
              ingredientType: value as "chocolate" | "butter" | "",
              chocolateType: "",
              butterType: "",
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ingredient type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chocolate">Chocolate</SelectItem>
            <SelectItem value="butter">Butter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chocolate Type */}
      {inputs.ingredientType === "chocolate" && (
        <div className="space-y-2">
          <Label htmlFor="chocolateType" className="text-slate-700 dark:text-slate-300">
            Chocolate Type
          </Label>
          <Select
            id="chocolateType"
            value={inputs.chocolateType}
            onValueChange={(value) =>
              setInputs((prev) => ({
                ...prev,
                chocolateType: value as ChocolateType,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select chocolate type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="milk">Milk</SelectItem>
              <SelectItem value="white">White</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Butter Type */}
      {inputs.ingredientType === "butter" && (
        <div className="space-y-2">
          <Label htmlFor="butterType" className="text-slate-700 dark:text-slate-300">
            Butter Type
          </Label>
          <Select
            id="butterType"
            value={inputs.butterType}
            onValueChange={(value) =>
              setInputs((prev) => ({
                ...prev,
                butterType: value as ButterType,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select butter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unsalted">Unsalted</SelectItem>
              <SelectItem value="salted">Salted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

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
            setInputs({ ingredientType: "", chocolateType: "", butterType: "" })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <div className="text-2xl font-extrabold text-blue-900 dark:text-white space-y-2">
                {results.value}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-4 font-medium">
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
              <strong>Chef's Tip:</strong> Use a digital thermometer to monitor
              temperatures precisely for perfect tempering results.
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
          Understanding Chocolate/Butter Tempering Temperature
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Tempering is a critical process in chocolate and butter preparation
          that involves carefully controlling temperature to stabilize fats and
          crystals. For chocolate, tempering ensures a glossy finish, firm
          texture, and prevents blooming, which is the white streaks or spots
          caused by fat separation. Butter tempering, while less common, helps
          maintain its spreadability and texture by controlling cooling and
          working temperatures.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Each type of chocolate—dark, milk, and white—has specific melting,
          cooling, and working temperatures due to their unique fat and sugar
          compositions. Butter, whether salted or unsalted, also requires
          precise temperature management to prevent separation and maintain
          quality. Understanding these temperature ranges is essential for
          professional chefs and home cooks aiming for consistent, high-quality
          results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using a reliable digital thermometer and following recommended
          temperature guidelines can significantly improve the outcome of your
          chocolate and butter-based recipes. This calculator provides quick
          access to these critical tempering temperatures, helping you achieve
          perfect texture and appearance every time.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Select the ingredient type you want to temper—either chocolate or
          butter. Depending on your choice, select the specific subtype such as
          dark, milk, or white chocolate, or salted/unsalted butter. Choose
          your preferred unit system, Imperial (°F) or Metric (°C), and then
          click Calculate to see the recommended melting, cooling, and working
          temperatures.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select "Chocolate" or "Butter" as the
            ingredient.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the specific type (e.g., dark
            chocolate, unsalted butter).
          </li>
          <li>
            <strong>Step 3:</strong> Pick your preferred temperature unit.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view the tempering
            temperature ranges.
          </li>
          <li>
            <strong>Step 5:</strong> Use a digital thermometer to monitor your
            ingredient as you melt, cool, and work it within these temperature
            ranges.
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
              href="https://www.culinaryinstitute.edu/chocolate-tempering"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. The Culinary Institute of America - Chocolate Tempering Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on chocolate tempering techniques and
              temperature control.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.buttermaking.com/temperature-control"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Buttermaking and Temperature Control
            </a>
            <p className="text-slate-500 text-sm">
              Insights into butter crystallization and temperature management
              for optimal texture.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.foodsafety.gov/food-safety-charts/danger-zone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA Food Safety - Danger Zone Temperatures
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA guidelines on safe temperature ranges for food
              handling.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Chocolate/Butter Tempering Temperature"
      description="Guide to chocolate tempering temperatures. Find the precise melting, cooling, and working points for dark, milk, and white chocolate."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Tempering temperatures are fixed ranges based on ingredient type and subtype.",
        variables: [
          { symbol: "Ingredient", description: "Chocolate or Butter Type" },
          { symbol: "Temp", description: "Recommended Tempering Temperature" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You want to temper dark chocolate using the Imperial system (°F).",
        steps: [
          {
            label: "1",
            explanation:
              "Select 'Chocolate' as ingredient type and 'Dark' as chocolate type.",
          },
          {
            label: "2",
            explanation: "Choose 'Imperial (°F)' as the unit system.",
          },
          {
            label: "3",
            explanation: "Click 'Calculate' to see the melting, cooling, and working temperatures.",
          },
        ],
        result:
          "Melting Point: 113°F, Cooling Point: 80.6°F, Working Temperature: 87.8°F",
      }}
      relatedCalculators={[
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🍳",
        },
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "🍞",
        },
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🧁",
        },
        {
          title: "Pasta Dry ↔ Cooked Yield & Portions",
          url: "/cooking/pasta-dry-cooked-yield-portions",
          icon: "📏",
        },
        {
          title: "Yeast Conversion Calculator",
          url: "/cooking/yeast-conversion-instant-active-fresh",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Chocolate/Butter Tempering Temperature" },
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