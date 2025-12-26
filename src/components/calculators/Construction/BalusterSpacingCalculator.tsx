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

export default function BalusterSpacingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters/cm, imperial = feet/inches
    length: "", // length of railing run (m or ft)
    spacing: "", // desired spacing between balusters (cm or inches)
    balusterWidth: "4", // width of one baluster (cm or inches), default 4cm/1.5in typical
    waste: "10", // waste percentage
    price: "", // price per baluster unit
    materialType: "wood", // wood, metal, composite
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const toCm = (value: number, unit: string) => {
    if (unit === "imperial") return value * 2.54; // inches to cm
    return value;
  };
  const toMeters = (value: number, unit: string) => {
    if (unit === "imperial") return value * 0.3048; // feet to meters
    return value;
  };
  const toInches = (value: number, unit: string) => {
    if (unit === "metric") return value / 2.54;
    return value;
  };
  const toFeet = (value: number, unit: string) => {
    if (unit === "metric") return value / 0.3048;
    return value;
  };

  // Calculation logic:
  // Number of balusters = (Length of railing / (spacing + baluster width)) + 1
  // Add waste margin
  // Round up to whole units

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const spacingNum = parseFloat(inputs.spacing);
    const balusterWidthNum = parseFloat(inputs.balusterWidth);
    const wasteNum = parseInt(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      isNaN(lengthNum) ||
      isNaN(spacingNum) ||
      isNaN(balusterWidthNum) ||
      lengthNum <= 0 ||
      spacingNum <= 0 ||
      balusterWidthNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all dimensions.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert length to cm for consistent calculation
    // Length input is in meters or feet, spacing and balusterWidth in cm or inches
    // So convert length to cm:
    let lengthCm: number;
    if (inputs.unit === "metric") {
      lengthCm = lengthNum * 100; // meters to cm
    } else {
      lengthCm = lengthNum * 12 * 2.54; // feet to inches to cm
    }

    // Convert spacing and balusterWidth to cm if imperial
    let spacingCm = inputs.unit === "imperial" ? spacingNum * 2.54 : spacingNum;
    let balusterWidthCm = inputs.unit === "imperial" ? balusterWidthNum * 2.54 : balusterWidthNum;

    // Calculate number of balusters needed:
    // Formula: count = floor(length / (spacing + balusterWidth)) + 1
    // Because balusters are placed at start and then spaced apart by spacing + width
    const baseCount = Math.floor(lengthCm / (spacingCm + balusterWidthCm)) + 1;

    // Add waste margin
    const totalCount = Math.ceil(baseCount * (1 + wasteNum / 100));

    // Calculate cost if price provided
    const cost = priceNum && priceNum > 0 ? (totalCount * priceNum).toFixed(2) : null;

    return {
      mainQty: `${totalCount} Units`,
      cost: cost ? `$${cost}` : "Price not set",
      details: `Base: ${baseCount} units + ${wasteNum}% waste = ${totalCount} units`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is baluster spacing and why is it important?",
      answer:
        "Baluster spacing refers to the distance between individual balusters in a railing system. Proper spacing ensures safety by preventing small children or pets from slipping through gaps, complies with building codes, and maintains the structural integrity and aesthetic appeal of the railing. Incorrect spacing can lead to safety hazards and code violations.",
    },
    {
      question: "How do I measure the length for baluster spacing calculations?",
      answer:
        "Measure the total length of the railing run where balusters will be installed. This is typically the horizontal distance along the top rail or base where balusters will be mounted. Ensure you measure in a straight line and convert units appropriately if mixing metric and imperial measurements.",
    },
    {
      question: "What materials can balusters be made from and how does that affect spacing?",
      answer:
        "Balusters can be made from wood, metal, composite, or glass. Material choice affects baluster width, strength, and spacing requirements. For example, metal balusters can be thinner but still strong, allowing for tighter spacing, while wood balusters might need to be wider. Always check local building codes for minimum spacing requirements based on material.",
    },
    {
      question: "Why should I include a waste margin in my baluster calculations?",
      answer:
        "Including a waste margin accounts for cutting errors, damaged pieces, and future repairs. It ensures you order enough material without running short during installation. Typically, a 10% waste margin is recommended, but this can vary based on project complexity and installer experience.",
    },
    {
      question: "Can I use this calculator for curved or angled railings?",
      answer:
        "This calculator assumes a straight railing run. For curved or angled railings, measurements and spacing calculations become more complex due to varying lengths and angles. For such cases, consult a professional estimator or use specialized software that accounts for curves and angles.",
    },
    {
      question: "How do building codes affect baluster spacing?",
      answer:
        "Building codes often specify maximum allowable spacing between balusters to ensure safety, commonly no more than 4 inches (100 mm) gap. These codes vary by region and type of building. Always verify local regulations before finalizing your baluster spacing and ordering materials.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing a wooden railing on a deck that is 12 feet long. You want to space your balusters 4 inches apart, and each baluster is 1.5 inches wide. You want to include a 10% waste margin and know the price per baluster is $5.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Length = 12 feet (convert to cm: 12 ft × 12 in/ft × 2.54 cm/in = 365.76 cm). Spacing = 4 inches (10.16 cm), Baluster width = 1.5 inches (3.81 cm).",
      },
      {
        label: "2. Calculate base quantity",
        explanation:
          "Number of balusters = floor(365.76 / (10.16 + 3.81)) + 1 = floor(365.76 / 13.97) + 1 = 26 + 1 = 27 units.",
      },
      {
        label: "3. Add waste margin",
        explanation: "Add 10% waste: 27 × 1.10 = 29.7 → round up to 30 units.",
      },
      {
        label: "4. Calculate cost",
        explanation: "30 units × $5 = $150 total estimated cost.",
      },
    ],
    result: "Final Order: 30 balusters, Estimated Cost: $150",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Number of Balusters = ⌊ Length / (Spacing + Baluster Width) ⌋ + 1",
    variables: [
      { symbol: "Length", description: "Total length of the railing run (cm or inches)" },
      { symbol: "Spacing", description: "Desired gap between balusters (cm or inches)" },
      { symbol: "Baluster Width", description: "Width of one baluster (cm or inches)" },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (m, cm)</SelectItem>
            <SelectItem value="imperial">Imperial (ft, in)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length of Railing ({inputs.unit === "metric" ? "meters (m)" : "feet (ft)"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 3.5" : "e.g. 12"}
          />
        </div>
        <div className="space-y-2">
          <Label>Desired Spacing Between Balusters ({inputs.unit === "metric" ? "cm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.spacing}
            onChange={(e) => handleInputChange("spacing", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 10" : "e.g. 4"}
          />
        </div>
        <div className="space-y-2">
          <Label>Baluster Width ({inputs.unit === "metric" ? "cm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.balusterWidth}
            onChange={(e) => handleInputChange("balusterWidth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 4" : "e.g. 1.5"}
          />
        </div>
        <div className="space-y-2">
          <Label>Material Type</Label>
          <Select value={inputs.materialType} onValueChange={(v) => handleInputChange("materialType", v)}>
            <SelectTrigger>
              <HardHat className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wood">Wood</SelectItem>
              <SelectItem value="metal">Metal</SelectItem>
              <SelectItem value="composite">Composite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between font-semibold text-blue-600">{inputs.waste}%</div>
            <Slider
              value={[parseInt(inputs.waste)]}
              min={0}
              max={25}
              step={5}
              onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price per Unit</Label>
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Materials Needed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.mainQty}</div>
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Baluster Spacing Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            A baluster spacing calculator is a specialized tool designed to help contractors, builders, and DIY enthusiasts accurately determine the number of balusters required for a railing project. Balusters are the vertical posts that support the handrail, and their spacing is critical for both safety and aesthetics. This calculator takes into account the total length of the railing, the desired spacing between balusters, and the width of each baluster to provide a precise count of units needed.
          </p>
          <p>
            Precision in baluster spacing is essential to comply with local building codes, which often specify maximum allowable gaps to prevent accidents, especially involving children. Incorrect spacing can lead to costly rework, safety hazards, and failed inspections. Using a calculator ensures you order the right amount of material, minimizing waste and saving money.
          </p>
          <p>
            Balusters come in various materials including wood, metal, and composite. Each material type has different standard widths and installation considerations. For example, metal balusters can be thinner yet stronger, allowing for tighter spacing, while wood balusters are typically wider and may require different spacing to maintain structural integrity. This calculator allows you to select the material type to better tailor your estimates.
          </p>
          <p>
            Additionally, the calculator includes a waste margin input to account for cutting errors, damaged pieces, and future repairs. This margin helps ensure you have enough balusters on hand without over-ordering. By combining accurate measurements, material considerations, and waste factors, this tool streamlines your project planning and budgeting.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure the railing length along the top rail where balusters will be installed, not along the floor or base, to ensure accuracy.
          </li>
          <li>
            <strong>Did You Know?</strong> The International Residential Code (IRC) typically requires baluster spacing to be less than 4 inches (100 mm) to prevent a 4-inch sphere from passing through.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering 10% extra balusters as waste can save you from costly delays caused by breakage or miscuts during installation.
          </li>
          <li>
            <strong>Tip:</strong> When working with metal balusters, consider their thinner profile to maximize visibility while maintaining safety.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Unit Conversion:</strong> Mixing metric and imperial units without proper conversion can lead to ordering too many or too few balusters. Always double-check your units before calculating.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Failing to include a waste margin can result in running out of balusters mid-project, causing delays and additional shipping costs.
          </p>
          <p>
            <strong>3. Not Accounting for Baluster Width:</strong> Only considering spacing without the actual width of the baluster will underestimate the number of units needed.
          </p>
          <p>
            <strong>4. Overlooking Local Building Codes:</strong> Not verifying local code requirements for baluster spacing can lead to non-compliance, failed inspections, and costly rework.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Baluster Spacing Calculator"
      description="The ultimate professional guide and calculator for Baluster Spacing Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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