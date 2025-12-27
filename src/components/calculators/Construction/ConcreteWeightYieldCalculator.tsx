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

export default function ConcreteWeightYieldCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    depth: "", // thickness or height of concrete slab
    waste: "10", // percentage waste margin
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Constants for calculation:
   * Concrete density approx 2400 kg/m³ (150 lb/ft³)
   * Standard bag yields:
   * - Standard bag: 0.03 m³ (1 cubic foot) per 40 kg bag (approx)
   * - Large bag: 0.05 m³ (1.75 cubic feet) per 60 kg bag (approx)
   *
   * For simplicity:
   * Metric:
   * - Density: 2400 kg/m³
   * - Standard bag volume: 0.03 m³
   * - Large bag volume: 0.05 m³
   *
   * Imperial:
   * - Density: 150 lb/ft³
   * - Standard bag volume: 1 ft³
   * - Large bag volume: 1.75 ft³
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      length <= 0 ||
      width <= 0 ||
      depth <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate volume
    // Metric: m x m x m = m³
    // Imperial: ft x ft x ft = ft³
    let volume = length * width * depth;

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Bag volume based on material size and unit
    let bagVolume = 0;
    if (unit === "metric") {
      bagVolume = materialSize === "standard" ? 0.03 : 0.05; // m³ per bag
    } else {
      bagVolume = materialSize === "standard" ? 1 : 1.75; // ft³ per bag
    }

    // Calculate number of bags needed, round up to next whole bag
    const bagsNeeded = Math.ceil(volumeWithWaste / bagVolume);

    // Calculate cost if price per unit provided
    const cost =
      !isNaN(pricePerUnit) && pricePerUnit > 0
        ? `$${(bagsNeeded * pricePerUnit).toFixed(2)}`
        : "N/A";

    // Calculate raw volume without waste for details
    const rawVolumeStr =
      unit === "metric"
        ? `${volume.toFixed(3)} m³`
        : `${volume.toFixed(3)} ft³`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost,
      details: `Raw Volume: ${rawVolumeStr}`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.depth,
    inputs.waste,
    inputs.price,
    inputs.unit,
    inputs.materialSize,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the Concrete Weight & Yield Calculator used for?",
      answer:
        "This calculator helps construction professionals and DIY enthusiasts estimate the amount of concrete material needed for a project based on the dimensions of the area to be filled. It calculates the volume of concrete required, accounts for waste, and converts this volume into the number of bags or units needed, helping to avoid over-ordering or shortages.",
    },
    {
      question:
        "Why is it important to include a waste margin when calculating concrete quantities?",
      answer:
        "Including a waste margin is crucial because during mixing, pouring, and finishing, some concrete is inevitably lost due to spillage, uneven surfaces, or changes in volume from compaction. A typical waste margin of 5-10% ensures you have enough material to complete the job without costly delays or additional orders.",
    },
    {
      question:
        "How do different material sizes affect the calculation of concrete bags?",
      answer:
        "Concrete bags come in various sizes, typically standard and large. The volume each bag yields differs, so selecting the correct bag size in the calculator adjusts the number of bags needed accordingly. Using the wrong bag size can lead to ordering too many or too few bags, impacting cost and project efficiency.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial measurement systems?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and enter the dimensions accordingly. The calculator will handle the conversions internally to provide accurate results.",
    },
    {
      question:
        "How accurate are the weight and yield estimates provided by this calculator?",
      answer:
        "The estimates are based on standard concrete densities and typical bag volumes, which are averages. Actual weight and yield can vary depending on concrete mix, moisture content, and compaction. Always consider these factors and consult with your supplier or engineer for critical projects.",
    },
    {
      question:
        "What should I do if my project requires reinforced concrete or additives?",
      answer:
        "This calculator estimates only the volume and quantity of basic concrete material. For reinforced concrete or mixes with additives, you should consult structural specifications and possibly adjust quantities or order additional materials like rebar separately. This tool is a starting point for material estimation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a concrete slab for a small patio measuring 4 meters long, 3 meters wide, and 0.15 meters deep. You want to order standard size concrete bags and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: 4 m × 3 m × 0.15 m = 1.8 m³ of concrete needed.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 1.8 m³ × 1.10 = 1.98 m³ total volume to order.",
      },
      {
        label: "3. Order",
        explanation:
          "Each standard bag yields 0.03 m³, so divide total volume by bag volume: 1.98 ÷ 0.03 = 66 bags. Order 66 bags to cover the project.",
      },
    ],
    result: "Final Order: 66 Standard Bags of Concrete",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the area" },
      { symbol: "W", description: "Width of the area" },
      { symbol: "D", description: "Depth or Thickness of concrete" },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 4"
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
            placeholder="e.g. 3"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.15"
          />
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
              <SelectItem value="standard">Standard Size</SelectItem>
              <SelectItem value="large">Large Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Bag</Label>
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
          Professional Guide: Concrete Weight & Yield Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Concrete Weight & Yield Calculator is an essential tool for
            construction professionals, contractors, and DIY enthusiasts who
            need to estimate the quantity of concrete required for a project.
            By inputting the dimensions of the area to be filled, this calculator
            determines the volume of concrete needed and converts it into the
            number of bags or units required, factoring in waste and material
            sizes.
          </p>
          <p>
            Precision in concrete estimation is critical to avoid costly
            over-ordering or shortages that can delay your project. Concrete is
            heavy and expensive, so knowing exactly how much to order saves time,
            money, and effort on site.
          </p>
          <p>
            Concrete materials come in various bag sizes and densities depending
            on the mix and supplier. This calculator supports standard and large
            bag sizes and allows switching between metric and imperial units for
            flexibility across different regions and project requirements.
          </p>
          <p>
            Always remember to include a waste margin to cover spillage,
            uneven surfaces, and volume changes during mixing and pouring.
            Typical waste margins range from 5% to 10%, but this can be adjusted
            based on your project's complexity and conditions.
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
            <strong>Tip:</strong> When measuring depth, use consistent units and
            measure the actual thickness of the concrete slab or form. Even small
            variations can significantly affect volume.
          </li>
          <li>
            <strong>Did You Know?</strong> Concrete density varies slightly
            depending on the mix design and moisture content, but 2400 kg/m³ (150
            lb/ft³) is a commonly accepted average for normal-weight concrete.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering a few extra bags beyond
            the calculated amount can save time and money by preventing last-minute
            trips to the supplier.
          </li>
          <li>
            <strong>Tip:</strong> For large projects, consider ordering ready-mix
            concrete by volume instead of bags for better efficiency and cost
            savings.
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
            <strong>1. Incorrect Unit Conversion:</strong> Mixing metric and
            imperial units without proper conversion leads to inaccurate volume
            calculations and material orders.
          </p>
          <p>
            <strong>2. Forgetting Waste Margin:</strong> Not including a waste
            margin can cause material shortages, project delays, and increased
            costs due to emergency orders.
          </p>
          <p>
            <strong>3. Using Wrong Bag Size:</strong> Selecting the wrong bag size
            in the calculator results in ordering too many or too few bags,
            affecting budget and logistics.
          </p>
          <p>
            <strong>4. Ignoring Depth Variations:</strong> Assuming uniform depth
            when the slab or form varies can cause underestimation of concrete
            volume.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
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
            <a href="https://www.thisoldhouse.com/search?q=Concrete%20Weight" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Weight - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Concrete Weight from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Concrete%20Weight" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Weight - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Concrete Weight, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.concretenetwork.com/search.html?q=Concrete%20Weight" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Weight - Concrete Network
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The leading source for concrete information, including design ideas, contractor directories, and technical guides for Concrete Weight.
            </p>
          </li>
          <li>
            <a href="https://www.cement.org/search-results?indexCatalogue=site-search&searchQuery=Concrete%20Weight&wordsMode=0" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Weight - Portland Cement Association
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical resources and industry standards for cement and concrete applications related to Concrete Weight.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Weight & Yield Calculator"
      description="The ultimate professional guide and calculator for Concrete Weight & Yield Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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