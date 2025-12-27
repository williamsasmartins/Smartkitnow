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

export default function PlasterVolumeBagCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, mm) or imperial (feet, inches)
    length: "",
    width: "",
    depth: "", // thickness of plaster layer
    waste: "10", // waste percentage
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for bag yields (volume coverage per bag in cubic meters or cubic feet)
  // Standard bag ~ 25 kg bag covers approx 0.015 m³ (metric) or 0.53 ft³ (imperial)
  // Large bag ~ 40 kg bag covers approx 0.025 m³ (metric) or 0.88 ft³ (imperial)
  const bagYields = {
    metric: {
      standard: 0.015, // cubic meters per bag
      large: 0.025,
    },
    imperial: {
      standard: 0.53, // cubic feet per bag
      large: 0.88,
    },
  };

  const results = useMemo(() => {
    // Parse inputs
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
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate volume in cubic meters or cubic feet
    // For metric: assume inputs in meters (if user inputs in mm, they must convert)
    // For imperial: inputs assumed in feet
    // Depth is thickness of plaster layer

    let volume = length * width * depth; // m³ or ft³

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Calculate number of bags needed (round up)
    const bagYield = bagYields[unit][materialSize];
    const bagsNeeded = Math.ceil(volumeWithWaste / bagYield);

    // Calculate cost if price per unit given
    const cost = !isNaN(pricePerUnit) && pricePerUnit > 0 ? (bagsNeeded * pricePerUnit).toFixed(2) : null;

    // Format results
    const mainQty = `${bagsNeeded} Bag${bagsNeeded !== 1 ? "s" : ""}`;
    const costStr = cost ? `$${cost}` : "N/A";

    // Details string
    const volumeStr =
      unit === "metric"
        ? `${volume.toFixed(3)} m³`
        : `${volume.toFixed(3)} ft³`;

    return {
      mainQty,
      cost: costStr,
      details: `Raw volume: ${volumeStr} | Waste margin: +${wastePercent}%`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the Plaster Volume & Bag Estimator used for?",
      answer:
        "The Plaster Volume & Bag Estimator calculates the total volume of plaster material required for a given surface area and thickness. It then estimates the number of plaster bags needed based on the selected bag size and includes a waste margin to ensure you order enough material. This helps contractors and DIYers avoid underordering or overordering plaster.",
    },
    {
      question: "Why is it important to include a waste margin in plaster calculations?",
      answer:
        "Including a waste margin accounts for material losses during mixing, application errors, surface irregularities, and unexpected site conditions. Typically, a 10% waste margin is recommended to prevent running short of plaster mid-project, which can cause delays and increase costs.",
    },
    {
      question: "How do I choose between standard and large plaster bag sizes?",
      answer:
        "Standard bags usually weigh around 25 kg and cover approximately 0.015 cubic meters, while large bags weigh about 40 kg and cover roughly 0.025 cubic meters. Choose based on project size, handling preferences, and supplier availability. Larger bags reduce the number of bags to carry but may be heavier to handle.",
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, the calculator supports metric units (meters and cubic meters) and imperial units (feet and cubic feet). Ensure you input all dimensions consistently in the selected unit system to get accurate results.",
    },
    {
      question: "How accurate are the estimates from this calculator?",
      answer:
        "The estimates provide a reliable baseline for material ordering but should be adjusted based on specific project conditions, plaster type, surface texture, and installer experience. Always consult product datasheets and consider site-specific factors for best accuracy.",
    },
    {
      question: "What types of plaster materials can be estimated with this tool?",
      answer:
        "This estimator is generic and works for common plaster types such as gypsum plaster, cement plaster, lime plaster, and premixed plaster. Different materials may have slightly different densities and coverage rates, so adjust bag yield values accordingly if you have precise product data.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are plastering a wall that measures 4 meters long, 3 meters high, with a plaster thickness of 0.02 meters (20 mm). You want to include a 10% waste margin and use standard size plaster bags.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: Length × Height × Thickness = 4 × 3 × 0.02 = 0.24 m³",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 0.24 × 1.10 = 0.264 m³ total plaster volume",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total volume by bag yield (0.015 m³ per standard bag): 0.264 ÷ 0.015 = 17.6 bags, round up to 18 bags",
      },
    ],
    result: "Final Order: 18 standard size plaster bags",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the surface area" },
      { symbol: "W", description: "Width or Height of the surface area" },
      { symbol: "D", description: "Depth or Thickness of plaster layer" },
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
          <Label>
            Width/Height ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
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
            Depth/Thickness ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "0.02 (20 mm)" : "0.07 (in feet)"}
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Plaster
          Volume & Bag Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Plaster Volume & Bag Estimator is a specialized tool designed to help
            contractors, builders, and DIY enthusiasts accurately calculate the amount
            of plaster material required for a project. By inputting the dimensions of
            the surface area and the desired plaster thickness, this calculator
            determines the total volume of plaster needed and estimates the number of
            plaster bags to order.
          </p>
          <p>
            Precision in plaster volume estimation is crucial to avoid costly
            overordering or underordering of materials. Overordering leads to wasted
            materials and increased expenses, while underordering can cause project
            delays and additional labor costs. This tool incorporates a waste margin to
            account for material loss during mixing and application.
          </p>
          <p>
            Different plaster materials and bag sizes affect the quantity calculations.
            Common plaster types include gypsum plaster, cement plaster, and lime
            plaster, each with unique density and coverage characteristics. The
            calculator allows selection between standard and large bag sizes to tailor
            estimates to your specific material choice.
          </p>
          <p>
            Whether you are working in metric or imperial units, this estimator adapts
            to your preferred measurement system, ensuring ease of use and accuracy.
            Use this calculator to streamline your material ordering process and keep
            your plastering projects on budget and on schedule.
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
            <strong>Tip:</strong> Always measure your surface area carefully and
            double-check thickness to avoid costly mistakes in volume calculation.
          </li>
          <li>
            <strong>Did You Know?</strong> Adding a 10% waste margin is industry
            standard to cover plaster shrinkage, spillage, and uneven surfaces.
          </li>
          <li>
            <strong>Contractor Secret:</strong> When working on textured or rough
            surfaces, increase the waste margin to 15-20% for better coverage.
          </li>
          <li>
            <strong>Tip:</strong> Use larger bags for bigger projects to reduce
            handling time and packaging waste.
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
            <strong>1. Incorrect Unit Conversion:</strong> Mixing metric and imperial
            units without proper conversion leads to inaccurate volume calculations.
            Always ensure all inputs are in the same unit system.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Not including a waste factor
            often results in running out of plaster mid-job, causing delays and extra
            costs.
          </p>
          <p>
            <strong>3. Underestimating Thickness:</strong> Using an average or
            incorrect plaster thickness can significantly affect volume and bag
            requirements.
          </p>
          <p>
            <strong>4. Overlooking Surface Texture:</strong> Rough or uneven surfaces
            require more plaster than smooth ones; failing to adjust for this leads to
            underordering.
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
            <a href="https://www.thisoldhouse.com/search?q=Plastering" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Plastering - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Plastering from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Plastering" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Plastering - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Plastering, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.energy.gov/search/site?keywords=Plastering" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Plastering - Energy.gov
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official Department of Energy guidelines for energy efficiency and Plastering to save money and improve home comfort.
            </p>
          </li>
          <li>
            <a href="https://www.ashrae.org/search?q=Plastering" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Plastering - ASHRAE
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical standards and guidelines for HVAC and building systems related to Plastering.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plaster Volume & Bag Estimator"
      description="The ultimate professional guide and calculator for Plaster Volume & Bag Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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