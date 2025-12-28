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

export default function ConduitFillCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    length: "",
    amps: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /*
   * LOGIC:
   * 1. From amps, determine wire size (AWG) and insulation type (assume THHN).
   * 2. From wire size, get conductor diameter.
   * 3. Calculate conduit fill % and minimum conduit size.
   *
   * NEC conduit fill tables and wire sizes are complex, but for this calculator,
   * we will use a simplified approach:
   *
   * - Determine minimum wire size for given amps (THHN copper, 75°C column).
   * - Use NEC Chapter 9, Table 5 for conductor diameters (approximate).
   * - Use NEC Chapter 9, Table 4 for conduit fill percentages (max 40% for more than 2 wires).
   * - Calculate total cross-sectional area of conductors.
   * - Determine minimum conduit size (trade size) that can fit the wires.
   *
   * For simplicity, assume 3 conductors (hot, neutral, ground).
   * Ground conductor size is smaller, but to be conservative, use same size for all.
   */

  // Wire ampacity reference (THHN copper, 75°C)
  // Source: NEC 310.15(B)(16) simplified common sizes
  // amps: wire size AWG
  const ampacityTable: { amps: number; awg: number; diameterInches: number }[] = [
    { amps: 15, awg: 14, diameterInches: 0.0641 },
    { amps: 20, awg: 12, diameterInches: 0.0808 },
    { amps: 30, awg: 10, diameterInches: 0.1019 },
    { amps: 40, awg: 8, diameterInches: 0.1285 },
    { amps: 55, awg: 6, diameterInches: 0.1620 },
    { amps: 75, awg: 4, diameterInches: 0.2043 },
    { amps: 95, awg: 3, diameterInches: 0.2294 },
    { amps: 115, awg: 2, diameterInches: 0.2576 },
    { amps: 130, awg: 1, diameterInches: 0.2893 },
    { amps: 150, awg: 1 / 0, diameterInches: 0.3249 }, // 1/0 AWG
    { amps: 170, awg: 2 / 0, diameterInches: 0.3648 }, // 2/0 AWG
    { amps: 195, awg: 3 / 0, diameterInches: 0.4096 }, // 3/0 AWG
    { amps: 225, awg: 4 / 0, diameterInches: 0.4600 }, // 4/0 AWG
  ];

  // Conduit trade sizes and their approximate internal cross-sectional areas (in²)
  // Source: NEC Chapter 9, Table 4 (approximate values for EMT conduit)
  const conduitTable: { tradeSize: string; areaInSqIn: number }[] = [
    { tradeSize: "1/2\"", areaInSqIn: 0.303 },
    { tradeSize: "3/4\"", areaInSqIn: 0.533 },
    { tradeSize: "1\"", areaInSqIn: 0.864 },
    { tradeSize: "1 1/4\"", areaInSqIn: 1.496 },
    { tradeSize: "1 1/2\"", areaInSqIn: 1.876 },
    { tradeSize: "2\"", areaInSqIn: 2.598 },
    { tradeSize: "2 1/2\"", areaInSqIn: 4.026 },
    { tradeSize: "3\"", areaInSqIn: 5.832 },
    { tradeSize: "3 1/2\"", areaInSqIn: 7.815 },
    { tradeSize: "4\"", areaInSqIn: 9.864 },
  ];

  // Calculate cross-sectional area of a conductor (circle area)
  // diameter in inches
  function conductorArea(diameter: number) {
    const radius = diameter / 2;
    return Math.PI * radius * radius;
  }

  // Find minimum wire size for given amps
  function getWireInfo(amps: number) {
    // Find first entry with amps >= input amps
    for (let i = 0; i < ampacityTable.length; i++) {
      if (amps <= ampacityTable[i].amps) {
        return ampacityTable[i];
      }
    }
    // If amps too high, return largest wire available
    return ampacityTable[ampacityTable.length - 1];
  }

  // Find minimum conduit size that fits total conductor area with max 40% fill
  function getConduitSize(totalArea: number) {
    for (let i = 0; i < conduitTable.length; i++) {
      const maxFillArea = conduitTable[i].areaInSqIn * 0.4;
      if (maxFillArea >= totalArea) return conduitTable[i];
    }
    // If none fits, return null
    return null;
  }

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const ampsNum = parseFloat(inputs.amps);

    if (!lengthNum || lengthNum <= 0 || !ampsNum || ampsNum <= 0) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for length and amps.",
        feedback: "",
      };
    }

    // Get wire info for amps
    const wire = getWireInfo(ampsNum);

    // Number of conductors: 3 (hot, neutral, ground)
    const conductorCount = 3;

    // Calculate total conductor area
    const singleArea = conductorArea(wire.diameterInches);
    const totalArea = singleArea * conductorCount;

    // Find conduit size
    const conduit = getConduitSize(totalArea);

    // Calculate conduit fill percentage for chosen conduit
    let fillPercent = 0;
    if (conduit) {
      fillPercent = (totalArea / conduit.areaInSqIn) * 100;
    }

    // Convert length to meters if metric
    const lengthDisplay =
      inputs.unit === "metric"
        ? `${(lengthNum * 0.3048).toFixed(2)} m`
        : `${lengthNum.toFixed(2)} ft`;

    // Feedback safety check
    let feedback = "";
    if (!conduit) {
      feedback =
        "Warning: Required conduit size exceeds 4\" trade size. Consult NEC or use multiple conduits.";
    } else if (fillPercent > 40) {
      feedback =
        "Warning: Conduit fill exceeds 40%, which is the NEC maximum for more than 2 conductors.";
    } else {
      feedback = "Conduit fill is within NEC limits.";
    }

    return {
      primary: conduit ? conduit.tradeSize : "N/A",
      secondary: "Minimum Conduit Size",
      details: `For ${ampsNum} amps and ${lengthDisplay}, use ${conductorCount} THHN copper conductors of size AWG ${wire.awg} (diameter ${wire.diameterInches.toFixed(
        3
      )}" each). Total conductor area: ${totalArea.toFixed(
        3
      )} in². Conduit fill: ${fillPercent.toFixed(1)}%.`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does conduit fill affect electrical safety?",
      answer:
        "Conduit fill is critical to ensure that wires have enough space for heat dissipation and to prevent damage during installation. Overfilling a conduit can cause overheating, insulation damage, and potential fire hazards. The NEC limits conduit fill to a maximum of 40% for more than two conductors to maintain safety and performance. Always adhere to these limits to ensure compliance and safety.",
    },
    {
      question: "Why do we assume three conductors for conduit fill calculations?",
      answer:
        "In typical branch circuit wiring, three conductors are used: hot, neutral, and ground. This assumption simplifies calculations and ensures conservative sizing. While some installations may have different conductor counts, using three conductors provides a safe baseline for conduit sizing. Adjustments may be necessary for specific applications or conduit fill rules.",
    },
    {
      question: "Can I use a conduit size smaller than the calculator's recommendation?",
      answer:
        "Using a conduit smaller than recommended can lead to excessive conduit fill, making wire pulling difficult and risking damage to the conductors. It may also violate NEC requirements, leading to inspection failures and safety hazards. Always follow the minimum conduit size recommendations based on conductor sizes and counts to ensure compliance and safe installation.",
    },
    {
      question: "Does the calculator consider voltage drop over the conduit length?",
      answer:
        "No, this calculator focuses solely on conduit fill and minimum conduit size based on ampacity and conductor size. Voltage drop depends on conductor length, size, and load current and requires separate calculations. For long runs, voltage drop calculations should be performed to ensure proper voltage at the load and may influence conductor sizing.",
    },
    {
      question: "Why is the conduit fill limit set at 40% for more than two conductors?",
      answer:
        "The NEC sets the 40% conduit fill limit to allow sufficient space for heat dissipation and ease of wire pulling. More than two conductors generate more heat and increase friction during installation, so the reduced fill percentage helps maintain safe operating temperatures and prevents damage. This limit is a balance between practical installation and electrical safety.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "An electrician needs to install wiring for a 40-amp circuit in a residential home. The conduit run length is 50 feet, and the wiring will use THHN copper conductors.",
    steps: [
      {
        label: "Step 1: Determine wire size",
        explanation:
          "For 40 amps, the minimum wire size is AWG 8 according to NEC ampacity tables.",
      },
      {
        label: "Step 2: Calculate conductor area",
        explanation:
          "Each AWG 8 conductor has a diameter of approximately 0.1285 inches, resulting in a cross-sectional area of about 0.013 square inches.",
      },
      {
        label: "Step 3: Calculate total conductor area",
        explanation:
          "Assuming 3 conductors (hot, neutral, ground), total area is 3 × 0.013 = 0.039 square inches.",
      },
      {
        label: "Step 4: Select conduit size",
        explanation:
          "The minimum conduit size that can accommodate this area at 40% fill is 3/4 inch EMT conduit (0.533 in² internal area).",
      },
    ],
    result:
      "Use a 3/4 inch conduit for the 40-amp circuit over 50 feet with 3 AWG 8 conductors, ensuring compliance with NEC conduit fill limits.",
  };

  const references = [
    {
      title: "NEC Chapter 9 Tables",
      description:
        "National Electrical Code (NEC) Chapter 9 contains tables for conductor sizes, conduit fill, and ampacity ratings.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Conduit Fill Calculations - Mike Holt",
      description:
        "Detailed explanations and examples of conduit fill calculations by electrical expert Mike Holt.",
      url: "https://www.mikeholt.com",
    },
    {
      title: "NEC Ampacity Tables",
      description:
        "Official NEC ampacity tables for conductor sizing based on insulation type and temperature rating.",
      url: "https://www.nfpa.org/nec",
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
            <SelectItem value="imperial">Imperial (ft)</SelectItem>
            <SelectItem value="metric">Metric (m)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`Enter length in ${inputs.unit === "imperial" ? "feet" : "meters"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Load Current (Amps)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.amps}
            onChange={(e) => handleInputChange("amps", e.target.value)}
            placeholder="Enter current in amps"
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate conduit fill"
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
            <Separator className="my-4" />
            <p
              className={`text-sm font-semibold ${
                results.feedback.startsWith("Warning")
                  ? "text-amber-900 dark:text-amber-400"
                  : "text-green-700 dark:text-green-400"
              }`}
            >
              {results.feedback}
            </p>
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
            Select the unit system you want to use: Imperial (feet) or Metric
            (meters).
          </li>
          <li>
            Enter the length of the conduit run in the selected unit.
          </li>
          <li>
            Enter the load current in amps that the circuit will carry.
          </li>
          <li>
            Click the "Calculate" button to determine the minimum conduit size
            required based on NEC conduit fill rules.
          </li>
          <li>
            Review the results, including recommended conduit size, conductor
            size, and safety feedback.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Conduit
          Fill Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The conduit fill calculator helps electricians and engineers
            determine the minimum conduit size required to safely house
            electrical conductors based on the load current and conduit length.
            It uses NEC guidelines to ensure compliance and safety.
          </p>
          <p>
            The calculator assumes THHN copper conductors and a typical setup of
            three conductors (hot, neutral, and ground). It selects the minimum
            wire gauge based on the load current and calculates the total cross
            sectional area of the conductors.
          </p>
          <p>
            Using NEC Chapter 9 conduit fill tables, it then determines the
            smallest conduit trade size that can accommodate the conductors
            without exceeding the 40% fill limit for more than two conductors.
          </p>
          <p>
            This approach ensures that the conduit is not overfilled, which can
            cause overheating, difficulty pulling wires, and potential damage to
            insulation.
          </p>
          <p>
            Always verify your installation with local codes and inspectors, as
            some jurisdictions may have additional requirements or amendments to
            the NEC.
          </p>
        </div>
      </section>

      {/* FIXED CSS FOR READABILITY */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Overfilling conduits beyond NEC limits can
            cause excessive heat buildup, damaging wire insulation and creating
            fire hazards. Always adhere to the 40% fill limit for more than two
            conductors.
          </p>
          <p>
            Avoid using conduit sizes smaller than recommended by this calculator,
            as it can make wire pulling difficult and may violate electrical
            codes.
          </p>
          <p>
            Remember that conduit fill calculations do not replace voltage drop
            calculations. For long runs, voltage drop must be considered to
            ensure proper circuit performance.
          </p>
          <p>
            Always use the correct wire insulation type and temperature rating
            for your application, as this affects ampacity and conduit fill
            requirements.
          </p>
          <p>
            Consult local electrical codes and inspectors for any amendments or
            additional requirements beyond the NEC.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-3">
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p>
            <strong>Result:</strong> {example.result}
          </p>
        </div>
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
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
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
      title="Conduit Fill Calculator"
      description="Professional electrical calculator: Conduit Fill Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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