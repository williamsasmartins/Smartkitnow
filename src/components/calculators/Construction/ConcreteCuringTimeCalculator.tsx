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

export default function ConcreteCuringTimeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    depth: "", // thickness of concrete slab
    waste: "10", // percent waste margin
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Concrete curing time estimation is primarily a function of concrete volume and type,
   * but this calculator focuses on estimating material units needed based on dimensions.
   * The curing time itself depends on mix, weather, and thickness.
   *
   * For material units, we calculate volume (m³ or ft³), add waste margin,
   * then convert volume to number of bags based on bag size yield.
   */

  // Bag yields (approximate):
  // Standard bag: 0.035 m³ (1 cubic foot)
  // Large bag: 0.05 m³ (1.4 cubic feet)

  const bagYields = {
    metric: {
      standard: 0.035,
      large: 0.05,
    },
    imperial: {
      standard: 1, // cubic foot
      large: 1.4,
    },
  };

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

    // Calculate volume in cubic meters or cubic feet
    // Metric inputs assumed meters, imperial feet
    const volume = length * width * depth;

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Convert volume to number of bags
    const yieldPerBag = bagYields[unit][materialSize];

    let bagsNeeded = volumeWithWaste / yieldPerBag;

    // Round up to nearest whole bag
    bagsNeeded = Math.ceil(bagsNeeded);

    // Calculate cost if price given
    const cost = pricePerUnit && !isNaN(pricePerUnit) ? bagsNeeded * pricePerUnit : 0;

    // Format results
    const mainQty = `${bagsNeeded} Bag${bagsNeeded > 1 ? "s" : ""}`;
    const costFormatted = cost ? `$${cost.toFixed(2)}` : "N/A";
    const details = `Raw volume: ${volume.toFixed(3)} ${
      unit === "metric" ? "m³" : "ft³"
    }, with waste: ${volumeWithWaste.toFixed(3)} ${
      unit === "metric" ? "m³" : "ft³"
    }`;

    return {
      mainQty,
      cost: costFormatted,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What factors influence concrete curing time?",
      answer:
        "Concrete curing time depends on several factors including the type of cement used, ambient temperature, humidity, and the thickness of the concrete slab. Proper curing ensures the concrete reaches its designed strength and durability. Typically, concrete reaches 70% of its strength within 7 days, but full curing can take up to 28 days or more depending on conditions.",
    },
    {
      question: "Why is it important to add a waste margin when ordering concrete?",
      answer:
        "Adding a waste margin accounts for spillage, uneven surfaces, and measurement inaccuracies during mixing and pouring. Without this margin, you risk running short of concrete mid-project, causing delays and additional costs. A typical waste margin ranges from 5% to 15%, depending on project complexity.",
    },
    {
      question: "How do I convert between metric and imperial units for concrete volume?",
      answer:
        "To convert cubic meters to cubic feet, multiply by 35.3147. Conversely, to convert cubic feet to cubic meters, multiply by 0.0283168. This calculator allows you to input dimensions in either meters or feet and automatically calculates volume and material units accordingly.",
    },
    {
      question: "What are the differences between standard and large concrete bag sizes?",
      answer:
        "Standard concrete bags typically yield about 0.035 cubic meters (1 cubic foot) of mixed concrete, while large bags yield approximately 0.05 cubic meters (1.4 cubic feet). Choosing the right bag size depends on your project's scale and mixing equipment. Larger bags reduce the number of bags needed but may be heavier and harder to handle.",
    },
    {
      question: "Can this calculator estimate the actual curing time of concrete?",
      answer:
        "No, this calculator estimates the quantity of concrete material needed based on dimensions and waste margin. Actual curing time depends on environmental conditions and mix design, which are beyond the scope of this tool. For curing time, consult technical datasheets or a concrete specialist.",
    },
    {
      question: "How accurate are the material quantity estimates?",
      answer:
        "The estimates are based on idealized volume calculations and typical bag yields. Actual quantities may vary due to compaction, mix consistency, and site conditions. Always consult with your supplier and consider ordering a slight excess to avoid shortages.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are pouring a concrete slab for a small patio measuring 4 meters long, 3 meters wide, and 0.1 meters thick (10 cm). You want to order standard size bags with a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: 4m × 3m × 0.1m = 1.2 cubic meters of concrete needed.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 1.2 × 1.10 = 1.32 cubic meters total volume to order.",
      },
      {
        label: "3. Order",
        explanation:
          "Each standard bag yields 0.035 m³, so bags needed: 1.32 ÷ 0.035 ≈ 37.7 bags, rounded up to 38 bags.",
      },
    ],
    result: "Final Order: 38 Standard Size Bags",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the concrete area" },
      { symbol: "W", description: "Width of the concrete area" },
      { symbol: "D", description: "Depth or thickness of the concrete slab" },
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
            min="0"
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
            min="0"
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
            min="0"
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.1"
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
          <Label>Price per Unit</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Concrete
          Curing Time Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Concrete curing time refers to the period required for concrete to
            achieve its desired strength and durability after being poured. This
            process involves maintaining adequate moisture, temperature, and time
            to allow the chemical hydration of cement to occur. While curing time
            varies depending on mix design and environmental conditions, it is
            critical to ensure structural integrity and longevity of concrete
            installations.
          </p>
          <p>
            Precision in estimating concrete volume and material units is essential
            for project planning and budgeting. Overestimating leads to wasted
            materials and increased costs, while underestimating can cause delays
            and compromise quality. This calculator helps you accurately determine
            the amount of concrete material needed based on your project's
            dimensions and waste margin.
          </p>
          <p>
            Concrete materials come in various types and bag sizes. Standard bags
            typically yield about 0.035 cubic meters (1 cubic foot) of mixed
            concrete, while larger bags yield approximately 0.05 cubic meters (1.4
            cubic feet). Selecting the right bag size and accounting for waste
            ensures you order the correct quantity for your project.
          </p>
          <p>
            Remember, while this tool estimates material quantities, actual curing
            time depends on factors such as ambient temperature, humidity, and
            concrete mix. Always follow best practices and manufacturer
            recommendations for curing to achieve optimal results.
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
            <strong>Tip:</strong> Always measure your concrete area carefully and
            double-check dimensions before ordering materials to avoid costly
            mistakes.
          </li>
          <li>
            <strong>Did You Know?</strong> Concrete continues to cure and gain
            strength for months after pouring, but most structural strength is
            achieved within the first 28 days.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Using curing blankets or plastic
            sheets can help retain moisture and speed up curing in cold or dry
            weather.
          </li>
          <li>
            <strong>Tip:</strong> When working in hot climates, schedule pours for
            early morning or late afternoon to reduce rapid drying and cracking.
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
            <strong>1. Underestimating Waste:</strong> Failing to include a waste
            margin can result in running out of concrete mid-pour, causing delays
            and inconsistent finishes.
          </p>
          <p>
            <strong>2. Ignoring Unit Conversions:</strong> Mixing metric and
            imperial units without proper conversion leads to inaccurate volume
            calculations and ordering errors.
          </p>
          <p>
            <strong>3. Incorrect Depth Measurement:</strong> Using inconsistent or
            incorrect depth values can drastically affect volume and material
            estimates.
          </p>
          <p>
            <strong>4. Not Considering Bag Yield Variations:</strong> Different
            concrete mixes and bag sizes yield different volumes; always verify
            with your supplier.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq">
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
            <a href="https://www.thisoldhouse.com/search?q=Concrete%20Curing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Curing - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Concrete Curing from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Concrete%20Curing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Curing - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Concrete Curing, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.concretenetwork.com/search.html?q=Concrete%20Curing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Curing - Concrete Network
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The leading source for concrete information, including design ideas, contractor directories, and technical guides for Concrete Curing.
            </p>
          </li>
          <li>
            <a href="https://www.cement.org/search-results?indexCatalogue=site-search&searchQuery=Concrete%20Curing&wordsMode=0" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Curing - Portland Cement Association
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical resources and industry standards for cement and concrete applications related to Concrete Curing.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Curing Time Estimator"
      description="The ultimate professional guide and calculator for Concrete Curing Time Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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