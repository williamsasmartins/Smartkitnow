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
    const spacingCm = inputs.unit === "imperial" ? spacingNum * 2.54 : spacingNum;
    const balusterWidthCm = inputs.unit === "imperial" ? balusterWidthNum * 2.54 : balusterWidthNum;

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
      question: "What is the standard baluster spacing requirement?",
      answer: "The International Building Code (IBC) and most local building codes require a maximum spacing of 4 inches between balusters on stairs, ramps, and guardrails. This spacing is measured at the widest point between balusters and is designed to prevent a 4-inch sphere from passing through, which protects children from becoming trapped. Some jurisdictions may have slightly different requirements, so always verify with your local building department before installation.",
    },
    {
      question: "How do I calculate the number of balusters I need?",
      answer: "To calculate the number of balusters needed, divide the total railing length by your desired spacing interval (typically 4-6 inches), then add 1 for the starting baluster. For example, on a 36-inch railing with 4-inch spacing: (36 ÷ 4) + 1 = 10 balusters. Always round up to ensure proper spacing and verify that your final spacing doesn't exceed code requirements.",
    },
    {
      question: "What's the difference between baluster spacing and baluster width?",
      answer: "Baluster spacing refers to the gap between the centerlines of two adjacent balusters, while baluster width is the actual thickness of each individual baluster. If spacing is 6 inches and your balusters are 2 inches wide, the gap between them would be approximately 4 inches. It's crucial to account for both dimensions when planning your layout to achieve even, code-compliant spacing.",
    },
    {
      question: "Can I use 6-inch spacing instead of 4-inch spacing?",
      answer: "Using 6-inch spacing depends on your local building code and the application. While 4 inches is the maximum for most residential applications to protect children, some codes allow up to 6 inches for commercial railings or if balusters are curved or tapered. Always check your jurisdiction's specific requirements—exceeding the maximum spacing can result in code violations and failed inspections.",
    },
    {
      question: "How do I adjust spacing for uneven railing lengths?",
      answer: "If your railing length doesn't divide evenly by your desired spacing, distribute the difference equally across all gaps rather than putting extra space at one end. For a 37-inch railing needing 10 balusters with 4-inch spacing, you'd have 4.1 inches per gap instead of exactly 4 inches. Most codes allow up to 0.25 inches of variance as long as no single gap exceeds the maximum allowed spacing.",
    },
    {
      question: "What materials work best for balusters?",
      answer: "Common baluster materials include wood, metal (aluminum and steel), composite, and vinyl, each with spacing considerations. Wood balusters must meet strength requirements and typically range from 1.5 to 2.5 inches wide, while metal balusters can be thinner (0.75–1.5 inches). Choose materials based on durability, maintenance requirements, and aesthetic goals while ensuring they meet local fire and safety codes.",
    },
    {
      question: "How do I account for rail newel posts in spacing calculations?",
      answer: "When measuring for baluster spacing, measure from the inside face of one newel post to the inside face of the next newel post. Subtract the width of the first baluster, then divide the remaining distance by your target spacing interval. For example, if the distance between newels is 40 inches and your first baluster is 2 inches wide, you have 38 inches for spacing 9 balusters evenly (38 ÷ 8 gaps = 4.75 inches per gap).",
    },
    {
      question: "Are there different spacing rules for exterior vs. interior railings?",
      answer: "The 4-inch maximum spacing rule generally applies to both interior and exterior railings in residential applications under the IBC. However, exterior railings may have additional requirements for wind resistance and durability, which could affect baluster material and installation methods but not the spacing itself. Always consult your local building code, as some regions have stricter requirements for commercial or high-traffic exterior applications.",
    },
    {
      question: "What happens if my spacing exceeds the maximum code requirement?",
      answer: "If spacing exceeds 4 inches (or your local maximum), the installation will fail inspection and must be corrected before approval. You'll need to add additional balusters to bring spacing into compliance, which may require removing and reinstalling portions of the railing. This can be costly and time-consuming, so calculating correct spacing beforehand using a baluster spacing calculator can prevent rework and project delays.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Baluster Spacing Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Baluster Spacing Calculator is a construction tool designed to determine the optimal number and spacing of balusters for stairs, railings, and guardrails while ensuring compliance with building codes. Proper baluster spacing is critical for safety—most codes require a maximum 4-inch gap to prevent a sphere of that diameter from passing through, protecting children from entrapment hazards. Using this calculator eliminates manual calculations and helps prevent costly code violations and rework.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need to input three key measurements: the total railing length in inches (measured between newel posts or support points), your desired baluster spacing in inches, and the width of your balusters. The calculator then automatically computes the exact number of balusters needed and shows how spacing should be distributed to ensure even appearance and code compliance. You can adjust spacing incrementally to find the best balance between material cost, aesthetic symmetry, and regulatory requirements.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results will show the number of balusters required, the actual spacing between centerlines, and whether adjustments are needed to meet code. If your railing length doesn't divide evenly, the calculator distributes any extra space proportionally across all gaps, keeping every gap within the maximum allowable limit. Use these results as your shopping list for materials and as a reference guide during installation to ensure each baluster is positioned correctly.</p>
        </div>
      </section>

      {/* TABLE: Standard Baluster Spacing Requirements by Application */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Baluster Spacing Requirements by Application</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows maximum baluster spacing limits according to the International Building Code for common residential and commercial applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Application Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Spacing (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Baluster Width (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Material</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential Stairs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wood or Metal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential Guardrails</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wood or Composite</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Deck Railings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wood or Metal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial Railings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Aluminum or Steel</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Glass Balustrades</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.375–0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tempered Glass</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Curved/Tapered Balusters</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wood or Metal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Requirements vary by jurisdiction and specific building code. Always verify local codes before installation. Glass balustrades may have different spacing rules based on pane size and thickness.</p>
      </section>

      {/* TABLE: Baluster Calculation Examples for Common Railing Lengths */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Baluster Calculation Examples for Common Railing Lengths</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These examples demonstrate how to calculate the number of balusters and actual spacing for various typical railing lengths.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Railing Length (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Desired Spacing (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calculated Balusters</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Actual Spacing (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjustment Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Divides evenly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Distribute 0.1-inch difference</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase to 5.5-inch spacing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Distribute 0.1-inch difference</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Distribute 0.2-inch difference evenly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Distribute 0.1-inch difference</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All calculations include one starting baluster. Actual spacing may require rounding; ensure final spacing does not exceed code maximum. Newel post widths must be subtracted from total railing length before calculations.</p>
      </section>

      {/* TABLE: Baluster Material Properties and Spacing Considerations */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Baluster Material Properties and Spacing Considerations</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different materials have varying widths and structural properties that affect optimal spacing and installation methods.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Width (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Strength Grade</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per Linear Foot (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Solid Wood (4x4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8–$15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wood Turned (2x2)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5–$12</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aluminum Round</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$18</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Steel Square Tube</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10–$25</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Composite Balusters</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12–$22</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vinyl Balusters</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4–$10</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by region, quality grade, and supplier. Material choice affects both spacing calculations and installation labor. Verify weight and structural capacity with manufacturer specifications.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure your railing length from the inside face of one newel post to the inside face of the next—never measure the outside edges, as this will throw off your spacing calculations and material counts.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to test multiple spacing scenarios before purchasing materials; for example, compare 4-inch spacing versus 5-inch spacing to see which requires fewer balusters and balances cost savings with aesthetic preference.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When spacing doesn't divide evenly, use the calculator's recommendation to distribute extra inches equally across all gaps rather than bunching extra space at one end, which looks unprofessional and may fail inspection.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a 0.25-inch tolerance buffer in mind—most codes allow this much variance in spacing, so if your calculator shows 4.1-inch spacing instead of exactly 4 inches, that's typically acceptable across the railing length.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Double-check your local building code requirements before starting, as some jurisdictions allow 6-inch spacing for commercial applications or specific baluster styles, which could significantly reduce your material count and project cost.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring from the wrong reference points</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measuring from the outside edges of newel posts instead of inside faces will result in spacing that's too large, causing you to purchase fewer balusters than needed. Always measure inside face to inside face to get accurate railing length for calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for baluster width in spacing calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Baluster spacing refers to the gap between balusters, not the distance from centerline to centerline. Confusing these measurements can lead to spacing that exceeds code limits or material shortages during installation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not verifying local code requirements before calculating</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While 4 inches is standard in most jurisdictions, some regions allow 6 inches for commercial applications or specific materials. Calculating spacing without checking local codes can result in wasted materials or failed inspections.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Placing all extra space in one location</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If your railing length creates uneven spacing, cramming all the extra distance into one gap creates an obvious visual flaw and may violate code. The calculator helps distribute variance equally, which is the professional approach.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming the same spacing works for all railing sections</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Different sections of railing (stairs, landings, deck edges) may have different lengths and thus require different spacing calculations. Calculate each section separately to ensure code compliance throughout the project.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard baluster spacing requirement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The International Building Code (IBC) and most local building codes require a maximum spacing of 4 inches between balusters on stairs, ramps, and guardrails. This spacing is measured at the widest point between balusters and is designed to prevent a 4-inch sphere from passing through, which protects children from becoming trapped. Some jurisdictions may have slightly different requirements, so always verify with your local building department before installation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the number of balusters I need?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate the number of balusters needed, divide the total railing length by your desired spacing interval (typically 4-6 inches), then add 1 for the starting baluster. For example, on a 36-inch railing with 4-inch spacing: (36 ÷ 4) + 1 = 10 balusters. Always round up to ensure proper spacing and verify that your final spacing doesn't exceed code requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between baluster spacing and baluster width?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Baluster spacing refers to the gap between the centerlines of two adjacent balusters, while baluster width is the actual thickness of each individual baluster. If spacing is 6 inches and your balusters are 2 inches wide, the gap between them would be approximately 4 inches. It's crucial to account for both dimensions when planning your layout to achieve even, code-compliant spacing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use 6-inch spacing instead of 4-inch spacing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Using 6-inch spacing depends on your local building code and the application. While 4 inches is the maximum for most residential applications to protect children, some codes allow up to 6 inches for commercial railings or if balusters are curved or tapered. Always check your jurisdiction's specific requirements—exceeding the maximum spacing can result in code violations and failed inspections.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I adjust spacing for uneven railing lengths?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your railing length doesn't divide evenly by your desired spacing, distribute the difference equally across all gaps rather than putting extra space at one end. For a 37-inch railing needing 10 balusters with 4-inch spacing, you'd have 4.1 inches per gap instead of exactly 4 inches. Most codes allow up to 0.25 inches of variance as long as no single gap exceeds the maximum allowed spacing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What materials work best for balusters?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common baluster materials include wood, metal (aluminum and steel), composite, and vinyl, each with spacing considerations. Wood balusters must meet strength requirements and typically range from 1.5 to 2.5 inches wide, while metal balusters can be thinner (0.75–1.5 inches). Choose materials based on durability, maintenance requirements, and aesthetic goals while ensuring they meet local fire and safety codes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for rail newel posts in spacing calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">When measuring for baluster spacing, measure from the inside face of one newel post to the inside face of the next newel post. Subtract the width of the first baluster, then divide the remaining distance by your target spacing interval. For example, if the distance between newels is 40 inches and your first baluster is 2 inches wide, you have 38 inches for spacing 9 balusters evenly (38 ÷ 8 gaps = 4.75 inches per gap).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there different spacing rules for exterior vs. interior railings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 4-inch maximum spacing rule generally applies to both interior and exterior railings in residential applications under the IBC. However, exterior railings may have additional requirements for wind resistance and durability, which could affect baluster material and installation methods but not the spacing itself. Always consult your local building code, as some regions have stricter requirements for commercial or high-traffic exterior applications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my spacing exceeds the maximum code requirement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If spacing exceeds 4 inches (or your local maximum), the installation will fail inspection and must be corrected before approval. You'll need to add additional balusters to bring spacing into compliance, which may require removing and reinstalling portions of the railing. This can be costly and time-consuming, so calculating correct spacing beforehand using a baluster spacing calculator can prevent rework and project delays.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iccsafe.org/products-plans/icc-product-lines/international-codes/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) — Chapter 3: Fire and Life Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The IBC provides the standard 4-inch maximum baluster spacing requirement for residential and commercial railings and guardrails.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders (NAHB) — Railing and Guardrail Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NAHB offers comprehensive guidance on residential railing installation, spacing requirements, and material specifications aligned with current building codes.</p>
          </li>
          <li>
            <a href="https://www.cpsc.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Product Safety Commission (CPSC) — Stair Safety Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CPSC provides safety standards and testing requirements for balusters and railings to prevent child entrapment and fall injuries.</p>
          </li>
          <li>
            <a href="https://www.stairtec.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Stair Builders Association — Technical Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This organization publishes technical standards and best practices for stair and railing construction, including baluster spacing and material specifications.</p>
          </li>
        </ul>
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
        { id: "references", label: "References & Resources" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}