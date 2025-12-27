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

export default function ConcreteBlockCmuWallCalculator() {
  /*
    Concrete Block (CMU) Wall Calculator
    Inputs:
      - Length (wall length)
      - Height (wall height)
      - Unit system (metric or imperial)
      - Waste percentage (default 10%)
      - Price per block (optional)
      - Block size (standard or large)
    Output:
      - Number of blocks needed (including waste)
      - Estimated cost (if price provided)
  */

  // Block sizes (nominal) in meters and inches for standard and large blocks
  // Standard CMU block nominal size: 16" x 8" x 8" (imperial)
  // Large block example: 20" x 8" x 8"
  // We'll use face area (length x height) for calculation
  // Block face area = block length x block height

  // Metric standard block: 400mm x 200mm (0.4m x 0.2m)
  // Large block: 500mm x 200mm (0.5m x 0.2m)

  const [inputs, setInputs] = useState({
    unit: "metric", // metric or imperial
    length: "",
    height: "",
    waste: "10",
    price: "",
    materialSize: "standard", // standard or large
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const inchToMeter = (inch: number) => inch * 0.0254;
  const meterToInch = (meter: number) => meter / 0.0254;

  // Block face area in m² depending on size and unit
  const blockFaceArea = useMemo(() => {
    if (inputs.unit === "metric") {
      if (inputs.materialSize === "standard") {
        // 0.4m x 0.2m
        return 0.4 * 0.2;
      } else {
        // large: 0.5m x 0.2m
        return 0.5 * 0.2;
      }
    } else {
      // imperial
      if (inputs.materialSize === "standard") {
        // 16" x 8" = 16*0.0254 x 8*0.0254
        return inchToMeter(16) * inchToMeter(8);
      } else {
        // large: 20" x 8"
        return inchToMeter(20) * inchToMeter(8);
      }
    }
  }, [inputs.unit, inputs.materialSize]);

  // Parse inputs safely
  const lengthNum = parseFloat(inputs.length);
  const heightNum = parseFloat(inputs.height);
  const wasteNum = parseFloat(inputs.waste);
  const priceNum = parseFloat(inputs.price);

  // Calculate results
  const results = useMemo(() => {
    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(heightNum) ||
      heightNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0
    ) {
      return {
        mainQty: "0 Blocks",
        cost: "$0.00",
        details: "Please enter valid positive numbers for length, height, and waste.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert length and height to meters if imperial
    let lengthM = lengthNum;
    let heightM = heightNum;
    if (inputs.unit === "imperial") {
      lengthM = inchToMeter(lengthNum * 12); // feet to inches * 12 + convert to meters
      heightM = inchToMeter(heightNum * 12);
      // Actually, input is assumed in feet or inches? 
      // Since no unit label, assume feet for length and height in imperial.
      // So convert feet to meters: 1 ft = 0.3048 m
      lengthM = lengthNum * 0.3048;
      heightM = heightNum * 0.3048;
    }

    // Wall area in m²
    const wallArea = lengthM * heightM;

    // Raw number of blocks needed (area / block face area)
    const rawBlocks = wallArea / blockFaceArea;

    // Add waste margin
    const totalBlocks = rawBlocks * (1 + wasteNum / 100);

    // Round up to nearest whole block
    const blocksRounded = Math.ceil(totalBlocks);

    // Cost calculation
    let cost = 0;
    if (!isNaN(priceNum) && priceNum > 0) {
      cost = blocksRounded * priceNum;
    }

    // Format cost string
    const costStr =
      cost > 0
        ? inputs.unit === "metric"
          ? `€${cost.toFixed(2)}`
          : `$${cost.toFixed(2)}`
        : "$0.00";

    return {
      mainQty: `${blocksRounded.toLocaleString()} Blocks`,
      cost: costStr,
      details: `Raw: ${rawBlocks.toFixed(2)} blocks`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [
    lengthNum,
    heightNum,
    wasteNum,
    priceNum,
    blockFaceArea,
    inputs.unit,
    inputs.waste,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a Concrete Block (CMU) Wall Calculator and how does it work?",
      answer:
        "A Concrete Block (CMU) Wall Calculator is a tool designed to estimate the number of concrete masonry units (CMUs) required to build a wall based on the wall's length and height. It calculates the total wall area and divides it by the face area of a single block, then adds a waste margin to account for breakage and cuts. This ensures accurate material ordering and cost estimation.",
    },
    {
      question: "Why is precision important when calculating the number of CMU blocks needed?",
      answer:
        "Precision is crucial because ordering too few blocks can cause construction delays and increase costs due to rush orders, while ordering too many leads to unnecessary expenses and material waste. Accurate calculations help optimize budget, reduce waste, and ensure the project timeline stays on track.",
    },
    {
      question: "What are the common sizes of concrete blocks used in walls?",
      answer:
        "The most common concrete block sizes are the standard 16 inches long by 8 inches high by 8 inches deep (imperial) or 400mm by 200mm by 200mm (metric). Larger blocks, such as 20 inches by 8 inches by 8 inches, are also available and can reduce the number of blocks needed but may affect structural and aesthetic considerations.",
    },
    {
      question: "How do I account for waste when ordering concrete blocks?",
      answer:
        "Waste accounts for blocks that are broken, cut, or otherwise unusable during construction. Typically, a waste margin of 5-15% is added to the calculated number of blocks. This calculator allows you to specify the waste percentage to ensure you order enough blocks to cover these losses.",
    },
    {
      question: "Can this calculator help estimate the cost of concrete blocks?",
      answer:
        "Yes, by entering the price per block, the calculator multiplies the total number of blocks (including waste) by the unit price to provide an estimated material cost. This helps in budgeting and comparing supplier prices.",
    },
    {
      question: "Does the calculator support both metric and imperial units?",
      answer:
        "Absolutely. You can select either metric or imperial units for your inputs. The calculator automatically converts measurements and block sizes accordingly to provide accurate results regardless of the unit system used.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a concrete block wall that is 10 meters long and 2.5 meters high using standard size blocks. You want to include a 10% waste margin and know the price per block is €2.50.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the wall area: Length (10 m) × Height (2.5 m) = 25 m².",
      },
      {
        label: "2. Calculate Blocks",
        explanation:
          "Standard block face area is 0.4 m × 0.2 m = 0.08 m². Divide wall area by block area: 25 ÷ 0.08 = 312.5 blocks.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 312.5 × 1.10 = 343.75 blocks, round up to 344 blocks.",
      },
      {
        label: "4. Estimate Cost",
        explanation:
          "Multiply blocks by price: 344 × €2.50 = €860.00 total estimated cost.",
      },
    ],
    result: "Final Order: 344 Blocks costing approximately €860.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Number of Blocks = (Wall Area ÷ Block Face Area) × (1 + Waste Percentage)",
    variables: [
      { symbol: "Wall Area", description: "Length × Height of the wall" },
      { symbol: "Block Face Area", description: "Length × Height of one block" },
      { symbol: "Waste Percentage", description: "Additional % to cover breakage and cuts" },
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

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Length ({inputs.unit === "metric" ? "meters (m)" : "feet (ft)"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Height ({inputs.unit === "metric" ? "meters (m)" : "feet (ft)"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="e.g. 2.5"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Block Size</Label>
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
        </div>
        <div className="space-y-2">
          <Label>Price per Block</Label>
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
          value={[parseInt(inputs.waste) || 10]}
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Concrete
          Block (CMU) Wall Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A Concrete Block (CMU) Wall Calculator is an essential tool for
            contractors, builders, and estimators to accurately determine the
            number of concrete masonry units required to construct a wall. By
            inputting the wall's length and height, this calculator computes the
            total wall area and divides it by the face area of a single block,
            providing a precise block count.
          </p>
          <p>
            Precision in these calculations is vital to avoid costly over-ordering
            or under-ordering of materials. Ordering too few blocks can delay
            construction, while ordering too many leads to wasted materials and
            increased expenses.
          </p>
          <p>
            Concrete blocks come in various sizes, with the most common being the
            standard 16" x 8" x 8" (imperial) or 400mm x 200mm x 200mm (metric).
            Larger blocks are also available and can reduce the total number of
            units needed but may impact structural design and aesthetics.
          </p>
          <p>
            This calculator also factors in a waste margin, typically between 5%
            and 15%, to account for breakage, cuts, and other losses during
            construction. Additionally, by entering the price per block, users can
            estimate the total material cost, aiding in budgeting and procurement.
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
            <strong>Tip:</strong> Always measure your wall dimensions twice to
            ensure accuracy before ordering materials.
          </li>
          <li>
            <strong>Did You Know?</strong> Using larger blocks can speed up
            construction but may require stronger mortar and reinforcement.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering an extra 10% waste margin
            is a safe bet to avoid delays caused by damaged blocks.
          </li>
          <li>
            <strong>Tip:</strong> When working in imperial units, input lengths and
            heights in feet for easier conversion.
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
            <strong>1. Ignoring Waste Margin:</strong> Not including a waste
            percentage can lead to ordering too few blocks, causing project delays
            and additional costs.
          </p>
          <p>
            <strong>2. Incorrect Unit Inputs:</strong> Mixing metric and imperial
            units without proper conversion results in inaccurate calculations.
          </p>
          <p>
            <strong>3. Overlooking Block Size Variations:</strong> Using the wrong
            block face area for calculations can significantly skew the required
            quantity.
          </p>
          <p>
            <strong>4. Not Rounding Up:</strong> Always round up the number of
            blocks to ensure you have enough material; rounding down can cause
            shortages.
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
            <a href="https://www.thisoldhouse.com/search?q=Concrete%20Masonry%20Unit" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Masonry Unit - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Concrete Masonry Unit from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Concrete%20Masonry%20Unit" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Masonry Unit - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Concrete Masonry Unit, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.concretenetwork.com/search.html?q=Concrete%20Masonry%20Unit" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Masonry Unit - Concrete Network
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The leading source for concrete information, including design ideas, contractor directories, and technical guides for Concrete Masonry Unit.
            </p>
          </li>
          <li>
            <a href="https://www.cement.org/search-results?indexCatalogue=site-search&searchQuery=Concrete%20Masonry%20Unit&wordsMode=0" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Masonry Unit - Portland Cement Association
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical resources and industry standards for cement and concrete applications related to Concrete Masonry Unit.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Block (CMU) Wall Calculator"
      description="The ultimate professional guide and calculator for Concrete Block (CMU) Wall Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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
        { id: "references", label: "References & Resources" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}