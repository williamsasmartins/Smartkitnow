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

export default function RetainingWallCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // wall length
    height: "", // wall height
    waste: "10", // waste percentage
    price: "", // price per block
    materialSize: "standard", // block size category
  });

  // Block sizes in square meters or square feet depending on unit and materialSize
  // Standard block area (example): 0.3m x 0.15m = 0.045 m²
  // Large block area (example): 0.45m x 0.2m = 0.09 m²
  // Imperial: convert accordingly (1 ft = 0.3048 m)
  const blockAreas = {
    metric: {
      standard: 0.045, // m²
      large: 0.09, // m²
    },
    imperial: {
      standard: 0.484, // ft² (approx 1.5ft x 0.32ft)
      large: 0.968, // ft² (approx 1.5ft x 0.65ft)
    },
  };

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Calculation logic
  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const height = parseFloat(inputs.height);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    if (
      isNaN(length) ||
      length <= 0 ||
      isNaN(height) ||
      height <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      isNaN(pricePerUnit) ||
      pricePerUnit < 0
    ) {
      return {
        mainQty: "0 Blocks",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate wall area (Length x Height)
    // Units: m² or ft² depending on unit
    const area = length * height;

    // Get block area for selected size and unit
    const blockArea = blockAreas[unit][materialSize];

    // Calculate raw number of blocks needed (area / blockArea)
    const rawBlocks = area / blockArea;

    // Add waste margin
    const totalBlocks = rawBlocks * (1 + wastePercent / 100);

    // Round up to next whole block
    const roundedBlocks = Math.ceil(totalBlocks);

    // Calculate cost
    const totalCost = pricePerUnit * roundedBlocks;

    // Format cost string with currency symbol
    const costStr =
      unit === "metric"
        ? `$${totalCost.toFixed(2)}`
        : `$${totalCost.toFixed(2)}`; // Assuming $ for imperial too, could be improved

    return {
      mainQty: `${roundedBlocks.toLocaleString()} Blocks`,
      cost: costStr,
      details: `Raw: ${rawBlocks.toFixed(2)} blocks before waste`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a retaining wall and why is it important to calculate materials precisely?",
      answer:
        "A retaining wall is a structure designed to hold back soil or rock from a building, structure, or area. Precise material calculation ensures structural integrity, cost efficiency, and reduces waste. Overestimating materials leads to unnecessary expenses, while underestimating can compromise safety and require costly rework.",
    },
    {
      question: "How do different block sizes affect the number of blocks needed for a retaining wall?",
      answer:
        "Block size directly influences the number of blocks required. Larger blocks cover more area, reducing the total count needed, which can speed up installation and reduce labor costs. However, larger blocks may be heavier and more expensive. Selecting the right block size balances cost, ease of installation, and wall design.",
    },
    {
      question: "Why is it necessary to include a waste margin in material calculations?",
      answer:
        "Including a waste margin accounts for breakage, cutting, and unforeseen adjustments during construction. It ensures you have enough materials to complete the project without delays. Typically, a 10% waste margin is recommended, but this can vary depending on site conditions and block handling.",
    },
    {
      question: "Can I use this calculator for walls with varying heights or lengths?",
      answer:
        "This calculator assumes a uniform height and length for the retaining wall. For walls with varying dimensions, calculate each section separately and sum the results. This approach ensures accuracy and accommodates complex wall designs.",
    },
    {
      question: "How do I convert measurements between metric and imperial units for this calculator?",
      answer:
        "The calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system from the dropdown. Input all measurements consistently in the chosen unit. The calculator automatically adjusts block sizes and calculations accordingly.",
    },
    {
      question: "What types of materials are commonly used for retaining wall blocks?",
      answer:
        "Common materials include concrete blocks, natural stone, brick, and timber. Concrete blocks are popular due to their durability and ease of installation. Natural stone offers aesthetic appeal but can be more expensive. Timber is less durable but suitable for smaller or temporary walls.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a retaining wall that is 10 meters long and 1.2 meters high using standard size concrete blocks. You want to include a 10% waste margin and each block costs $3.50.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the wall area: Length (10 m) × Height (1.2 m) = 12 m².",
      },
      {
        label: "2. Calculate Blocks",
        explanation:
          "Each standard block covers 0.045 m². Divide area by block area: 12 ÷ 0.045 = 266.67 blocks.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 266.67 × 1.10 = 293.33 blocks. Round up to 294 blocks.",
      },
      {
        label: "4. Calculate Cost",
        explanation:
          "Multiply blocks by price: 294 × $3.50 = $1029.00 total estimated cost.",
      },
    ],
    result: "Final Order: 294 Blocks costing approximately $1029.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Number of Blocks = (Length × Height) / Block Area × (1 + Waste%)",
    variables: [
      { symbol: "Length", description: "Length of the retaining wall" },
      { symbol: "Height", description: "Height of the retaining wall" },
      { symbol: "Block Area", description: "Surface area covered by one block" },
      { symbol: "Waste%", description: "Waste margin percentage (decimal form)" },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
          aria-label="Select unit system"
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

      {/* Inputs: Length, Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length-input">Length</Label>
          <Input
            id="length-input"
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height-input">Height</Label>
          <Input
            id="height-input"
            type="number"
            min="0"
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
          />
        </div>
      </div>

      {/* Material Size & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material-size-select">Block Size</Label>
          <Select
            id="material-size-select"
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="price-input">Price per Block</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="price-input"
              className="pl-8"
              type="number"
              min="0"
              step="0.01"
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
          <Label htmlFor="waste-slider">Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          id="waste-slider"
          value={[parseInt(inputs.waste)]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
          aria-label="Waste margin slider"
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
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
          <BookOpen className="w-6 h-6 text-blue-500" />
          Professional Guide: Retaining Wall Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A retaining wall is a critical structural element designed to hold back soil and prevent erosion or collapse on sloped terrains. Calculating the correct number of blocks needed for your retaining wall project ensures you purchase the right amount of materials, saving time and money while avoiding delays.
          </p>
          <p>
            Precision in measurement and calculation is essential because underestimating materials can lead to costly project interruptions, while overestimating results in wasted resources and increased expenses. This calculator helps you determine the exact number of blocks required based on your wall's length and height, factoring in a waste margin for safety.
          </p>
          <p>
            Retaining wall blocks come in various sizes and materials, including concrete, natural stone, and brick. Concrete blocks are the most common due to their durability and ease of installation. This tool allows you to select between standard and large block sizes, adjusting calculations accordingly to fit your project needs.
          </p>
          <p>
            By inputting your wall dimensions, block size, and price per block, you can quickly estimate both the quantity of blocks needed and the total material cost. This empowers you to plan your budget accurately and order materials confidently.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure twice and input your measurements carefully to avoid costly mistakes.
          </li>
          <li>
            <strong>Did You Know?</strong> Using larger blocks can reduce installation time but may require heavier equipment.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Adding a 10% waste margin is standard, but for complex walls with curves or cuts, consider increasing waste to 15%.
          </li>
          <li>
            <strong>Tip:</strong> When ordering blocks, confirm with your supplier about block dimensions as sizes can vary slightly by manufacturer.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring Waste Margin:</strong> Not including a waste margin can leave you short of materials, causing project delays and additional costs.
          </p>
          <p>
            <strong>2. Mixing Units:</strong> Inputting length in meters but height in feet (or vice versa) leads to incorrect calculations. Always use consistent units.
          </p>
          <p>
            <strong>3. Overlooking Block Size Variations:</strong> Assuming all blocks are the same size can cause ordering errors. Verify block dimensions before calculating.
          </p>
          <p>
            <strong>4. Rounding Down:</strong> Always round up the number of blocks to ensure you have enough materials; rounding down risks shortages.
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
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://www.thisoldhouse.com/search?q=Retaining%20Wall%20Design" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Retaining Wall Design - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Retaining Wall Design from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Retaining%20Wall%20Design" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Retaining Wall Design - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Retaining Wall Design, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.concretenetwork.com/search.html?q=Retaining%20Wall%20Design" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Retaining Wall Design - Concrete Network
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The leading source for concrete information, including design ideas, contractor directories, and technical guides for Retaining Wall Design.
            </p>
          </li>
          <li>
            <a href="https://www.cement.org/search-results?indexCatalogue=site-search&searchQuery=Retaining%20Wall%20Design&wordsMode=0" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Retaining Wall Design - Portland Cement Association
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical resources and industry standards for cement and concrete applications related to Retaining Wall Design.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Retaining Wall Calculator"
      description="The ultimate professional guide and calculator for Retaining Wall Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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