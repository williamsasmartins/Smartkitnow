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
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Ruler,
  Hammer,
  HardHat,
  Box,
  DollarSign,
  RotateCcw,
  Info,
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DrywallSheetCountCalculator() {
  /**
   * Drywall sheet sizes:
   * - Metric standard: 1.2m x 2.4m (4ft x 8ft approx)
   * - Imperial standard: 4ft x 8ft (1.22m x 2.44m)
   *
   * We'll allow user to input custom sheet size (width & height) to cover non-standard sheets.
   *
   * Calculation logic:
   * 1. Calculate total wall area (sum of all walls + ceiling if selected)
   * 2. Add waste factor (default 10%)
   * 3. Divide by sheet coverage area
   * 4. Round up to nearest whole sheet count
   * 5. Multiply by price per sheet for total cost
   */

  const [inputs, setInputs] = useState({
    unit: "metric", // or imperial
    length: "", // room length (m or ft)
    width: "", // room width (m or ft)
    height: "", // room height (m or ft)
    includeCeiling: false,
    waste: "10", // waste factor in %
    price: "", // price per sheet
    sheetWidth: "", // sheet width (default 1.2m or 4ft)
    sheetHeight: "", // sheet height (default 2.4m or 8ft)
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to parse float safely
  const parseNumber = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) || n <= 0 ? null : n;
  };

  // Convert feet to meters and vice versa
  const ftToM = (ft: number) => ft * 0.3048;
  const mToFt = (m: number) => m / 0.3048;

  // Format number with fixed decimals and thousand separators
  const formatNumber = (num: number, decimals = 2) =>
    num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const results = useMemo(() => {
    // Validate inputs
    const length = parseNumber(inputs.length);
    const width = parseNumber(inputs.width);
    const height = parseNumber(inputs.height);
    const waste = parseNumber(inputs.waste);
    const price = parseNumber(inputs.price);
    const sheetWidth = parseNumber(inputs.sheetWidth);
    const sheetHeight = parseNumber(inputs.sheetHeight);

    if (
      !length ||
      !width ||
      !height ||
      waste === null ||
      waste < 0 ||
      waste > 30 ||
      !sheetWidth ||
      !sheetHeight
    )
      return null;

    // Calculate total wall area (4 walls)
    // Walls: 2*(length*height) + 2*(width*height)
    // Ceiling area if included: length*width
    // All in consistent units (meters or feet)
    let totalArea = 2 * (length * height) + 2 * (width * height);
    if (inputs.includeCeiling) totalArea += length * width;

    // Add waste factor
    const totalWithWaste = totalArea * (1 + waste / 100);

    // Sheet coverage area
    const sheetArea = sheetWidth * sheetHeight;

    // Sheets needed (round up)
    const sheetsNeeded = Math.ceil(totalWithWaste / sheetArea);

    // Total cost
    const totalCost = price && sheetsNeeded ? sheetsNeeded * price : null;

    // Raw area and waste area for display
    const wasteArea = totalWithWaste - totalArea;

    // Units labels
    const unitLabel = inputs.unit === "metric" ? "m²" : "ft²";

    return {
      qty: `${sheetsNeeded} Sheets`,
      cost: totalCost !== null ? `$${formatNumber(totalCost, 2)}` : "N/A",
      rawArea: `${formatNumber(totalArea, 2)} ${unitLabel}`,
      wasteAmount: `${formatNumber(wasteArea, 2)} ${unitLabel} (Waste)`,
      feedback:
        sheetsNeeded <= 10
          ? "Small project, easy to manage."
          : sheetsNeeded <= 50
          ? "Medium project, plan accordingly."
          : "Large project, consider bulk ordering.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How much waste should I add?",
      answer:
        "For simple rectangular rooms, 5-10% is sufficient. For complex angles or patterns, calculate 15-20%.",
    },
    {
      question: "Can I include ceiling drywall in the calculation?",
      answer:
        "Yes, toggle the 'Include Ceiling' option to add ceiling area to the total drywall calculation.",
    },
    {
      question: "What are the standard drywall sheet sizes?",
      answer:
        "Standard drywall sheets are typically 4ft x 8ft (1.22m x 2.44m). You can customize sheet size if using non-standard sheets.",
    },
    {
      question: "Should I consider door and window openings?",
      answer:
        "This calculator does not subtract openings. For precise estimates, subtract openings area manually before input.",
    },
    {
      question: "Why is the waste factor important?",
      answer:
        "Waste accounts for cuts, mistakes, and damaged sheets, preventing material shortage on site.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Default sheet sizes based on unit
  const defaultSheetSizes = {
    metric: { width: 1.2, height: 2.4 },
    imperial: { width: 4, height: 8 },
  };

  // On unit change, reset sheet sizes to defaults
  const onUnitChange = (unit: string) => {
    const def = defaultSheetSizes[unit as "metric" | "imperial"];
    handleInputChange("unit", unit);
    handleInputChange("sheetWidth", def.width.toString());
    handleInputChange("sheetHeight", def.height.toString());
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => onUnitChange(v)}
          aria-label="Select measurement unit"
        >
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (Meters)</SelectItem>
            <SelectItem value="imperial">Imperial (Feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length-input">Length</Label>
          <Input
            id="length-input"
            type="number"
            min={0}
            step="0.01"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`0.00 ${inputs.unit === "metric" ? "m" : "ft"}`}
            aria-describedby="length-desc"
          />
          <p id="length-desc" className="text-xs text-slate-500">
            Room length ({inputs.unit === "metric" ? "meters" : "feet"})
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="width-input">Width</Label>
          <Input
            id="width-input"
            type="number"
            min={0}
            step="0.01"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder={`0.00 ${inputs.unit === "metric" ? "m" : "ft"}`}
            aria-describedby="width-desc"
          />
          <p id="width-desc" className="text-xs text-slate-500">
            Room width ({inputs.unit === "metric" ? "meters" : "feet"})
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="height-input">Height</Label>
          <Input
            id="height-input"
            type="number"
            min={0}
            step="0.01"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={`0.00 ${inputs.unit === "metric" ? "m" : "ft"}`}
            aria-describedby="height-desc"
          />
          <p id="height-desc" className="text-xs text-slate-500">
            Wall height ({inputs.unit === "metric" ? "meters" : "feet"})
          </p>
        </div>
      </div>

      {/* Include Ceiling Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          id="include-ceiling"
          type="checkbox"
          checked={inputs.includeCeiling}
          onChange={(e) => handleInputChange("includeCeiling", e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="include-ceiling" className="select-none">
          Include Ceiling Area
        </Label>
        <Info className="w-4 h-4 text-slate-400" title="Add ceiling area to drywall calculation" />
      </div>

      {/* Sheet Size Inputs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sheet-width">Sheet Width</Label>
          <Input
            id="sheet-width"
            type="number"
            min={0}
            step="0.01"
            value={inputs.sheetWidth}
            onChange={(e) => handleInputChange("sheetWidth", e.target.value)}
            placeholder={`${defaultSheetSizes[inputs.unit as "metric" | "imperial"].width}`}
            aria-describedby="sheet-width-desc"
          />
          <p id="sheet-width-desc" className="text-xs text-slate-500">
            {inputs.unit === "metric" ? "Meters" : "Feet"}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sheet-height">Sheet Height</Label>
          <Input
            id="sheet-height"
            type="number"
            min={0}
            step="0.01"
            value={inputs.sheetHeight}
            onChange={(e) => handleInputChange("sheetHeight", e.target.value)}
            placeholder={`${defaultSheetSizes[inputs.unit as "metric" | "imperial"].height}`}
            aria-describedby="sheet-height-desc"
          />
          <p id="sheet-height-desc" className="text-xs text-slate-500">
            {inputs.unit === "metric" ? "Meters" : "Feet"}
          </p>
        </div>

        {/* Waste Factor */}
        <div className="space-y-3 col-span-2 md:col-span-1 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center">
            <Label htmlFor="waste-slider">Waste Factor (Cuts & Spills)</Label>
            <span className="text-sm font-bold text-blue-600">{inputs.waste}%</span>
          </div>
          <Slider
            id="waste-slider"
            value={[parseInt(inputs.waste) || 10]}
            min={0}
            max={30}
            step={5}
            onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            aria-valuetext={`${inputs.waste}% waste factor`}
          />
          <p className="text-xs text-slate-500">
            Recommended: 5-10% for standard jobs.
          </p>
        </div>

        {/* Price per Sheet */}
        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="price-input">Price per Sheet</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="price-input"
              className="pl-8"
              type="number"
              min={0}
              step="0.01"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
              aria-describedby="price-desc"
            />
          </div>
          <p id="price-desc" className="text-xs text-slate-500">
            Cost per drywall sheet in your currency.
          </p>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No special action needed, calculation is reactive
          // Could add validation or feedback here if desired
        }}
        aria-label="Calculate drywall sheets needed"
      >
        <Hammer className="mr-2 h-5 w-5" /> Calculate Materials
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900 shadow-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <span className="text-sm font-semibold text-slate-500 uppercase">
                You Need Approximately
              </span>
              <div className="text-5xl font-extrabold text-blue-600 my-2">
                {results.qty}
              </div>
              <div className="text-xl font-medium text-slate-700 dark:text-slate-300">
                Est. Cost: {results.cost}
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
              <div>
                Raw Area:{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {results.rawArea}
                </span>
              </div>
              <div>
                Waste Buffer:{" "}
                <span className="font-semibold text-red-500">
                  {results.wasteAmount}
                </span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm italic text-slate-700 dark:text-slate-300">
              {results.feedback}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-10">
      <section id="how-to-measure" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Ruler className="w-6 h-6 text-blue-500" /> How to Measure
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed">
          <p>Accurate measurement is the foundation of any construction project. For this calculation:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Length & Width:</strong> Measure at the floor level. If the room is not square, divide it into smaller rectangles.
            </li>
            <li>
              <strong>Height:</strong> Measure from floor to ceiling for wall height.
            </li>
            <li>
              <strong>Ceiling:</strong> Optionally include ceiling drywall by toggling the checkbox.
            </li>
            <li>
              <strong>Sheet Size:</strong> Use standard sheet sizes or enter custom dimensions.
            </li>
          </ul>
        </div>
      </section>

      <section id="pro-tips" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <HardHat className="w-5 h-5" /> Pro Tips
        </h3>
        <p className="text-slate-700 dark:text-slate-300 text-sm">
          Always buy materials from the same batch number (especially for tiles and paint) to ensure color consistency. Leftover material is better than running out halfway through the job.
          <br />
          For rooms with many openings (doors/windows), subtract their area manually for more precise estimates.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b pb-4">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Drywall Sheet Count Calculator"
      description="Calculate the number of standard drywall sheets needed to cover walls and ceilings based on room dimensions."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[
        // Suggest related construction tools
        { title: "Concrete Calculator", url: "/construction/concrete-calculator", icon: "🏗️" },
        { title: "Paint Calculator", url: "/construction/paint-calculator", icon: "🎨" },
        { title: "Flooring Calculator", url: "/construction/flooring-calculator", icon: "🪵" },
      ]}
      onThisPage={[
        { id: "how-to-measure", label: "How to Measure" },
        { id: "pro-tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}