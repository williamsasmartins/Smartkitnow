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

export default function PlywoodCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    waste: "10", // waste percentage
    price: "",
    materialSize: "standard", // standard or large sheet size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for sheet sizes in meters and feet
  // Standard plywood sheet sizes:
  // Metric standard: 1.22m x 2.44m (4ft x 8ft)
  // Large size: 1.52m x 3.05m (5ft x 10ft)
  const sheetSizes = {
    metric: {
      standard: { length: 2.44, width: 1.22 }, // meters
      large: { length: 3.05, width: 1.52 },
    },
    imperial: {
      standard: { length: 8, width: 4 }, // feet
      large: { length: 10, width: 5 },
    },
  };

  // Calculate required sheets based on inputs
  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(widthNum) ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      wastePercent > 25
    ) {
      return {
        mainQty: "0 Sheets",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Get sheet size for selected unit and material size
    const sheet = sheetSizes[inputs.unit][inputs.materialSize];

    // Calculate total area needed
    // length and width are area dimensions to cover (floor, wall, etc)
    // area = length * width
    const totalArea = lengthNum * widthNum;

    // Calculate number of sheets needed without waste
    const sheetArea = sheet.length * sheet.width;

    let sheetsNeeded = totalArea / sheetArea;

    // Add waste margin
    sheetsNeeded *= 1 + wastePercent / 100;

    // Round up to nearest whole sheet
    const sheetsRounded = Math.ceil(sheetsNeeded);

    // Calculate cost if price per sheet is provided
    const cost = priceNum && priceNum > 0 ? sheetsRounded * priceNum : 0;

    return {
      mainQty: `${sheetsRounded} Sheet${sheetsRounded > 1 ? "s" : ""}`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "N/A",
      details: `Raw sheets needed: ${sheetsNeeded.toFixed(2)}`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a plywood calculator and how does it work?",
      answer:
        "A plywood calculator helps you estimate the number of plywood sheets required to cover a specific area based on your project's dimensions. By inputting the length and width of the area and selecting the plywood sheet size, the calculator computes the total sheets needed, including an optional waste margin to account for cutting and errors.",
    },
    {
      question:
        "Why is it important to include a waste margin when calculating plywood requirements?",
      answer:
        "Including a waste margin is crucial because during cutting, fitting, and installation, some material is inevitably lost or damaged. A typical waste margin ranges from 5% to 15%, depending on project complexity. This ensures you order enough plywood to complete your project without costly delays or shortages.",
    },
    {
      question:
        "How do I choose between standard and large plywood sheet sizes?",
      answer:
        "Standard plywood sheets typically measure 4 feet by 8 feet (1.22m x 2.44m), while large sheets can be 5 feet by 10 feet (1.52m x 3.05m). Your choice depends on project requirements, availability, and transportation constraints. Larger sheets cover more area but may be harder to handle and transport.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and input your dimensions accordingly. The calculator automatically adjusts sheet sizes and calculations based on the selected unit.",
    },
    {
      question:
        "How accurate is the plywood calculator for complex shapes or irregular areas?",
      answer:
        "The calculator assumes rectangular or square areas for simplicity. For complex or irregular shapes, it's best to break down the area into smaller rectangles, calculate plywood needs for each, and sum them up. Always add a higher waste margin to accommodate irregular cuts and fitting challenges.",
    },
    {
      question:
        "How do I estimate the cost of plywood using this calculator?",
      answer:
        "You can input the price per plywood sheet in the calculator. Once you enter your project dimensions and waste margin, the calculator will estimate the total number of sheets needed and multiply by the price per sheet to give you an estimated material cost.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a plywood subfloor for a room measuring 5 meters by 4 meters using standard metric plywood sheets (1.22m x 2.44m). You want to include a 10% waste margin to account for cutting and fitting.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the total area: 5m × 4m = 20 square meters.",
      },
      {
        label: "2. Calculate Sheets Needed",
        explanation:
          "Each standard sheet covers 1.22m × 2.44m = 2.9768 square meters. Sheets needed without waste: 20 ÷ 2.9768 ≈ 6.72 sheets.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste margin: 6.72 × 1.10 = 7.39 sheets.",
      },
      {
        label: "4. Order",
        explanation:
          "Round up to nearest whole sheet: 8 sheets to order.",
      },
    ],
    result: "Final Order: 8 Standard Sheets",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Sheets Needed = (Area to Cover) / (Sheet Area) × (1 + Waste Percentage)",
    variables: [
      { symbol: "Area to Cover", description: "Length × Width of the project area" },
      { symbol: "Sheet Area", description: "Length × Width of one plywood sheet" },
      { symbol: "Waste Percentage", description: "Additional percentage to cover waste (e.g., 0.10 for 10%)" },
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
            placeholder={`e.g. ${inputs.unit === "metric" ? "5" : "16"}`}
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
            placeholder={`e.g. ${inputs.unit === "metric" ? "4" : "13"}`}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sheet Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                Standard ({inputs.unit === "metric" ? "1.22m x 2.44m" : "4ft x 8ft"})
              </SelectItem>
              <SelectItem value="large">
                Large ({inputs.unit === "metric" ? "1.52m x 3.05m" : "5ft x 10ft"})
              </SelectItem>
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
              min={0}
              step="0.01"
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Plywood
          Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A plywood calculator is an essential tool for contractors, builders,
            and DIY enthusiasts to accurately estimate the number of plywood sheets
            required for a project. Whether you are constructing floors, walls,
            roofs, or furniture, knowing the exact quantity of plywood needed helps
            avoid costly over-ordering or frustrating shortages.
          </p>
          <p>
            Precision matters in plywood estimation because plywood sheets come in
            fixed sizes, and cutting them to fit your project area often results in
            waste. By calculating the total area to cover and factoring in a waste
            margin, you can order the right amount of material, saving money and
            time.
          </p>
          <p>
            There are different types and sizes of plywood sheets available. The
            most common standard size is 4 feet by 8 feet (1.22m x 2.44m), but
            larger sheets such as 5 feet by 10 feet (1.52m x 3.05m) are also used
            for bigger projects. The calculator allows you to select the sheet size
            that best fits your needs.
          </p>
          <p>
            Additionally, plywood comes in various grades and thicknesses depending
            on the application, such as exterior-grade, interior-grade, or marine
            plywood. While this calculator focuses on quantity and size, always
            choose the appropriate plywood type for your project's structural and
            environmental requirements.
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
            <strong>Tip:</strong> When measuring your project area, always measure
            twice and consider any cutouts or openings that won’t require plywood.
          </li>
          <li>
            <strong>Did You Know?</strong> Standard plywood sheets are designed to
            fit common framing dimensions, making installation easier and reducing
            waste.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering a few extra sheets beyond
            the calculated amount can save you from delays caused by unexpected
            mistakes or damaged sheets.
          </li>
          <li>
            <strong>Tip:</strong> For projects with irregular shapes, break down
            the area into rectangles and calculate plywood needs for each section
            separately.
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
            <strong>1. Underestimating Waste:</strong> Not including a waste margin
            can lead to ordering too little plywood, causing project delays and
            additional trips to the supplier.
          </p>
          <p>
            <strong>2. Ignoring Sheet Orientation:</strong> Plywood sheets have a
            grain direction and standard sizes; failing to plan cuts according to
            sheet orientation can increase waste.
          </p>
          <p>
            <strong>3. Mixing Units:</strong> Inputting dimensions in mixed units
            (e.g., length in feet and width in meters) will produce incorrect
            results. Always select and use one unit system consistently.
          </p>
          <p>
            <strong>4. Forgetting to Round Up:</strong> Always round up the number
            of sheets to the next whole number since you cannot order partial sheets.
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
            <a href="https://www.thisoldhouse.com/search?q=Plywood%20Sheathing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Plywood Sheathing - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Plywood Sheathing from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Plywood%20Sheathing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Plywood Sheathing - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Plywood Sheathing, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.finehomebuilding.com/?s=Plywood%20Sheathing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Plywood Sheathing - Fine Homebuilding
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Expert articles and detailed construction techniques for Plywood Sheathing from professional builders and craftsmen.
            </p>
          </li>
          <li>
            <a href="https://www.constructconnect.com/blog/search?term=Plywood%20Sheathing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Plywood Sheathing - ConstructConnect
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Construction industry insights, cost data, and project management tips relevant to Plywood Sheathing.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plywood Calculator"
      description="The ultimate professional guide and calculator for Plywood Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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