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

export default function DuctSizeAirflowCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = mm, m3/min; imperial = inches, cfm
    length: "", // duct length
    width: "", // duct width
    depth: "", // duct height/depth
    waste: "10", // waste margin %
    price: "", // price per unit material
    materialSize: "standard", // standard or large duct sheet size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Convert inputs to consistent units (meters for metric, feet for imperial)
   * 2. Calculate duct surface area (material needed) = perimeter * length
   *    Perimeter = 2*(width + depth)
   *    Length is duct run length
   * 3. Add waste margin
   * 4. Calculate material units needed based on sheet size (area per sheet)
   * 5. Calculate cost if price per unit given
   */

  const results = useMemo(() => {
    // Parse inputs
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const depthNum = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(depthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      depthNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Unit conversion factors
    // Metric inputs assumed in millimeters, convert to meters for area calculation
    // Imperial inputs assumed in inches, convert to feet
    let lengthM = 0,
      widthM = 0,
      depthM = 0;
    if (inputs.unit === "metric") {
      lengthM = lengthNum / 1000;
      widthM = widthNum / 1000;
      depthM = depthNum / 1000;
    } else {
      // imperial
      lengthM = lengthNum / 3.281; // feet to meters
      widthM = widthNum / 3.281;
      depthM = depthNum / 3.281;
    }

    // Calculate perimeter of duct cross-section (rectangle)
    const perimeter = 2 * (widthM + depthM); // meters

    // Surface area of duct material needed (side walls + top/bottom)
    // Assume duct is rectangular and open ends don't need material
    // Surface area = perimeter * length
    const surfaceArea = perimeter * lengthM; // m²

    // Add waste margin
    const surfaceAreaWithWaste = surfaceArea * (1 + wastePercent / 100);

    // Material sheet sizes (area per unit)
    // Standard size: 1.2m x 2.4m = 2.88 m²
    // Large size: 1.5m x 3.0m = 4.5 m²
    const sheetArea =
      inputs.materialSize === "large" ? 4.5 : 2.88; // m² per sheet

    // Calculate number of sheets needed (round up)
    const sheetsNeeded = Math.ceil(surfaceAreaWithWaste / sheetArea);

    // Calculate cost if price given
    const cost = priceNum && priceNum > 0 ? priceNum * sheetsNeeded : 0;

    return {
      mainQty: `${sheetsNeeded} Unit${sheetsNeeded > 1 ? "s" : ""}`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "N/A",
      details: `Raw Material Area: ${surfaceArea.toFixed(
        2
      )} m², with waste: ${surfaceAreaWithWaste.toFixed(2)} m²`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a duct size and airflow calculator used for?",
      answer:
        "A duct size and airflow calculator helps HVAC professionals and contractors determine the appropriate duct dimensions and the amount of material needed for duct fabrication. It ensures that ducts are sized correctly to handle the required airflow efficiently, minimizing energy loss and noise while maintaining indoor air quality. This calculator also estimates material quantities and costs, aiding in project planning and budgeting.",
    },
    {
      question:
        "Why is precision important when calculating duct size and material requirements?",
      answer:
        "Precision in duct sizing and material estimation is critical to avoid costly mistakes such as ordering excess material or fabricating ducts that do not meet airflow requirements. Incorrect duct sizes can lead to inefficient HVAC system performance, increased energy consumption, and uncomfortable indoor environments. Accurate calculations help optimize material usage, reduce waste, and ensure compliance with design specifications and building codes.",
    },
    {
      question: "What types of materials are commonly used for duct fabrication?",
      answer:
        "Common duct materials include galvanized steel, aluminum, and flexible ducting materials like insulated fiberglass. Galvanized steel is widely used for its durability and corrosion resistance, while aluminum offers a lightweight alternative. Flexible ducts are often used for short runs or tight spaces. The choice of material affects cost, installation ease, and longevity, so selecting the right type is essential for project success.",
    },
    {
      question:
        "How do waste margins affect the calculation of material quantities?",
      answer:
        "Waste margins account for material lost due to cutting, fitting, and errors during installation. Including a waste percentage in calculations ensures that enough material is ordered to complete the job without delays. Typically, a 5-15% waste margin is added depending on project complexity. Neglecting waste can result in material shortages, while overestimating waste can increase costs unnecessarily.",
    },
    {
      question:
        "Can this calculator handle both metric and imperial units for duct sizing?",
      answer:
        "Yes, this calculator supports both metric (millimeters and meters) and imperial (inches and feet) units. It automatically converts inputs to a consistent unit system for accurate calculations. Users can select their preferred unit system to match project specifications or regional standards, ensuring flexibility and ease of use.",
    },
    {
      question:
        "How does the material size selection impact the number of units calculated?",
      answer:
        "Material size refers to the dimensions of the duct sheet or panel used for fabrication. Selecting a larger sheet size means each unit covers more surface area, potentially reducing the total number of units needed. Conversely, smaller sheet sizes may increase the number of units required. This selection helps tailor the calculation to available materials and optimize ordering quantities.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are fabricating a rectangular duct run that is 10 meters long, with a cross-section of 400 mm width and 300 mm depth. You want to order standard size galvanized steel sheets and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Convert dimensions to meters: Length = 10 m, Width = 0.4 m, Depth = 0.3 m. Calculate perimeter = 2 × (0.4 + 0.3) = 1.4 m.",
      },
      {
        label: "2. Calculate Surface Area",
        explanation:
          "Surface area = Perimeter × Length = 1.4 m × 10 m = 14 m².",
      },
      {
        label: "3. Add Waste Margin",
        explanation:
          "Add 10% waste: 14 m² × 1.10 = 15.4 m² total material needed.",
      },
      {
        label: "4. Determine Sheets Needed",
        explanation:
          "Standard sheet size = 2.88 m². Sheets needed = 15.4 ÷ 2.88 ≈ 5.35, round up to 6 sheets.",
      },
      {
        label: "5. Final Order",
        explanation: "Order 6 sheets of galvanized steel for the duct run.",
      },
    ],
    result: "Final Order: 6 Sheets",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Material Area = Perimeter × Length × (1 + Waste Margin)\nPerimeter = 2 × (Width + Depth)",
    variables: [
      { symbol: "L", description: "Length of the duct run" },
      { symbol: "W", description: "Width of the duct cross-section" },
      { symbol: "D", description: "Depth (height) of the duct cross-section" },
      { symbol: "Waste", description: "Waste margin percentage (decimal)" },
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
            <SelectItem value="metric">Metric (mm, m³/min)</SelectItem>
            <SelectItem value="imperial">Imperial (in, cfm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 10000"
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 400"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth / Height ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 300"
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
              <SelectItem value="standard">Standard Size (1.2m x 2.4m)</SelectItem>
              <SelectItem value="large">Large Size (1.5m x 3.0m)</SelectItem>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Duct
          Size & Airflow Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Duct Size & Airflow Calculator is an essential tool for HVAC
            professionals, contractors, and engineers involved in designing and
            fabricating ductwork systems. It helps determine the precise amount of
            material needed to construct ducts based on their dimensions and
            airflow requirements. Accurate duct sizing ensures optimal airflow,
            energy efficiency, and system performance.
          </p>
          <p>
            Precision in duct sizing is crucial because undersized ducts can cause
            excessive noise, increased energy consumption, and poor air
            distribution, while oversized ducts lead to unnecessary material costs
            and installation difficulties. This calculator incorporates waste
            margins to account for cutting losses and fitting adjustments,
            minimizing project delays and cost overruns.
          </p>
          <p>
            Various materials are used for duct fabrication, including galvanized
            steel, aluminum, and flexible ducting. Each material type has unique
            properties affecting durability, cost, and installation methods. This
            calculator allows you to select standard or large sheet sizes to match
            your material supply, helping optimize ordering quantities and reduce
            waste.
          </p>
          <p>
            By using this calculator, you can quickly estimate the number of duct
            material units required, incorporate waste factors, and calculate
            approximate costs based on your pricing inputs. This streamlines
            project planning and budgeting, ensuring efficient and cost-effective
            ductwork installation.
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
            <strong>Tip:</strong> Always measure duct dimensions at multiple points
            to account for any irregularities or bends that may affect material
            requirements.
          </li>
          <li>
            <strong>Did You Know?</strong> Adding a waste margin of 10% to 15% is
            standard practice in duct fabrication to cover cutting errors and
            fitting adjustments.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering slightly larger sheet sizes
            can reduce the number of joints and seams, improving airflow and
            reducing installation time.
          </li>
          <li>
            <strong>Tip:</strong> Use this calculator early in the project to help
            negotiate better pricing with suppliers by knowing your exact material
            needs.
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
            <strong>1. Ignoring Unit Consistency:</strong> Mixing metric and imperial
            units without proper conversion leads to inaccurate calculations and
            costly errors. Always double-check your units before inputting values.
          </p>
          <p>
            <strong>2. Underestimating Waste Margin:</strong> Failing to include an
            adequate waste percentage can cause material shortages, project delays,
            and increased labor costs.
          </p>
          <p>
            <strong>3. Overlooking Material Size Impact:</strong> Not selecting the
            correct material sheet size can result in ordering too many or too few
            units, affecting budget and installation efficiency.
          </p>
          <p>
            <strong>4. Neglecting Duct Shape Variations:</strong> This calculator
            assumes rectangular ducts. For round or oval ducts, specialized
            calculations are necessary.
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
            <a href="https://www.thisoldhouse.com/search?q=Ductwork%20Sizing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Ductwork Sizing - This Old House
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Professional advice, step-by-step tutorials, and expert videos on Ductwork Sizing from the trusted team at This Old House.
            </p>
          </li>
          <li>
            <a href="https://www.familyhandyman.com/?s=Ductwork%20Sizing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Ductwork Sizing - The Family Handyman
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Practical DIY guides, project plans, and tool reviews for Ductwork Sizing, helping you get the job done right.
            </p>
          </li>
          <li>
            <a href="https://www.energy.gov/search/site?keywords=Ductwork%20Sizing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Ductwork Sizing - Energy.gov
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official Department of Energy guidelines for energy efficiency and Ductwork Sizing to save money and improve home comfort.
            </p>
          </li>
          <li>
            <a href="https://www.ashrae.org/search?q=Ductwork%20Sizing" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Ductwork Sizing - ASHRAE
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Technical standards and guidelines for HVAC and building systems related to Ductwork Sizing.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Duct Size & Airflow Calculator"
      description="The ultimate professional guide and calculator for Duct Size & Airflow Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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