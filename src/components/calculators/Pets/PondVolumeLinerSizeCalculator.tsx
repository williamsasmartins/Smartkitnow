import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PondVolumeLinerSizeCalculator() {
  // 1. STATE
  // Unit system default to imperial (feet, inches)
  const [unit, setUnit] = useState("imperial");

  // Inputs: length, width, average depth (all positive numbers)
  // Imperial inputs in feet (allow decimals)
  // Metric inputs in meters (allow decimals)
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    depth: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      length <= 0 ||
      width <= 0 ||
      depth <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all dimensions.",
      };
    }

    // Calculate volume in gallons (imperial) or liters (metric)
    // Volume = length * width * depth
    // 1 cubic foot = 7.48052 gallons
    // 1 cubic meter = 1000 liters

    let volumeGallons = 0;
    let volumeLiters = 0;
    let linerLength = 0;
    let linerWidth = 0;

    if (unit === "imperial") {
      // volume in cubic feet
      const volumeCubicFeet = length * width * depth;
      volumeGallons = volumeCubicFeet * 7.48052;

      // Liner size calculation:
      // Add 1 foot overlap on all sides for liner length and width
      linerLength = length + 2; // feet
      linerWidth = width + 2; // feet

      return {
        value: `${volumeGallons.toFixed(0)} gallons`,
        label: "Estimated Pond Volume",
        subtext: `Minimum liner size: ${linerLength.toFixed(1)} ft x ${linerWidth.toFixed(
          1
        )} ft (includes 1 ft overlap each side)`,
        warning: null,
      };
    } else {
      // metric
      // volume in cubic meters
      const volumeCubicMeters = length * width * depth;
      volumeLiters = volumeCubicMeters * 1000;

      // Liner size calculation:
      // Add 0.3 meters overlap on all sides (~1 foot)
      linerLength = length + 0.6; // meters
      linerWidth = width + 0.6; // meters

      return {
        value: `${volumeLiters.toFixed(0)} liters`,
        label: "Estimated Pond Volume",
        subtext: `Minimum liner size: ${linerLength.toFixed(2)} m x ${linerWidth.toFixed(
          2
        )} m (includes 0.3 m overlap each side)`,
        warning: null,
      };
    }
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to add overlap when calculating liner size?",
      answer:
        "Adding overlap to the liner size is crucial to ensure proper installation and durability. The overlap allows the liner to extend beyond the pond edges, preventing soil and debris from damaging the liner and providing enough material to secure it firmly. Without sufficient overlap, the liner may shift, tear, or fail prematurely, risking water leakage and pond damage.",
    },
    {
      question: "How does pond depth affect the volume calculation?",
      answer:
        "Pond depth directly influences the total volume of water the pond can hold, as volume is a product of length, width, and depth. Accurately measuring the average depth ensures the volume estimate reflects the pond’s true capacity. Variations in depth should be averaged to avoid underestimating or overestimating the volume, which impacts liner size and water management.",
    },
    {
      question: "Can this calculator be used for irregularly shaped ponds?",
      answer:
        "This calculator assumes a rectangular pond shape for simplicity and accuracy in volume estimation. For irregularly shaped ponds, the calculated volume may be less precise because the formula does not account for curves or varying widths. In such cases, dividing the pond into smaller rectangular sections and summing their volumes can improve accuracy.",
    },
    {
      question: "Why are there different units for volume and liner size in imperial and metric systems?",
      answer:
        "The calculator uses gallons and feet for the imperial system and liters and meters for the metric system to align with common measurement standards. This ensures users receive results in familiar units, facilitating easier interpretation and application. Converting between units internally maintains accuracy while providing user-friendly outputs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (feet, gallons)</option>
            <option value="metric">Metric (meters, liters)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
            Pond Length ({unit === "imperial" ? "feet" : "meters"})
          </Label>
          <Input
            id="length"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter length in ${unit === "imperial" ? "feet" : "meters"}`}
            value={inputs.length}
            onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">
            Pond Width ({unit === "imperial" ? "feet" : "meters"})
          </Label>
          <Input
            id="width"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter width in ${unit === "imperial" ? "feet" : "meters"}`}
            value={inputs.width}
            onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="depth" className="text-slate-700 dark:text-slate-300">
            Average Pond Depth ({unit === "imperial" ? "feet" : "meters"})
          </Label>
          <Input
            id="depth"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter average depth in ${unit === "imperial" ? "feet" : "meters"}`}
            value={inputs.depth}
            onChange={(e) => setInputs({ ...inputs, depth: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ length: "", width: "", depth: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Pond Volume & Liner Size Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating the volume of a pond is essential for maintaining a healthy aquatic environment, especially when caring for aquatic animals or plants. This calculator estimates the total water volume based on the pond’s length, width, and average depth, providing a reliable figure to guide water treatment, filtration, and habitat management. Accurate volume measurement helps prevent over- or under-dosing of chemicals and ensures proper aeration and filtration systems are selected.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, determining the correct liner size is critical to prevent leaks and structural damage. The liner must be larger than the pond dimensions to allow for overlap and secure anchoring around the edges. This tool factors in a recommended overlap to ensure durability and ease of installation, which is vital for long-term pond integrity and animal safety.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide quick, accurate results for pond volume and liner size. Begin by selecting your preferred unit system—imperial or metric—to match your measurement tools. Then, enter the pond’s length, width, and average depth using the appropriate units. Ensure all values are positive numbers to avoid calculation errors.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure the pond’s length and width at the widest points, and determine the average depth by sampling multiple locations.
          </li>
          <li>
            <strong>Step 2:</strong> Input these measurements into the calculator fields, ensuring accuracy for the best results.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to view the estimated pond volume and recommended liner size, including overlap allowances.
          </li>
          <li>
            <strong>Step 4:</strong> Use the results to guide pond maintenance, liner purchase, and habitat management decisions.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.extension.purdue.edu/extmedia/ID/ID-146-W.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Purdue Extension - Pond Management and Maintenance
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on pond volume calculations, liner installation, and aquatic habitat management for healthy pond ecosystems.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wsu.edu/outreach/Pacific-Northwest-Ag-Health-and-Safety/pond-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Washington State University - Pond Management for Aquatic Animal Health
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary-focused resource detailing pond volume importance in maintaining aquatic animal health and water quality.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pond Volume & Liner Size Calculator"
      description="Calculate the volume of water in a pond and the minimum required liner size based on length, width, and depth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Pond Volume = Length × Width × Average Depth",
        variables: [
          { symbol: "Length", description: "Pond length (feet or meters)" },
          { symbol: "Width", description: "Pond width (feet or meters)" },
          { symbol: "Average Depth", description: "Average pond depth (feet or meters)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A rectangular pond measures 20 feet in length, 10 feet in width, and has an average depth of 3 feet. The goal is to calculate the pond volume and determine the minimum liner size including overlap.",
        steps: [
          { label: "1", explanation: "Calculate volume: 20 ft × 10 ft × 3 ft = 600 cubic feet." },
          { label: "2", explanation: "Convert volume to gallons: 600 × 7.48052 = 4488 gallons." },
          { label: "3", explanation: "Add 1 ft overlap on each side for liner: 20 + 2 = 22 ft length, 10 + 2 = 12 ft width." },
        ],
        result: "The pond holds approximately 4,488 gallons, and the minimum liner size should be 22 ft by 12 ft.",
      }}
      relatedCalculators={[
        { title: "Horse Selenium Toxicity Threshold (ppm)", url: "/pets/horse-selenium-toxicity-threshold", icon: "🐎" },
        { title: "Cat Grape/Raisin Exposure Risk (educational)", url: "/pets/cat-grape-raisin-exposure-risk", icon: "🐱" },
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Breeding Tank Volume Planner", url: "/pets/breeding-tank-volume-planner", icon: "🍖" },
        { title: "Dewormer & Antibiotic Dose Reference", url: "/pets/reptile-dewormer-antibiotic-dose-reference", icon: "💉" },
        { title: "Horse Salt & Mineral Balance Checker", url: "/pets/horse-salt-mineral-balance-checker", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Pond Volume & Liner Size Calculator" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}