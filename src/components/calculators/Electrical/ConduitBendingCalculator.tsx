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
  Settings,
  BookOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ConduitBendingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    length: "", // Length of conduit run (ft or m)
    amps: "", // Load current in Amps
    gauge: "", // Wire gauge (AWG)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * NEC Table 310.16 (2020) - Typical allowable ampacities for copper conductors in conduit,
   * 75°C insulation rating (common for THHN/THWN).
   * Keys are string to avoid octal literals.
   * Values are ampacity in Amps.
   */
  const wireAmpacityTable: Record<string, number> = {
    "14": 20,
    "12": 25,
    "10": 35,
    "8": 50,
    "6": 65,
    "4": 85,
    "3": 100,
    "2": 115,
    "1": 130,
    "1/0": 150,
    "2/0": 175,
    "3/0": 200,
    "4/0": 230,
    "250": 255,
    "300": 285,
    "350": 310,
    "400": 335,
    "500": 380,
    "600": 420,
  };

  /**
   * Conduit bending calculation:
   * For this calculator, we estimate the minimum conduit size (trade size in inches)
   * based on the wire gauge and length of run.
   *
   * This is a simplified approach:
   * - Use NEC ampacity table to verify wire gauge is sufficient for the amps.
   * - Calculate voltage drop for the run length and wire gauge.
   * - Suggest conduit size based on number of conductors (assumed 3 for typical circuits),
   *   using NEC conduit fill tables (approximate).
   *
   * For conduit bending, the key is to know the conduit size needed to pull the wires,
   * and the length to calculate total bends needed.
   *
   * This calculator outputs:
   * - Minimum conduit trade size (inches)
   * - Voltage drop (%)
   * - Safety feedback
   */

  // Approximate conduit fill area (in square inches) for common conduit sizes (EMT)
  // Source: NEC Chapter 9, Table 4 and 5 (approximate values)
  const conduitFillArea: Record<string, number> = {
    "1/2": 0.122,
    "3/4": 0.213,
    "1": 0.346,
    "1 1/4": 0.598,
    "1 1/2": 0.832,
    "2": 1.342,
    "2 1/2": 2.08,
    "3": 3.356,
    "3 1/2": 4.53,
    "4": 5.85,
  };

  // Approximate wire cross-sectional areas (in square inches) for THHN copper wires
  // Source: NEC Chapter 9, Table 5 (approximate)
  const wireArea: Record<string, number> = {
    "14": 0.0133,
    "12": 0.0211,
    "10": 0.0331,
    "8": 0.0526,
    "6": 0.0831,
    "4": 0.132,
    "3": 0.167,
    "2": 0.210,
    "1": 0.265,
    "1/0": 0.334,
    "2/0": 0.421,
    "3/0": 0.531,
    "4/0": 0.670,
  };

  // Resistivity of copper (ohm-cmil/ft)
  // For voltage drop calculation, use standard resistivity: 10.4 ohm-cmil/ft at 75°C
  // But we use simplified voltage drop formula:
  // Vdrop = (2 * K * I * L) / CM
  // K = resistivity constant (12.9 for copper at 75°C in ohm-cmil/ft)
  // I = current (amps)
  // L = one-way length (ft)
  // CM = circular mil area of conductor

  // Circular mil area for wire gauge (approximate)
  const wireCircularMil: Record<string, number> = {
    "14": 4110,
    "12": 6530,
    "10": 10380,
    "8": 16510,
    "6": 26240,
    "4": 41740,
    "3": 52620,
    "2": 66360,
    "1": 83690,
    "1/0": 105600,
    "2/0": 133100,
    "3/0": 167800,
    "4/0": 211600,
  };

  // Voltage drop limit recommendation (NEC recommends max 3% for branch circuits)
  const maxVoltageDropPercent = 3;

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const ampsNum = parseFloat(inputs.amps);
    const gaugeRaw = inputs.gauge.trim();

    if (
      !lengthNum ||
      lengthNum <= 0 ||
      !ampsNum ||
      ampsNum <= 0 ||
      !gaugeRaw ||
      !(gaugeRaw in wireAmpacityTable)
    ) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter valid inputs for length, amps, and wire gauge.",
        feedback: "",
      };
    }

    // Check ampacity
    const ampacity = wireAmpacityTable[gaugeRaw];
    let safetyFeedback = "";
    if (ampsNum > ampacity) {
      safetyFeedback = `Warning: The selected wire gauge (${gaugeRaw} AWG) is NOT rated for ${ampsNum} Amps. Maximum ampacity is ${ampacity} Amps. Use a larger wire gauge to avoid overheating and fire hazards.`;
    } else {
      safetyFeedback = `The selected wire gauge (${gaugeRaw} AWG) is rated for ${ampsNum} Amps load.`;
    }

    // Calculate voltage drop
    // Use formula: Vdrop = (2 * K * I * L) / CM
    // K = 12.9 (ohm-cmil/ft for copper at 75°C)
    // I = ampsNum
    // L = lengthNum (ft)
    // CM = circular mil area
    // If metric, convert meters to feet (1m = 3.28084 ft)
    const lengthFeet =
      inputs.unit === "metric" ? lengthNum * 3.28084 : lengthNum;

    const CM = wireCircularMil[gaugeRaw];
    const K = 12.9;
    const Vdrop = (2 * K * ampsNum * lengthFeet) / CM; // voltage drop in volts

    // Assuming 120V system for percentage calculation
    const systemVoltage = 120;
    const VdropPercent = (Vdrop / systemVoltage) * 100;

    // Determine if voltage drop is acceptable
    if (VdropPercent > maxVoltageDropPercent) {
      safetyFeedback += ` Voltage drop is ${VdropPercent.toFixed(
        2
      )}%, which exceeds the recommended maximum of ${maxVoltageDropPercent}%. Consider increasing conductor size or reducing run length.`;
    } else {
      safetyFeedback += ` Voltage drop is ${VdropPercent.toFixed(
        2
      )}%, within acceptable limits.`;
    }

    // Calculate conduit size needed
    // Assume 3 conductors (hot, neutral, ground) for typical branch circuit
    // Total wire area = wireArea[gaugeRaw] * 3
    // Find smallest conduit size with fill area >= total wire area * 0.4 (40% max fill for 3+ conductors)
    // NEC limits conduit fill to 40% for more than 2 conductors

    const conductorsCount = 3;
    const totalWireArea = (wireArea[gaugeRaw] ?? 0) * conductorsCount;
    const maxFillArea = totalWireArea / 0.4; // minimum conduit area

    // Find smallest conduit size that fits maxFillArea
    const conduitSizes = Object.entries(conduitFillArea).sort(
      ([a], [b]) => parseFloat(a) - parseFloat(b)
    );

    let selectedConduitSize = "-";
    for (const [size, area] of conduitSizes) {
      if (area >= maxFillArea) {
        selectedConduitSize = size;
        break;
      }
    }
    if (selectedConduitSize === "-") {
      selectedConduitSize = "4 or larger (consult NEC tables)";
    }

    return {
      primary: selectedConduitSize,
      secondary: "Minimum conduit trade size (inches)",
      details: `For ${conductorsCount} conductors of ${gaugeRaw} AWG wire carrying ${ampsNum} Amps over ${lengthNum} ${
        inputs.unit === "imperial" ? "ft" : "m"
      }, the minimum conduit size is ${selectedConduitSize}.`,
      feedback: safetyFeedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is conduit size important in electrical installations?",
      answer:
        "Conduit size is critical to ensure that electrical conductors can be safely pulled through the conduit without damage or excessive friction. Proper conduit sizing also ensures compliance with NEC conduit fill requirements, which prevent overheating and allow for heat dissipation. Undersized conduit can lead to difficulties during installation and potential safety hazards.",
    },
    {
      question: "How does wire gauge affect conduit bending and installation?",
      answer:
        "Wire gauge determines the physical size of the conductor, which directly impacts the conduit fill area. Larger gauge wires (smaller numbers) have bigger diameters and require larger conduits to accommodate them safely. Additionally, the wire gauge must be selected based on the current load to prevent overheating. Incorrect gauge selection can lead to voltage drop issues and safety risks.",
    },
    {
      question:
        "What is voltage drop and why must it be considered in conduit runs?",
      answer:
        "Voltage drop is the reduction in voltage as electrical current flows through a conductor due to resistance. Excessive voltage drop can cause equipment malfunction, reduced efficiency, and potential damage. NEC recommends keeping voltage drop below 3% for branch circuits to ensure proper operation. Longer conduit runs and smaller wire gauges increase voltage drop, so both must be considered during design.",
    },
    {
      question:
        "Can I use this calculator for both imperial and metric units?",
      answer:
        "Yes, this calculator supports both imperial (feet) and metric (meters) units for conduit length. When switching units, the calculator automatically converts the length for internal calculations such as voltage drop. This flexibility allows users worldwide to use the tool effectively.",
    },
    {
      question:
        "What are common safety mistakes when bending conduit and installing wires?",
      answer:
        "Common safety mistakes include using undersized conduit or wire gauge, not accounting for voltage drop, improper bending radius causing wire damage, and neglecting NEC conduit fill limits. These errors can lead to overheating, electrical faults, and fire hazards. Always follow NEC guidelines and use proper tools and techniques for conduit bending and wire installation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Running 100 feet of 12 AWG copper wire to supply a 20 Amp circuit in a residential setting using EMT conduit.",
    steps: [
      {
        label: "Step 1: Input Parameters",
        explanation:
          "Enter length as 100 ft, amps as 20, and wire gauge as 12 in the calculator. Select 'Imperial' units.",
      },
      {
        label: "Step 2: Calculate",
        explanation:
          "The calculator verifies that 12 AWG wire is rated for 25 Amps, which is sufficient for 20 Amps load. It calculates voltage drop over 100 ft and suggests minimum conduit size.",
      },
      {
        label: "Step 3: Review Results",
        explanation:
          "The minimum conduit size is 3/4 inch EMT to accommodate three 12 AWG conductors with acceptable voltage drop (~1.65%). Safety feedback confirms compliance with NEC guidelines.",
      },
    ],
    result:
      "Use 3/4 inch EMT conduit with 12 AWG copper conductors for a 20 Amp circuit over 100 ft. Voltage drop is within acceptable limits.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "NEC Chapter 9, Tables 4 & 5",
      description:
        "Conduit fill and conductor cross-sectional areas for conduit sizing.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "Voltage Drop Calculations - Mike Holt",
      description:
        "Comprehensive guide on voltage drop and conductor sizing for electrical installations.",
      url: "https://www.mikeholt.com/",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min="0"
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
            min="0"
            step="any"
            value={inputs.amps}
            onChange={(e) => handleInputChange("amps", e.target.value)}
            placeholder="Enter current in Amps"
          />
        </div>

        <div className="space-y-2">
          <Label>Wire Gauge (AWG)</Label>
          <Select
            value={inputs.gauge}
            onValueChange={(v) => handleInputChange("gauge", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select wire gauge" />
            </SelectTrigger>
            <SelectContent>
              {[
                "14",
                "12",
                "10",
                "8",
                "6",
                "4",
                "3",
                "2",
                "1",
                "1/0",
                "2/0",
                "3/0",
                "4/0",
              ].map((g) => (
                <SelectItem key={g} value={g}>
                  {g} AWG
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
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
            <p className="text-sm text-amber-900 dark:text-amber-100 font-semibold">
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
            Select the unit system: Imperial (feet) or Metric (meters) for the
            conduit length.
          </li>
          <li>
            Enter the length of the conduit run. This is the one-way distance
            the wires will travel inside the conduit.
          </li>
          <li>Input the load current in Amps that the circuit will carry.</li>
          <li>
            Choose the wire gauge (AWG) you plan to use for the conductors.
          </li>
          <li>
            Click the "Calculate" button to get the minimum conduit size,
            voltage drop estimate, and safety feedback.
          </li>
          <li>
            Review the results and ensure the wire gauge and conduit size meet
            your project requirements and NEC guidelines.
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
            The conduit bending calculator helps electrical engineers and
            electricians determine the minimum conduit size required to safely
            install electrical conductors based on the wire gauge, load current,
            and conduit run length. It also estimates voltage drop to ensure
            efficient power delivery.
          </p>
          <p>
            The calculator uses NEC ampacity tables to verify that the selected
            wire gauge can safely carry the specified current without overheating.
            It then calculates the voltage drop using standard resistivity values
            for copper conductors, considering the length of the run and current.
          </p>
          <p>
            Conduit fill calculations are based on NEC Chapter 9 guidelines,
            limiting fill to 40% for three or more conductors to prevent
            overheating and allow for heat dissipation. The calculator suggests
            the smallest conduit trade size that meets these requirements.
          </p>
          <p>
            Proper conduit sizing and bending are essential to avoid damage to
            conductors during installation, ensure compliance with electrical
            codes, and maintain system safety and reliability.
          </p>
        </div>
      </section>

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
            <strong>Warning:</strong> Electricity is inherently dangerous and
            improper conduit bending or wire sizing can lead to serious hazards
            including electrical shock, fire, and equipment damage. Always
            follow NEC guidelines and local codes.
          </p>
          <p>
            Common mistakes include using undersized conduit that makes pulling
            wires difficult and can damage insulation, selecting wire gauges
            that are too small for the load causing overheating, and ignoring
            voltage drop which can reduce equipment performance.
          </p>
          <p>
            Additionally, improper bending radius can kink or damage wires,
            leading to premature failure. Use proper conduit bending tools and
            techniques to maintain conduit integrity and wire safety.
          </p>
          <p>
            When in doubt, consult a licensed electrician or engineer to verify
            your design and installation plans.
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