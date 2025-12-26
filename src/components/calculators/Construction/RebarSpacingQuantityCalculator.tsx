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

export default function RebarSpacingQuantityCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, mm) or imperial (feet, inches)
    length: "", // length of slab or beam
    width: "", // width of slab or beam
    depth: "", // thickness or height of slab or beam
    rebarSpacing: "", // spacing between rebars (cm or inches)
    rebarDiameter: "16", // diameter in mm or inches (default 16mm)
    waste: "10", // waste percentage
    price: "", // price per unit length of rebar
    materialSize: "standard", // standard or large rebar size (affects length per unit)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: convert input strings to numbers safely
  const toNumber = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  // Conversion constants
  const MM_TO_M = 0.001;
  const CM_TO_M = 0.01;
  const INCH_TO_FT = 1 / 12;
  const INCH_TO_M = 0.0254;

  // Calculate rebar quantity and length needed
  const results = useMemo(() => {
    // Parse inputs
    const length = toNumber(inputs.length);
    const width = toNumber(inputs.width);
    const depth = toNumber(inputs.depth);
    const spacing = toNumber(inputs.rebarSpacing);
    const wastePercent = toNumber(inputs.waste);
    const pricePerUnit = toNumber(inputs.price);
    const rebarDia = toNumber(inputs.rebarDiameter);

    if (length <= 0 || width <= 0 || spacing <= 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions and spacing.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert all dimensions to meters for calculation
    // Units: metric = meters/cm/mm; imperial = feet/inches
    let lengthM = length;
    let widthM = width;
    let spacingM = spacing;
    let rebarDiameterM = rebarDia * MM_TO_M; // diameter always in mm converted to meters

    if (inputs.unit === "imperial") {
      // length and width assumed feet, spacing inches
      lengthM = length * 0.3048; // feet to meters
      widthM = width * 0.3048; // feet to meters
      spacingM = spacing * INCH_TO_M; // inches to meters
      rebarDiameterM = rebarDia * INCH_TO_M; // inches to meters
    } else {
      // metric: length and width in meters, spacing in cm convert to meters
      spacingM = spacing * CM_TO_M;
    }

    // Calculate number of rebars needed in each direction
    // Rebars run lengthwise and crosswise spaced by spacingM
    // Number of rebars along width = width / spacing + 1 (for last bar)
    // Number of rebars along length = length / spacing + 1
    const numRebarsWidth = Math.floor(widthM / spacingM) + 1;
    const numRebarsLength = Math.floor(lengthM / spacingM) + 1;

    // Total length of rebar needed:
    // Longitudinal bars run lengthwise, each lengthM long, count = numRebarsWidth
    // Transverse bars run widthwise, each widthM long, count = numRebarsLength
    const totalLengthM = numRebarsWidth * lengthM + numRebarsLength * widthM;

    // Add waste margin
    const totalLengthWithWaste = totalLengthM * (1 + wastePercent / 100);

    // Determine standard rebar length based on materialSize
    // Standard rebar length usually 12m, large size 16m (example)
    const standardLength = inputs.materialSize === "large" ? 16 : 12;

    // Calculate number of rebar units (bars) needed, round up
    const barsNeeded = Math.ceil(totalLengthWithWaste / standardLength);

    // Calculate cost estimate if price per unit length is given
    // Price per unit assumed per meter of rebar
    const cost = pricePerUnit > 0 ? pricePerUnit * totalLengthWithWaste : 0;

    // Format outputs
    const mainQty = `${barsNeeded} Bars`;
    const costFormatted = `$${cost.toFixed(2)}`;
    const details = `Raw length: ${totalLengthM.toFixed(2)} m, with waste: ${totalLengthWithWaste.toFixed(
      2
    )} m`;
    const wasteInfo = `+${wastePercent}% Waste included`;

    return {
      mainQty,
      cost: costFormatted,
      details,
      wasteInfo,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the importance of rebar spacing in concrete structures?",
      answer:
        "Rebar spacing is critical to ensure the structural integrity and load distribution of concrete elements. Proper spacing prevents cracking, controls shrinkage, and ensures the concrete can bear the intended loads safely. Incorrect spacing can lead to weak points and premature failure.",
    },
    {
      question: "How do I convert imperial measurements to metric for this calculator?",
      answer:
        "This calculator automatically converts imperial inputs (feet for length/width, inches for spacing) into metric units internally for accurate calculations. Simply select 'Imperial' as your unit system and input your dimensions accordingly.",
    },
    {
      question: "Why is it necessary to include a waste margin in rebar quantity calculations?",
      answer:
        "Including a waste margin accounts for cutting losses, overlaps, bends, and potential errors during installation. Typically, a 5-10% waste factor is added to ensure you order enough material without costly shortages.",
    },
    {
      question: "How does rebar diameter affect quantity calculations?",
      answer:
        "While diameter does not directly affect the number of bars needed, it influences the strength and spacing requirements per design codes. Larger diameters may require greater spacing and affect the total weight and cost of the rebar used.",
    },
    {
      question: "Can this calculator be used for different types of concrete elements?",
      answer:
        "Yes, this calculator is suitable for slabs, beams, columns, and walls where rebar is placed in a grid pattern. For complex shapes or irregular spacing, additional engineering calculations may be necessary.",
    },
    {
      question: "What are the standard lengths of rebar bars used in construction?",
      answer:
        "Standard rebar lengths vary by region but commonly are 12 meters (about 40 feet) for standard bars and up to 16 meters for larger sizes. This calculator allows you to select between standard and large sizes to match your supplier's offerings.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are reinforcing a concrete slab measuring 6 meters long by 4 meters wide with a rebar spacing of 20 cm. You want to calculate how many rebar bars you need, including a 10% waste margin, using standard 12-meter bars.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Length = 6 m, Width = 4 m, Rebar Spacing = 20 cm (0.2 m). Calculate number of bars along width and length.",
      },
      {
        label: "2. Calculate Total Length",
        explanation:
          "Number of bars widthwise = floor(4 / 0.2) + 1 = 21 bars, lengthwise = floor(6 / 0.2) + 1 = 31 bars. Total length = (21 × 6) + (31 × 4) = 126 + 124 = 250 m.",
      },
      {
        label: "3. Add Waste",
        explanation: "Add 10% waste: 250 m × 1.10 = 275 m total rebar length needed.",
      },
      {
        label: "4. Order Bars",
        explanation:
          "Divide total length by bar length: 275 m / 12 m = 22.92 → 23 bars needed to order.",
      },
    ],
    result: "Final Order: 23 standard 12-meter rebar bars",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Rebar Length = (Number of Bars Along Width × Length) + (Number of Bars Along Length × Width)",
    variables: [
      { symbol: "L", description: "Length of the slab or beam" },
      { symbol: "W", description: "Width of the slab or beam" },
      { symbol: "S", description: "Rebar spacing" },
      { symbol: "Nw", description: "Number of bars along width = floor(W / S) + 1" },
      { symbol: "Nl", description: "Number of bars along length = floor(L / S) + 1" },
      { symbol: "Waste", description: "Waste margin percentage added to total length" },
      { symbol: "BarLength", description: "Standard length of one rebar bar" },
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
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 6"
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth / Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label>Rebar Spacing ({inputs.unit === "metric" ? "cm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.rebarSpacing}
            onChange={(e) => handleInputChange("rebarSpacing", e.target.value)}
            placeholder="e.g. 20"
          />
        </div>
        <div className="space-y-2">
          <Label>Rebar Diameter ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Select
            value={inputs.rebarDiameter}
            onValueChange={(v) => handleInputChange("rebarDiameter", v)}
          >
            <SelectTrigger>
              <HardHat className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {inputs.unit === "metric" ? (
                <>
                  <SelectItem value="10">10 mm</SelectItem>
                  <SelectItem value="12">12 mm</SelectItem>
                  <SelectItem value="16">16 mm</SelectItem>
                  <SelectItem value="20">20 mm</SelectItem>
                  <SelectItem value="25">25 mm</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="0.375">3/8 inch</SelectItem>
                  <SelectItem value="0.5">1/2 inch</SelectItem>
                  <SelectItem value="0.625">5/8 inch</SelectItem>
                  <SelectItem value="0.75">3/4 inch</SelectItem>
                  <SelectItem value="1">1 inch</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Item Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size (12 m)</SelectItem>
              <SelectItem value="large">Large Size (16 m)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Meter</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="any"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

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
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Rebar Spacing & Quantity Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Rebar spacing and quantity calculation is a fundamental step in the planning and execution of reinforced concrete structures. It involves determining the number and length of steel reinforcement bars (rebars) required to provide adequate strength and durability to concrete elements such as slabs, beams, columns, and walls. Accurate calculations ensure structural safety, cost efficiency, and compliance with engineering standards.
          </p>
          <p>
            Precision in rebar spacing is crucial because it affects the load distribution and crack control within the concrete. Too wide spacing can lead to weak points and structural failure, while overly dense spacing increases material costs unnecessarily. This calculator helps you find the optimal number of rebars based on your project dimensions and spacing requirements.
          </p>
          <p>
            The calculator supports both metric and imperial units, allowing you to input dimensions in meters or feet and spacing in centimeters or inches. It also considers the diameter of the rebar, which influences spacing requirements and overall strength. By including a waste margin, it accounts for cutting losses and installation adjustments.
          </p>
          <p>
            Different types of rebar materials and sizes are available, typically ranging from standard 12-meter bars to larger 16-meter bars. Selecting the correct size and quantity helps streamline ordering and reduce waste. This tool also estimates the cost based on your input price per meter, assisting in budgeting and procurement.
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
            <strong>Tip:</strong> Always double-check your rebar spacing against local building codes and engineering specifications to ensure compliance and safety.
          </li>
          <li>
            <strong>Did You Know?</strong> Rebar is often coated with epoxy or galvanized to prevent corrosion, especially in environments exposed to moisture or chemicals.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering slightly more rebar than calculated (5-10% waste) can save costly delays caused by shortages on site.
          </li>
          <li>
            <strong>Tip:</strong> When working with imperial units, converting spacing to metric internally ensures more precise calculations and reduces rounding errors.
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
            <strong>1. Incorrect Unit Conversion:</strong> Mixing metric and imperial units without proper conversion can lead to significant miscalculations in rebar quantity.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Failing to include a waste factor often results in ordering insufficient material, causing project delays and increased costs.
          </p>
          <p>
            <strong>3. Overlooking Rebar Diameter Impact:</strong> Using the wrong diameter can affect spacing requirements and structural integrity.
          </p>
          <p>
            <strong>4. Not Rounding Up Bars:</strong> Always round up the number of bars to whole units since partial bars cannot be ordered.
          </p>
          <p>
            <strong>5. Neglecting Local Codes:</strong> Rebar spacing and sizing must comply with local building regulations and engineering designs.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rebar Spacing & Quantity Calculator"
      description="The ultimate professional guide and calculator for Rebar Spacing & Quantity Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "guide", label: "Guide" },
        { id: "tips", label: "Pro Tips" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "mistakes", label: "Mistakes" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}