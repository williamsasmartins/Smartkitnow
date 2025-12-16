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

export default function AlcoholAbvDilutionCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial"); // imperial or metric
  const [inputs, setInputs] = useState({
    initialAbv: "", // initial alcohol % (e.g. 40 for 40%)
    initialVolume: "", // volume of alcohol solution before dilution (cups or ml)
    dilutionVolume: "", // volume of diluent (water or other liquid) added (cups or ml)
    // unit system for volume is controlled by unit state
  });

  // Helper: parse float safely
  const parseInput = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // 2. LOGIC ENGINE
  // Formula: 
  // Final ABV after dilution = (Initial ABV * Initial Volume) / (Initial Volume + Dilution Volume)
  // Volumes must be in same units (cups or ml)
  // Result is % ABV after dilution

  const results = useMemo(() => {
    const initialAbv = parseInput(inputs.initialAbv);
    const initialVol = parseInput(inputs.initialVolume);
    const dilutionVol = parseInput(inputs.dilutionVolume);

    if (initialAbv === 0 || initialVol === 0) {
      return {
        value: 0,
        label: "Enter valid initial ABV and volume",
        subtext: null,
        warning: null,
      };
    }

    // Calculate final ABV
    const finalAbv =
      (initialAbv * initialVol) / (initialVol + dilutionVol || 1);

    // Format result with 2 decimals
    const finalAbvFormatted = finalAbv.toFixed(2);

    return {
      value: finalAbvFormatted,
      label: `Final Alcohol by Volume (ABV) %`,
      subtext: dilutionVol
        ? `Diluted from ${initialAbv}% over ${initialVol} ${
            unit === "imperial" ? "cups" : "ml"
          } with ${dilutionVol} ${unit === "imperial" ? "cups" : "ml"} of diluent.`
        : "No dilution volume entered.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How does dilution affect the alcohol content in cooking?",
      answer:
        "Dilution reduces the alcohol concentration by increasing the total volume of liquid. The final ABV is calculated by multiplying the initial ABV by the ratio of initial volume to total volume after dilution. This helps chefs control alcohol intensity in recipes.",
    },
    {
      question: "Can I use this calculator for spirits and wines?",
      answer:
        "Yes, this tool works for any alcoholic beverage as long as you know the initial ABV and volume. It helps estimate the alcohol content after adding non-alcoholic liquids like water, broth, or juice.",
    },
    {
      question: "Does cooking reduce alcohol content further?",
      answer:
        "Yes, cooking (especially simmering or baking) reduces alcohol content through evaporation. This calculator only estimates dilution effects, not alcohol loss from heat. For cooking evaporation, refer to specialized charts.",
    },
    {
      question: "Why is measuring volume important instead of weight?",
      answer:
        "Alcohol content is based on volume percentage (ABV), so volume measurements are more accurate for dilution calculations. Weight conversions vary due to density differences and are less reliable for ABV math.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  const onInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const onReset = () => {
    setInputs({
      initialAbv: "",
      initialVolume: "",
      dilutionVolume: "",
    });
  };

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
              <SelectItem value="imperial">Imperial (Cups / °F / Lbs)</SelectItem>
              <SelectItem value="metric">Metric (Milliliters / °C / Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="initialAbv" className="text-slate-700 dark:text-slate-300">
            Initial Alcohol % (ABV)
          </Label>
          <Input
            id="initialAbv"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g. 40"
            value={inputs.initialAbv}
            onChange={(e) => onInputChange("initialAbv", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="initialVolume" className="text-slate-700 dark:text-slate-300">
            Initial Volume ({unit === "imperial" ? "cups" : "ml"})
          </Label>
          <Input
            id="initialVolume"
            type="number"
            min={0}
            step={0.01}
            placeholder={unit === "imperial" ? "e.g. 1.5" : "e.g. 355"}
            value={inputs.initialVolume}
            onChange={(e) => onInputChange("initialVolume", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="dilutionVolume" className="text-slate-700 dark:text-slate-300">
            Dilution Volume ({unit === "imperial" ? "cups" : "ml"})
          </Label>
          <Input
            id="dilutionVolume"
            type="number"
            min={0}
            step={0.01}
            placeholder={unit === "imperial" ? "e.g. 0.5" : "e.g. 120"}
            value={inputs.dilutionVolume}
            onChange={(e) => onInputChange("dilutionVolume", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          // Calculation is reactive, no explicit onClick needed
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
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
                {results.value}%
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
              <strong>Chef's Tip:</strong> Always measure volumes precisely for accurate ABV dilution. Use metric units for best consistency in professional kitchens.
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
          Understanding Alcohol by Volume (ABV) Dilution
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Alcohol by Volume (ABV) is a standard measure of how much alcohol is contained in a given volume of an alcoholic beverage. When cooking, chefs often dilute spirits or wines with other liquids to adjust flavor and alcohol intensity. This dilution lowers the ABV proportionally to the total volume of liquid after adding the diluent.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation is straightforward: multiply the initial ABV by the ratio of the initial volume to the total volume (initial plus dilution). This helps estimate the final alcohol concentration in your dish before any cooking evaporation occurs. Understanding this allows chefs to control alcohol levels for flavor balance and food safety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that cooking processes like simmering or baking further reduce alcohol content through evaporation, which this calculator does not account for. For precise culinary control, combine dilution calculations with cooking evaporation charts.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool helps you calculate the final alcohol concentration after diluting a spirit or wine with another liquid. Use it to adjust recipes for desired alcohol intensity or to comply with food safety standards.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the initial ABV percentage of your alcohol (e.g., 40% for vodka).
          </li>
          <li>
            <strong>Step 2:</strong> Input the volume of the alcoholic liquid before dilution in cups or milliliters.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the volume of the diluent (water, broth, juice) added.
          </li>
          <li>
            <strong>Step 4:</strong> Review the calculated final ABV to adjust your recipe accordingly.
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
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety and Alcohol Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on alcohol use in cooking and food safety standards.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking - Alcohol in Baking
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on how alcohol behaves in baking and dilution effects.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats - Alcohol Cooking Science
            </a>
            <p className="text-slate-500 text-sm">
              In-depth articles on alcohol evaporation and dilution in culinary applications.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Alcohol by Volume (ABV) Dilution"
      description="Calculate alcohol dilution for cooking. Estimate the remaining Alcohol by Volume (ABV) in your dishes after simmering or baking."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula: "Final ABV = (Initial ABV × Initial Volume) / (Initial Volume + Dilution Volume)",
        variables: [
          { symbol: "Initial ABV", description: "Alcohol by Volume % before dilution" },
          { symbol: "Initial Volume", description: "Volume of alcoholic liquid before dilution" },
          { symbol: "Dilution Volume", description: "Volume of diluent added" },
          { symbol: "Final ABV", description: "Alcohol by Volume % after dilution" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You have 1 cup of 40% ABV vodka and add 0.5 cups of water to dilute it.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate total volume: 1 cup + 0.5 cups = 1.5 cups.",
          },
          {
            label: "2",
            explanation:
              "Calculate final ABV: (40 × 1) / 1.5 = 26.67%.",
          },
        ],
        result: "Final ABV after dilution is 26.67%.",
      }}
      relatedCalculators={[
        {
          title: "Yeast Conversion Calculator",
          url: "/cooking/yeast-conversion-instant-active-fresh",
          icon: "🍳",
        },
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Safe Internal Temperature Checker",
          url: "/cooking/safe-internal-temperature-checker",
          icon: "🌡️",
        },
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "⚖️",
        },
        {
          title: "Stock/Broth Reduction Time & Yield",
          url: "/cooking/stock-broth-reduction-time-yield",
          icon: "📏",
        },
        {
          title: "Volume ↔ Weight Converter",
          url: "/cooking/volume-weight-food-density",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Alcohol by Volume (ABV) Dilution" },
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