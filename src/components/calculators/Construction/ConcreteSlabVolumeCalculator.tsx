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
import { Hammer, Ruler, Box } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ConcreteSlabVolumeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // imperial or metric
    length: "", // ft or m
    width: "",
    depth: "", // inches or cm
    gravelBase: "false", // string "true" or "false"
    waste: "10", // percent
    price: "", // price per bag
    materialSize: "standard", // standard or large bag
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for bag volumes (approximate)
  // Standard bag = 60 lb (27.2 kg) ~ 0.45 cu ft (12.7 L)
  // Large bag = 80 lb (36.3 kg) ~ 0.6 cu ft (17 L)
  // We'll use volume in cubic feet for imperial, cubic meters for metric
  // Conversion: 1 cu ft = 0.0283168 m³

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerBag = parseFloat(inputs.price);
    const gravelBase = inputs.gravelBase === "true";
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
        details: "Please enter valid positive numbers for dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert all inputs to consistent units (imperial or metric)
    // Imperial: length, width in feet; depth in inches -> convert depth to feet
    // Metric: length, width in meters; depth in cm -> convert depth to meters

    let volumeCubicFeet = 0;
    if (inputs.unit === "imperial") {
      // depth is in inches, convert to feet
      const depthFeet = depth / 12;
      volumeCubicFeet = length * width * depthFeet;
    } else {
      // metric: depth in cm, convert to meters
      const depthMeters = depth / 100;
      const volumeCubicMeters = length * width * depthMeters;
      // convert cubic meters to cubic feet for bag calculation
      volumeCubicFeet = volumeCubicMeters / 0.0283168;
    }

    // Add gravel base volume if selected (usually 4 inches thick)
    // Gravel base thickness: 4 inches = 0.333 ft
    // Gravel base volume = length * width * 0.333 ft
    // Gravel base does NOT require concrete bags, but affects excavation and cost
    // So we just note it, no addition to concrete volume

    // Add waste factor
    const volumeWithWaste = volumeCubicFeet * (1 + wastePercent / 100);

    // Bags calculation:
    // Standard bag volume: 0.45 cu ft
    // Large bag volume: 0.6 cu ft
    const bagVolume =
      materialSize === "large" ? 0.6 /* cu ft */ : 0.45 /* cu ft */;

    const bagsNeeded = Math.ceil(volumeWithWaste / bagVolume);

    // Cost calculation
    const totalCost =
      !isNaN(pricePerBag) && pricePerBag > 0
        ? `$${(bagsNeeded * pricePerBag).toFixed(2)}`
        : "N/A";

    // Details string
    const details = `Raw Volume: ${volumeCubicFeet.toFixed(
      2
    )} cu ft | With Waste: ${volumeWithWaste.toFixed(
      2
    )} cu ft | Bag Volume: ${bagVolume.toFixed(2)} cu ft`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost: totalCost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- CONTENT GENERATION ---

  const example = {
    title: "Example Project",
    scenario:
      "You want to build a 12 ft x 12 ft concrete slab for a shed foundation with a depth of 6 inches. You choose a 10% waste margin and standard 60 lb concrete bags.",
    steps: [
      {
        label: "1. Calculate Volume",
        explanation:
          "12 ft (length) x 12 ft (width) x 0.5 ft (6 inches depth) = 72 cubic feet.",
      },
      {
        label: "2. Add Waste",
        explanation: "72 cu ft + 10% waste = 79.2 cubic feet total.",
      },
      {
        label: "3. Convert to Bags",
        explanation:
          "Each standard bag covers 0.45 cu ft, so 79.2 / 0.45 = 176 bags (rounded up).",
      },
    ],
    result: "Total: 176 Bags of Concrete",
  };

  const editorial = (
    <div className="space-y-6 prose prose-slate dark:prose-invert max-w-none">
      <p>
        Calculating the volume of concrete required for a slab is a fundamental
        step in any construction project involving concrete. Accurately
        estimating the volume ensures you purchase the right amount of material,
        minimizing waste and cost overruns. The volume is calculated by
        multiplying the length, width, and depth of the slab, converting all
        measurements to consistent units.
      </p>
      <p>
        When ordering concrete bags, it’s important to consider the size of the
        bags you intend to use. Standard 60 lb bags typically cover about 0.45
        cubic feet of concrete, while larger 80 lb bags cover roughly 0.6 cubic
        feet. Selecting the correct bag size affects both the number of bags
        needed and the overall cost.
      </p>
      <p>
        Including a waste margin is a best practice to account for spillage,
        uneven subgrade, and slight miscalculations. A typical waste factor is
        10%, but this can be adjusted based on project complexity and site
        conditions. Additionally, if a gravel base is required beneath the slab,
        it should be accounted for separately as it does not affect the concrete
        volume but impacts excavation and material costs.
      </p>
      <p>
        Finally, always verify your calculations and consult with suppliers to
        confirm bag sizes and coverage rates. This calculator provides a
        reliable estimate, but real-world conditions may vary, so plan
        accordingly.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "How do I convert my measurements to use this calculator?",
      answer:
        "For imperial units, enter length and width in feet, and depth in inches. For metric, enter length and width in meters, and depth in centimeters. The calculator will convert and compute the volume accordingly.",
    },
    {
      question: "Why do I need to add a waste margin?",
      answer:
        "Waste margin accounts for spillage, uneven surfaces, and minor miscalculations. It ensures you have enough concrete to complete the project without running short, which can cause delays and additional costs.",
    },
    {
      question:
        "What is the difference between standard and large concrete bags?",
      answer:
        "Standard bags typically weigh 60 lbs and cover about 0.45 cubic feet of concrete, while large bags weigh 80 lbs and cover about 0.6 cubic feet. Using larger bags reduces the number of bags needed but may cost more per bag.",
    },
    {
      question: "Does the gravel base thickness affect the concrete volume?",
      answer:
        "No, the gravel base is a separate layer beneath the concrete slab and does not affect the concrete volume. However, it impacts excavation depth and overall project cost.",
    },
    {
      question:
        "Can I use this calculator for slabs with varying depths or shapes?",
      answer:
        "This calculator assumes a uniform slab thickness and rectangular shape. For slabs with varying depths or irregular shapes, divide the slab into sections with uniform dimensions, calculate each separately, and sum the volumes.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

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
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* INPUTS adapted to Concrete Slab Volume Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "imperial" ? "12" : "3.6"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "imperial" ? "12" : "3.6"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Depth ({inputs.unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "imperial" ? "6" : "15"}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label>Gravel Base</Label>
          <Select
            value={inputs.gravelBase}
            onValueChange={(v) => handleInputChange("gravelBase", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">No Gravel Base</SelectItem>
              <SelectItem value="true">Include 4" Gravel Base</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              <SelectItem value="standard">Standard 60 lb Bag</SelectItem>
              <SelectItem value="large">Large 80 lb Bag</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <Input
            type="number"
            min={0}
            max={25}
            step={1}
            value={inputs.waste}
            onChange={(e) => {
              let val = e.target.value;
              if (val === "") val = "0";
              let num = parseInt(val);
              if (num < 0) num = 0;
              if (num > 25) num = 25;
              handleInputChange("waste", num.toString());
            }}
            placeholder="10"
          />
        </div>
        <div className="space-y-2">
          <Label>Price per Bag ($)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="0.00"
          />
        </div>
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
            <p className="text-xs text-slate-400 mt-1">{results.wasteInfo}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Slab Volume Calculator"
      description="Professional calculator for Concrete Slab Volume Calculator. Includes material estimation, waste factors, gravel base option, and cost analysis."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "guide", label: "Guide" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}