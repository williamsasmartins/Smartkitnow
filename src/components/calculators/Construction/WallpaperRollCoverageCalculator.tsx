import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Ruler,
  Hammer,
  HardHat,
  Box,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Calculator,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function WallpaperRollCoverageCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    height: "",
    waste: "10", // percent
    price: "",
    materialSize: "standard", // standard or large roll
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Wallpaper roll sizes in meters and feet (width x length)
  // Standard roll: 0.53m width x 10m length (approx 5.3 m² coverage)
  // Large roll: 0.70m width x 15m length (approx 10.5 m² coverage)
  // Imperial equivalents: 1.75ft x 33ft (standard), 2.3ft x 49ft (large)
  // We'll calculate blockArea based on selected materialSize and unit

  const rollSizes = {
    metric: {
      standard: { width: 0.53, length: 10, area: 0.53 * 10 }, // 5.3 m²
      large: { width: 0.7, length: 15, area: 0.7 * 15 }, // 10.5 m²
    },
    imperial: {
      standard: { width: 1.75, length: 33, area: 1.75 * 33 }, // 57.75 ft²
      large: { width: 2.3, length: 49, area: 2.3 * 49 }, // 112.7 ft²
    },
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const heightNum = parseFloat(inputs.height);
    const wasteNum = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(heightNum) ||
      heightNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0 ||
      wasteNum > 100
    ) {
      return {
        mainQty: "0 Rolls",
        cost: "$0.00",
        details: "Please enter valid positive numbers for length, height, and waste.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate wall area
    // Length x Height (width is not used here as wallpaper covers height vertically and length horizontally)
    // Units: meters or feet, consistent with roll area units
    const wallArea = lengthNum * heightNum;

    // Get roll coverage area based on unit and materialSize
    const blockArea = rollSizes[inputs.unit][inputs.materialSize].area;

    // Calculate raw rolls needed (area / blockArea)
    const rawRolls = wallArea / blockArea;

    // Add waste margin
    const rollsWithWaste = rawRolls * (1 + wasteNum / 100);

    // Round up to nearest whole roll
    const rollsNeeded = Math.ceil(rollsWithWaste);

    // Calculate cost if price is provided
    const totalCost = priceNum > 0 ? rollsNeeded * priceNum : 0;

    // Format outputs
    const mainQty = `${rollsNeeded} Roll${rollsNeeded > 1 ? "s" : ""}`;
    const cost = priceNum > 0 ? `$${totalCost.toFixed(2)}` : "Price not set";
    const details = `Wall Area: ${wallArea.toFixed(2)} ${inputs.unit === "metric" ? "m²" : "ft²"} / Roll Coverage: ${blockArea.toFixed(
      2
    )} ${inputs.unit === "metric" ? "m²" : "ft²"} (Raw: ${rawRolls.toFixed(2)} rolls)`;
    const wasteInfo = `+${wasteNum}% Waste included`;

    return {
      mainQty,
      cost,
      details,
      wasteInfo,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a Wallpaper Roll Coverage Calculator and why should I use it?",
      answer:
        "A Wallpaper Roll Coverage Calculator helps you determine how many wallpaper rolls you need to cover a wall based on its dimensions and the wallpaper roll size. Using this calculator ensures you purchase the correct amount of wallpaper, avoiding costly overbuying or running short during installation.",
    },
    {
      question: "Why is precision important when calculating wallpaper roll coverage?",
      answer:
        "Precision matters because wallpaper rolls come in fixed sizes, and walls often have irregular dimensions or patterns that require matching. Accurate calculations help minimize waste and ensure you have enough material to complete the job without delays or extra trips to the store.",
    },
    {
      question: "How do different wallpaper material types affect coverage calculations?",
      answer:
        "Different wallpaper materials may come in varying roll sizes and patterns. For example, vinyl wallpapers might have larger rolls, while textured or patterned wallpapers may require extra material for pattern matching. This calculator allows you to select standard or large roll sizes to accommodate these differences.",
    },
    {
      question: "How do I account for waste or mistakes in wallpaper installation?",
      answer:
        "It's common to add a waste margin (usually 10-15%) to your wallpaper order to cover cutting errors, pattern matching, and future repairs. This calculator includes a waste slider so you can easily adjust the percentage based on your project's complexity.",
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and the calculator will adjust the roll sizes and calculations accordingly.",
    },
    {
      question: "What if my wallpaper roll size is different from the standard options?",
      answer:
        "If your wallpaper roll size differs from the standard or large options provided, you can manually calculate the roll coverage by multiplying the roll width by its length to get the coverage area, then divide your wall area by this number. Alternatively, you can contact your supplier for exact roll dimensions and adjust your order accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you want to wallpaper a living room wall that is 5 meters long and 2.5 meters high. You choose a standard wallpaper roll (0.53m x 10m) and want to include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate wall area: 5m (length) × 2.5m (height) = 12.5 m²",
      },
      {
        label: "2. Calculate raw rolls",
        explanation: "Divide wall area by roll coverage: 12.5 m² ÷ 5.3 m² ≈ 2.36 rolls",
      },
      {
        label: "3. Add waste",
        explanation: "Add 10% waste margin: 2.36 × 1.10 = 2.6 rolls",
      },
      {
        label: "4. Final order",
        explanation: "Round up to nearest whole roll: 3 rolls needed",
      },
    ],
    result: "Final Order: 3 Rolls",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Number of Rolls = (Wall Area) / (Roll Coverage Area) × (1 + Waste Margin)",
    variables: [
      { symbol: "Wall Area", description: "Length × Height of the wall" },
      { symbol: "Roll Coverage Area", description: "Width × Length of one wallpaper roll" },
      { symbol: "Waste Margin", description: "Percentage of extra material to account for waste (expressed as decimal)" },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs for Length and Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length of Wall ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "5" : "16"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Height of Wall ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "2.5" : "8"}`}
          />
        </div>
      </div>

      {/* Material Size and Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Wallpaper Roll Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Roll</SelectItem>
              <SelectItem value="large">Large Roll</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Roll</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="0.01"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Waste Margin Slider */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          value={[parseInt(inputs.waste)]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
          aria-label="Waste margin percentage"
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Materials Needed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.mainQty}</div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-xs text-slate-400 mt-1 italic">{results.wasteInfo}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 4. GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Wallpaper Roll Coverage Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Wallpaper Roll Coverage Calculator is a specialized tool designed to help professionals and DIY enthusiasts accurately estimate the number of wallpaper rolls required to cover a given wall area. By inputting the wall's length and height along with the wallpaper roll size, this calculator provides a precise roll count, ensuring efficient material usage and cost savings.
          </p>
          <p>
            Precision in wallpaper estimation is crucial because wallpaper rolls come in fixed sizes and patterns. Overestimating can lead to unnecessary expenses and leftover material, while underestimating may cause project delays and mismatched patterns. This calculator factors in a waste margin to accommodate cutting, pattern matching, and installation errors.
          </p>
          <p>
            Wallpaper materials vary widely, from vinyl and paper to textured and fabric-backed types. These materials often come in different roll sizes, which affects coverage. This calculator allows you to select between standard and large roll sizes, adapting calculations accordingly to fit your specific wallpaper type.
          </p>
          <p>
            Whether you work in metric or imperial units, the calculator supports both systems, converting roll sizes and wall measurements seamlessly. This flexibility makes it suitable for professionals working in various regions and ensures your wallpaper project is planned with confidence and accuracy.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure your walls carefully, including windows and doors, but subtract these areas if you want a more precise wallpaper quantity estimate.
          </li>
          <li>
            <strong>Did You Know?</strong> Wallpaper rolls often have pattern repeats, which means you might need extra material to align patterns perfectly, increasing the waste margin.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering an extra roll beyond the calculated amount can save you from running out mid-project, especially with discontinued wallpaper designs.
          </li>
          <li>
            <strong>Tip:</strong> When working with textured or embossed wallpapers, consider ordering slightly more material as trimming and matching can be more challenging.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Measurements:</strong> Failing to measure the wall length and height accurately can lead to ordering too few or too many rolls. Always double-check your measurements and consider measuring multiple walls if applicable.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Not including a waste margin for pattern matching, cutting errors, or future repairs can cause shortages during installation. Always add at least 10% waste to your calculations.
          </p>
          <p>
            <strong>3. Using Wrong Roll Size:</strong> Wallpaper rolls come in different sizes depending on the manufacturer and material. Using incorrect roll dimensions in your calculations will produce inaccurate results.
          </p>
          <p>
            <strong>4. Forgetting Unit Conversion:</strong> Mixing metric and imperial units without proper conversion can cause major miscalculations. Always ensure your inputs and roll sizes use the same unit system.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-100">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            <a href="https://www.thisoldhouse.com/search?q=Wallpaper+Roll+Coverage+Calculator" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wallpaper Roll Coverage Calculator - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Wallpaper Roll Coverage Calculator from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Wallpaper+Roll+Coverage+Calculator" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wallpaper Roll Coverage Calculator - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Wallpaper Roll Coverage Calculator, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.bobvila.com/search?q=Wallpaper+Roll+Coverage+Calculator" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wallpaper Roll Coverage Calculator - Bob Vila
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Tried-and-true home advice, cleaning hacks, and DIY tips for Wallpaper Roll Coverage Calculator from America's most trusted home improvement expert.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Wallpaper Roll Coverage Calculator"
      description="The ultimate professional guide and calculator for Wallpaper Roll Coverage Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula} // 8. PASSING FORMULA
      example={example} // 9. PASSING EXAMPLE
      relatedCalculators={[]}
      onThisPage={[
        // 10. FULL NAVIGATION
        { id: "guide", label: "Guide" },
        { id: "tips", label: "Pro Tips" },
        { id: "formula", label: "Formula" }, // Layout handles id="formula" automatically for the prop
        { id: "example", label: "Example" }, // Layout handles id="example" automatically for the prop
        { id: "mistakes", label: "Mistakes" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References & Resources" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}