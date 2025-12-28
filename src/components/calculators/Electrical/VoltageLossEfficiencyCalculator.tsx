import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VoltageLossEfficiencyCalculator() {
  const [inputs, setInputs] = useState({
    voltage: "", // Supply Voltage (V)
    current: "", // Load Current (A)
    conductorLength: "", // One-way conductor length (ft or m)
    conductorSize: "", // Conductor size in AWG or mm²
    conductorMaterial: "copper", // copper or aluminum
    conductorUnit: "ft", // ft or m
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Resistivity values in ohm-cmil/ft (copper) and ohm-cmil/ft (aluminum)
  // For simplicity, we use standard resistivity constants:
  // Copper resistivity: 10.37 ohm-cmil/ft at 75°C
  // Aluminum resistivity: 17.24 ohm-cmil/ft at 75°C
  // We'll convert conductor size AWG to circular mils, or accept mm² and convert to circular mils.

  // Helper: AWG to circular mils lookup (common sizes)
  const awgToCircularMils = (awg: number) => {
    // Source: NEC and standard tables
    const table: Record<number, number> = {
      14: 4110,
      12: 6530,
      10: 10380,
      8: 16510,
      6: 26240,
      4: 41740,
      3: 52620,
      2: 66360,
      1: 83690,
      0: 105600,
      00: 133100,
      000: 167800,
      0000: 211600,
    };
    if (awg in table) return table[awg];
    return 10000; // default fallback
  };

  // Convert mm² to circular mils: 1 mm² = 1973.5 circular mils
  const mm2ToCircularMils = (mm2: number) => mm2 * 1973.5;

  // Calculate resistance per conductor length (ohms)
  // R = (resistivity * length) / circular mils
  // Length is two-way (there and back)
  // Resistivity values:
  // Copper: 10.37 ohm-cmil/ft
  // Aluminum: 17.24 ohm-cmil/ft
  // If unit is meters, convert meters to feet (1 m = 3.28084 ft)

  const results = useMemo(() => {
    const voltage = parseFloat(inputs.voltage);
    const current = parseFloat(inputs.current);
    const lengthInput = parseFloat(inputs.conductorLength);
    const conductorSizeInput = inputs.conductorSize.trim();
    const conductorMaterial = inputs.conductorMaterial;
    const conductorUnit = inputs.conductorUnit;

    if (
      isNaN(voltage) ||
      voltage <= 0 ||
      isNaN(current) ||
      current <= 0 ||
      isNaN(lengthInput) ||
      lengthInput <= 0 ||
      conductorSizeInput === ""
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Convert length to feet if needed
    const lengthFt = conductorUnit === "m" ? lengthInput * 3.28084 : lengthInput;

    // Determine circular mils from conductor size input
    // Try parse as AWG number first (integer)
    let circularMils = 0;
    const awgNumber = parseInt(conductorSizeInput, 10);
    if (!isNaN(awgNumber) && awgNumber >= 0 && awgNumber <= 14) {
      circularMils = awgToCircularMils(awgNumber);
    } else {
      // Try parse as mm²
      const mm2 = parseFloat(conductorSizeInput);
      if (!isNaN(mm2) && mm2 > 0) {
        circularMils = mm2ToCircularMils(mm2);
      } else {
        return {
          primary: "—",
          secondary: "",
          details:
            "Conductor size must be a valid AWG number (0-14) or cross-sectional area in mm².",
          feedback: "",
        };
      }
    }

    // Resistivity ohm-cmil/ft
    const resistivity = conductorMaterial === "aluminum" ? 17.24 : 10.37;

    // Total conductor length (round trip)
    const totalLengthFt = lengthFt * 2;

    // Resistance R = (resistivity * length) / circular mils
    const resistance = (resistivity * totalLengthFt) / circularMils; // ohms

    // Voltage drop = I * R
    const voltageDrop = current * resistance;

    // Voltage drop percentage
    const voltageDropPercent = (voltageDrop / voltage) * 100;

    // Efficiency = (Voltage at load / Voltage at source) * 100%
    const efficiency = ((voltage - voltageDrop) / voltage) * 100;

    // Feedback message for safety
    let feedback = "";
    if (voltageDropPercent > 5) {
      feedback =
        "Warning: Voltage drop exceeds 5%, which may cause equipment malfunction or inefficiency.";
    } else if (voltageDropPercent > 3) {
      feedback =
        "Caution: Voltage drop is between 3% and 5%. Consider upsizing conductor or reducing length.";
    } else {
      feedback = "Voltage drop is within acceptable limits.";
    }

    return {
      primary: voltageDrop.toFixed(2),
      secondary: "Volts Voltage Drop",
      details: `Voltage drop is ${voltageDropPercent.toFixed(
        2
      )}%. Efficiency is ${efficiency.toFixed(2)}%.`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is voltage drop and why is it important?",
      answer:
        "Voltage drop is the reduction in voltage in an electrical circuit between the source and the load. It occurs due to the resistance of the conductors carrying current. Excessive voltage drop can lead to inefficient operation of electrical equipment, overheating, and potential damage. Maintaining voltage drop within recommended limits ensures safety, efficiency, and compliance with electrical codes.",
    },
    {
      question: "How do I choose the correct conductor size to minimize voltage drop?",
      answer:
        "Choosing the correct conductor size involves considering the load current, conductor length, material, and acceptable voltage drop limits. Larger conductor sizes have lower resistance, reducing voltage drop. This calculator helps estimate voltage drop based on these parameters, allowing you to select an appropriate conductor size to maintain voltage drop within safe limits, typically under 3-5%.",
    },
    {
      question: "Can I use aluminum conductors instead of copper?",
      answer:
        "Yes, aluminum conductors are commonly used as a cost-effective alternative to copper. However, aluminum has higher resistivity, which results in higher voltage drop for the same conductor size and length. When using aluminum, it is often necessary to use a larger conductor size compared to copper to achieve the same voltage drop performance. Always follow local electrical codes and manufacturer recommendations.",
    },
    {
      question: "Why do I need to consider the round-trip length of the conductor?",
      answer:
        "The round-trip length accounts for the total length of the conductor from the source to the load and back. Since current flows through both the supply and return conductors, the total resistance affecting voltage drop is based on the entire circuit length. Neglecting the return path can significantly underestimate voltage drop and lead to unsafe or inefficient designs.",
    },
    {
      question: "What are the typical acceptable limits for voltage drop?",
      answer:
        "Electrical codes and industry standards typically recommend keeping voltage drop below 3% for branch circuits and 5% for total voltage drop including feeders and branch circuits combined. Staying within these limits ensures efficient operation of electrical equipment, reduces energy losses, and prevents overheating or damage to wiring and devices.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating voltage drop for a 120V residential lighting circuit with a 50A load, using 100 feet of copper conductor sized 6 AWG.",
    steps: [
      {
        label: "Step 1: Input parameters",
        explanation:
          "Supply voltage = 120 V, Load current = 50 A, Conductor length = 100 ft (one-way), Conductor size = 6 AWG, Material = Copper.",
      },
      {
        label: "Step 2: Calculate resistance",
        explanation:
          "Using copper resistivity and 6 AWG circular mils, calculate conductor resistance for 200 ft total length (round trip).",
      },
      {
        label: "Step 3: Calculate voltage drop",
        explanation:
          "Voltage drop = Current × Resistance. Calculate voltage drop in volts and percentage.",
      },
      {
        label: "Step 4: Evaluate efficiency",
        explanation:
          "Calculate efficiency as (Voltage at load / Supply voltage) × 100%.",
      },
    ],
    result:
      "The voltage drop is approximately 3.95 V (3.29%), and efficiency is 96.71%. This is within acceptable limits for residential lighting circuits.",
  };

  const references = [
    {
      title: "National Electrical Code (NEC) Article 310",
      description:
        "Provides guidelines on conductor sizing, voltage drop, and ampacity requirements.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "IEEE Std 141-1993 (Red Book)",
      description:
        "Recommended practice for electric power distribution for voltage drop calculations and conductor sizing.",
      url: "https://standards.ieee.org/standard/141-1993.html",
    },
    {
      title: "Voltage Drop Calculator - Electrical Engineering Portal",
      description:
        "Detailed explanation and formulas for voltage drop calculations in electrical circuits.",
      url: "https://electrical-engineering-portal.com/voltage-drop-calculation",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Supply Voltage (Volts, V)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 120"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Load Current (Amps, A)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
            value={inputs.current}
            onChange={(e) => handleInputChange("current", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Conductor Length (One-way)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.conductorLength}
            onChange={(e) => handleInputChange("conductorLength", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Length Unit</Label>
          <select
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2"
            value={inputs.conductorUnit}
            onChange={(e) => handleInputChange("conductorUnit", e.target.value)}
          >
            <option value="ft">Feet (ft)</option>
            <option value="m">Meters (m)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Conductor Size (AWG or mm²)</Label>
          <Input
            type="text"
            placeholder="e.g. 6 or 16"
            value={inputs.conductorSize}
            onChange={(e) => handleInputChange("conductorSize", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Conductor Material</Label>
          <select
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2"
            value={inputs.conductorMaterial}
            onChange={(e) => handleInputChange("conductorMaterial", e.target.value)}
          >
            <option value="copper">Copper</option>
            <option value="aluminum">Aluminum</option>
          </select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <Separator className="my-4" />
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{results.feedback}</p>
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
            Enter the supply voltage of your electrical system in volts (V). Typical values are 120V, 240V, etc.
          </li>
          <li>
            Input the load current in amperes (A) that the circuit will carry.
          </li>
          <li>
            Provide the one-way length of the conductor from the power source to the load in feet or meters.
          </li>
          <li>
            Specify the conductor size either as an AWG number (e.g., 6) or cross-sectional area in mm² (e.g., 16).
          </li>
          <li>
            Select the conductor material, either copper or aluminum, as this affects resistivity.
          </li>
          <li>
            Click the "Calculate" button to compute the voltage drop, voltage drop percentage, and efficiency.
          </li>
          <li>
            Review the results and feedback to ensure your design meets safety and efficiency standards.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Voltage Loss & Efficiency Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Voltage drop occurs when electrical current flows through a conductor with resistance, causing a reduction in voltage at the load end. This can lead to inefficient operation of electrical equipment, overheating of conductors, and potential safety hazards.
          </p>
          <p>
            This calculator estimates the voltage drop and efficiency of an electrical circuit based on key parameters: supply voltage, load current, conductor length, conductor size, and material. It uses standard resistivity values for copper and aluminum conductors and accounts for the round-trip length of the conductor.
          </p>
          <p>
            Maintaining voltage drop within recommended limits (typically below 3-5%) is critical for compliance with electrical codes and ensuring reliable operation of electrical devices. Oversized conductors reduce voltage drop but increase cost, so this tool helps balance safety, efficiency, and economy.
          </p>
          <p>
            Always verify your calculations with local electrical codes and consult a licensed electrician or engineer for complex or critical installations.
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
            <strong>Warning:</strong> Ignoring voltage drop can cause electrical equipment to malfunction or fail prematurely. Always ensure voltage drop stays within recommended limits.
          </p>
          <p>
            A common mistake is to neglect the return conductor length, which doubles the effective conductor length and resistance, leading to underestimating voltage drop.
          </p>
          <p>
            Using incorrect conductor size or material resistivity values can result in inaccurate calculations. Always verify conductor specifications and units.
          </p>
          <p>
            Do not rely solely on this calculator for critical or high-power installations. Consult local electrical codes and a qualified professional.
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
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Voltage Loss & Efficiency Calculator"
      description="Professional electrical calculator: Voltage Loss & Efficiency Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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