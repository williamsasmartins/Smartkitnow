import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Ruler, Hammer, HardHat, Box, DollarSign, RotateCcw, Info, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DrywallAreaSheetsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    height: "", // height/thickness of drywall (usually 0.0127 m or 1/2 inch)
    waste: "10",
    price: "",
    materialSize: "standard" // standard = 1.22m x 2.44m (4'x8'), large = 1.22m x 3.05m (4'x10')
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const wastePercent = parseInt(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    // Validate inputs
    if (
      isNaN(length) || length <= 0 ||
      isNaN(width) || width <= 0 ||
      isNaN(height) || height <= 0 ||
      isNaN(wastePercent) || wastePercent < 0 ||
      isNaN(pricePerUnit) || pricePerUnit < 0
    ) {
      return {
        qty: "0",
        unitLabel: "Sheets",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all fields.",
        wasteInfo: "",
        recommendation: "Ensure all inputs are filled correctly to get accurate results."
      };
    }

    // Convert imperial inputs to metric for calculation if needed
    // 1 foot = 0.3048 meters, 1 inch = 0.0254 meters
    // Drywall thickness typical: 12.7 mm (0.5 inch) or 9.5 mm (3/8 inch)
    let lengthM = length;
    let widthM = width;
    let heightM = height;

    if (unit === "imperial") {
      lengthM = length * 0.3048;
      widthM = width * 0.3048;
      heightM = height * 0.0254; // input thickness in inches
    }

    // Calculate total wall area (length x height) + (width x height) for two walls if needed?
    // But here we assume user inputs length and width of the drywall surface area (floor plan or wall length x height)
    // For drywall, area = length x height (height = wall height), width is not used for area calculation but for room width if needed
    // To avoid confusion, let's assume length = total linear length of walls, height = wall height, width is optional or for room width

    // For drywall, area = perimeter length x height
    // So let's treat length as total linear length of walls to drywall, height as wall height
    // Width input can be ignored or used for other purposes (e.g. ceiling drywall)

    // To support ceiling drywall, user can input length and width as ceiling dimensions, height as thickness

    // Let's clarify:
    // If user wants to calculate drywall for walls, length = total linear length of walls, height = wall height, width unused
    // If user wants ceiling drywall, length and width = ceiling dimensions, height = thickness

    // We'll calculate area as length x height (for walls) or length x width (for ceiling)
    // To cover both, let's calculate both wall area and ceiling area separately:

    // For this calculator, let's assume:
    // - If width is provided, area = length x width (ceiling or floor)
    // - If width is empty or zero, area = length x height (wall)

    // This way user can choose what to input.

    let areaM2 = 0;
    if (widthM > 0) {
      areaM2 = lengthM * widthM; // ceiling or floor drywall area
    } else {
      areaM2 = lengthM * heightM; // wall drywall area
    }

    // Add waste margin
    const areaWithWaste = areaM2 * (1 + wastePercent / 100);

    // Drywall sheet sizes:
    // Standard sheet: 1.22m x 2.44m = 2.9768 m²
    // Large sheet: 1.22m x 3.05m = 3.721 m²

    const sheetArea = materialSize === "standard" ? 1.22 * 2.44 : 1.22 * 3.05;

    // Calculate number of sheets needed (round up)
    const sheetsNeeded = Math.ceil(areaWithWaste / sheetArea);

    // Calculate total cost
    const totalCost = sheetsNeeded * pricePerUnit;

    // Format cost string with currency symbol based on unit system
    // Assuming USD for simplicity, could be enhanced to support currency input
    const costFormatted = `$${totalCost.toFixed(2)}`;

    // Details string with raw area and sheet area
    const details = `Raw Area: ${areaM2.toFixed(2)} m² | Sheet Area: ${sheetArea.toFixed(2)} m²`;

    // Waste info
    const wasteInfo = `Includes ${wastePercent}% waste margin for cuts, fitting, and breakage.`;

    // Recommendation
    const recommendation = `It is recommended to purchase at least 1-2 extra sheets beyond the calculated amount to accommodate unexpected damage or measurement errors.`;

    return {
      qty: sheetsNeeded.toString(),
      unitLabel: "Sheets",
      cost: costFormatted,
      details,
      wasteInfo,
      recommendation
    };
  }, [inputs]);

  // 💡 RICH FAQ CONTENT GENERATION
  const faqs = [
    {
      question: "How do I accurately calculate drywall sheets for irregular room shapes?",
      answer:
        "When dealing with irregular room shapes, it is important to divide the space into smaller, manageable sections such as rectangles or triangles. Calculate the drywall area for each section separately and then sum the areas to get the total. This approach reduces errors and ensures you order the correct amount of drywall sheets, preventing costly overages or shortages."
    },
    {
      question: "How does the waste factor affect my drywall project?",
      answer:
        "The waste factor accounts for material lost due to cutting, fitting around obstacles, and accidental damage during installation. Drywall sheets often need to be trimmed to fit corners, windows, and doors, which generates offcuts that cannot be reused. Industry standards recommend adding 10% waste for simple layouts and up to 20% for complex or curved walls to ensure sufficient material is available."
    },
    {
      question: "What is a common mistake contractors make when measuring for drywall?",
      answer:
        "A frequent mistake is measuring wall-to-wall length without subtracting areas occupied by doors, windows, or built-in fixtures. This oversight leads to overestimating the drywall needed, increasing costs unnecessarily. To avoid this, always measure and subtract the surface area of openings and permanent fixtures from the total wall area before calculating drywall requirements."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (Meters)</SelectItem>
            <SelectItem value="imperial">Imperial (Feet/Inches)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length {inputs.unit === "imperial" ? "(feet)" : "(meters)"}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 20" : "e.g. 6"}
          />
          <p className="text-xs text-slate-500">
            Enter total linear length of walls or ceiling length.
          </p>
        </div>
        <div className="space-y-2">
          <Label>
            {inputs.unit === "imperial" ? "Width (feet)" : "Width (meters)"}{" "}
            <span className="text-xs text-slate-400">(Optional for walls)</span>
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 15" : "e.g. 4.5"}
          />
          <p className="text-xs text-slate-500">
            Enter ceiling width or leave blank for wall drywall calculation.
          </p>
        </div>
        <div className="space-y-2">
          <Label>
            Thickness/Height {inputs.unit === "imperial" ? "(inches for walls)" : "(meters)"}
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 8" : "e.g. 2.4"}
          />
          <p className="text-xs text-slate-500">
            For walls: wall height in feet/inches; for ceilings: drywall thickness in meters/inches.
          </p>
        </div>
      </div>

      {/* Material & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Drywall Sheet Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (4' x 8' / 1.22m x 2.44m)</SelectItem>
              <SelectItem value="large">Large (4' x 10' / 1.22m x 3.05m)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Sheet</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min="0"
              step="any"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Waste Slider */}
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
        <p className="text-xs text-slate-500">
          <strong>Pro Tip:</strong> Use 5-10% for simple square rooms, and 15-20% for rooms with angles or curves.
        </p>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Hammer className="mr-2 h-5 w-5" /> Calculate Materials
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900 shadow-md animate-in fade-in slide-in-from-bottom-2">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Estimated Materials
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.qty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-medium text-slate-700 dark:text-slate-300">
              Total Est. Cost: {results.cost}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 text-left">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> <span>{results.details}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> <span>{results.wasteInfo}</span>
              </div>
            </div>
            <p className="mt-4 text-sm italic text-slate-500 bg-slate-100 dark:bg-slate-800 p-2 rounded">
              "{results.recommendation}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. COMPREHENSIVE GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Drywall Area & Sheets Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Calculating the drywall area and the number of sheets required is a fundamental step in any drywall installation project. This calculation ensures that you purchase the correct amount of material, which directly impacts the project's budget, timeline, and quality. Accurate estimation prevents costly delays caused by material shortages and reduces waste, contributing to a more sustainable construction process.
          </p>
          <p>
            Drywall sheets come in standardized sizes and thicknesses, typically 12.7 mm (1/2 inch) thick for residential walls. The density and thickness of drywall influence not only the weight but also the structural properties such as fire resistance and soundproofing. Understanding these material properties helps in selecting the right drywall type and calculating the precise quantity needed for your specific project.
          </p>
        </div>
      </section>

      {/* 2. STEP-BY-STEP MEASUREMENT */}
      <section id="how-to-measure" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-indigo-500" /> How to Measure Correctly
        </h3>
        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">1</span>
            <span>
              <strong>Length & Width:</strong> Measure the longest points of the area you intend to drywall. For walls, this usually means the total linear length of all walls combined. For ceilings, measure the length and width of the ceiling area. If your space is irregular, divide it into smaller sections and measure each separately to improve accuracy.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
            <span>
              <strong>Depth/Thickness:</strong> For walls, this is the height from floor to ceiling. For ceilings, this is the thickness of the drywall sheet, typically 12.7 mm (1/2 inch). Use a tape measure or laser level to ensure consistent measurements across the entire area.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
            <span>
              <strong>Subtract Obstacles:</strong> Account for areas where drywall will not be installed, such as doors, windows, built-in shelves, or large vents. Measure these openings and subtract their surface area from the total to avoid over-ordering materials.
            </span>
          </li>
        </ul>
      </section>

      {/* 3. COMMON MISTAKES (HIGH VALUE) */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Underestimating Waste:</strong> Many beginners order exactly the calculated amount of drywall without considering waste. This is risky because drywall sheets often need to be cut to fit corners, windows, and doors, resulting in offcuts that cannot be reused. Always add a waste margin of at least 10% to accommodate these losses.
          </p>
          <p>
            <strong>2. Ignoring Surface Preparation:</strong> Proper surface preparation, including removing old drywall and ensuring framing is ready, affects the final drywall installation. Neglecting this can lead to uneven surfaces and increased material usage due to additional layers or patching.
          </p>
        </div>
      </section>

      {/* 4. DETAILED FAQ */}
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
      title="Drywall Area & Sheets Calculator"
      description="The ultimate guide and calculator for Drywall Area & Sheets Calculator. Learn how to estimate materials, calculate costs, and avoid common mistakes in your project."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[
        { title: "Concrete Calculator", url: "/construction/concrete-slab-volume", icon: "🏗️" },
        { title: "Flooring Calculator", url: "/construction/hardwood-plank-quantity", icon: "🪵" },
        { title: "Paint Calculator", url: "/construction/paint-coverage-gallons", icon: "🎨" }
      ]}
      onThisPage={[
        { id: "guide", label: "Complete Guide" },
        { id: "how-to-measure", label: "How to Measure" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "FAQ" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}