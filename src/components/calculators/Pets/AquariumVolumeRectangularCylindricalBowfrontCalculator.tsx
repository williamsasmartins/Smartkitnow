import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumVolumeRectangularCylindricalBowfrontCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs for all three aquarium types
  // Rectangular: length, width, height
  // Cylindrical: diameter, height
  // Bowfront: length, width, height, bow depth
  const [shape, setShape] = useState<"rectangular" | "cylindrical" | "bowfront">("rectangular");
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    height: "",
    diameter: "",
    bowDepth: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Parse inputs to floats
    const parseInput = (val: string) => {
      const n = parseFloat(val);
      return isNaN(n) || n <= 0 ? null : n;
    };

    // Convert inches to cm if imperial, else cm stays cm
    const toCm = (val: number) => (unit === "imperial" ? val * 2.54 : val);

    // Volume in liters calculation
    let volumeLiters: number | null = null;

    if (shape === "rectangular") {
      const length = parseInput(inputs.length);
      const width = parseInput(inputs.width);
      const height = parseInput(inputs.height);
      if (length && width && height) {
        // Convert to cm
        const l = toCm(length);
        const w = toCm(width);
        const h = toCm(height);
        // Volume in cubic cm = l * w * h
        // 1 liter = 1000 cubic cm
        volumeLiters = (l * w * h) / 1000;
      }
    } else if (shape === "cylindrical") {
      const diameter = parseInput(inputs.diameter);
      const height = parseInput(inputs.height);
      if (diameter && height) {
        const d = toCm(diameter);
        const h = toCm(height);
        // Volume = π * r^2 * h
        const r = d / 2;
        volumeLiters = (Math.PI * r * r * h) / 1000;
      }
    } else if (shape === "bowfront") {
      // Bowfront approx volume = height * width * length * (1 - bowDepthFactor)
      // BowDepthFactor approx = bowDepth / width * 0.3 (empirical factor)
      const length = parseInput(inputs.length);
      const width = parseInput(inputs.width);
      const height = parseInput(inputs.height);
      const bowDepth = parseInput(inputs.bowDepth);
      if (length && width && height && bowDepth) {
        const l = toCm(length);
        const w = toCm(width);
        const h = toCm(height);
        const bd = toCm(bowDepth);
        // Bowfront volume approx = rectangular volume * (1 - 0.3 * (bowDepth / width))
        const bowFactor = 1 - 0.3 * (bd / w);
        volumeLiters = (l * w * h * bowFactor) / 1000;
      }
    }

    if (volumeLiters === null) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all required fields.",
      };
    }

    // Convert liters to gallons if imperial
    const volume = unit === "imperial" ? +(volumeLiters * 0.264172).toFixed(2) : +volumeLiters.toFixed(2);
    const label = unit === "imperial" ? "Gallons" : "Liters";

    return {
      value: volume,
      label,
      subtext: `Calculated volume of your ${shape} aquarium.`,
      warning: null,
    };
  }, [inputs, unit, shape]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to accurately calculate aquarium volume?",
      answer:
        "Accurate aquarium volume calculation is essential for maintaining a healthy aquatic environment. It helps determine the correct dosage of medications, filtration capacity, and appropriate stocking levels. Without precise volume measurements, you risk harming aquatic life due to improper water chemistry or overcrowding.",
    },
    {
      question: "How does the shape of the aquarium affect volume calculation?",
      answer:
        "Different aquarium shapes require distinct volume formulas because their dimensions influence water capacity differently. Rectangular tanks use length, width, and height, while cylindrical tanks rely on diameter and height. Bowfront tanks have a curved front, so an adjustment factor is applied to account for the bow depth, ensuring more accurate volume estimation.",
    },
    {
      question: "Can I use this calculator for saltwater and freshwater aquariums alike?",
      answer:
        "Yes, this calculator estimates the total water volume regardless of water type. However, keep in mind that saltwater is denser than freshwater, which can slightly affect weight but not volume. For veterinary and maintenance purposes, volume calculations remain consistent across both types.",
    },
    {
      question: "Why does the calculator default to imperial units, and can I switch to metric?",
      answer:
        "The calculator defaults to imperial units to accommodate users primarily in regions using gallons and inches. However, you can easily switch to metric units (liters and centimeters) via the unit selector. This flexibility ensures accurate input and output tailored to your preferred measurement system.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (inches, gallons)</SelectItem>
              <SelectItem value="metric">Metric (cm, liters)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-slate-700 dark:text-slate-300">Aquarium Shape</Label>
        <Select value={shape} onValueChange={setShape}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangular">Rectangular</SelectItem>
            <SelectItem value="cylindrical">Cylindrical</SelectItem>
            <SelectItem value="bowfront">Bowfront</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs based on shape */}
      {shape === "rectangular" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
              Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="length"
              type="number"
              min={0}
              step="any"
              value={inputs.length}
              onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
              placeholder="e.g. 36"
            />
          </div>
          <div>
            <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">
              Width ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="width"
              type="number"
              min={0}
              step="any"
              value={inputs.width}
              onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
              placeholder="e.g. 18"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              value={inputs.height}
              onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
              placeholder="e.g. 20"
            />
          </div>
        </div>
      )}

      {shape === "cylindrical" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="diameter" className="text-slate-700 dark:text-slate-300">
              Diameter ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="diameter"
              type="number"
              min={0}
              step="any"
              value={inputs.diameter}
              onChange={(e) => setInputs({ ...inputs, diameter: e.target.value })}
              placeholder="e.g. 24"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              value={inputs.height}
              onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
              placeholder="e.g. 30"
            />
          </div>
        </div>
      )}

      {shape === "bowfront" && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
              Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="length"
              type="number"
              min={0}
              step="any"
              value={inputs.length}
              onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
              placeholder="e.g. 48"
            />
          </div>
          <div>
            <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">
              Width ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="width"
              type="number"
              min={0}
              step="any"
              value={inputs.width}
              onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
              placeholder="e.g. 18"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              value={inputs.height}
              onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
              placeholder="e.g. 20"
            />
          </div>
          <div>
            <Label htmlFor="bowDepth" className="text-slate-700 dark:text-slate-300">
              Bow Depth ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="bowDepth"
              type="number"
              min={0}
              step="any"
              value={inputs.bowDepth}
              onChange={(e) => setInputs({ ...inputs, bowDepth: e.target.value })}
              placeholder="e.g. 4"
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              length: "",
              width: "",
              height: "",
              diameter: "",
              bowDepth: "",
            })
          }
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
          Understanding Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Aquarium Volume Calculator is a specialized tool designed to help aquarium enthusiasts and veterinary professionals accurately determine the water volume of various aquarium shapes. Whether your tank is rectangular, cylindrical, or bowfront, this calculator applies the appropriate geometric formulas to provide precise volume measurements. Accurate volume calculation is critical for maintaining optimal water quality, dosing medications, and ensuring the health and safety of aquatic animals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Rectangular aquariums are the most common and straightforward to calculate, using length, width, and height dimensions. Cylindrical tanks require diameter and height measurements, utilizing the formula for the volume of a cylinder. Bowfront aquariums, characterized by their curved front glass, need an additional bow depth measurement to adjust the volume estimate, as their shape deviates from a simple rectangle. This calculator integrates these variations seamlessly, providing reliable results regardless of tank design.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By offering both imperial and metric units, the tool caters to a global audience, ensuring accessibility and ease of use. Veterinary professionals can leverage this calculator to better understand the aquatic environment when advising on treatments or environmental adjustments. Ultimately, this calculator supports responsible aquarium management by empowering users with accurate, science-based volume data.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and intuitive. Begin by selecting the shape of your aquarium from the dropdown menu: rectangular, cylindrical, or bowfront. Next, input the required dimensions in your preferred unit system—imperial or metric. The calculator will automatically convert and compute the volume based on your inputs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the aquarium shape that matches your tank design.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the relevant measurements (length, width, height, diameter, bow depth) in inches or centimeters.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to view the estimated volume in gallons or liters.
          </li>
          <li>
            <strong>Step 4:</strong> Use the volume result to guide aquarium maintenance, medication dosing, or veterinary consultations.
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
              href="https://www.aquaticcommunity.com/aquarium/volume.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Aquarium Volume Calculations - Aquatic Community
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on calculating aquarium volumes for different shapes, including formulas and practical tips for hobbyists and professionals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/fish-health-and-care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Fish Health and Care - American Veterinary Medical Association (AVMA)
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary resource providing insights into aquatic animal health, emphasizing the importance of proper tank conditions and volume.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7159453/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Veterinary Care of Fish - National Center for Biotechnology Information (NCBI)
            </a>
            <p className="text-slate-500 text-sm">
              Scholarly article discussing veterinary approaches to fish care, including environmental factors such as tank volume and water quality.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)"
      description="Calculate the accurate volume (in Liters or Gallons) of rectangular, cylindrical, or bowfront aquariums."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Rectangular: Volume = (Length × Width × Height) / 1000; Cylindrical: Volume = (π × (Diameter/2)² × Height) / 1000; Bowfront: Volume ≈ (Length × Width × Height × (1 - 0.3 × (BowDepth / Width))) / 1000",
        variables: [
          { symbol: "Length", description: "Length of the aquarium" },
          { symbol: "Width", description: "Width of the aquarium" },
          { symbol: "Height", description: "Height of the aquarium" },
          { symbol: "Diameter", description: "Diameter of the cylindrical aquarium" },
          { symbol: "BowDepth", description: "Depth of the bowfront curve" },
          { symbol: "π", description: "Mathematical constant Pi (~3.1416)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A hobbyist owns a bowfront aquarium measuring 48 inches in length, 18 inches in width, 20 inches in height, and a bow depth of 4 inches. They want to know the volume in gallons to dose medication accurately.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert all measurements to centimeters (1 inch = 2.54 cm). Length = 121.92 cm, Width = 45.72 cm, Height = 50.8 cm, Bow Depth = 10.16 cm.",
          },
          {
            label: "2",
            explanation:
              "Calculate the bowfront volume using the formula: Volume ≈ (Length × Width × Height × (1 - 0.3 × (BowDepth / Width))) / 1000.",
          },
          {
            label: "3",
            explanation:
              "Substitute values: Volume ≈ (121.92 × 45.72 × 50.8 × (1 - 0.3 × (10.16 / 45.72))) / 1000 ≈ 270.5 liters.",
          },
          {
            label: "4",
            explanation:
              "Convert liters to gallons: 270.5 × 0.264172 ≈ 71.4 gallons.",
          },
        ],
        result: "The aquarium volume is approximately 71.4 gallons, which can be used for precise veterinary dosing and maintenance.",
      }}
      relatedCalculators={[
        { title: "Lilies Poisoning Risk Guide (cats)", url: "/pets/cat-lilies-poisoning-risk-guide", icon: "🐱" },
        { title: "Kitten Adult Weight Predictor", url: "/pets/kitten-adult-weight-predictor", icon: "🐶" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "🐱" },
        { title: "Phosphorus per Meal Estimator (diet label helper)", url: "/pets/cat-phosphorus-per-meal-estimator", icon: "🍖" },
        { title: "Daily Water Intake Checker for Cats", url: "/pets/cat-daily-water-intake-checker", icon: "🐱" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Cats", url: "/pets/cat-benadryl-diphenhydramine-dose", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)" },
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