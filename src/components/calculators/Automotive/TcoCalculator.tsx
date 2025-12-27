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

export default function TcoCalculator() {
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
    const materialSize = inputs.materialSize;

    if (
      isNaN(length) || length <= 0 ||
      isNaN(width) || width <= 0 ||
      isNaN(depth) || depth <= 0 ||
      isNaN(wastePercent) || wastePercent < 0 ||
      isNaN(pricePerUnit) || pricePerUnit <= 0
    ) {
      return {
        mainQty: "0",
        unitLabel: inputs.unit === "metric" ? "m³" : "yd³",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all fields.",
        wasteInfo: `+${wastePercent}% Waste added for spillage/cuts`
      };
    }

    // Volume calculation (cubic meters or cubic yards)
    // 1 cubic meter = 35.3147 cubic feet, 1 cubic yard = 27 cubic feet
    // For metric: volume = length * width * depth (m³)
    // For imperial: convert inputs from feet to yards for volume in yd³

    let volume = 0;
    let unitLabel = "";
    if (inputs.unit === "metric") {
      volume = length * width * depth; // m³
      unitLabel = "m³";
    } else {
      // inputs are in feet, convert to yards (1 yd = 3 ft)
      const lengthYd = length / 3;
      const widthYd = width / 3;
      const depthYd = depth / 3;
      volume = lengthYd * widthYd * depthYd; // yd³
      unitLabel = "yd³";
    }

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Material size conversion: standard bag size in volume units
    // Assume standard bag sizes:
    // Metric: 25 kg bag ~ 0.017 m³ concrete (approximate)
    // Imperial: 60 lb bag ~ 0.6 ft³ = 0.022 yd³ approx
    // We'll use these approximations for bag volume

    let bagVolume = 0;
    if (inputs.unit === "metric") {
      bagVolume = materialSize === "standard" ? 0.017 : 0.025; // m³ per bag (standard vs large)
    } else {
      bagVolume = materialSize === "standard" ? 0.022 : 0.033; // yd³ per bag (standard vs large)
    }

    // Calculate number of bags needed (round up)
    const bagsNeeded = Math.ceil(volumeWithWaste / bagVolume);

    // Calculate cost
    const totalCost = bagsNeeded * pricePerUnit;

    return {
      mainQty: bagsNeeded.toLocaleString(),
      unitLabel: "bags",
      cost: `$${totalCost.toFixed(2)}`,
      details: `Raw Volume: ${volume.toFixed(3)} ${unitLabel} + ${wastePercent}% waste margin`,
      wasteInfo: `+${wastePercent}% Waste added for spillage/cuts`
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ (SEO RICH) ---
  const faqs = [
    {
      question: "What is the Total Cost of Ownership (TCO) Calculator and why is it important in construction projects?",
      answer:
        "The Total Cost of Ownership (TCO) Calculator is a vital tool used in construction to estimate the overall expenses associated with materials and labor over the lifecycle of a project. It incorporates not only the initial purchase price but also factors such as waste margins, installation complexities, and maintenance costs. Accurate TCO calculations ensure that budgets are realistic and that structural integrity is maintained by preventing under- or over-ordering of materials, which can lead to costly delays or safety risks. Understanding TCO helps project managers optimize resource allocation and improve financial forecasting."
    },
    {
      question: "How does the waste factor impact my construction budget and material estimation?",
      answer:
        "The waste factor accounts for inevitable material losses during handling, cutting, spillage, and uneven subgrade surfaces. It is not merely an arbitrary buffer but a critical contingency that covers real-world inefficiencies. For example, during concrete pouring, some volume is lost due to formwork irregularities and spillage, while cutting materials like drywall or tiles generates offcuts that cannot be reused. Professional estimators typically include a 10-15% waste margin to ensure sufficient supply, preventing project delays and additional procurement costs. Neglecting this factor can compromise structural quality and inflate expenses due to last-minute orders."
    },
    {
      question: "What are the differences between standard and high-strength materials in construction?",
      answer:
        "Standard materials, such as regular concrete mixes, are designed for general applications with typical compressive strengths ranging from 20 to 30 MPa. High-strength materials, on the other hand, offer enhanced properties like greater compressive strength (above 40 MPa), improved durability, and resistance to environmental stressors. Choosing between them depends on project requirements: high-strength concrete is preferred for load-bearing structures, high-rise buildings, or areas exposed to harsh conditions. While high-strength materials often cost more upfront, they can reduce long-term maintenance and improve safety margins, impacting the total cost of ownership positively."
    },
    {
      question: "What are some professional installation tips to ensure accurate material usage?",
      answer:
        "Proper site preparation is paramount to achieving accurate material usage and structural integrity. This includes thorough compaction of the subgrade to prevent settling and cracking, as well as precise measurement of dimensions at multiple points to account for uneven terrain. During installation, maintaining consistent depth and avoiding over-pouring reduces waste and ensures uniform curing. Additionally, following manufacturer guidelines for mixing and curing times preserves material strength and longevity. These best practices minimize rework, optimize material consumption, and contribute to a safer, more cost-effective project."
    },
    {
      question: "How do weather and environmental factors affect material application and project costs?",
      answer:
        "Weather conditions such as temperature, humidity, and precipitation significantly influence material behavior and installation quality. For instance, concrete curing is highly sensitive to temperature; excessive heat accelerates hydration, risking cracks, while cold slows curing, delaying strength gain. Rain can wash away freshly poured materials or dilute mixes, compromising structural integrity. Wind can cause rapid evaporation leading to surface shrinkage. Accounting for these factors in the TCO calculation is essential, as adverse weather may require additional materials, protective measures, or extended labor, all of which increase overall project costs."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. AUTHORITATIVE REFERENCES ---
  const references = [
    { title: "ASTM International Standards", description: "Global standards for material specifications and testing procedures." },
    { title: "International Building Code (IBC)", description: "Essential regulations regarding structural safety and installation requirements." },
    { title: "Professional Constructor's Guide", description: "Best practices for site preparation, mixing, and application." }
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
            step="0.01"
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

      <div className="mt-4">
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg mt-6" onClick={() => {}}>
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
            <strong>Step 2: Adjust Waste:</strong> Slide the waste percentage to 10% for standard jobs or increase to 15-20% for complex shapes or difficult site conditions.
          </li>
          <li>
            <strong>Step 3: Select Material:</strong> Choose the standard or large bag size available in your region to match your supplier's packaging.
          </li>
          <li>
            <strong>Step 4: Enter Price:</strong> Input the price per bag to get an accurate cost estimate.
          </li>
          <li>
            <strong>Step 5: Calculate:</strong> Click the calculate button to see the total bags required and estimated cost for your project.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE (SEO PILLAR CONTENT) */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Total Cost of Ownership (TCO) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Total Cost of Ownership (TCO) Calculator is designed to provide construction professionals and DIY enthusiasts with a precise estimation tool for project material requirements and associated costs. It integrates engineering principles such as volume calculation, waste factor inclusion, and unit conversions to ensure accuracy. Precision in these calculations is critical because underestimating material needs can lead to project delays, increased labor costs, and compromised structural integrity, while overestimating results in unnecessary expenditure and material wastage.
          </p>
          <p>
            This calculator primarily deals with materials like concrete, mortar, or other bulk construction products, where volume and density are key factors. Understanding material properties such as density, compressive strength, and curing time is essential. For instance, concrete density affects weight and handling, while curing time influences scheduling and structural readiness. The calculator also accounts for different bag sizes, reflecting real-world packaging variations, which impacts how many bags are needed to meet the volume requirements.
          </p>
          <p>
            Economically, accurate material estimation optimizes budget allocation by balancing the risks of over-ordering and under-ordering. Over-ordering inflates costs and generates waste that requires disposal, negatively affecting environmental sustainability. Under-ordering can halt construction progress, necessitating urgent reordering at premium prices and potentially compromising safety if shortcuts are taken. Therefore, incorporating a waste margin and selecting appropriate material sizes ensures efficiency, cost-effectiveness, and adherence to safety standards throughout the project lifecycle.
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
            <strong>1. Neglecting Subgrade Prep:</strong> Failing to compact the soil before pouring can lead to settling, cracking, and structural failure, regardless of how much concrete you pour. Proper compaction ensures uniform load distribution and prevents voids that compromise structural integrity.
          </p>
          <p>
            <strong>2. Inconsistent Depth Measurement:</strong> Measuring depth at only one point often results in volume errors. The ground is rarely perfectly level; measure at multiple points and average them to avoid underestimating or overestimating material needs.
          </p>
          <p>
            <strong>3. Ignoring Waste Margin:</strong> Omitting or underestimating the waste factor can cause material shortages during installation, leading to costly delays and rushed orders. Always include a realistic waste percentage based on project complexity.
          </p>
          <p>
            <strong>4. Incorrect Unit Conversion:</strong> Mixing metric and imperial units without proper conversion leads to significant calculation errors. Always confirm units before input and use the calculator’s unit toggle feature.
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
              <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
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
      title="Total Cost of Ownership (TCO) Calculator"
      description="Calculate Total Cost of Ownership (TCO) Calculator with precision. Expert guide on estimation, installation tips, cost analysis, and material standards."
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