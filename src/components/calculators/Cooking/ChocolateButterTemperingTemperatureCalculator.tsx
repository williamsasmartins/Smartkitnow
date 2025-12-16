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

const TEMPERING_TEMPERATURES = {
  dark: {
    melting: { imperial: 115, metric: 46 }, // °F / °C
    cooling: { imperial: 82, metric: 28 },
    working: { imperial: 88, metric: 31 },
  },
  milk: {
    melting: { imperial: 110, metric: 43 },
    cooling: { imperial: 80, metric: 27 },
    working: { imperial: 86, metric: 30 },
  },
  white: {
    melting: { imperial: 110, metric: 43 },
    cooling: { imperial: 79, metric: 26 },
    working: { imperial: 84, metric: 29 },
  },
};

const BUTTER_TEMPERING = {
  melting: { imperial: 95, metric: 35 }, // Butter melts ~95°F / 35°C
  cooling: { imperial: 60, metric: 16 },
  working: { imperial: 65, metric: 18 },
};

const DANGER_ZONE_F_LOW = 40;
const DANGER_ZONE_F_HIGH = 140;
const DANGER_ZONE_C_LOW = 4;
const DANGER_ZONE_C_HIGH = 60;

export default function ChocolateButterTemperingTemperatureCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    ingredientType: "chocolate" | "butter" | "";
    chocolateType: "dark" | "milk" | "white" | "";
    inputTemp: string;
  }>({
    ingredientType: "",
    chocolateType: "",
    inputTemp: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { ingredientType, chocolateType, inputTemp } = inputs;
    if (!ingredientType) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Get tempering temps based on ingredient
    let temps;
    if (ingredientType === "butter") {
      temps = BUTTER_TEMPERING;
    } else if (ingredientType === "chocolate" && chocolateType) {
      temps = TEMPERING_TEMPERATURES[chocolateType];
    } else {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Parse input temperature
    const tempNum = parseFloat(inputTemp);
    if (isNaN(tempNum)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert input temp to °F for danger zone check if metric
    let tempF = tempNum;
    if (unit === "metric") {
      tempF = tempNum * 1.8 + 32;
    }

    // Danger zone warning if temp is in 40°F - 140°F (4°C - 60°C)
    // For tempering, this is relevant if chocolate/butter is held too long in this range (risk of bacterial growth)
    let warning = null;
    if (tempF > DANGER_ZONE_F_LOW && tempF < DANGER_ZONE_F_HIGH) {
      warning =
        "Warning: Tempering temperatures in the 40°F - 140°F (4°C - 60°C) range can promote bacterial growth if held too long. Use promptly.";
    }

    // Determine closest tempering stage based on input temp
    // We'll find which stage melting, cooling, or working is closest to input temp
    // Also provide recommended temp for that stage
    const stages = ["melting", "cooling", "working"] as const;

    // Find closest stage by absolute difference
    let closestStage: typeof stages[number] = "melting";
    let minDiff = Infinity;
    for (const stage of stages) {
      const stageTemp = temps[stage][unit];
      const diff = Math.abs(tempNum - stageTemp);
      if (diff < minDiff) {
        minDiff = diff;
        closestStage = stage;
      }
    }

    // Format output
    const stageLabels = {
      melting: "Melting Point",
      cooling: "Cooling Point",
      working: "Working Temperature",
    };

    const value = temps[closestStage][unit];
    const label = `${stageLabels[closestStage]} (${ingredientType === "butter" ? "Butter" : `${chocolateType.charAt(0).toUpperCase() + chocolateType.slice(1)} Chocolate`})`;
    const subtext = `Recommended tempering temperature is ${value}°${unit === "imperial" ? "F" : "C"}.`;

    return {
      value,
      label,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is tempering chocolate important?",
      answer:
        "Tempering chocolate ensures it has a smooth texture, glossy finish, and a crisp snap. It stabilizes cocoa butter crystals, preventing bloom and improving shelf life. Proper tempering also enhances flavor and mouthfeel.",
    },
    {
      question: "Can I temper chocolate without a thermometer?",
      answer:
        "While possible, using a thermometer is highly recommended for precision. Visual cues alone can be misleading, risking improper tempering. A digital thermometer ensures you reach exact melting and working temperatures for best results.",
    },
    {
      question: "What happens if butter is overheated during tempering?",
      answer:
        "Overheating butter can cause it to separate or burn, affecting texture and flavor. Maintaining the recommended melting temperature prevents breakdown of milk solids and preserves butter’s creamy consistency.",
    },
    {
      question: "Is it safe to hold chocolate or butter in the danger zone temperature range?",
      answer:
        "Holding chocolate or butter between 40°F and 140°F (4°C - 60°C) for extended periods can promote bacterial growth. Always use tempered ingredients promptly and store properly to ensure food safety, as recommended by USDA guidelines.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // UI Handlers
  function onInputChange(
    field: keyof typeof inputs,
    value: string | "dark" | "milk" | "white" | "chocolate" | "butter" | ""
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
      // Reset chocolateType if ingredientType changes to butter or empty
      ...(field === "ingredientType" &&
      (value === "butter" || value === "") && { chocolateType: "" }),
    }));
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
          onValueChange={(v) => onInputChange("ingredientType", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chocolate">Chocolate</SelectItem>
            <SelectItem value="butter">Butter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chocolate Type (only if chocolate selected) */}
      {inputs.ingredientType === "chocolate" && (
        <div className="space-y-2">
          <Label htmlFor="chocolateType" className="text-slate-700 dark:text-slate-300">
            Chocolate Type
          </Label>
          <Select
            id="chocolateType"
            value={inputs.chocolateType}
            onValueChange={(v) => onInputChange("chocolateType", v)}
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

      {/* Input Temperature */}
      <div className="space-y-2">
        <Label htmlFor="inputTemp" className="text-slate-700 dark:text-slate-300">
          Input Temperature (°{unit === "imperial" ? "F" : "C"})
        </Label>
        <Input
          id="inputTemp"
          type="number"
          min={unit === "imperial" ? 0 : -10}
          max={unit === "imperial" ? 250 : 120}
          placeholder={`Enter temperature in °${unit === "imperial" ? "F" : "C"}`}
          value={inputs.inputTemp}
          onChange={(e) => onInputChange("inputTemp", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          disabled={
            !inputs.ingredientType ||
            (inputs.ingredientType === "chocolate" && !inputs.chocolateType) ||
            !inputs.inputTemp
          }
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ingredientType: "",
              chocolateType: "",
              inputTemp: "",
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
                {results.value}°{unit === "imperial" ? "F" : "C"}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

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
              <strong>Chef's Tip:</strong> Use a precise digital thermometer to ensure chocolate and butter reach exact tempering temperatures for optimal texture and safety.
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
          Tempering is a critical process in chocolate and butter preparation that involves carefully controlling temperature to stabilize fat crystals. For chocolate, this ensures a glossy finish, firm snap, and prevents bloom, which is the white streaks or spots caused by fat separation. Butter tempering helps maintain its creamy texture and prevents separation during cooking or baking.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Each type of chocolate—dark, milk, and white—has specific melting, cooling, and working temperatures due to their unique fat and sugar compositions. Butter also requires precise temperature control to maintain its structure without breaking down milk solids. Using a thermometer to monitor these temperatures is essential for consistent culinary results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, food safety guidelines from the USDA emphasize avoiding prolonged exposure of these ingredients to the temperature "danger zone" (40°F - 140°F / 4°C - 60°C), where bacterial growth can occur. Prompt use and proper storage after tempering are vital to ensure both quality and safety.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you identify the key tempering temperatures for chocolate and butter based on your ingredient and unit preference. Follow these steps for best results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your ingredient type—chocolate or butter.
          </li>
          <li>
            <strong>Step 2:</strong> If chocolate, choose the specific type: dark, milk, or white.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the temperature you want to check or are working with.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see the closest tempering stage and recommended temperature.
          </li>
          <li>
            <strong>Step 5:</strong> Use a digital thermometer to monitor and maintain these temperatures during tempering.
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
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Provides safe temperature ranges and handling practices for food ingredients, including dairy and chocolate.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking - Chocolate Tempering Guide
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanations on tempering chocolate with temperature charts and techniques.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats - Butter Science & Cooking Temperatures
            </a>
            <p className="text-slate-500 text-sm">
              Insights into butter melting points and how temperature affects cooking and baking outcomes.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Chocolate/Butter Tempering Temperature"
      description="Guide to chocolate tempering temperatures. Find the precise melting, cooling, and working points for dark, milk, and white chocolate, as well as butter."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Kitchen Math",
        formula:
          "Recommended Temp = Closest of {Melting, Cooling, Working} Temperatures for Ingredient Type",
        variables: [
          { symbol: "Input", description: "Input Temperature (°F or °C)" },
          { symbol: "Result", description: "Recommended Tempering Temperature" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You have dark chocolate heated to 110°F and want to know which tempering stage it corresponds to.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 'Chocolate' as ingredient and 'Dark' as chocolate type, then input 110°F.",
          },
          {
            label: "2",
            explanation:
              "Calculate to find that 110°F is closest to the melting point (115°F) stage.",
          },
        ],
        result: "Recommended melting point temperature is 115°F for dark chocolate tempering.",
      }}
      relatedCalculators={[
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🍳",
        },
        {
          title: "Icing/Frosting Coverage by Cake Size",
          url: "/cooking/icing-frosting-coverage-cake-size",
          icon: "🍰",
        },
        {
          title: "Recipe Scaler (x0.5, x2, x3…)",
          url: "/cooking/recipe-scaler",
          icon: "🥩",
        },
        {
          title: "Whole Chicken/Roast Cook Time Estimator",
          url: "/cooking/whole-chicken-roast-cook-time",
          icon: "🧁",
        },
        {
          title: "Sourdough Starter Ratio & Feed Planner",
          url: "/cooking/sourdough-starter-ratio-feed-planner",
          icon: "🍞",
        },
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Chocolate/Butter Tempering Temperature" },
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