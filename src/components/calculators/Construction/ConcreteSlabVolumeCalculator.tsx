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

export default function ConcreteSlabVolumeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    depth: "",
    gravelBase: "0", // thickness of gravel base in same units as depth
    waste: "10", // percent waste margin
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for bag yields (volume per bag in cubic meters or cubic feet)
  // Standard bag sizes: 40 lb (0.0113 m³) and 60 lb (0.017 m³) approx
  // For imperial, convert accordingly
  const bagYields = {
    metric: {
      standard: 0.0113, // cubic meters per bag (40 lb bag)
      large: 0.017, // cubic meters per bag (60 lb bag)
    },
    imperial: {
      standard: 0.4, // cubic feet per bag (40 lb bag)
      large: 0.6, // cubic feet per bag (60 lb bag)
    },
  };

  // Convert inputs to numbers
  const lengthNum = parseFloat(inputs.length);
  const widthNum = parseFloat(inputs.width);
  const depthNum = parseFloat(inputs.depth);
  const gravelNum = parseFloat(inputs.gravelBase);
  const wastePercent = parseFloat(inputs.waste);
  const priceNum = parseFloat(inputs.price);
  const unit = inputs.unit;
  const materialSize = inputs.materialSize;

  const results = useMemo(() => {
    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(depthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      depthNum <= 0
    ) {
      return {
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Total depth includes gravel base if any
    const totalDepth = depthNum + (isNaN(gravelNum) ? 0 : gravelNum);

    // Calculate volume of concrete slab (excluding gravel base)
    // Gravel base is not concrete, so volume for concrete is length * width * depth only
    const concreteVolume = lengthNum * widthNum * depthNum; // in m³ or ft³

    // Calculate gravel volume if gravel base > 0
    const gravelVolume =
      gravelNum > 0 ? lengthNum * widthNum * gravelNum : 0;

    // Add waste margin to concrete volume
    const concreteVolumeWithWaste =
      concreteVolume * (1 + wastePercent / 100);

    // Calculate number of bags needed
    const bagYield = bagYields[unit][materialSize]; // volume per bag

    const bagsNeeded = Math.ceil(concreteVolumeWithWaste / bagYield);

    // Calculate cost if price is provided
    const cost =
      !isNaN(priceNum) && priceNum > 0
        ? `$${(bagsNeeded * priceNum).toFixed(2)}`
        : "N/A";

    // Details string
    const details = `Concrete Volume: ${concreteVolume.toFixed(
      3
    )} ${unit === "metric" ? "m³" : "ft³"} | Gravel Base: ${gravelVolume.toFixed(
      3
    )} ${unit === "metric" ? "m³" : "ft³"} | Bags Needed: ${bagsNeeded}`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    lengthNum,
    widthNum,
    depthNum,
    gravelNum,
    wastePercent,
    priceNum,
    unit,
    materialSize,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question:
        "How do I accurately measure the dimensions for the concrete slab volume calculation?",
      answer:
        "To get precise volume calculations, measure the length, width, and depth (thickness) of the slab area carefully using a tape measure or laser distance measurer. Ensure measurements are in consistent units (meters or feet). Double-check measurements to avoid costly errors. For uneven surfaces, take average depths or divide the area into sections.",
    },
    {
      question:
        "Why is it important to include a waste margin when ordering concrete bags?",
      answer:
        "Including a waste margin (commonly 10%) accounts for spillage, over-excavation, uneven subgrade, and slight miscalculations. This ensures you have enough concrete to complete the project without delays. Ordering too little can cause costly last-minute purchases and inconsistent slab quality.",
    },
    {
      question:
        "What types of concrete bags are available and how do they affect the calculation?",
      answer:
        "Concrete bags typically come in standard sizes such as 40 lb and 60 lb bags, which correspond to different volumes per bag. Larger bags reduce the total number of bags needed but may be heavier to handle. Selecting the correct bag size in the calculator ensures accurate bag quantity and cost estimation.",
    },
    {
      question:
        "How does the gravel base thickness affect the concrete volume calculation?",
      answer:
        "The gravel base thickness does not add to the concrete volume but is important for site preparation. It provides drainage and stability beneath the slab. This calculator allows you to input gravel base thickness for informational purposes, but concrete volume is calculated based on slab thickness only.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports both metric (meters) and imperial (feet) units. Simply select your preferred unit system, and enter all dimensions accordingly. The results, including volume and bag quantities, will be displayed in the chosen units.",
    },
    {
      question:
        "How do I estimate the total cost of the concrete needed for my slab?",
      answer:
        "Enter the price per bag of concrete in the calculator along with your slab dimensions and waste margin. The calculator will estimate the total number of bags required and multiply by the price per bag to give you an estimated total cost. This helps with budgeting and ordering.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a concrete slab for a small patio measuring 4 meters long, 3 meters wide, and 0.15 meters thick, with a 0.05 meter gravel base underneath. You want to order standard 40 lb concrete bags and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the concrete volume: 4m (L) × 3m (W) × 0.15m (D) = 1.8 m³",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 1.8 m³ × 1.10 = 1.98 m³ total concrete needed",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total volume by bag yield (0.0113 m³ per standard bag): 1.98 ÷ 0.0113 ≈ 175 bags",
      },
    ],
    result: "Final Order: 175 Bags of concrete",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the slab area" },
      { symbol: "W", description: "Width of the slab area" },
      { symbol: "D", description: "Depth or thickness of the slab" },
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
          <Label>Depth (Slab Thickness) ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.15"
          />
        </div>
        <div className="space-y-2">
          <Label>Gravel Base Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.gravelBase}
            onChange={(e) => handleInputChange("gravelBase", e.target.value)}
            placeholder="e.g. 0.05"
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
              <SelectItem value="standard">Standard Size (40 lb)</SelectItem>
              <SelectItem value="large">Large Size (60 lb)</SelectItem>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Concrete
          Slab Volume Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A concrete slab volume calculator is an essential tool for contractors,
            builders, and DIY enthusiasts to accurately estimate the amount of
            concrete needed for slab projects. By inputting the length, width, and
            depth of the slab, this calculator determines the total volume of
            concrete required, helping you avoid costly overordering or shortages.
          </p>
          <p>
            Precision in these calculations is critical because concrete is sold by
            volume, and errors can lead to wasted materials or project delays. Even
            small miscalculations in depth or area can significantly impact the
            total volume and cost.
          </p>
          <p>
            Different types of concrete bags are available, typically in standard
            sizes such as 40 lb or 60 lb bags, each yielding a specific volume of
            mixed concrete. Selecting the correct bag size in the calculator ensures
            accurate bag counts and cost estimates.
          </p>
          <p>
            Additionally, many projects require a gravel base beneath the slab for
            drainage and stability. While the gravel base thickness does not affect
            the concrete volume, including it in your planning ensures proper site
            preparation.
          </p>
          <p>
            This calculator also factors in a waste margin, typically around 10%,
            to account for spillage, uneven surfaces, and other unforeseen
            circumstances, ensuring you order enough material to complete your
            project smoothly.
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
            <strong>Tip:</strong> Always measure twice and consider site conditions
            such as slope or uneven ground that may require adjusting slab depth.
          </li>
          <li>
            <strong>Did You Know?</strong> Concrete bags vary in volume yield based
            on brand and mix type; always check the bag label for exact coverage.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering slightly more concrete than
            calculated can save time and money by avoiding multiple deliveries.
          </li>
          <li>
            <strong>Tip:</strong> Use a gravel base thickness of at least 4 inches
            (0.1 m) for proper drainage under slabs.
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
            to running out of concrete mid-project, causing delays and extra costs.
          </p>
          <p>
            <strong>2. Mistake:</strong> Mixing units (e.g., length in meters and
            depth in feet) results in incorrect volume calculations and inaccurate
            bag counts.
          </p>
          <p>
            <strong>3. Mistake:</strong> Not accounting for the gravel base thickness
            in site preparation plans can compromise slab stability, even though it
            doesn't affect concrete volume.
          </p>
          <p>
            <strong>4. Mistake:</strong> Using the wrong bag size in calculations
            leads to ordering too many or too few bags, impacting budget and
            workflow.
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
            <a href="https://www.thisoldhouse.com/search?q=Concrete%20Slab%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Slab Calculation - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Concrete Slab Calculation from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Concrete%20Slab%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Slab Calculation - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Concrete Slab Calculation, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.concretenetwork.com/search.html?q=Concrete%20Slab%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Slab Calculation - Concrete Network
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              The leading source for concrete information, including design ideas, contractor directories, and technical guides for Concrete Slab Calculation.
            </p>
          </li>
          <li>
            <a href="https://www.cement.org/search-results?indexCatalogue=site-search&searchQuery=Concrete%20Slab%20Calculation&wordsMode=0" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Concrete Slab Calculation - Portland Cement Association
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical resources and industry standards for cement and concrete applications related to Concrete Slab Calculation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Slab Volume Calculator"
      description="The ultimate professional guide and calculator for Concrete Slab Volume Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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