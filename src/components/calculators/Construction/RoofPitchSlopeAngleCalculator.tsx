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

export default function RoofPitchSlopeAngleCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    run: "", // horizontal run length
    rise: "", // vertical rise height
    length: "", // length of the roof slope (hypotenuse)
    waste: "10", // waste percentage
    price: "", // price per unit material
    materialSize: "standard", // standard or large size material units
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculations:
   * 1. Calculate pitch = rise / run (ratio)
   * 2. Calculate slope angle (degrees) = atan(rise/run) * (180/π)
   * 3. Calculate slope length = sqrt(run² + rise²)
   * 4. Calculate material units needed based on length and roof length input
   * 5. Add waste margin
   * 6. Calculate estimated cost
   */

  const results = useMemo(() => {
    const runNum = parseFloat(inputs.run);
    const riseNum = parseFloat(inputs.rise);
    const lengthNum = parseFloat(inputs.length);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const unit = inputs.unit;

    if (
      isNaN(runNum) ||
      runNum <= 0 ||
      isNaN(riseNum) ||
      riseNum < 0 ||
      isNaN(lengthNum) ||
      lengthNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive numbers for run, rise, and length.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate pitch ratio (rise/run)
    const pitchRatio = riseNum / runNum;

    // Calculate slope angle in degrees
    const slopeAngle = Math.atan(pitchRatio) * (180 / Math.PI);

    // Calculate slope length (hypotenuse) if not provided or verify input
    // But user inputs length of roof slope (hypotenuse), so we trust input for material calc
    // Material units needed = length of slope * length of roof (lengthNum)
    // For simplicity, assume material units cover 1 linear unit length each (standard size)
    // If large size, assume 1.5x coverage

    const coveragePerUnit = inputs.materialSize === "large" ? 1.5 : 1.0;

    // Total linear units needed along the slope length
    // lengthNum = length of roof slope (along slope)
    // runNum = horizontal run (base)
    // riseNum = vertical rise (height)
    // Material units needed = lengthNum / coveragePerUnit

    // Add waste margin
    const rawUnits = lengthNum / coveragePerUnit;
    const totalUnits = rawUnits * (1 + wastePercent / 100);

    // Round up to whole units
    const roundedUnits = Math.ceil(totalUnits);

    // Calculate cost
    const cost = priceNum && priceNum > 0 ? roundedUnits * priceNum : 0;

    return {
      mainQty: `${roundedUnits} Units`,
      cost: `$${cost.toFixed(2)}`,
      details: `Pitch: ${pitchRatio.toFixed(
        2
      )} (rise/run), Angle: ${slopeAngle.toFixed(
        1
      )}°, Raw Units: ${rawUnits.toFixed(2)}`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.run,
    inputs.rise,
    inputs.length,
    inputs.waste,
    inputs.price,
    inputs.materialSize,
    inputs.unit,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is roof pitch and why is it important?",
      answer:
        "Roof pitch is the ratio of the vertical rise to the horizontal run of a roof, expressed as a fraction or ratio (e.g., 4:12). It determines the steepness of the roof and affects water drainage, material selection, and structural design. Accurate pitch measurement ensures proper installation and longevity of roofing materials.",
    },
    {
      question:
        "How do I convert between roof pitch and slope angle in degrees?",
      answer:
        "To convert roof pitch (rise/run) to slope angle in degrees, use the formula: angle = arctangent(rise/run) × (180/π). This converts the ratio into an angle measurement, which is useful for cutting materials and understanding roof geometry.",
    },
    {
      question:
        "Why should I include a waste margin when ordering roofing materials?",
      answer:
        "Including a waste margin (usually 5-15%) accounts for material loss due to cutting, mistakes, overlaps, and damage during installation. This ensures you have enough materials to complete the job without costly delays or additional orders.",
    },
    {
      question:
        "What types of roofing materials are affected by roof pitch calculations?",
      answer:
        "Materials like shingles, metal panels, tiles, and membranes require accurate pitch and slope calculations to determine quantities and installation methods. Steeper roofs may require different fastening techniques or material types to ensure durability and safety.",
    },
    {
      question:
        "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, this calculator supports metric (meters) and imperial (feet) units. Make sure to input all dimensions consistently in the selected unit system to get accurate results.",
    },
    {
      question:
        "How does material size selection affect the quantity calculation?",
      answer:
        "Material size affects coverage per unit. For example, larger roofing panels cover more area per piece, reducing the total number of units needed. Selecting the correct material size in the calculator adjusts the coverage factor accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing metal roofing panels on a residential roof with a run of 12 feet and a rise of 4 feet. The length of the roof slope is 30 feet. You want to order standard size panels and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Determine the horizontal run (12 ft), vertical rise (4 ft), and slope length (30 ft). Calculate pitch = 4/12 = 0.33 and slope angle ≈ 18.4°.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin to account for cutting and errors during installation.",
      },
      {
        label: "3. Order",
        explanation:
          "Calculate material units needed: 30 ft roof length / 1 ft coverage per panel = 30 panels. Add 10% waste = 33 panels. Order 33 panels.",
      },
    ],
    result: "Final Order: 33 Standard Size Panels",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Pitch = Rise / Run\nSlope Angle (°) = arctangent(Rise / Run) × (180 / π)\nMaterial Units = (Roof Slope Length / Coverage per Unit) × (1 + Waste %)",
    variables: [
      { symbol: "Rise", description: "Vertical height of the roof" },
      { symbol: "Run", description: "Horizontal length of the roof base" },
      { symbol: "Roof Slope Length", description: "Length along the roof slope" },
      { symbol: "Coverage per Unit", description: "Length coverage per material unit" },
      { symbol: "Waste %", description: "Percentage of material waste margin" },
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
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs for Run, Rise, Roof Slope Length */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Run (Horizontal Length)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.run}
            onChange={(e) => handleInputChange("run", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
          />
        </div>
        <div className="space-y-2">
          <Label>Rise (Vertical Height)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.rise}
            onChange={(e) => handleInputChange("rise", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
          />
        </div>
        <div className="space-y-2">
          <Label>Roof Slope Length</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size (1 unit coverage)</SelectItem>
              <SelectItem value="large">Large Size (1.5 units coverage)</SelectItem>
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
          Professional Guide: Roof Pitch & Slope Angle Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The roof pitch and slope angle are fundamental measurements in
            construction and roofing projects. Roof pitch is the ratio of the
            vertical rise to the horizontal run of a roof, often expressed as a
            fraction or ratio (e.g., 4:12). The slope angle is the corresponding
            angle in degrees, which helps contractors understand the steepness
            of the roof. This calculator helps you determine both values and
            estimate the amount of material needed based on your roof's
            dimensions.
          </p>
          <p>
            Precision in measuring and calculating roof pitch and slope angle is
            critical. An inaccurate pitch can lead to improper material orders,
            poor water drainage, and structural issues. Using this calculator,
            you can input your roof's run, rise, and slope length to get exact
            pitch ratios, slope angles, and material quantities, helping you
            avoid costly mistakes.
          </p>
          <p>
            Different roofing materials require different handling based on the
            roof pitch. For example, asphalt shingles are suitable for moderate
            pitches, while metal panels or tiles may be preferred for steeper
            slopes. This calculator also allows you to select material sizes and
            add waste margins to ensure you order the right amount of materials
            for your project.
          </p>
          <p>
            Whether you are a contractor, builder, or DIY enthusiast, this tool
            streamlines your planning process by combining geometry with
            practical material estimation, saving time and reducing errors on
            site.
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
            <strong>Tip:</strong> Always double-check your run and rise
            measurements on-site before ordering materials. Small errors can
            lead to significant material waste or shortages.
          </li>
          <li>
            <strong>Did You Know?</strong> Roof pitch affects not only material
            quantity but also the type of underlayment and flashing required for
            proper waterproofing.
          </li>
          <li>
            <strong>Contractor Secret:</strong> When ordering large size panels,
            you can reduce installation time but must ensure your roof framing
            supports the increased panel weight.
          </li>
          <li>
            <strong>Tip:</strong> Use the slope angle output to help cut rafters
            and trim materials accurately, improving fit and finish.
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
            <strong>1. Incorrect Unit Mixing:</strong> Mixing metric and imperial
            units in measurements leads to inaccurate calculations. Always
            ensure all inputs are in the same unit system.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Not accounting for waste
            can cause material shortages, project delays, and increased costs.
            Always include a reasonable waste percentage.
          </p>
          <p>
            <strong>3. Using Roof Height Instead of Rise:</strong> The rise is
            the vertical height over the horizontal run, not the total roof
            height. Confusing these can skew pitch and angle results.
          </p>
          <p>
            <strong>4. Overlooking Material Size Impact:</strong> Different
            material sizes cover different areas. Using the wrong coverage per
            unit will miscalculate quantities.
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
      title="Roof Pitch & Slope Angle Calculator"
      description="The ultimate professional guide and calculator for Roof Pitch & Slope Angle Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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