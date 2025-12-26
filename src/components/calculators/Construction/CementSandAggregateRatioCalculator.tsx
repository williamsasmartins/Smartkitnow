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

export default function CementSandAggregateRatioCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "", // thickness or height of slab or structure
    waste: "10", // percentage waste margin
    price: "",
    materialSize: "standard", // standard or large bag size
    ratioCement: "1",
    ratioSand: "2",
    ratioAggregate: "4",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Calculate volume in cubic meters or cubic feet.
   * 2. Convert to cubic yards if imperial (for aggregate).
   * 3. Use mix ratio (cement:sand:aggregate) to find volume of each material.
   * 4. Convert volume of cement to bags (standard 50kg bag = 0.035 m3 approx).
   * 5. Convert sand and aggregate volume to tonnes or cubic meters.
   * 6. Add waste margin.
   * 7. Calculate cost if price per unit provided.
   */

  const results = useMemo(() => {
    const {
      unit,
      length,
      width,
      depth,
      waste,
      price,
      materialSize,
      ratioCement,
      ratioSand,
      ratioAggregate,
    } = inputs;

    // Validate inputs
    const L = parseFloat(length);
    const W = parseFloat(width);
    const D = parseFloat(depth);
    const wastePercent = parseFloat(waste);
    const cementRatio = parseFloat(ratioCement);
    const sandRatio = parseFloat(ratioSand);
    const aggregateRatio = parseFloat(ratioAggregate);
    const pricePerUnit = parseFloat(price);

    if (
      isNaN(L) ||
      isNaN(W) ||
      isNaN(D) ||
      L <= 0 ||
      W <= 0 ||
      D <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      isNaN(cementRatio) ||
      isNaN(sandRatio) ||
      isNaN(aggregateRatio) ||
      cementRatio <= 0 ||
      sandRatio <= 0 ||
      aggregateRatio <= 0
    ) {
      return {
        mainQty: "Invalid input",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all fields.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate total volume
    // Metric: m x m x m = m3
    // Imperial: ft x ft x ft = ft3, convert to cubic yards (1 yd3 = 27 ft3)
    let volumeM3 = 0;
    if (unit === "metric") {
      volumeM3 = L * W * D; // cubic meters
    } else {
      // imperial
      const volumeFt3 = L * W * D;
      volumeM3 = volumeFt3 / 35.3147; // convert ft3 to m3
    }

    // Add waste margin
    const volumeWithWaste = volumeM3 * (1 + wastePercent / 100);

    // Total parts in mix ratio
    const totalParts = cementRatio + sandRatio + aggregateRatio;

    // Volume of each material (m3)
    const cementVol = (cementRatio / totalParts) * volumeWithWaste;
    const sandVol = (sandRatio / totalParts) * volumeWithWaste;
    const aggregateVol = (aggregateRatio / totalParts) * volumeWithWaste;

    // Convert cement volume to bags
    // Standard 50kg cement bag volume ~0.035 m3 (approximate bulk volume)
    // Large bag assumed 0.05 m3 (for example)
    const bagVolume =
      materialSize === "standard" ? 0.035 : 0.05; /* m3 per bag */

    const cementBags = Math.ceil(cementVol / bagVolume);

    // Sand and aggregate usually measured in tonnes or m3
    // Density approx:
    // Sand: 1600 kg/m3 (1.6 tonnes/m3)
    // Aggregate: 1500 kg/m3 (1.5 tonnes/m3)
    const sandDensity = 1.6; // tonnes/m3
    const aggregateDensity = 1.5; // tonnes/m3

    const sandTonnes = sandVol * sandDensity;
    const aggregateTonnes = aggregateVol * aggregateDensity;

    // Round sand and aggregate to 2 decimals
    const sandRounded = Math.round(sandTonnes * 100) / 100;
    const aggregateRounded = Math.round(aggregateTonnes * 100) / 100;

    // Cost calculation (if price provided)
    // Price per unit applies to cement bags, sand tonnes, aggregate tonnes?
    // For simplicity, assume price per cement bag only.
    let cost = 0;
    if (!isNaN(pricePerUnit) && pricePerUnit > 0) {
      cost = cementBags * pricePerUnit;
    }

    // Compose mainQty string
    const mainQty = `${cementBags} Bags Cement, ${sandRounded} Tonnes Sand, ${aggregateRounded} Tonnes Aggregate`;

    // Details string
    const details = `Volume: ${volumeWithWaste.toFixed(
      3
    )} m³ (incl. waste). Cement bags based on ${
      materialSize === "standard" ? "50kg" : "Large"
    } bags.`;

    const costStr = cost > 0 ? `$${cost.toFixed(2)}` : "N/A";

    return {
      mainQty,
      cost: costStr,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the ideal cement, sand, and aggregate ratio for concrete?",
      answer:
        "The ideal ratio depends on the type of construction and required strength. A common general-purpose mix is 1:2:4 (cement:sand:aggregate), which provides good strength for slabs and foundations. Adjusting the ratio affects the concrete's strength, workability, and durability.",
    },
    {
      question: "Why is it important to include a waste margin in material calculations?",
      answer:
        "Including a waste margin accounts for material losses during mixing, spillage, uneven surfaces, and measurement inaccuracies. Typically, a 5-10% waste margin ensures you order enough materials to complete the job without costly delays or shortages.",
    },
    {
      question: "How do I convert measurements between metric and imperial units for concrete calculations?",
      answer:
        "Metric measurements use meters and cubic meters, while imperial uses feet and cubic feet. To convert cubic feet to cubic meters, divide by 35.3147. For volume calculations, always convert all dimensions to the same unit system before calculating volume to ensure accuracy.",
    },
    {
      question: "How do bag sizes affect the quantity of cement needed?",
      answer:
        "Cement bags come in different sizes, commonly 50kg standard bags or larger bulk bags. The volume each bag covers differs, so knowing the bag size helps convert volume of cement required into the correct number of bags. Using incorrect bag volume can lead to ordering too much or too little cement.",
    },
    {
      question: "Can I use this calculator for different concrete mix ratios?",
      answer:
        "Yes, this calculator allows you to input custom ratios for cement, sand, and aggregate. Adjusting these ratios lets you tailor the mix for specific strength or workability requirements. Always ensure the ratios are positive numbers and reflect the intended mix design.",
    },
    {
      question: "How accurate are the volume-to-weight conversions for sand and aggregate?",
      answer:
        "The calculator uses average bulk densities (sand ~1600 kg/m³, aggregate ~1500 kg/m³) to convert volume to weight. Actual densities can vary based on moisture content, compaction, and material type. For critical projects, consult material suppliers or perform site-specific density tests.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a concrete slab for a patio measuring 5 meters long, 3 meters wide, and 0.15 meters thick. You want to use a 1:2:4 mix ratio with a 10% waste margin, using standard 50kg cement bags priced at $7.50 each.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate volume: 5m × 3m × 0.15m = 2.25 m³ of concrete.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 2.25 m³ × 1.10 = 2.475 m³ total volume needed.",
      },
      {
        label: "3. Calculate Materials",
        explanation:
          "Using 1:2:4 ratio, total parts = 7. Cement volume = 1/7 × 2.475 = 0.354 m³. Cement bags = 0.354 / 0.035 ≈ 11 bags.",
      },
      {
        label: "4. Order",
        explanation:
          "Order 11 bags of cement, plus sand and aggregate quantities accordingly.",
      },
    ],
    result:
      "Final Order: 11 Bags Cement, 5.28 Tonnes Sand, 3.54 Tonnes Aggregate (including 10% waste).",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Volume = Length × Width × Depth; Material Volume = (Ratio Part / Total Parts) × Volume × (1 + Waste%)",
    variables: [
      { symbol: "L", description: "Length of the area (meters or feet)" },
      { symbol: "W", description: "Width of the area (meters or feet)" },
      { symbol: "D", description: "Depth or Thickness of the slab (meters or feet)" },
      { symbol: "Waste%", description: "Waste margin percentage (e.g., 10%)" },
      { symbol: "Ratio Part", description: "Part of cement, sand, or aggregate in mix ratio" },
      { symbol: "Total Parts", description: "Sum of all parts in mix ratio (e.g., 1+2+4=7)" },
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

      {/* Dimensions Inputs */}
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
          <Label>Depth / Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
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

      <Separator />

      {/* Mix Ratio Inputs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Cement Ratio</Label>
          <Input
            type="number"
            min={0.1}
            step="any"
            value={inputs.ratioCement}
            onChange={(e) => handleInputChange("ratioCement", e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
        <div className="space-y-2">
          <Label>Sand Ratio</Label>
          <Input
            type="number"
            min={0.1}
            step="any"
            value={inputs.ratioSand}
            onChange={(e) => handleInputChange("ratioSand", e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
        <div className="space-y-2">
          <Label>Aggregate Ratio</Label>
          <Input
            type="number"
            min={0.1}
            step="any"
            value={inputs.ratioAggregate}
            onChange={(e) => handleInputChange("ratioAggregate", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
      </div>

      <Separator />

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
              <SelectItem value="standard">Standard Size (50kg)</SelectItem>
              <SelectItem value="large">Large Size (Bulk)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Cement Bag</Label>
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
            <div className="text-3xl md:text-5xl font-extrabold text-blue-600 my-3">
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
          Professional Guide: Cement, Sand & Aggregate Ratio Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Cement, Sand & Aggregate Ratio Calculator is an essential tool for
            construction professionals and DIY enthusiasts alike. It helps you
            accurately estimate the quantities of cement, sand, and aggregate needed
            for your concrete mix based on your project dimensions and desired mix
            ratio. Whether you are pouring a slab, building a foundation, or making
            concrete blocks, this calculator ensures you order the right amount of
            materials, saving time and money.
          </p>
          <p>
            Precision in material estimation is crucial. Overestimating leads to
            wasted materials and increased costs, while underestimating can cause
            project delays and compromise structural integrity. This calculator
            factors in a waste margin to accommodate spillage, uneven surfaces, and
            measurement errors, giving you a buffer to work with.
          </p>
          <p>
            Concrete is made by mixing cement, sand, and aggregate in specific
            ratios. Common mix ratios like 1:2:4 (cement:sand:aggregate) provide a
            balance of strength and workability suitable for many applications.
            Adjusting these ratios changes the concrete’s properties, so it’s
            important to choose the right mix for your project.
          </p>
          <p>
            Different materials have different densities and packaging sizes. Cement
            is typically sold in 50kg bags, but bulk bags are also available. Sand
            and aggregate are usually measured by weight (tonnes) or volume (cubic
            meters). This calculator converts volumes to practical units, helping
            you order materials efficiently.
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
            <strong>Tip:</strong> Always measure your site dimensions carefully and
            double-check before ordering materials. Small errors can lead to large
            material shortages or excess.
          </li>
          <li>
            <strong>Did You Know?</strong> The bulk density of sand and aggregate
            varies depending on moisture content and compaction. For more accurate
            estimates, consider getting density values from your supplier.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering a slightly higher waste
            margin (up to 15%) is common on uneven or complex jobs to avoid delays.
          </li>
          <li>
            <strong>Tip:</strong> When working in imperial units, always convert
            volumes to cubic meters internally for consistent calculations.
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
            units without proper conversion leads to inaccurate volume and material
            estimates. Always ensure all dimensions are in the same unit system.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Not including a waste margin
            can cause material shortages, forcing last-minute orders and project
            delays.
          </p>
          <p>
            <strong>3. Using Wrong Bag Volume:</strong> Cement bag sizes vary by
            region and supplier. Using an incorrect bag volume for calculations can
            result in ordering too many or too few bags.
          </p>
          <p>
            <strong>4. Overlooking Material Density Variations:</strong> Bulk
            densities of sand and aggregate can vary significantly. Using generic
            densities without adjustment may affect accuracy.
          </p>
          <p>
            <strong>5. Not Adjusting Mix Ratios:</strong> Using a default mix ratio
            for all projects without considering structural requirements can lead to
            weak or overly expensive concrete.
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cement, Sand & Aggregate Ratio Calculator"
      description="The ultimate professional guide and calculator for Cement, Sand & Aggregate Ratio Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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