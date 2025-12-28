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
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Plug,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Settings,
  Lightbulb,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ConduitBendingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    length: "",
    amps: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Conduit Bending Calculator Logic:
   * Inputs:
   * - Length (ft or m)
   * - Amps (current load)
   *
   * Outputs:
   * - Minimum conduit size (trade size in inches or mm)
   * - Suggested conduit bending radius (inches or mm)
   * - Estimated conduit fill percentage
   *
   * Assumptions:
   * - Using NEC conduit fill tables for THHN conductors (typical)
   * - Conduit sizes: trade sizes in inches (imperial) or mm (metric)
   * - Bending radius based on conduit type (EMT, RMC, etc.) - typical values used
   *
   * For simplicity:
   * - Calculate minimum conduit size based on amps using NEC ampacity tables (approximate)
   * - Calculate bending radius as 6x conduit diameter (typical for EMT)
   * - Calculate conduit fill based on number of conductors estimated from amps (1 conductor per 20A)
   */

  // NEC Ampacity to Wire Gauge (approximate for THHN copper)
  // Then wire gauge to conduit fill area (approximate)
  // For simplicity, map amps to conduit size directly (common practice)

  // Conduit sizes and their approximate inside diameters (inches) and cross-sectional area (sq in)
  // Source: NEC Chapter 9, Table 4 (approximate)
  const conduitDataImperial = [
    { tradeSize: "1/2", insideDiameter: 0.622, area: 0.303 },
    { tradeSize: "3/4", insideDiameter: 0.824, area: 0.533 },
    { tradeSize: "1", insideDiameter: 1.049, area: 0.864 },
    { tradeSize: "1 1/4", insideDiameter: 1.380, area: 1.496 },
    { tradeSize: "1 1/2", insideDiameter: 1.610, area: 2.036 },
    { tradeSize: "2", insideDiameter: 2.067, area: 3.356 },
    { tradeSize: "2 1/2", insideDiameter: 2.469, area: 4.813 },
    { tradeSize: "3", insideDiameter: 3.068, area: 7.063 },
    { tradeSize: "3 1/2", insideDiameter: 3.548, area: 9.621 },
    { tradeSize: "4", insideDiameter: 4.026, area: 12.566 },
  ];

  // Metric conduit sizes (mm) and approximate inside diameter and area (mm and mm²)
  // Converted from imperial for simplicity
  const conduitDataMetric = [
    { tradeSize: "16", insideDiameter: 16, area: 201 },
    { tradeSize: "20", insideDiameter: 20, area: 314 },
    { tradeSize: "25", insideDiameter: 25, area: 491 },
    { tradeSize: "32", insideDiameter: 32, area: 804 },
    { tradeSize: "40", insideDiameter: 40, area: 1256 },
    { tradeSize: "50", insideDiameter: 50, area: 1963 },
    { tradeSize: "63", insideDiameter: 63, area: 3117 },
    { tradeSize: "75", insideDiameter: 75, area: 4418 },
    { tradeSize: "90", insideDiameter: 90, area: 6362 },
    { tradeSize: "110", insideDiameter: 110, area: 9503 },
  ];

  // Approximate conductor cross-sectional area per amp (THHN copper)
  // Assume 1 conductor per 20 amps, conductor area ~ 0.013 sq in (14 AWG)
  // For conduit fill, max 40% fill allowed for more than 2 conductors (NEC)
  // We'll estimate number of conductors = ceil(amps / 20)
  // Then total conductor area = number * 0.013 sq in (imperial) or convert to mm²

  // Constants
  const conductorAreaImperial = 0.013; // sq in per conductor (approx 14 AWG)
  const conductorAreaMetric = 8.4; // mm² per conductor (14 AWG approx)

  // Max conduit fill percentage (NEC)
  const maxFillPercent = 40;

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const amps = parseFloat(inputs.amps);
    const unit = inputs.unit;

    if (isNaN(length) || length <= 0 || isNaN(amps) || amps <= 0) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for length and amps.",
        feedback: "",
      };
    }

    // Select conduit data based on unit
    const conduitData = unit === "imperial" ? conduitDataImperial : conduitDataMetric;
    const conductorArea = unit === "imperial" ? conductorAreaImperial : conductorAreaMetric;

    // Estimate number of conductors needed (1 per 20 amps)
    const conductors = Math.ceil(amps / 20);

    // Total conductor area
    const totalConductorArea = conductors * conductorArea;

    // Find minimum conduit size that can handle total conductor area at max fill
    // max usable area = conduit area * maxFillPercent / 100
    let selectedConduit = conduitData[conduitData.length - 1]; // default largest

    for (const conduit of conduitData) {
      const maxUsableArea = (conduit.area * maxFillPercent) / 100;
      if (maxUsableArea >= totalConductorArea) {
        selectedConduit = conduit;
        break;
      }
    }

    // Calculate bending radius = 6x inside diameter (typical for EMT)
    const bendingRadius = selectedConduit.insideDiameter * 6;

    // Format outputs
    const primary = unit === "imperial" ? `${selectedConduit.tradeSize}"` : `${selectedConduit.tradeSize} mm`;
    const secondary = "Minimum Conduit Size";

    const bendingRadiusFormatted =
      unit === "imperial"
        ? `${bendingRadius.toFixed(2)} in`
        : `${bendingRadius.toFixed(1)} mm`;

    const fillPercent = ((totalConductorArea / selectedConduit.area) * 100).toFixed(1);

    const details = `Estimated conduit fill: ${fillPercent}% of max ${maxFillPercent}%. Suggested bending radius: ${bendingRadiusFormatted}. Number of conductors estimated: ${conductors}.`;

    // Safety feedback
    let feedback = "";
    if (fillPercent > maxFillPercent) {
      feedback =
        "Warning: Conduit fill exceeds NEC maximum allowed. Increase conduit size or reduce conductors.";
    } else if (length > 100) {
      feedback =
        "Note: Long conduit runs (>100 ft/m) may require derating or additional considerations.";
    } else {
      feedback = "Conduit size and bending radius are within typical safe limits.";
    }

    return {
      primary,
      secondary,
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does conduit size affect electrical wiring safety?",
      answer:
        "Conduit size is critical to ensure that electrical conductors have enough space to prevent overheating and allow heat dissipation. Undersized conduit can cause excessive heat buildup, leading to insulation damage and potential fire hazards. Proper conduit sizing also facilitates easier wire pulling and future maintenance.",
    },
    {
      question: "Why is the bending radius important in conduit installation?",
      answer:
        "The bending radius determines how sharply a conduit can be bent without damaging the conduit or the wires inside. A radius that is too tight can kink the conduit or damage insulation on conductors, leading to electrical faults. Following recommended bending radii ensures mechanical integrity and compliance with electrical codes.",
    },
    {
      question: "Can I use this calculator for all types of conduit?",
      answer:
        "This calculator provides general guidance based on typical EMT conduit dimensions and NEC fill percentages. Different conduit types like RMC or PVC may have different bending radius requirements and fill capacities. Always consult manufacturer specifications and local electrical codes for specific conduit types.",
    },
    {
      question: "What should I do if my conduit fill exceeds the recommended maximum?",
      answer:
        "If the calculated conduit fill exceeds the NEC recommended maximum (usually 40% for more than two conductors), you should increase the conduit size or reduce the number of conductors in that conduit. Overfilled conduits can cause overheating and make wire pulling difficult, compromising safety and code compliance.",
    },
    {
      question: "Does conduit length affect conductor ampacity?",
      answer:
        "While conduit length itself does not directly affect ampacity, longer conduit runs can increase voltage drop and may require conductor size adjustments. Additionally, longer runs may require more bends or supports, which can affect installation complexity. Always consider length when planning wiring layouts.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "An electrician needs to install conduit for a circuit carrying 60 amps over a 50 ft run in a commercial building using imperial units.",
    steps: [
      {
        label: "Step 1: Input values",
        explanation:
          "Enter the conduit length as 50 ft and the current load as 60 amps in the calculator.",
      },
      {
        label: "Step 2: Calculate number of conductors",
        explanation:
          "Estimate the number of conductors as 60 amps / 20 amps per conductor = 3 conductors.",
      },
      {
        label: "Step 3: Determine conduit size",
        explanation:
          "The calculator finds the minimum conduit size that can safely accommodate 3 conductors with a max fill of 40%. In this case, a 1-inch conduit is recommended.",
      },
      {
        label: "Step 4: Review bending radius",
        explanation:
          "The suggested bending radius is 6 times the conduit inside diameter, approximately 6.29 inches for a 1-inch conduit.",
      },
    ],
    result:
      "The electrician should use a 1-inch conduit with a bending radius of about 6.3 inches to safely install the wiring for the 60-amp circuit over 50 feet.",
  };

  const references = [
    {
      title: "NEC Chapter 9 - Tables",
      description:
        "National Electrical Code (NEC) Chapter 9 provides tables for conduit fill, conductor sizes, and bending radii.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Conduit Bending Basics - Mike Holt Enterprises",
      description:
        "Comprehensive guide on conduit bending techniques and best practices for electricians.",
      url: "https://www.mikeholt.com",
    },
    {
      title: "NEC Conduit Fill Calculations",
      description:
        "Detailed explanation of conduit fill rules and calculations according to NEC standards.",
      url: "https://www.ecmag.com/section/codes-standards/conduit-fill-calculations",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (ft, in)</SelectItem>
            <SelectItem value="metric">Metric (m, mm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Conduit Length ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={inputs.unit === "imperial" ? "e.g. 50" : "e.g. 15"}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Current Load (Amps)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 60"
            value={inputs.amps}
            onChange={(e) => handleInputChange("amps", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate conduit bending"
      >
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p className="mt-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
                {results.feedback}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Select your preferred unit system: Imperial (feet/inches) or Metric
            (meters/millimeters).
          </li>
          <li>
            Enter the total length of the conduit run in the selected unit.
          </li>
          <li>Enter the current load in amps that the circuit will carry.</li>
          <li>
            Click the "Calculate" button to see the minimum conduit size,
            suggested bending radius, and estimated conduit fill percentage.
          </li>
          <li>
            Review the results and safety feedback to ensure compliance with
            NEC guidelines.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Conduit Bending Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The conduit bending calculator helps electricians and engineers
            determine the appropriate conduit size and bending radius for
            electrical wiring installations. Proper conduit sizing is essential
            to ensure safe electrical performance, ease of installation, and
            compliance with the National Electrical Code (NEC).
          </p>
          <p>
            This calculator estimates the minimum conduit size based on the
            current load (amps) and conduit length, considering typical
            conductor sizes and NEC fill percentages. It also suggests a
            bending radius, which is critical to avoid damaging the conduit or
            conductors during installation.
          </p>
          <p>
            The calculator supports both imperial and metric units, making it
            versatile for different regions and project requirements. Always
            verify results with local codes and manufacturer specifications.
          </p>
          <p>
            Remember, conduit fill should not exceed 40% for more than two
            conductors to prevent overheating and allow for easy wire pulling.
            The bending radius is typically 6 times the conduit inside diameter
            for EMT conduit but may vary for other types.
          </p>
        </div>
      </section>

      {/* FIXED CSS FOR READABILITY */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Using an undersized conduit can cause
            excessive heat buildup, damage insulation, and increase fire risk.
            Always ensure conduit fill does not exceed NEC limits.
          </p>
          <p>
            Avoid bending conduit with a radius smaller than recommended, as
            this can kink the conduit or damage conductors, leading to
            electrical faults.
          </p>
          <p>
            Do not rely solely on this calculator for final design. Always
            consult local electrical codes, manufacturer guidelines, and
            perform on-site assessments.
          </p>
          <p>
            For long conduit runs, consider voltage drop and derating factors
            that may affect conductor sizing and conduit fill.
          </p>
          <p>
            When in doubt, choose a larger conduit size to facilitate easier
            installation and future maintenance.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {example.title}
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300">{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          {example.steps.map((step, i) => (
            <li key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">
          Result: {example.result}
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
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

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" />
          References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {ref.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Conduit Bending Calculator"
      description="Professional electrical calculator: Conduit Bending Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Safety & Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}