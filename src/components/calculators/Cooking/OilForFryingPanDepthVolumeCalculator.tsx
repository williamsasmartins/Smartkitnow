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

export default function OilForFryingPanDepthVolumeCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    panShape: "round" | "square" | "";
    diameterOrLength: string;
    height: string;
    width?: string;
  }>({
    panShape: "",
    diameterOrLength: "",
    height: "",
    width: "",
  });

  // 2. LOGIC ENGINE

  /**
   * Calculate volume in cubic inches or cubic centimeters based on pan shape and dimensions.
   * Then convert volume to cups or liters.
   * 1 cup = 14.4375 cubic inches
   * 1 liter = 1000 cubic centimeters
   */
  const results = useMemo(() => {
    const { panShape, diameterOrLength, height, width } = inputs;

    if (
      !panShape ||
      !diameterOrLength ||
      !height ||
      (panShape === "square" && !width)
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Parse inputs as numbers
    const dOrL = parseFloat(diameterOrLength);
    const h = parseFloat(height);
    const w = width ? parseFloat(width) : 0;

    if (isNaN(dOrL) || isNaN(h) || (panShape === "square" && isNaN(w))) {
      return {
        value: 0,
        label: "",
        subtext: "Please enter valid numeric values.",
        warning: null,
      };
    }

    // Calculate volume in cubic inches or cubic centimeters
    let volumeCubicInches = 0;
    let volumeCubicCm = 0;

    if (unit === "imperial") {
      if (panShape === "round") {
        // Volume = π * r^2 * h
        const r = dOrL / 2;
        volumeCubicInches = Math.PI * r * r * h;
      } else if (panShape === "square") {
        // Volume = L * W * H
        volumeCubicInches = dOrL * w * h;
      }
      // Convert volume to cups (1 cup = 14.4375 cubic inches)
      const cups = volumeCubicInches / 14.4375;

      // Round cups to 2 decimals
      const cupsRounded = Math.round(cups * 100) / 100;

      return {
        value: cupsRounded,
        label: "Cups of Oil Needed",
        subtext:
          "Calculated volume to fill your pan to the specified depth for safe frying.",
        warning: null,
      };
    } else {
      // Metric: inputs assumed in cm, volume in cubic cm
      if (panShape === "round") {
        const r = dOrL / 2;
        volumeCubicCm = Math.PI * r * r * h;
      } else if (panShape === "square") {
        volumeCubicCm = dOrL * w * h;
      }
      // Convert volume to liters (1000 cm³ = 1 L)
      const liters = volumeCubicCm / 1000;
      const litersRounded = Math.round(liters * 100) / 100;

      return {
        value: litersRounded,
        label: "Liters of Oil Needed",
        subtext:
          "Calculated volume to fill your pan to the specified depth for safe frying.",
        warning: null,
      };
    }
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is it important to calculate oil volume accurately for frying?",
      answer:
        "Accurate oil volume ensures food is properly submerged for even cooking and prevents oil overflow, which can cause dangerous splatters or fires. Maintaining the correct oil depth also helps regulate frying temperature and improves food texture. Always fill your fryer or pan to the recommended level for safety and optimal results.",
    },
    {
      question: "What pan shapes does this calculator support?",
      answer:
        "This calculator supports round and square pans, the most common shapes used for frying. For round pans, input the diameter; for square pans, input length and width. Accurate dimensions help determine the precise oil volume needed to fill the pan to your desired depth.",
    },
    {
      question:
        "Can I use this calculator to determine oil volume for deep fryers or only pans?",
      answer:
        "Yes, this calculator works for any container where you know the shape and dimensions, including deep fryers, pots, or pans. Just measure the internal dimensions and desired oil depth, and the calculator will provide the volume needed to fill it safely.",
    },
    {
      question:
        "Are there food safety considerations when filling oil for frying?",
      answer:
        "Absolutely. Overfilling oil can cause dangerous spills and fires, while underfilling may lead to uneven cooking. Always leave space for food displacement and never fill oil above the manufacturer’s recommended level. Also, monitor oil temperature carefully to avoid overheating, which can degrade oil quality and create hazards.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    field: keyof typeof inputs,
    value: string | "round" | "square"
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Reset inputs
  function resetForm() {
    setInputs({
      panShape: "",
      diameterOrLength: "",
      height: "",
      width: "",
    });
  }

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
              <SelectItem value="imperial">
                Imperial (Inches / Cups)
              </SelectItem>
              <SelectItem value="metric">Metric (cm / Liters)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pan Shape Select */}
      <div>
        <Label htmlFor="panShape" className="mb-1 block text-slate-700 dark:text-slate-300">
          Pan Shape
        </Label>
        <Select
          id="panShape"
          value={inputs.panShape}
          onValueChange={(v) => handleInputChange("panShape", v as any)}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select pan shape" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round">Round</SelectItem>
            <SelectItem value="square">Square / Rectangular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Diameter or Length Input */}
      {inputs.panShape === "round" && (
        <div>
          <Label
            htmlFor="diameter"
            className="mb-1 block text-slate-700 dark:text-slate-300"
          >
            Diameter ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="diameter"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter diameter in ${unit === "imperial" ? "inches" : "cm"}`}
            value={inputs.diameterOrLength}
            onChange={(e) => handleInputChange("diameterOrLength", e.target.value)}
          />
        </div>
      )}

      {inputs.panShape === "square" && (
        <>
          <div>
            <Label
              htmlFor="length"
              className="mb-1 block text-slate-700 dark:text-slate-300"
            >
              Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="length"
              type="number"
              min={0}
              step="any"
              placeholder={`Enter length in ${unit === "imperial" ? "inches" : "cm"}`}
              value={inputs.diameterOrLength}
              onChange={(e) => handleInputChange("diameterOrLength", e.target.value)}
            />
          </div>
          <div>
            <Label
              htmlFor="width"
              className="mb-1 block text-slate-700 dark:text-slate-300"
            >
              Width ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="width"
              type="number"
              min={0}
              step="any"
              placeholder={`Enter width in ${unit === "imperial" ? "inches" : "cm"}`}
              value={inputs.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Height / Oil Depth Input */}
      <div>
        <Label
          htmlFor="height"
          className="mb-1 block text-slate-700 dark:text-slate-300"
        >
          Oil Depth ({unit === "imperial" ? "inches" : "cm"})
        </Label>
        <Input
          id="height"
          type="number"
          min={0}
          step="any"
          placeholder={`Enter oil depth in ${unit === "imperial" ? "inches" : "cm"}`}
          value={inputs.height}
          onChange={(e) => handleInputChange("height", e.target.value)}
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
          onClick={resetForm}
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
              <strong>Chef's Tip:</strong> Always leave at least 2-3 inches (5-7 cm)
              of space between the oil surface and the pan rim to prevent spills
              when adding food.
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
          Understanding Oil for Frying Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Deep frying requires the right amount of oil to ensure food cooks evenly
          and safely. Too little oil can cause uneven cooking and sticking, while
          too much oil risks dangerous spills and fires. This calculator helps you
          determine the precise volume of oil needed to fill your pan or fryer to
          a safe and effective depth.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting your pan's shape and dimensions along with the desired oil
          depth, the calculator uses geometric formulas to compute the volume. It
          then converts this volume into cups or liters depending on your preferred
          unit system. This ensures you add just the right amount of oil for
          optimal frying results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Proper oil volume also helps maintain consistent frying temperatures,
          which is critical for food safety and quality. Always follow manufacturer
          guidelines for your cookware and fryer, and never fill oil above the
          recommended level.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward. Select your pan shape, enter
          the internal dimensions, and specify the oil depth you want. The result
          will tell you how much oil to add, helping you avoid waste and hazards.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your pan's internal diameter (round)
            or length and width (square) in inches or centimeters.
          </li>
          <li>
            <strong>Step 2:</strong> Decide on the oil depth you want for frying,
            typically 2-4 inches (5-10 cm).
          </li>
          <li>
            <strong>Step 3:</strong> Enter these values into the calculator and
            select your unit system.
          </li>
          <li>
            <strong>Step 4:</strong> Add the calculated amount of oil to your pan,
            leaving space at the top to prevent spills.
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
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-minimum-cooking-temperature"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Safe Cooking Temperatures & Food Safety
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines on safe frying practices and oil handling to prevent
              foodborne illness and kitchen accidents.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/bakers-percentage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking - Baker's Math & Ratios
            </a>
            <p className="text-slate-500 text-sm">
              Foundational baking math principles that inform ingredient ratios and
              conversions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-deep-fry-food-safely"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats - Deep Frying Safety & Techniques
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on frying oil volumes, temperatures, and safety tips.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Oil for Frying Calculator"
      description="Calculate oil needed for deep frying. Determine the volume required to fill your pan or fryer to the safe depth level."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Volume = π × (Diameter / 2)² × Depth (for round pans) or Volume = Length × Width × Depth (for square pans)",
        variables: [
          { symbol: "Diameter / Length / Width / Depth", description: "Pan dimensions" },
          { symbol: "Volume", description: "Oil volume needed" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You have a round pan 10 inches in diameter and want to fill it with 3 inches of oil.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate radius: 10 inches / 2 = 5 inches.",
          },
          {
            label: "2",
            explanation:
              "Calculate volume: π × 5² × 3 ≈ 235.6 cubic inches.",
          },
          {
            label: "3",
            explanation:
              "Convert to cups: 235.6 / 14.4375 ≈ 16.3 cups of oil needed.",
          },
        ],
        result: "Add approximately 16.3 cups of oil to fill the pan to 3 inches depth.",
      }}
      relatedCalculators={[
        { title: "Serving Size Multiplier", url: "/cooking/serving-size-multiplier", icon: "🍳" },
        { title: "Cups ↔ Grams ↔ Ounces Converter", url: "/cooking/cups-grams-ounces-by-ingredient", icon: "⚖️" },
        { title: "Rice:Water Ratio & Yield Calculator", url: "/cooking/rice-water-ratio-yield", icon: "🥩" },
        { title: "Baker’s Percentage Calculator", url: "/cooking/bakers-percentage", icon: "🧁" },
        { title: "Safe Internal Temperature Checker", url: "/cooking/safe-internal-temperature-checker", icon: "🌡️" },
        { title: "Recipe Scaler (x0.5, x2, x3…)", url: "/cooking/recipe-scaler", icon: "🌡️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Oil for Frying Calculator" },
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