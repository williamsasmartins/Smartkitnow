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

type UnitSystem = "imperial" | "metric";

type RiceType = "basmati" | "jasmine" | "brown" | "sushi";

const riceWaterRatios: Record<
  RiceType,
  { imperial: number; metric: number }
> = {
  basmati: { imperial: 1.5, metric: 1.5 }, // 1 cup rice : 1.5 cups water
  jasmine: { imperial: 1.25, metric: 1.25 },
  brown: { imperial: 2, metric: 2 },
  sushi: { imperial: 1.3, metric: 1.3 },
};

// Density in g/ml or g/cup (for weight conversions)
const densities = {
  rice: 190, // grams per cup uncooked rice (approximate)
  water: 236, // grams per cup water (1 cup water = 236g)
};

export default function RiceWaterRatioYieldCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    riceType?: RiceType;
    riceAmount?: string; // string to handle empty input
  }>({ riceType: "basmati", riceAmount: "" });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    if (!inputs.riceType || !inputs.riceAmount) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const riceType = inputs.riceType;
    const riceAmountRaw = inputs.riceAmount.trim();
    if (riceAmountRaw === "") {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Parse rice amount input
    const riceAmountNum = Number(riceAmountRaw);
    if (isNaN(riceAmountNum) || riceAmountNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "Please enter a valid positive number for rice amount.",
        warning: null,
      };
    }

    // Get water ratio based on rice type and unit system
    const ratio = riceWaterRatios[riceType][unit];

    // Calculate water amount
    // riceAmountNum is in cups (imperial) or grams (metric)
    // For imperial: riceAmountNum cups rice * ratio = cups water
    // For metric: riceAmountNum grams rice -> convert to cups rice, then water cups, then grams water

    let riceCups: number;
    let waterCups: number;
    let waterGrams: number;
    let riceGrams: number;

    if (unit === "imperial") {
      // riceAmountNum is cups rice
      riceCups = riceAmountNum;
      waterCups = riceCups * ratio;
      riceGrams = riceCups * densities.rice;
      waterGrams = waterCups * densities.water;
      return {
        value: waterCups.toFixed(2),
        label: "Cups of Water Needed",
        subtext: `For ${riceCups.toFixed(2)} cups of ${riceType} rice, use ${waterCups.toFixed(
          2
        )} cups of water.`,
        warning: null,
      };
    } else {
      // metric
      // riceAmountNum is grams rice
      riceGrams = riceAmountNum;
      riceCups = riceGrams / densities.rice;
      waterCups = riceCups * ratio;
      waterGrams = waterCups * densities.water;
      return {
        value: waterGrams.toFixed(0),
        label: "Grams of Water Needed",
        subtext: `For ${riceGrams.toFixed(0)} grams of ${riceType} rice, use approximately ${waterGrams.toFixed(
          0
        )} grams (ml) of water.`,
        warning: null,
      };
    }
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why does the rice-to-water ratio vary by rice type?",
      answer:
        "Different rice varieties absorb water differently due to their grain structure and processing. For example, brown rice requires more water and longer cooking time than white rice. Adjusting the ratio ensures optimal texture and doneness. (Source: USDA, Serious Eats)",
    },
    {
      question: "Can I use weight instead of volume for measuring rice and water?",
      answer:
        "Yes, weighing ingredients is more accurate than volume measurements. Using grams for rice and water ensures consistent results, especially important in professional kitchens. (Source: King Arthur Baking)",
    },
    {
      question: "What happens if I use too little or too much water?",
      answer:
        "Too little water results in undercooked, hard rice, while too much water makes it mushy or sticky. Following recommended ratios helps achieve fluffy, perfectly cooked rice every time.",
    },
    {
      question: "Is rinsing rice before cooking necessary?",
      answer:
        "Rinsing removes excess surface starch, preventing overly sticky rice and improving texture. It also helps remove any impurities. However, some recipes may call for unwashed rice for specific textures.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onRiceTypeChange(value: RiceType) {
    setInputs((prev) => ({ ...prev, riceType: value }));
  }
  function onRiceAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, riceAmount: e.target.value }));
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
              <SelectItem value="imperial">Imperial (Cups / °F / Lbs)</SelectItem>
              <SelectItem value="metric">Metric (Grams / °C / Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rice Type Select */}
      <div className="space-y-2">
        <Label htmlFor="riceType" className="text-slate-700 dark:text-slate-300">
          Select Rice Type
        </Label>
        <Select
          id="riceType"
          value={inputs.riceType}
          onValueChange={(val) => onRiceTypeChange(val as RiceType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose rice type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basmati">Basmati</SelectItem>
            <SelectItem value="jasmine">Jasmine</SelectItem>
            <SelectItem value="brown">Brown</SelectItem>
            <SelectItem value="sushi">Sushi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rice Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="riceAmount" className="text-slate-700 dark:text-slate-300">
          Enter Rice Amount ({unit === "imperial" ? "Cups" : "Grams"})
        </Label>
        <Input
          id="riceAmount"
          type="number"
          min={0}
          step="any"
          placeholder={unit === "imperial" ? "e.g. 1.5" : "e.g. 285"}
          value={inputs.riceAmount || ""}
          onChange={onRiceAmountChange}
          aria-describedby="riceAmountHelp"
        />
        <p id="riceAmountHelp" className="text-xs text-slate-500 dark:text-slate-400">
          Input the amount of uncooked rice you plan to cook.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger re-render, calculation is memoized on inputs
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ riceType: "basmati", riceAmount: "" })}
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
              <strong>Chef's Tip:</strong> For best results, rinse rice before cooking to remove excess starch and use a digital scale for precise measurements.
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
          Understanding Rice:Water Ratio & Yield Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cooking perfect rice requires understanding the precise ratio of rice to water, which varies depending on the rice variety. This calculator helps home cooks and professionals alike determine the exact amount of water needed for different types of rice, ensuring fluffy, well-cooked grains every time. By accounting for ingredient density and standard culinary ratios, it eliminates guesswork and improves consistency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Different rice types such as Basmati, Jasmine, Brown, and Sushi rice absorb water differently due to their grain structure and processing. For example, brown rice requires more water and longer cooking times compared to white rice varieties. This tool incorporates these culinary nuances to provide tailored recommendations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using either imperial or metric units, the calculator converts your input into the appropriate water volume or weight, leveraging ingredient density data for accuracy. This approach aligns with best practices recommended by culinary authorities like the USDA and King Arthur Baking.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Chef's Tips & How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get started, select your preferred unit system (Imperial or Metric), then choose the rice type you plan to cook. Enter the amount of uncooked rice you have, and click Calculate to see the exact amount of water needed. Follow these steps for best results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the rice variety (Basmati, Jasmine, Brown, or Sushi) to get the correct water ratio.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the amount of uncooked rice in cups (imperial) or grams (metric).
          </li>
          <li>
            <strong>Step 3:</strong> Click Calculate to receive the recommended water amount in cups or grams.
          </li>
          <li>
            <strong>Step 4:</strong> Rinse your rice to remove excess starch, then cook using the suggested water quantity for perfect texture.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Culinary FAQ</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Standard Ratios & References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety and Cooking Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Provides authoritative cooking ratios and food safety standards for rice and other staples.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking - Ingredient Weight Charts
            </a>
            <p className="text-slate-500 text-sm">
              Offers detailed ingredient density data to convert volume to weight accurately.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats - Rice Cooking Techniques
            </a>
            <p className="text-slate-500 text-sm">
              Explores rice varieties and their water absorption characteristics for perfect cooking.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rice:Water Ratio & Yield Calculator"
      description="Get the perfect rice-to-water ratio. Calculate yield and liquid needs for Basmati, Jasmine, Brown, or Sushi rice."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula: "Water = Rice × Ratio (cups or grams depending on unit system)",
        variables: [
          { symbol: "Rice", description: "Amount of uncooked rice" },
          { symbol: "Ratio", description: "Rice-to-water ratio based on rice type" },
          { symbol: "Water", description: "Amount of water needed" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You want to cook 2 cups of Basmati rice using the imperial system.",
        steps: [
          {
            label: "1",
            explanation:
              "Select Basmati rice and enter 2 cups as the rice amount.",
          },
          {
            label: "2",
            explanation:
              "The calculator uses a 1:1.5 rice-to-water ratio for Basmati rice.",
          },
          {
            label: "3",
            explanation:
              "Multiply 2 cups rice × 1.5 = 3 cups water needed.",
          },
        ],
        result: "Use 3 cups of water to cook 2 cups of Basmati rice.",
      }}
      relatedCalculators={[
        {
          title: "Yeast Conversion Calculator",
          url: "/cooking/yeast-conversion-instant-active-fresh",
          icon: "🍳",
        },
        {
          title: "Sourdough Starter Ratio & Feed Planner",
          url: "/cooking/sourdough-starter-ratio-feed-planner",
          icon: "🍞",
        },
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "⚖️",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🧁",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "⚖️",
        },
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Rice:Water Ratio & Yield Calculator" },
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