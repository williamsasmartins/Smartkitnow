import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Ruler, Hammer, HardHat, Box, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Lightbulb } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CostPerMileCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    length: "",
    width: "",
    depth: "",
    waste: "10",
    price: "",
    materialSize: "standard"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
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
      isNaN(length) || length <= 0 ||
      isNaN(width) || width <= 0 ||
      isNaN(depth) || depth <= 0 ||
      isNaN(wastePercent) || wastePercent < 0 ||
      isNaN(pricePerUnit) || pricePerUnit < 0
    ) {
      return {
        mainQty: "0",
        unitLabel: unit === "metric" ? "cubic meters" : "cubic yards",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all fields.",
        wasteInfo: `+${wastePercent}% Waste added for spillage/cuts`
      };
    }

    // Volume calculation (cubic meters or cubic feet)
    // Depth is assumed in meters or feet depending on unit
    let volume = length * width * depth; // cubic meters or cubic feet

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Convert volume to cubic yards if imperial
    let volumeInCubicYards = volumeWithWaste;
    let unitLabel = "";
    if (unit === "metric") {
      unitLabel = "cubic meters";
    } else {
      // Convert cubic feet to cubic yards (1 cubic yard = 27 cubic feet)
      volumeInCubicYards = volumeWithWaste / 27;
      unitLabel = "cubic yards";
    }

    // Determine material bag size volume in cubic meters or cubic yards
    // Assume standard bag sizes:
    // Metric: standard = 0.025 cubic meters (25L bag), large = 0.04 cubic meters (40L bag)
    // Imperial: standard = 0.75 cubic feet (~0.028 cubic meters), large = 1.1 cubic feet (~0.031 cubic meters)
    let bagVolume = 0;
    if (unit === "metric") {
      bagVolume = materialSize === "standard" ? 0.025 : 0.04;
    } else {
      bagVolume = materialSize === "standard" ? 0.75 : 1.1; // cubic feet
    }

    // Calculate number of bags needed
    let bagsNeeded = 0;
    if (unit === "metric") {
      bagsNeeded = volumeInCubicYards / bagVolume;
    } else {
      // volumeInCubicYards is in cubic yards, convert bag volume to cubic yards
      const bagVolumeCubicYards = bagVolume / 27;
      bagsNeeded = volumeInCubicYards / bagVolumeCubicYards;
    }

    bagsNeeded = Math.ceil(bagsNeeded);

    // Calculate cost
    const totalCost = bagsNeeded * pricePerUnit;

    return {
      mainQty: bagsNeeded.toLocaleString(),
      unitLabel: "bags",
      cost: `$${totalCost.toFixed(2)}`,
      details: `Raw Volume: ${volumeWithWaste.toFixed(2)} ${unit === "metric" ? "m³" : "ft³"}`,
      wasteInfo: `+${wastePercent}% Waste added for spillage/cuts`
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What is the technical basis for calculating Cost Per Mile (Per Kilometer) in construction projects?",
      answer:
        "Calculating Cost Per Mile (or Per Kilometer) in construction involves precise measurement of the project’s linear dimensions combined with volumetric calculations of materials required. This calculation accounts for length, width, and depth to estimate the total volume of material needed, such as concrete or asphalt. The engineering principles include understanding material density, compressive strength requirements, and the curing process for concrete to ensure structural integrity. Accurate estimation prevents under-ordering, which can cause delays, or over-ordering, which leads to waste and increased costs."
    },
    {
      question: "How does the waste factor influence the overall budget in construction material estimation?",
      answer:
        "The waste factor is a critical component in construction budgeting as it accounts for material losses during handling, spillage, cutting, and uneven subgrade surfaces. Typically set between 10-15%, this margin ensures that the project has sufficient materials to maintain structural quality without costly delays. Ignoring waste can lead to insufficient material on site, causing project downtime and rushed orders that increase expenses. Professional estimators incorporate waste to maintain efficiency and uphold the safety standards dictated by material specifications and building codes."
    },
    {
      question: "What are the differences between standard and high-strength materials in construction, and when should each be used?",
      answer:
        "Standard materials, such as regular concrete mixes, are designed for general applications with typical compressive strengths around 3,000 to 4,000 psi. High-strength materials exceed these values, often reaching 6,000 psi or more, and are used in structural elements requiring enhanced load-bearing capacity or durability. Choosing between them depends on project requirements, environmental exposure, and safety codes. For example, high-strength concrete is preferred in bridges or high-rise foundations where structural integrity under stress is paramount, while standard mixes suffice for sidewalks or driveways."
    },
    {
      question: "What are some professional installation tips to ensure accurate material application and longevity?",
      answer:
        "Proper site preparation is essential for successful installation; this includes thorough compaction of the subgrade to prevent settling and cracking. Consistent depth measurement across the project area ensures uniform material application, which is vital for structural stability. Additionally, controlling the curing process—maintaining appropriate moisture and temperature conditions—enhances the material’s compressive strength and durability. Using vibration tools during concrete pouring can eliminate air pockets, improving density and longevity."
    },
    {
      question: "How do weather conditions affect the application and curing of construction materials like concrete?",
      answer:
        "Weather significantly impacts the curing and performance of materials such as concrete. High temperatures accelerate the curing process, potentially causing shrinkage cracks and reduced strength if not properly managed with moisture retention techniques. Conversely, cold weather slows curing, increasing the risk of freeze-thaw damage and delayed strength gain. Rain can dilute the mix or wash away surface cement, compromising structural integrity. Therefore, weather forecasts must be considered to schedule pours and apply protective measures like curing blankets or admixtures."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    {
      title: "ASTM International Standards",
      description: "Global standards for material specifications and testing procedures."
    },
    {
      title: "International Building Code (IBC)",
      description: "Essential regulations regarding structural safety and installation requirements."
    },
    {
      title: "Professional Constructor's Guide",
      description: "Best practices for site preparation, mixing, and application."
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
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

      {/* INPUTS FOR: STANDARD CONSTRUCTION CALCULATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`Enter length in ${inputs.unit === "metric" ? "meters" : "feet"}`}
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
            placeholder={`Enter width in ${inputs.unit === "metric" ? "meters" : "feet"}`}
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
            placeholder={`Enter depth in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Price per Bag ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="Enter price per bag"
          />
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

      <div className="space-y-4">
        <Label>Material Bag Size</Label>
        <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
          <SelectTrigger className="w-[180px]">
            <Box className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard Bag</SelectItem>
            <SelectItem value="large">Large Bag</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No explicit action needed, calculation is reactive
        }}
      >
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Materials</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
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
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1: Input Dimensions:</strong> Measure the length, width, and depth of your project area. Ensure units match (meters or feet) based on your selection.
          </li>
          <li>
            <strong>Step 2: Adjust Waste:</strong> Slide the waste percentage to 10% for standard jobs or 15% for complex shapes or uneven terrain to cover spillage and cuts.
          </li>
          <li>
            <strong>Step 3: Select Material:</strong> Choose the standard or large bag size available in your region to match your material supplier’s packaging.
          </li>
          <li>
            <strong>Step 4: Enter Price:</strong> Input the price per bag to get an accurate cost estimate for budgeting purposes.
          </li>
          <li>
            <strong>Step 5: Calculate:</strong> Click the calculate button to see the total bags required and estimated cost for your project.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Cost Per Mile (Per Kilometer) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Calculating the cost per mile or kilometer in construction projects is a fundamental step in project planning and budgeting. This process involves determining the volume of materials required to cover a linear distance with specified width and depth, such as for roadways, pipelines, or concrete slabs. Precision in these calculations is critical because even minor errors in dimension measurements can lead to significant cost overruns or material shortages, impacting structural integrity and project timelines. Engineering principles such as load distribution, compressive strength, and curing times must be considered to ensure the finished structure meets safety and durability standards.
          </p>
          <p>
            The materials used in these projects vary widely, from standard concrete mixes to specialized high-strength composites. Each material has unique properties including density, curing behavior, and environmental resistance. For example, concrete requires a curing process that can be affected by temperature and moisture levels, influencing its final compressive strength and durability. Understanding these nuances helps in selecting the right material and bag size, which directly affects the volume calculations and cost estimations. Accurate volume measurement also ensures efficient use of materials, minimizing waste and environmental impact.
          </p>
          <p>
            Economically, over-ordering materials leads to unnecessary expenses and storage challenges, while under-ordering can cause project delays and compromised quality due to rushed procurement. Incorporating a waste factor, typically between 10-15%, accounts for spillage, cutting losses, and uneven subgrades, balancing efficiency with contingency. This calculator helps project managers and estimators optimize material orders by providing clear, data-driven insights into the quantities and costs involved. Ultimately, accurate cost per mile or kilometer calculations support better financial planning, resource allocation, and adherence to construction standards.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Neglecting Subgrade Prep:</strong> Failing to compact and level the soil before pouring materials can lead to uneven settling, cracking, and premature structural failure. Proper subgrade preparation ensures uniform load distribution and enhances the longevity of the installation.
          </p>
          <p>
            <strong>2. Inconsistent Depth Measurement:</strong> Measuring depth at only one point assumes a perfectly level surface, which is rarely the case. Taking multiple measurements and averaging them reduces volume estimation errors and prevents costly material shortages or excess.
          </p>
          <p>
            <strong>3. Ignoring Waste Factor:</strong> Omitting or underestimating the waste margin can result in insufficient materials on site, causing delays and rushed orders. Including a realistic waste percentage accounts for spillage, cutting, and surface irregularities.
          </p>
          <p>
            <strong>4. Incorrect Unit Conversion:</strong> Mixing metric and imperial units without proper conversion leads to significant miscalculations. Always verify unit consistency before inputting data into the calculator.
          </p>
        </div>
      </section>

      {/* 4. FAQ (FULL TEXT) */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cost Per Mile (Per Kilometer) Calculator"
      description="Calculate Cost Per Mile (Per Kilometer) Calculator with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}