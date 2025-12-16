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

type UnitSystem = "imperial" | "metric";

type Inputs = {
  starterAmount: string; // number as string
  starterUnit: "g" | "cup" | "oz";
  flourAmount: string;
  flourUnit: "g" | "cup" | "oz";
  waterAmount: string;
  waterUnit: "g" | "cup" | "oz";
  starterHydration: string; // % as string, e.g. 100 for 100%
  feedRatio: string; // e.g. 1:1:1 expressed as "1:1:1"
};

const densityMap = {
  flour: 120, // g per cup
  water: 236, // g per cup (approximate)
  starter: 120, // approximate same as flour (hydrated flour + water)
};

const ozToGram = 28.3495;
const gramToOz = 1 / ozToGram;
const cupToGram = {
  flour: 120,
  water: 236,
  starter: 120,
};
const gramToCup = {
  flour: 1 / 120,
  water: 1 / 236,
  starter: 1 / 120,
};

function convertToGrams(
  amount: number,
  unit: "g" | "cup" | "oz",
  ingredient: "flour" | "water" | "starter"
): number {
  if (unit === "g") return amount;
  if (unit === "cup") return amount * cupToGram[ingredient];
  if (unit === "oz") return amount * ozToGram;
  return amount;
}

function convertFromGrams(
  grams: number,
  unit: "g" | "cup" | "oz",
  ingredient: "flour" | "water" | "starter"
): number {
  if (unit === "g") return grams;
  if (unit === "cup") return grams * gramToCup[ingredient];
  if (unit === "oz") return grams * gramToOz;
  return grams;
}

function parseRatio(ratioStr: string): [number, number, number] | null {
  // Expect format "1:1:1" or "1:2:2"
  const parts = ratioStr.split(":").map((p) => parseFloat(p.trim()));
  if (
    parts.length === 3 &&
    parts.every((v) => !isNaN(v) && v > 0)
  ) {
    return [parts[0], parts[1], parts[2]];
  }
  return null;
}

