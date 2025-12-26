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

export default function MortarMixRatioBagCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "", // thickness of mortar layer
    waste: "10", // waste percentage
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation assumptions:
   * - Mortar volume = Length x Width x Depth (converted to cubic meters or cubic feet)
   * - Mortar mix ratio: 1 part cement : 4 parts sand (typical)
   * - Bag yield:
   *    Standard bag (e.g. 25 kg bag) yields approx 0.017 m³ (0.6 ft³) of mortar
   *    Large bag (e.g. 40 kg bag) yields approx 0.027 m³ (1.0 ft³) of mortar
   * - Waste added as percentage on total volume
   * - Cost calculated by multiplying number of bags by price per bag
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      length <= 0 ||
      width <= 0 ||
      depth <= 0
    ) {
      return {
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert all dimensions to meters or feet depending on unit
    // For metric: inputs are meters, result volume in cubic meters
    // For imperial: inputs are feet, result volume in cubic feet
    let volume: number;
    if (inputs.unit === "metric") {
      volume = length * width * depth; // m³
    } else {
      volume = length * width * depth; // ft³
    }

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Bag yield per size and unit
    // Standard bag yields:
    // Metric: 0.017 m³ per bag (typical 25kg bag)
    // Imperial: 0.6 ft³ per bag
    // Large bag yields:
    // Metric: 0.027 m³ per bag (typical 40kg bag)
    // Imperial: 1.0 ft³ per bag

    const bagYield =
      inputs.materialSize === "standard"
        ? inputs.unit === "metric"
          ? 0.017
          : 0.6
        : inputs.unit === "metric"
        ? 0.027
        : 1.0;

    // Calculate number of bags needed (round up)
    const bagsNeeded = Math.ceil(volumeWithWaste / bagYield);

    // Calculate cost
    const cost =
      !isNaN(pricePerUnit) && pricePerUnit > 0
        ? `$${(bagsNeeded * pricePerUnit).toFixed(2)}`
        : "Price not set";

    // Detailed info string
    const details = `Volume: ${volume.toFixed(
      3
    )} ${inputs.unit === "metric" ? "m³" : "ft³"} + Waste: ${wastePercent}% = ${volumeWithWaste.toFixed(
      3
    )} ${inputs.unit === "metric" ? "m³" : "ft³"}`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost,
      details,
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
      question: "What is the ideal mortar mix ratio for general construction?",
      answer:
        "The most common mortar mix ratio used in general construction is 1 part cement to 4 parts sand by volume. This ratio provides a good balance of strength, workability, and durability for most masonry and plastering applications. Adjustments may be made depending on specific project requirements or environmental conditions.",
    },
    {
      question:
        "Why is it important to include a waste margin when calculating mortar quantities?",
      answer:
        "Including a waste margin accounts for material losses during mixing, handling, and application. Mortar can spill, dry out, or be applied thicker than planned, so adding a typical waste percentage (usually 5-15%) ensures you order enough material to complete the job without costly delays or shortages.",
    },
    {
      question:
        "How do I convert mortar volume calculations between metric and imperial units?",
      answer:
        "When working with metric units, dimensions should be in meters to calculate volume in cubic meters (m³). For imperial units, dimensions are in feet to calculate cubic feet (ft³). To convert between units, use the conversion factor 1 m³ = 35.3147 ft³. This ensures accurate volume and bag quantity calculations regardless of the measurement system.",
    },
    {
      question:
        "What factors affect the yield of a mortar bag and how can I estimate it accurately?",
      answer:
        "The yield of a mortar bag depends on the bag size, mix ratio, and moisture content. Standard 25 kg bags typically yield about 0.017 m³ of mortar, while larger 40 kg bags yield around 0.027 m³. Variations in sand grading, water content, and compaction can also affect yield. Always refer to manufacturer specifications and consider a waste margin for accuracy.",
    },
    {
      question:
        "Can I use this calculator for specialized mortar mixes like refractory or waterproof mortar?",
      answer:
        "This calculator is designed for standard cement-sand mortar mixes. Specialized mortars such as refractory or waterproof mixes may have different densities, mix ratios, and yields. For these, consult product datasheets or manufacturers for precise mix ratios and yields, and adjust calculations accordingly.",
    },
    {
      question:
        "How does mortar thickness (depth) influence the quantity of material needed?",
      answer:
        "Mortar thickness directly affects the volume of mortar required. Thicker layers increase the volume proportionally, leading to more material needed. Accurately measuring the depth or thickness of the mortar bed or joint is crucial for precise quantity estimation and cost control.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are plastering a wall that measures 5 meters long, 3 meters high, with a mortar thickness of 0.02 meters (20 mm). You want to order standard 25 kg mortar bags and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: 5 m × 3 m × 0.02 m = 0.3 m³ of mortar needed.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 0.3 m³ × 1.10 = 0.33 m³ total mortar volume.",
      },
      {
        label: "3. Order",
        explanation:
          "Standard bag yield = 0.017 m³, so bags needed = 0.33 ÷ 0.017 ≈ 19.5, round up to 20 bags.",
      },
    ],
    result: "Final Order: 20 Bags of standard mortar mix",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Volume = Length × Width × Depth\nBags Needed = (Volume × (1 + Waste%)) ÷ Bag Yield",
    variables: [
      { symbol: "L", description: "Length of the area (meters or feet)" },
      { symbol: "W", description: "Width of the area (meters or feet)" },
      { symbol: "D", description: "Depth or thickness of mortar (meters or feet)" },
      { symbol: "Waste%", description: "Waste margin percentage (e.g., 10%)" },
      {
        symbol: "Bag Yield",
        description:
          "Volume of mortar yielded per bag (m³ or ft³), depends on bag size and unit system",
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 5"
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
          <Label>
            Depth / Thickness ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "0.02" : "0.07"}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bag Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (25 kg / 0.017 m³)</SelectItem>
              <SelectItem value="large">Large (40 kg / 0.027 m³)</SelectItem>
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
          <BookOpen className="w-6 h-6 text-blue-500" />
          Professional Guide: Mortar Mix Ratio & Bag Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Mortar is a crucial binding material used in masonry, plastering, and
            other construction applications. It is typically a mixture of cement,
            sand, and water, designed to hold bricks, stones, or blocks together.
            The mortar mix ratio defines the proportion of cement to sand, which
            directly influences the strength, durability, and workability of the
            mortar.
          </p>
          <p>
            Precision in calculating the amount of mortar required is essential to
            avoid material shortages or excess waste. Overestimating leads to
            unnecessary costs and storage issues, while underestimating can cause
            project delays and compromise structural integrity. This calculator
            helps professionals and DIYers estimate the correct quantity of mortar
            bags needed based on project dimensions, mix ratios, and waste margins.
          </p>
          <p>
            Mortar materials come in various bag sizes and formulations. Standard
            bags typically weigh 25 kg and yield about 0.017 cubic meters of mortar,
            while larger 40 kg bags yield approximately 0.027 cubic meters. The
            choice of bag size affects ordering, storage, and cost calculations.
            Additionally, different mortar types (e.g., masonry, plaster, refractory)
            may have unique mix ratios and yields.
          </p>
          <p>
            This calculator supports both metric and imperial units, allowing you to
            input project dimensions in meters or feet. It also factors in a waste
            margin to ensure you have enough material to cover spillage, over-application,
            and other losses common on construction sites.
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
            <strong>Tip:</strong> Always measure your project dimensions accurately
            and double-check before ordering materials. Small errors in thickness
            or area can lead to significant material miscalculations.
          </li>
          <li>
            <strong>Did You Know?</strong> The typical mortar mix ratio of 1:4 (cement
            to sand) was developed to balance compressive strength with workability,
            making it suitable for most masonry applications.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Adding a 10% waste margin is a
            standard practice on job sites to cover spillage, uneven application,
            and minor miscalculations.
          </li>
          <li>
            <strong>Tip:</strong> When switching between metric and imperial units,
            always convert all dimensions consistently to avoid errors in volume
            calculations.
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
            <strong>1. Ignoring Waste Margin:</strong> Not accounting for waste can
            lead to ordering insufficient mortar, causing delays and additional
            costs.
          </p>
          <p>
            <strong>2. Mixing Units:</strong> Mixing metric and imperial units
            without proper conversion results in incorrect volume and bag quantity
            calculations.
          </p>
          <p>
            <strong>3. Incorrect Depth Measurement:</strong> Using inconsistent or
            estimated mortar thickness without precise measurement can skew results.
          </p>
          <p>
            <strong>4. Overlooking Bag Yield Differences:</strong> Different bag
            sizes and manufacturers yield different mortar volumes. Always verify
            bag yield before ordering.
          </p>
          <p>
            <strong>5. Not Updating Price:</strong> Forgetting to input or update
            the price per bag can lead to inaccurate cost estimations.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" />
          Frequently Asked Questions
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mortar Mix Ratio & Bag Calculator"
      description="The ultimate professional guide and calculator for Mortar Mix Ratio & Bag Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}