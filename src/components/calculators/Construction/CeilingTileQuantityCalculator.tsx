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

export default function CeilingTileQuantityCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // room length
    width: "", // room width
    waste: "10", // waste percentage
    price: "", // price per tile unit
    materialSize: "standard", // standard or large tile size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Tile sizes in meters and feet for calculation
  // Standard tile: 600mm x 600mm (0.6m x 0.6m) or 2ft x 2ft
  // Large tile: 1200mm x 600mm (1.2m x 0.6m) or 4ft x 2ft
  const tileSizes = {
    metric: {
      standard: 0.6 * 0.6, // 0.36 m²
      large: 1.2 * 0.6, // 0.72 m²
    },
    imperial: {
      standard: 2 * 2, // 4 ft²
      large: 4 * 2, // 8 ft²
    },
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wasteNum = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0 ||
      wasteNum > 100
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate total area
    const totalArea = lengthNum * widthNum; // in m² or ft² depending on unit

    // Tile area based on selected size and unit
    const tileArea = tileSizes[inputs.unit][inputs.materialSize];

    // Raw quantity needed (without waste)
    const rawQty = totalArea / tileArea;

    // Add waste margin
    const qtyWithWaste = rawQty * (1 + wasteNum / 100);

    // Round up to whole units (tiles)
    const finalQty = Math.ceil(qtyWithWaste);

    // Calculate cost if price provided
    const totalCost =
      !isNaN(priceNum) && priceNum > 0 ? finalQty * priceNum : null;

    return {
      mainQty: `${finalQty.toLocaleString()} Units`,
      cost: totalCost !== null ? `$${totalCost.toFixed(2)}` : "Price N/A",
      details: `Raw: ${rawQty.toFixed(2)} tiles + ${wasteNum}% waste`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a ceiling tile quantity calculator and why is it important?",
      answer:
        "A ceiling tile quantity calculator helps estimate the exact number of ceiling tiles required to cover a given ceiling area. This tool ensures that contractors and DIYers purchase the right amount of materials, minimizing waste and avoiding costly shortages. Accurate estimation is crucial for budgeting, scheduling, and efficient project management.",
    },
    {
      question:
        "How do I choose between standard and large ceiling tiles in the calculator?",
      answer:
        "The calculator offers options for standard and large tile sizes to match common industry dimensions. Standard tiles typically measure 600mm x 600mm (2ft x 2ft), while large tiles are often 1200mm x 600mm (4ft x 2ft). Selecting the correct tile size ensures accurate quantity calculations based on the actual tile coverage area.",
    },
    {
      question:
        "Why does the calculator include a waste percentage, and how much should I add?",
      answer:
        "Waste percentage accounts for breakage, cutting, and fitting adjustments during installation. It is standard practice to add a waste margin, typically between 5% and 15%, depending on project complexity. Including waste ensures you have enough tiles to complete the job without unexpected shortages.",
    },
    {
      question:
        "Can I use the calculator for both metric and imperial measurement systems?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and enter the room dimensions accordingly. The calculator automatically adjusts tile sizes and calculations to match the selected unit system.",
    },
    {
      question:
        "How do I estimate the total cost of ceiling tiles using this calculator?",
      answer:
        "Enter the price per tile unit in the provided input field. The calculator multiplies the total quantity of tiles (including waste) by the unit price to provide an estimated total cost. This helps with budgeting and procurement planning.",
    },
    {
      question:
        "What should I do if my ceiling has an irregular shape or obstacles?",
      answer:
        "For irregular ceilings or those with obstacles like beams or vents, measure the total ceiling area as accurately as possible, subtracting areas not covered by tiles. You may want to increase the waste percentage to accommodate additional cuts and adjustments. Consulting with a professional estimator is recommended for complex layouts.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing standard ceiling tiles in a rectangular room measuring 5 meters by 4 meters, and you want to include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the ceiling area: 5m (length) × 4m (width) = 20 m² total area.",
      },
      {
        label: "2. Calculate Raw Quantity",
        explanation:
          "Each standard tile covers 0.6m × 0.6m = 0.36 m². Divide total area by tile area: 20 ÷ 0.36 ≈ 55.56 tiles.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 55.56 × 1.10 = 61.12 tiles needed.",
      },
      {
        label: "4. Final Order",
        explanation:
          "Round up to the nearest whole tile: 62 tiles to order.",
      },
    ],
    result: "Final Order: 62 Standard Ceiling Tiles",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Number of Tiles = (Length × Width) ÷ Tile Area × (1 + Waste Percentage)",
    variables: [
      { symbol: "Length", description: "Length of the ceiling area" },
      { symbol: "Width", description: "Width of the ceiling area" },
      { symbol: "Tile Area", description: "Coverage area of one tile" },
      {
        symbol: "Waste Percentage",
        description: "Additional percentage to cover breakage and cuts",
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
            <SelectItem value="metric">Metric (m)</SelectItem>
            <SelectItem value="imperial">Imperial (ft)</SelectItem>
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
            placeholder={`Enter length in ${inputs.unit === "metric" ? "meters" : "feet"}`}
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
            placeholder={`Enter width in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tile Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (600x600 mm / 2x2 ft)</SelectItem>
              <SelectItem value="large">Large (1200x600 mm / 4x2 ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Tile Unit</Label>
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
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Materials Needed
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty}
            </div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Ceiling
          Tile Quantity Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A ceiling tile quantity calculator is an essential tool for contractors,
            architects, and DIY enthusiasts to accurately estimate the number of
            ceiling tiles required for a project. By inputting the dimensions of the
            ceiling area and selecting the tile size, this calculator provides a
            precise quantity estimate, helping to avoid costly over-ordering or
            shortages during installation.
          </p>
          <p>
            Precision matters because ceiling tiles are typically sold in whole units,
            and ordering too few can delay your project, while ordering too many
            results in wasted materials and increased costs. Including a waste margin
            accounts for breakage, cutting, and fitting adjustments, ensuring you have
            enough tiles to complete the job smoothly.
          </p>
          <p>
            Ceiling tiles come in various sizes and materials, with the most common
            sizes being standard 600mm x 600mm (2ft x 2ft) and large 1200mm x 600mm
            (4ft x 2ft). Materials range from mineral fiber and fiberglass to metal
            and PVC, each with different costs and installation requirements. Selecting
            the correct tile size and material type in the calculator helps tailor the
            estimate to your specific project needs.
          </p>
          <p>
            This calculator supports both metric and imperial units, making it versatile
            for projects worldwide. By entering your ceiling dimensions, waste margin,
            and price per tile, you can quickly obtain an accurate material quantity
            and cost estimate to streamline your procurement and budgeting process.
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
            <strong>Tip:</strong> Always measure your ceiling dimensions at multiple
            points to account for irregularities or slopes, then use the average for
            the most accurate estimate.
          </li>
          <li>
            <strong>Did You Know?</strong> Standard ceiling tiles are designed to fit
            into modular grid systems, making installation and replacement easier.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering an extra 10-15% of tiles as
            waste can save time and money by preventing last-minute orders and delays.
          </li>
          <li>
            <strong>Tip:</strong> If your ceiling has many cutouts or fixtures, increase
            the waste margin accordingly to avoid shortages.
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
            <strong>1. Mistake:</strong> Forgetting to include a waste margin can lead
            to ordering too few tiles, causing project delays and additional shipping
            costs.
          </p>
          <p>
            <strong>2. Mistake:</strong> Using incorrect units or mixing metric and
            imperial measurements results in inaccurate calculations and material
            shortages or excess.
          </p>
          <p>
            <strong>3. Mistake:</strong> Not accounting for ceiling obstacles like
            vents, lights, or beams can cause overestimation or underestimation of
            tile quantities.
          </p>
          <p>
            <strong>4. Mistake:</strong> Rounding down the number of tiles instead of
            rounding up can leave you short during installation.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" /> Frequently Asked Questions
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
            <a href="https://www.thisoldhouse.com/search?q=Drop%20Ceiling%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Drop Ceiling Installation - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Drop Ceiling Installation from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Drop%20Ceiling%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Drop Ceiling Installation - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Drop Ceiling Installation, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.energy.gov/search/site?keywords=Drop%20Ceiling%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Drop Ceiling Installation - Energy.gov
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official Department of Energy guidelines for energy efficiency and Drop Ceiling Installation to save money and improve home comfort.
            </p>
          </li>
          <li>
            <a href="https://www.ashrae.org/search?q=Drop%20Ceiling%20Installation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Drop Ceiling Installation - ASHRAE
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical standards and guidelines for HVAC and building systems related to Drop Ceiling Installation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ceiling Tile Quantity Calculator"
      description="The ultimate professional guide and calculator for Ceiling Tile Quantity Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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