export default function SourdoughStarterRatioFeedPlannerCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<Inputs>({
    starterAmount: "",
    starterUnit: unit === "imperial" ? "cup" : "g",
    flourAmount: "",
    flourUnit: unit === "imperial" ? "cup" : "g",
    waterAmount: "",
    waterUnit: unit === "imperial" ? "cup" : "g",
    starterHydration: "100",
    feedRatio: "1:1:1",
  });

  // Sync units on unit system change
  // This effect is not strictly necessary but improves UX
  // We won't use useEffect here to avoid complexity, but will update units on Reset

  // 2. LOGIC ENGINE (ALL CALCULATIONS HERE)
  const results = useMemo(() => {
    // Parse inputs
    const starterAmtNum = parseFloat(inputs.starterAmount);
    const flourAmtNum = parseFloat(inputs.flourAmount);
    const waterAmtNum = parseFloat(inputs.waterAmount);
    const starterHydrationNum = parseFloat(inputs.starterHydration);
    const feedRatioParsed = parseRatio(inputs.feedRatio);

    // Validate inputs
    if (
      isNaN(starterAmtNum) ||
      starterAmtNum <= 0 ||
      isNaN(flourAmtNum) ||
      flourAmtNum < 0 ||
      isNaN(waterAmtNum) ||
      waterAmtNum < 0 ||
      isNaN(starterHydrationNum) ||
      starterHydrationNum <= 0 ||
      !feedRatioParsed
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers and ratio (e.g. 1:1:1).",
        subtext: "",
        warning: null,
      };
    }

    // Convert all inputs to grams for internal calculation
    const starterGrams = convertToGrams(
      starterAmtNum,
      inputs.starterUnit,
      "starter"
    );
    const flourGrams = convertToGrams(flourAmtNum, inputs.flourUnit, "flour");
    const waterGrams = convertToGrams(waterAmtNum, inputs.waterUnit, "water");

    // Calculate total feed amounts based on ratio
    // feedRatioParsed = [starterRatio, flourRatio, waterRatio]
    const [starterRatio, flourRatio, waterRatio] = feedRatioParsed;

    // Total parts
    const totalParts = starterRatio + flourRatio + waterRatio;

    // Calculate total feed weight based on starter input and ratio
    // We assume starter input corresponds to starterRatio parts
    // So 1 part starter = starterGrams / starterRatio
    const partWeight = starterGrams / starterRatio;

    // Calculate target flour and water grams based on ratio parts
    const targetFlourGrams = partWeight * flourRatio;
    const targetWaterGrams = partWeight * waterRatio;

    // Calculate hydration of starter from input hydration %
    // Hydration = water weight / flour weight * 100%
    // Starter hydration input is % (e.g. 100)
    // We can estimate starter flour and water weights:
    // starterFlour = starterGrams / (1 + hydration/100)
    // starterWater = starterGrams - starterFlour
    const starterFlourGrams =
      starterGrams / (1 + starterHydrationNum / 100);
    const starterWaterGrams = starterGrams - starterFlourGrams;

    // Calculate total flour and water after feeding
    const totalFlour = starterFlourGrams + targetFlourGrams;
    const totalWater = starterWaterGrams + targetWaterGrams;

    // Calculate new hydration after feeding
    const newHydration = (totalWater / totalFlour) * 100;

    // Prepare display strings in selected units
    const displayStarter = `${starterAmtNum.toFixed(2)} ${inputs.starterUnit}`;
    const displayFlour = `${flourAmtNum.toFixed(2)} ${inputs.flourUnit}`;
    const displayWater = `${waterAmtNum.toFixed(2)} ${inputs.waterUnit}`;

    // Display target feed amounts in selected units (flour and water)
    const displayTargetFlour = `${convertFromGrams(
      targetFlourGrams,
      inputs.flourUnit,
      "flour"
    ).toFixed(2)} ${inputs.flourUnit}`;
    const displayTargetWater = `${convertFromGrams(
      targetWaterGrams,
      inputs.waterUnit,
      "water"
    ).toFixed(2)} ${inputs.waterUnit}`;

    // Display new hydration rounded
    const newHydrationDisplay = newHydration.toFixed(1);

    // Warning if hydration out of typical range (50-150%)
    let warningMsg: string | null = null;
    if (newHydration < 50) {
      warningMsg =
        "Warning: New hydration is very low (<50%). Starter may be too dry.";
    } else if (newHydration > 150) {
      warningMsg =
        "Warning: New hydration is very high (>150%). Starter may be too wet.";
    }

    // Compose result string
    const value = `Feed Plan:
Starter: ${displayStarter}
Flour to add: ${displayTargetFlour}
Water to add: ${displayTargetWater}
New Hydration: ${newHydrationDisplay}%`;

    const label = "Calculated Feed Amounts & Hydration";
    const subtext =
      "Adjust feed ratio or hydration to maintain a healthy starter.";

    return {
      value,
      label,
      subtext,
      warning: warningMsg,
    };
  }, [inputs]);

  // Handle input changes
  function onInputChange(
    field: keyof Inputs,
    value: string | "g" | "cup" | "oz"
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Reset inputs on unit change or reset button
  function resetInputs(newUnit: UnitSystem) {
    setInputs({
      starterAmount: "",
      starterUnit: newUnit === "imperial" ? "cup" : "g",
      flourAmount: "",
      flourUnit: newUnit === "imperial" ? "cup" : "g",
      waterAmount: "",
      waterUnit: newUnit === "imperial" ? "cup" : "g",
      starterHydration: "100",
      feedRatio: "1:1:1",
    });
  }

  const faqs = [
    {
      question: "What is sourdough starter hydration and why does it matter?",
      answer:
        "Sourdough starter hydration is the ratio of water to flour in your starter, expressed as a percentage. It affects the starter's activity, texture, and flavor. A 100% hydration starter has equal weights of water and flour, producing a bubbly, active starter ideal for most recipes. Adjusting hydration changes fermentation speed and dough handling.",
    },
    {
      question: "How do I use the feed ratio in this planner?",
      answer:
        "The feed ratio represents the parts of starter, flour, and water you mix during feeding, e.g., 1:1:1 means equal parts by weight. This planner calculates how much flour and water to add based on your starter amount and desired ratio, helping maintain consistent starter strength and hydration.",
    },
    {
      question: "Can I use volume units like cups for feeding calculations?",
      answer:
        "Yes, but volume units vary by ingredient density. This tool converts cups and ounces to grams using ingredient-specific densities for accuracy. For best results, use a digital scale and metric units to ensure precise feeding amounts.",
    },
    {
      question: "Why is maintaining starter hydration important for baking?",
      answer:
        "Maintaining consistent starter hydration ensures predictable fermentation and dough behavior. It influences yeast and bacteria activity, dough elasticity, and crumb structure. Using this planner helps you keep your starter healthy and your bread baking results consistent.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(val) => {
              setUnit(val as UnitSystem);
              resetInputs(val as UnitSystem);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (Cups/°F)</SelectItem>
              <SelectItem value="metric">Metric (Grams/°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Starter Amount */}
        <div>
          <Label htmlFor="starterAmount" className="mb-1 block text-slate-700 dark:text-slate-300">
            Starter Amount
          </Label>
          <div className="flex gap-2">
            <Input
              id="starterAmount"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 0.5"
              value={inputs.starterAmount}
              onChange={(e) => onInputChange("starterAmount", e.target.value)}
            />
            <Select
              value={inputs.starterUnit}
              onValueChange={(val) => onInputChange("starterUnit", val as "g" | "cup" | "oz")}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unit === "imperial" ? (
                  <>
                    <SelectItem value="cup">cup</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                  </>
                ) : (
                  <SelectItem value="g">g</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Flour Amount */}
        <div>
          <Label htmlFor="flourAmount" className="mb-1 block text-slate-700 dark:text-slate-300">
            Flour Amount (to add)
          </Label>
          <div className="flex gap-2">
            <Input
              id="flourAmount"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 1"
              value={inputs.flourAmount}
              onChange={(e) => onInputChange("flourAmount", e.target.value)}
            />
            <Select
              value={inputs.flourUnit}
              onValueChange={(val) => onInputChange("flourUnit", val as "g" | "cup" | "oz")}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unit === "imperial" ? (
                  <>
                    <SelectItem value="cup">cup</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                  </>
                ) : (
                  <SelectItem value="g">g</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Water Amount */}
        <div>
          <Label htmlFor="waterAmount" className="mb-1 block text-slate-700 dark:text-slate-300">
            Water Amount (to add)
          </Label>
          <div className="flex gap-2">
            <Input
              id="waterAmount"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 1"
              value={inputs.waterAmount}
              onChange={(e) => onInputChange("waterAmount", e.target.value)}
            />
            <Select
              value={inputs.waterUnit}
              onValueChange={(val) => onInputChange("waterUnit", val as "g" | "cup" | "oz")}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unit === "imperial" ? (
                  <>
                    <SelectItem value="cup">cup</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                  </>
                ) : (
                  <SelectItem value="g">g</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Starter Hydration */}
      <div>
        <Label htmlFor="starterHydration" className="mb-1 block text-slate-700 dark:text-slate-300">
          Starter Hydration (%) 
        </Label>
        <Input
          id="starterHydration"
          type="number"
          min={10}
          max={300}
          step="any"
          value={inputs.starterHydration}
          onChange={(e) => onInputChange("starterHydration", e.target.value)}
          placeholder="e.g. 100"
        />
      </div>

      {/* Feed Ratio */}
      <div>
        <Label htmlFor="feedRatio" className="mb-1 block text-slate-700 dark:text-slate-300">
          Feed Ratio (Starter:Flour:Water)
        </Label>
        <Input
          id="feedRatio"
          type="text"
          value={inputs.feedRatio}
          onChange={(e) => onInputChange("feedRatio", e.target.value)}
          placeholder="e.g. 1:1:1"
          spellCheck={false}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating inputs with same values
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => resetInputs(unit)}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (CLEAN JSX ONLY) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 whitespace-pre-line">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Kitchen Result
              </p>
              <p className="text-lg font-mono text-blue-900 dark:text-white whitespace-pre-wrap">{results.value}</p>
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
              <strong>Chef's Tip:</strong> Use a digital scale for baking precision.
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
          Understanding Sourdough Starter Ratio & Feed Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A sourdough starter is a living culture of wild yeast and bacteria used to leaven bread naturally. Maintaining a healthy starter requires regular feedings of flour and water in specific ratios to keep the yeast active and balanced. The hydration level, or the ratio of water to flour, influences the starter's texture, fermentation speed, and flavor profile.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This feed planner helps bakers calculate the precise amounts of starter, flour, and water needed based on your desired feeding ratio and hydration. By inputting your current starter amount and preferred feed ratio, you can maintain consistency in your starter’s strength and hydration, ensuring reliable baking results every time.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this planner, enter the amount of your current starter, the hydration percentage of your starter, and the feeding ratio you want to maintain. The feeding ratio is expressed as parts starter : flour : water (e.g., 1:1:1). The calculator will then tell you how much flour and water to add to your starter to keep it healthy and active.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your current starter amount and its hydration percentage.
          </li>
          <li>
            <strong>Step 3:</strong> Input the feeding ratio you want to use (default is 1:1:1).
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see the exact amounts of flour and water to add.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to feed your starter consistently for best baking results.
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
              href="https://www.kingarthurbaking.com/learn/guides/sourdough-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Sourdough Starter Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on sourdough starter maintenance, hydration, and feeding ratios.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.theperfectloaf.com/sourdough-starter-hydration/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. The Perfect Loaf - Understanding Starter Hydration
            </a>
            <p className="text-slate-500 text-sm">
              In-depth explanation of hydration's impact on sourdough starter performance and bread quality.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.breadtopia.com/sourdough-starter-feeding-ratios/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Breadtopia - Sourdough Starter Feeding Ratios
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on feeding ratios and how to adjust your starter for different baking needs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Sourdough Starter Ratio & Feed Planner"
      description="Plan your sourdough starter feedings. Calculate the perfect ratio of starter, flour, and water to keep your wild yeast active."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Flour to add = (Starter amount / Starter ratio) × Flour ratio\nWater to add = (Starter amount / Starter ratio) × Water ratio\nNew Hydration (%) = ((Starter water + Water to add) / (Starter flour + Flour to add)) × 100",
        variables: [
          { symbol: "Starter amount", description: "Weight of starter you have" },
          { symbol: "Starter ratio", description: "Part of starter in feed ratio" },
          { symbol: "Flour ratio", description: "Part of flour in feed ratio" },
          { symbol: "Water ratio", description: "Part of water in feed ratio" },
          { symbol: "Starter water", description: "Water weight in starter" },
          { symbol: "Starter flour", description: "Flour weight in starter" },
          { symbol: "Flour to add", description: "Flour weight to add" },
          { symbol: "Water to add", description: "Water weight to add" },
          { symbol: "New Hydration", description: "Hydration percentage after feeding" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have 100g of starter at 100% hydration and want to feed it with a 1:1:1 ratio.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate part weight: 100g starter / 1 (starter ratio) = 100g per part.",
          },
          {
            label: "2",
            explanation:
              "Calculate flour to add: 100g × 1 (flour ratio) = 100g flour.",
          },
          {
            label: "3",
            explanation:
              "Calculate water to add: 100g × 1 (water ratio) = 100g water.",
          },
          {
            label: "4",
            explanation:
              "New hydration = ((50g starter water + 100g water) / (50g starter flour + 100g flour)) × 100 = 100%.",
          },
        ],
        result:
          "Feed 100g starter with 100g flour and 100g water to maintain 100% hydration.",
      }}
      relatedCalculators={[
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "🍞",
        },
        {
          title: "Sugar/Butter/Flour Density Lookup",
          url: "/cooking/sugar-butter-flour-density-lookup",
          icon: "🍰",
        },
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "🧁",
        },
        {
          title: "Pasta Dry ↔ Cooked Yield & Portions",
          url: "/cooking/pasta-dry-cooked-yield-portions",
          icon: "📏",
        },
        {
          title: "Cake Pan Size & Volume Converter",
          url: "/cooking/cake-pan-size-volume-converter",
          icon: "🍰",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Sourdough Starter Ratio & Feed Planner" },
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