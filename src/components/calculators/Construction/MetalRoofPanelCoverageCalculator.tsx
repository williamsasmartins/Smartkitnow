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
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Calculator,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MetalRoofPanelCoverageCalculator() {
  /*
    Metal Roofing Panel Coverage Calculator
    Inputs:
      - unit: metric (meters) or imperial (feet)
      - length: length of roof area (m or ft)
      - width: width of roof area (m or ft)
      - panelCoverageWidth: effective coverage width of one metal panel (m or ft)
      - waste: % waste margin (default 10%)
      - price: price per panel unit (optional)
      - materialSize: standard or large (affects panel coverage width)
  */

  // Panel coverage widths for standard and large panels (approximate)
  // Standard: 3 ft (0.9144 m), Large: 3.5 ft (1.067 m)
  // These are typical coverage widths, not total panel width (includes overlap)
  const panelCoverageWidths = {
    standard: { metric: 0.9144, imperial: 3 },
    large: { metric: 1.067, imperial: 3.5 },
  };

  const [inputs, setInputs] = useState({
    unit: "metric", // metric or imperial
    length: "",
    width: "",
    panelCoverageWidth: "", // optional override, else use materialSize default
    waste: "10",
    price: "",
    materialSize: "standard",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Calculation logic:
  // 1. Calculate roof area = length * width (in chosen units)
  // 2. Determine panel coverage width (default by materialSize or override)
  // 3. Calculate number of panels needed = roof width / panel coverage width * roof length (assuming panels run lengthwise)
  //    Actually, panels are usually installed lengthwise along the slope, so coverage is width-wise.
  //    So number of panels = roof length / panel length (assumed full length) * roof width / panel coverage width
  //    But since panel length varies, we simplify: assume panels run lengthwise, so number of panels = roof width / panel coverage width
  //    Then number of panels needed = roof length / panel length * number of panels width-wise
  //    Since length of panels is usually cut to roof length, we only need to calculate how many panels cover width.
  //    So for coverage calculation, number of panels = roof width / panel coverage width * roof length (in linear feet/meters)
  //    But since panels run lengthwise, we just calculate how many panels cover width, and length is covered by length of panels.
  //    So total panels = roof width / panel coverage width * number of rows along length (usually 1 row per length)
  //    For simplicity, calculate panels needed = roof width / panel coverage width * 1 (one panel length covers length)
  //    But if length > panel length, multiple panels lengthwise needed.
  //    Since panel length is variable, we assume panels cut to length, so length dimension does not affect panel count.
  //    So panels needed = roof width / panel coverage width * roof length / panel length (if known)
  //    Without panel length input, assume panels cut to length, so panels needed = roof width / panel coverage width * roof length / panel length = roof width / panel coverage width
  //    So final formula: panels needed = (roof width / panel coverage width) * (roof length / panel length)
  //    Since panel length is roof length, panels needed = roof width / panel coverage width
  //    So we calculate panels needed = roof width / panel coverage width * roof length / panel length (assumed equal)
  //    Simplify: panels needed = (roof width / panel coverage width) * 1 = roof width / panel coverage width
  //    But this ignores length dimension, so to be safe, calculate panels needed = (roof length * roof width) / (panel coverage width * panel length)
  //    Since panel length = roof length (cut to fit), panel length cancels out, so panels needed = roof width / panel coverage width
  //    So we calculate panels needed = roof width / panel coverage width * roof length / panel length (assumed roof length)
  //    So panels needed = roof width / panel coverage width
  //
  // For this calculator, we will assume panels run lengthwise and are cut to length, so number of panels = roof width / panel coverage width
  // Then multiply by roof length to get total panel area coverage? No, panels cover length fully.
  // So total panels = roof width / panel coverage width * roof length / panel length (panel length = roof length)
  // So panels needed = roof width / panel coverage width
  //
  // To be more precise, we calculate total roof area (length * width), then divide by panel coverage area (panel coverage width * panel length)
  // Since panel length = roof length (cut to fit), panel coverage area = panel coverage width * roof length
  // So panels needed = roof area / panel coverage area = (length * width) / (panel coverage width * length) = width / panel coverage width
  //
  // So panels needed = roof width / panel coverage width (rounded up)
  //
  // Add waste margin and round up to whole panels.

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wasteNum = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(widthNum) ||
      widthNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions and waste margin.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Determine panel coverage width
    let panelCoverageWidthNum = parseFloat(inputs.panelCoverageWidth);
    if (isNaN(panelCoverageWidthNum) || panelCoverageWidthNum <= 0) {
      // Use default from materialSize
      panelCoverageWidthNum = panelCoverageWidths[materialSize][unit];
    }

    // Calculate panels needed = roof width / panel coverage width
    const panelsNeededRaw = widthNum / panelCoverageWidthNum;

    // Add waste margin
    const panelsWithWaste = panelsNeededRaw * (1 + wasteNum / 100);

    // Round up to whole panels
    const panelsFinal = Math.ceil(panelsWithWaste);

    // Calculate cost if price provided
    const totalCost =
      !isNaN(priceNum) && priceNum > 0 ? panelsFinal * priceNum : null;

    return {
      mainQty: `${panelsFinal} Panel${panelsFinal !== 1 ? "s" : ""}`,
      cost: totalCost !== null ? `$${totalCost.toFixed(2)}` : "N/A",
      details: `Raw panels needed: ${panelsNeededRaw.toFixed(2)}`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.waste,
    inputs.price,
    inputs.unit,
    inputs.materialSize,
    inputs.panelCoverageWidth,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question:
        "How does the Metal Roofing Panel Coverage Calculator determine the number of panels needed?",
      answer:
        "This calculator estimates the number of metal roofing panels required by dividing the roof's width by the effective coverage width of a single panel. It assumes panels run lengthwise and are cut to fit the roof length, so the length dimension does not affect panel count. The calculator also adds a waste margin to account for cutting, overlaps, and errors, ensuring you order enough material.",
    },
    {
      question:
        "Why is it important to include a waste margin when calculating metal roofing panels?",
      answer:
        "Including a waste margin is crucial because metal roofing panels often require cutting to fit roof dimensions, and overlaps between panels reduce effective coverage. Additionally, mistakes or damage during installation can occur. A typical waste margin of 10% to 15% helps ensure you have enough panels to complete the job without costly delays or additional orders.",
    },
    {
      question:
        "Can I use this calculator for different types of metal roofing panels?",
      answer:
        "Yes, the calculator supports different panel sizes by allowing you to select standard or large panel coverage widths. You can also manually input a custom panel coverage width if you have specific panel dimensions. This flexibility helps accommodate various metal roofing profiles and manufacturers.",
    },
    {
      question:
        "How do I convert measurements if my roof dimensions are in feet but the calculator is set to metric units?",
      answer:
        "The calculator allows you to select either metric (meters) or imperial (feet) units. Ensure you input your roof dimensions and panel coverage width in the same unit system selected. If you need to convert, 1 foot equals 0.3048 meters. Consistency in units is essential for accurate calculations.",
    },
    {
      question:
        "What factors can affect the accuracy of the panel quantity estimate?",
      answer:
        "Several factors can influence accuracy, including roof complexity (hips, valleys, ridges), panel profile and overlap, installation method, and measurement precision. This calculator provides a simplified estimate based on rectangular roof areas and typical panel coverage widths. For complex roofs, consult a professional estimator or roofing contractor.",
    },
    {
      question:
        "Is the price estimate reliable for budgeting purposes?",
      answer:
        "The price estimate is based on the price per panel unit you enter and the calculated number of panels needed, including waste. While it provides a helpful budgeting reference, actual costs may vary due to labor, additional materials, taxes, and regional price differences. Always obtain detailed quotes from suppliers and contractors.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing a metal roof on a rectangular garage measuring 6 meters wide by 10 meters long. You plan to use standard metal roofing panels with an effective coverage width of 0.9144 meters (3 feet). You want to include a 10% waste margin for cutting and overlaps.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Roof width = 6 m, Roof length = 10 m, Panel coverage width = 0.9144 m",
      },
      {
        label: "2. Calculate Panels Needed",
        explanation:
          "Panels needed (raw) = Roof width / Panel coverage width = 6 / 0.9144 ≈ 6.56 panels",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 6.56 × 1.10 = 7.22 panels, round up to 8 panels",
      },
      {
        label: "4. Order",
        explanation:
          "Order 8 panels to cover the roof width with waste margin included.",
      },
    ],
    result: "Final Order: 8 Panels",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Panels Needed = ⌈ (Roof Width ÷ Panel Coverage Width) × (1 + Waste Margin) ⌉",
    variables: [
      { symbol: "Roof Width", description: "Width of the roof area" },
      {
        symbol: "Panel Coverage Width",
        description:
          "Effective coverage width of one metal roofing panel (excluding overlaps)",
      },
      {
        symbol: "Waste Margin",
        description:
          "Percentage of extra material added to account for waste (expressed as decimal, e.g., 0.10 for 10%)",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the next whole panel",
      },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
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

      {/* Inputs: Length and Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Roof Length ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 10"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Roof Width ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 6"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
      </div>

      {/* Panel Coverage Width or Material Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size</SelectItem>
              <SelectItem value="large">Large Size</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Default panel coverage width:{" "}
            {panelCoverageWidths[inputs.materialSize][inputs.unit].toFixed(3)}{" "}
            {inputs.unit === "metric" ? "m" : "ft"}
          </p>
        </div>
        <div className="space-y-2">
          <Label>
            Panel Coverage Width (optional,{" "}
            {inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="Override default"
            value={inputs.panelCoverageWidth}
            onChange={(e) => handleInputChange("panelCoverageWidth", e.target.value)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Leave blank to use default for selected material size.
          </p>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="font-bold text-blue-600">{inputs.waste}%</span>
            </div>
            <Slider
              value={[parseInt(inputs.waste) || 10]}
              min={0}
              max={25}
              step={1}
              onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price per Panel Unit</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="any"
              placeholder="0.00"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Materials Needed
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty}
            </div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-xs text-slate-500 mt-1">{results.wasteInfo}</p>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Metal
          Roofing Panel Coverage Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Metal roofing panels are a popular choice for residential and commercial
            buildings due to their durability, longevity, and aesthetic appeal.
            Calculating the correct number of metal roofing panels needed for a
            project is essential to ensure efficient budgeting and minimize waste.
            The Metal Roofing Panel Coverage Calculator helps professionals and DIY
            enthusiasts estimate the quantity of panels required based on roof
            dimensions and panel sizes.
          </p>
          <p>
            Precision in these calculations matters because ordering too few panels
            can cause project delays and increased costs due to additional orders,
            while ordering too many results in unnecessary expenses and leftover
            materials. This calculator factors in a waste margin to accommodate
            cutting, overlaps, and potential errors during installation.
          </p>
          <p>
            Metal roofing panels come in various profiles and sizes, with coverage
            widths typically ranging from about 3 feet (0.91 meters) to 3.5 feet
            (1.07 meters). The calculator allows you to select standard or large
            panel sizes or input a custom coverage width to match your specific
            materials.
          </p>
          <p>
            By inputting your roof's length and width along with panel coverage
            width and waste margin, you can quickly determine the number of panels
            to order, helping streamline your project planning and procurement.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section
        id="tips"
        className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure your roof dimensions carefully,
            including any overhangs or irregular shapes, to improve accuracy.
          </li>
          <li>
            <strong>Did You Know?</strong> Metal roofing panels overlap to create a
            watertight seal, which reduces the effective coverage width of each
            panel.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering an extra 10-15% panels can
            save time and money by avoiding delays caused by running out of material
            mid-installation.
          </li>
          <li>
            <strong>Tip:</strong> If your roof has multiple slopes or angles,
            calculate panel needs for each section separately and sum the totals.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring Waste Margin:</strong> Not including a waste margin
            often leads to ordering insufficient panels, causing costly delays and
            additional shipping fees.
          </p>
          <p>
            <strong>2. Mixing Units:</strong> Inputting roof dimensions and panel
            sizes in different units (e.g., feet vs. meters) without conversion
            results in inaccurate calculations.
          </p>
          <p>
            <strong>3. Overlooking Roof Complexity:</strong> Calculating panel
            needs based on simple rectangular dimensions without accounting for
            hips, valleys, or dormers can underestimate material requirements.
          </p>
          <p>
            <strong>4. Using Total Panel Width Instead of Coverage Width:</strong>{" "}
            Using the full panel width including overlaps instead of the effective
            coverage width will underestimate the number of panels needed.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" /> Frequently Asked
          Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Metal%20Roofing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Metal Roofing - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Metal Roofing from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Metal%20Roofing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Metal Roofing - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Metal Roofing, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.finehomebuilding.com/?s=Metal%20Roofing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Metal Roofing - Fine Homebuilding
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Expert articles and detailed construction techniques for Metal Roofing from professional builders and craftsmen.
            </p>
          </li>
          <li>
            <a href="https://www.constructconnect.com/blog/search?term=Metal%20Roofing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Metal Roofing - ConstructConnect
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Construction industry insights, cost data, and project management tips relevant to Metal Roofing.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Metal Roofing Panel Coverage Calculator"
      description="The ultimate professional guide and calculator for Metal Roofing Panel Coverage Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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