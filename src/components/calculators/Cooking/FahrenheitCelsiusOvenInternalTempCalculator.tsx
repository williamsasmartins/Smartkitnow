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

export default function FahrenheitCelsiusOvenInternalTempCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial"); // imperial = Fahrenheit, Cups, Lbs; metric = Celsius, Grams, Kg
  const [inputs, setInputs] = useState({
    temperature: "",
    direction: "f-to-c",
  });

  // USDA Danger Zone temps in Fahrenheit and Celsius
  const dangerZoneF = { min: 40, max: 140 };
  const dangerZoneC = { min: 4.4, max: 60 };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const tempInput = parseFloat(inputs.temperature);
    if (isNaN(tempInput)) {
      return {
        value: 0,
        label: "Please enter a valid temperature",
        subtext: null,
        warning: null,
      };
    }

    let converted = 0;
    let label = "";
    let subtext = "";
    let warning = null;

    if (inputs.direction === "f-to-c") {
      // Fahrenheit to Celsius
      converted = Math.round(((tempInput - 32) * 5) / 9);
      label = `${converted} °C`;
      subtext = `Converted from ${tempInput} °F`;

      // Food safety check: Danger zone in Celsius
      if (tempInput >= dangerZoneF.min && tempInput <= dangerZoneF.max) {
        warning =
          "Warning: Temperature is in the USDA Danger Zone (40°F - 140°F). Food held in this range for extended periods may risk bacterial growth.";
      }
    } else {
      // Celsius to Fahrenheit
      converted = Math.round((tempInput * 9) / 5 + 32);
      label = `${converted} °F`;
      subtext = `Converted from ${tempInput} °C`;

      // Food safety check: Danger zone in Celsius
      if (tempInput >= dangerZoneC.min && tempInput <= dangerZoneC.max) {
        warning =
          "Warning: Temperature is in the USDA Danger Zone (4.4°C - 60°C). Food held in this range for extended periods may risk bacterial growth.";
      }
    }

    return { value: converted, label, subtext, warning };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is it important to convert oven temperatures accurately?",
      answer:
        "Accurate temperature conversion ensures your recipes bake correctly, preserving texture and flavor. Oven temperatures vary globally, so converting between Fahrenheit and Celsius helps maintain consistency. This is crucial in baking where precise heat affects chemical reactions in dough and batter.",
    },
    {
      question: "What is the USDA Danger Zone and why should I avoid it?",
      answer:
        "The USDA Danger Zone is the temperature range between 40°F and 140°F (4.4°C to 60°C) where bacteria grow rapidly. Keeping food out of this range during cooking and storage is essential to prevent foodborne illness. Always cook meats to safe internal temperatures above this zone.",
    },
    {
      question: "Can I use this converter for meat internal temperature checks?",
      answer:
        "Yes, this converter helps translate meat thermometer readings between Fahrenheit and Celsius. Use it alongside USDA recommended safe internal temperatures to ensure your meat is cooked safely and deliciously.",
    },
    {
      question: "How does temperature affect baking outcomes?",
      answer:
        "Temperature controls the rate of chemical reactions like yeast fermentation and protein coagulation. Too low, and dough may underproof; too high, and baked goods can burn or dry out. Converting temperatures accurately helps replicate recipes from different regions reliably.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, temperature: e.target.value }));
  };
  const handleDirectionChange = (value: string) => {
    setInputs((prev) => ({ ...prev, direction: value }));
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Conversion Direction
          </Label>
          <Select
            value={inputs.direction}
            onValueChange={handleDirectionChange}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="f-to-c">Fahrenheit → Celsius (°F → °C)</SelectItem>
              <SelectItem value="c-to-f">Celsius → Fahrenheit (°C → °F)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Temperature Input */}
      <div className="space-y-2">
        <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
          Enter Temperature ({inputs.direction === "f-to-c" ? "°F" : "°C"})
        </Label>
        <Input
          id="temperature"
          type="number"
          placeholder={`e.g. ${inputs.direction === "f-to-c" ? "350" : "180"}`}
          value={inputs.temperature}
          onChange={handleInputChange}
          min={inputs.direction === "f-to-c" ? 0 : -50}
          max={inputs.direction === "f-to-c" ? 1000 : 600}
          step="any"
        />
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
          onClick={() => setInputs({ temperature: "", direction: "f-to-c" })}
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
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                  {results.subtext}
                </p>
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
              <strong>Chef's Tip:</strong> Always verify oven temperatures with an
              oven thermometer for best baking results. Food safety is paramount —
              avoid holding food in the danger zone temperatures to prevent bacterial
              growth.
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
          Understanding Fahrenheit ↔ Celsius Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Oven temperatures and internal meat temperatures are often given in
          either Fahrenheit or Celsius depending on the region. This converter
          allows chefs and home cooks to quickly and accurately switch between
          these units, ensuring recipes are followed precisely. Accurate
          temperature conversion is critical in baking and cooking to achieve
          desired textures, flavors, and food safety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula for converting Fahrenheit to Celsius is: (°F - 32) × 5/9,
          and for Celsius to Fahrenheit: (°C × 9/5) + 32. This tool automates
          these calculations, reducing errors and saving time in the kitchen.
          Additionally, it highlights temperatures within the USDA Danger Zone,
          where bacterial growth can occur, helping maintain food safety standards.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the converter, select the direction of conversion—either
          Fahrenheit to Celsius or Celsius to Fahrenheit. Enter the temperature
          value you want to convert and click Calculate. The converted value will
          display instantly, along with any relevant food safety warnings.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the conversion direction based on your
            recipe or thermometer reading.
          </li>
          <li>
            <strong>Step 2:</strong> Input the temperature value you want to convert.
          </li>
          <li>
            <strong>Step 3:</strong> Click Calculate to see the converted
            temperature and any safety warnings.
          </li>
          <li>
            <strong>Step 4:</strong> Use the converted temperature to adjust oven
            settings or check meat doneness accurately.
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
              href="https://www.usda.gov/food-safety"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety and Inspection Service
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on safe cooking temperatures and food handling.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/oven-temperature"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking Oven Temperature Guide
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on oven temperature conversions and baking tips.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/food-safety-temperature-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats Food Safety Temperature Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive food safety temperature charts and cooking advice.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fahrenheit ↔ Celsius Converter"
      description="Convert oven temperatures instantly. Switch between Fahrenheit and Celsius for baking recipes and internal meat thermometers."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "°C = (°F - 32) × 5/9;  °F = (°C × 9/5) + 32",
        variables: [
          { symbol: "Input", description: "Temperature in °F or °C" },
          { symbol: "Result", description: "Converted temperature" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You have a recipe calling for 350°F but your oven shows Celsius.",
        steps: [
          {
            label: "1",
            explanation:
              "Select Fahrenheit to Celsius conversion.",
          },
          {
            label: "2",
            explanation:
              "Enter 350 in the temperature input.",
          },
          {
            label: "3",
            explanation:
              "Click Calculate to get 177°C, the equivalent oven temperature.",
          },
        ],
        result: "Use 177°C on your oven for accurate baking.",
      }}
      relatedCalculators={[
        { title: "Defrost Time Estimator", url: "/cooking/defrost-time-fridge-cold-water", icon: "🍳" },
        { title: "Serving Size Multiplier", url: "/cooking/serving-size-multiplier", icon: "🍞" },
        { title: "Recipe Scaler (x0.5, x2, x3…)", url: "/cooking/recipe-scaler", icon: "🥩" },
        { title: "Salt % for Brining Calculator", url: "/cooking/salt-percent-brining", icon: "🧁" },
        { title: "Safe Internal Temperature Checker", url: "/cooking/safe-internal-temperature-checker", icon: "🌡️" },
        { title: "Cake Pan Size & Volume Converter", url: "/cooking/cake-pan-size-volume-converter", icon: "🍰" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fahrenheit ↔ Celsius Converter" },
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