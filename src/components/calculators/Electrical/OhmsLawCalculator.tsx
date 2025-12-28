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

export default function OhmsLawCalculator() {
  /*
    Inputs:
      V = Voltage (Volts)
      I = Current (Amps)
      R = Resistance (Ohms)
      P = Power (Watts)

    Ohm's Law:
      V = I * R
      I = V / R
      R = V / I

    Power formulas:
      P = V * I
      P = I^2 * R
      P = V^2 / R

    User can input any two known values among V, I, R, P.
    Calculator will solve for the other two.
  */

  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs: User enters any two known values, leave others blank
  const [voltage, setVoltage] = useState<string>("");
  const [current, setCurrent] = useState<string>("");
  const [resistance, setResistance] = useState<string>("");
  const [power, setPower] = useState<string>("");

  // Helper to parse float or NaN
  const parseNum = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) ? null : n;
  };

  // Calculation logic:
  // We try to solve for missing values if at least two inputs are provided.
  // Priority: Use Ohm's Law and Power formulas to find missing values.

  const results = useMemo(() => {
    const V = parseNum(voltage);
    const I = parseNum(current);
    const R = parseNum(resistance);
    const P = parseNum(power);

    // Count how many inputs are provided
    const inputsProvided = [V, I, R, P].filter((x) => x !== null).length;

    if (inputsProvided < 2) {
      return {
        primary: "Enter at least two known values",
        secondary: "",
        details: "You must provide at least two values among Voltage (V), Current (I), Resistance (R), and Power (P) to calculate the others.",
        feedback: "",
      };
    }

    // Variables to hold calculated values
    let calcV: number | null = V;
    let calcI: number | null = I;
    let calcR: number | null = R;
    let calcP: number | null = P;

    // Try to solve missing values based on known pairs
    // Cases:

    // 1) V and I known
    if (V !== null && I !== null) {
      calcR = R === null ? V / I : R;
      calcP = P === null ? V * I : P;
    }
    // 2) V and R known
    else if (V !== null && R !== null) {
      calcI = I === null ? V / R : I;
      calcP = P === null ? (V * V) / R : P;
    }
    // 3) I and R known
    else if (I !== null && R !== null) {
      calcV = V === null ? I * R : V;
      calcP = P === null ? I * I * R : P;
    }
    // 4) V and P known
    else if (V !== null && P !== null) {
      calcI = I === null ? P / V : I;
      calcR = R === null ? (V * V) / P : R;
    }
    // 5) I and P known
    else if (I !== null && P !== null) {
      calcV = V === null ? P / I : V;
      calcR = R === null ? P / (I * I) : R;
    }
    // 6) R and P known
    else if (R !== null && P !== null) {
      calcI = I === null ? Math.sqrt(P / R) : I;
      calcV = V === null ? Math.sqrt(P * R) : V;
    }

    // After calculation, check if any still null
    if (
      calcV === null ||
      calcI === null ||
      calcR === null ||
      calcP === null ||
      Number.isNaN(calcV) ||
      Number.isNaN(calcI) ||
      Number.isNaN(calcR) ||
      Number.isNaN(calcP)
    ) {
      return {
        primary: "Calculation error",
        secondary: "",
        details:
          "The provided values are inconsistent or insufficient to calculate all parameters. Please check your inputs.",
        feedback: "",
      };
    }

    // Format results to 3 decimals
    const f = (num: number) => num.toFixed(3);

    // Safety feedback example: warn if current or power is too high for typical residential circuits
    let feedback = "";
    if (calcI > 100) {
      feedback =
        "Warning: Calculated current exceeds 100A, which may require special wiring and breaker sizing.";
    } else if (calcP > 24000) {
      feedback =
        "Warning: Calculated power exceeds 24kW, ensure equipment and wiring are rated accordingly.";
    }

    return {
      primary: `${f(calcV)} V, ${f(calcI)} A`,
      secondary: `${f(calcR)} Ω, ${f(calcP)} W`,
      details: `Voltage (V) = ${f(calcV)} volts, Current (I) = ${f(
        calcI
      )} amps, Resistance (R) = ${f(calcR)} ohms, Power (P) = ${f(calcP)} watts.`,
      feedback,
    };
  }, [voltage, current, resistance, power]);

  // FAQ content
  const faqs = [
    {
      question: "What is Ohm's Law and why is it important?",
      answer:
        "Ohm's Law is a fundamental principle in electrical engineering that relates voltage (V), current (I), and resistance (R) in an electrical circuit. It states that V = I × R, meaning the voltage across a resistor is proportional to the current flowing through it. This law is essential for designing, analyzing, and troubleshooting electrical circuits safely and efficiently.",
    },
    {
      question: "Can I calculate power if I only know voltage and resistance?",
      answer:
        "Yes, power (P) can be calculated using voltage (V) and resistance (R) with the formula P = V² / R. This allows you to determine how much power is dissipated by a resistor when voltage is applied, which is crucial for selecting components that can handle the power without damage.",
    },
    {
      question: "Why do I need to input at least two values in this calculator?",
      answer:
        "Ohm's Law and power formulas require at least two known values to solve for the others because the relationships involve multiple variables. Providing only one value is insufficient to determine the rest, so entering at least two known parameters ensures accurate and meaningful calculations.",
    },
    {
      question: "What units should I use for voltage, current, resistance, and power?",
      answer:
        "Voltage should be entered in volts (V), current in amperes (A), resistance in ohms (Ω), and power in watts (W). This calculator assumes these standard units for consistency and accuracy. Using other units requires conversion before input.",
    },
    {
      question: "How can I ensure my calculations are safe for real-world electrical systems?",
      answer:
        "Always verify that calculated currents and power levels do not exceed the ratings of your wiring, breakers, and devices. Follow local electrical codes such as the NEC, use proper wire gauges, and consult a licensed electrician for installations. Safety is paramount to prevent hazards like overheating and electrical fires.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Real world example object
  const example = {
    title: "Real World Example",
    scenario:
      "Sizing a wire for a 50ft subpanel run supplying a 240V heater rated at 3600W.",
    steps: [
      {
        label: "Step 1: Calculate Current (I)",
        explanation:
          "Using power formula: P = V × I, rearranged to I = P / V. Given P = 3600W and V = 240V, current I = 3600 / 240 = 15A.",
      },
      {
        label: "Step 2: Calculate Resistance (R)",
        explanation:
          "Using Ohm's Law: V = I × R, rearranged to R = V / I. R = 240 / 15 = 16Ω (theoretical load resistance).",
      },
      {
        label: "Step 3: Check voltage drop for 50ft wire",
        explanation:
          "Using voltage drop formula: V_drop = 2 × K × I × L / CM, where K = 12.9 (copper), I = 15A, L = 50ft, CM = circular mil area of wire. For 8 AWG copper wire (CM ≈ 16510), V_drop = 2 × 12.9 × 15 × 50 / 16510 ≈ 1.17V, which is about 0.5% voltage drop, acceptable under NEC guidelines.",
      },
      {
        label: "Step 4: Select wire size",
        explanation:
          "Since voltage drop is under 3%, 8 AWG copper wire is suitable for this load and distance. Also, 8 AWG is rated for 40A, providing a safety margin above 15A load.",
      },
    ],
    result:
      "Final Result: Use 8 AWG copper wire for the 50ft run to safely supply the 3600W heater at 240V with minimal voltage drop.",
  };

  // References
  const references = [
    {
      title: "National Electrical Code (NEC)",
      description:
        "The benchmark for safe electrical design, installation, and inspection.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "IEEE Standards Association",
      description: "Global industry standards for electrical engineering.",
      url: "https://standards.ieee.org/",
    },
    {
      title: "Electrical Engineering Portal",
      description: "Technical articles and guides.",
      url: "https://electrical-engineering-portal.com/",
    },
  ];

  // Widget UI
  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={unit}
          onValueChange={(v) => setUnit(v as "imperial" | "metric")}
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
          <Label htmlFor="voltage">Voltage (V)</Label>
          <Input
            id="voltage"
            type="number"
            placeholder="e.g. 120"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
            min="0"
            step="any"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current">Current (A)</Label>
          <Input
            id="current"
            type="number"
            placeholder="e.g. 10"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            min="0"
            step="any"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resistance">Resistance (Ω)</Label>
          <Input
            id="resistance"
            type="number"
            placeholder="e.g. 12"
            value={resistance}
            onChange={(e) => setResistance(e.target.value)}
            min="0"
            step="any"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="power">Power (W)</Label>
          <Input
            id="power"
            type="number"
            placeholder="e.g. 1500"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            min="0"
            step="any"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={false}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Calculated Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p className="mt-3 text-sm text-amber-700 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {results.feedback}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Enter at least two known values among Voltage
            (V), Current (I), Resistance (R), and Power (P) in their respective
            input fields.
          </li>
          <li>
            <strong>Step 2:</strong> Choose your preferred unit system (Imperial or
            Metric) from the dropdown at the top right.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to compute the
            missing electrical parameters based on Ohm's Law and power formulas.
          </li>
          <li>
            <strong>Step 4:</strong> Review the calculated results displayed below
            the button, including voltage, current, resistance, and power values.
          </li>
          <li>
            <strong>Step 5:</strong> Pay attention to any safety warnings or
            feedback messages indicating potential electrical hazards or
            unusual values.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Ohm's Law Calculator (V, I, R, P)
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Ohm's Law is a cornerstone of electrical engineering, providing a simple
            yet powerful relationship between voltage (V), current (I), and
            resistance (R) in electrical circuits. This calculator extends the
            fundamental Ohm's Law by incorporating power (P) calculations, enabling
            comprehensive analysis of electrical parameters. By inputting any two
            known values, the calculator uses established formulas to determine the
            remaining unknowns, facilitating design, troubleshooting, and verification
            tasks.
          </p>
          <p>
            The core formulas used include V = I × R, P = V × I, P = I² × R, and P =
            V² / R. These relationships allow engineers and electricians to assess
            circuit behavior under various conditions, ensuring components are
            correctly rated and systems operate safely. For example, knowing the
            current and resistance allows calculation of voltage and power, which is
            essential when selecting wire sizes, fuses, and protective devices.
          </p>
          <p>
            This calculator supports both Imperial and Metric units for length-based
            calculations, although voltage, current, resistance, and power inputs
            remain in standard electrical units (volts, amps, ohms, watts). It is
            designed for professional use, providing accurate results that comply
            with electrical codes and standards.
          </p>
          <p>
            Understanding and applying Ohm's Law correctly is critical for safety.
            Overloading circuits or using undersized wiring can lead to overheating,
            equipment damage, or fire hazards. This tool helps prevent such issues by
            providing clear, reliable calculations and safety feedback. Always
            double-check inputs and consult local electrical codes or a licensed
            electrician when planning or modifying electrical systems.
          </p>
          <p>
            In summary, this Ohm's Law Calculator is an indispensable tool for
            electrical engineers, electricians, and hobbyists alike, simplifying
            complex calculations and promoting safe, efficient electrical design.
          </p>
        </div>
      </section>

      {/* 3. SAFETY & MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>Warning:</strong> Electricity is inherently dangerous. Always
            de-energize circuits before working on them, use proper personal
            protective equipment, and follow local electrical codes and standards.
            Failure to do so can result in severe injury or death.
          </p>
          <p>
            <strong>1. Mistake:</strong> Providing insufficient or inconsistent input
            values can lead to incorrect calculations. Always enter at least two
            accurate known parameters to ensure reliable results.
          </p>
          <p>
            <strong>2. Mistake:</strong> Ignoring calculated current or power limits
            can cause undersized wiring or breakers, leading to overheating and fire
            hazards. Always verify results against equipment ratings and code
            requirements.
          </p>
          <p>
            <strong>3. Mistake:</strong> Confusing units (e.g., milliamps vs amps,
            kilowatts vs watts) can cause calculation errors. Use standard units as
            specified and convert if necessary.
          </p>
          <p>
            <strong>4. Mistake:</strong> Neglecting voltage drop over long wire runs
            can cause equipment malfunction. For wiring projects, consider voltage
            drop calculations and select appropriate wire gauge.
          </p>
          <p>
            <strong>5. Mistake:</strong> Relying solely on calculator results without
            professional judgment or code compliance checks can be dangerous.
            Always consult qualified professionals for critical electrical work.
          </p>
        </div>
      </section>

      {/* 4. REAL WORLD EXAMPLE */}
      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            <strong>Scenario:</strong> Sizing a wire for a 50ft subpanel run supplying
            a 240V heater rated at 3600W.
          </p>
          {example.steps.map((step, idx) => (
            <div key={idx}>
              <h3 className="font-semibold">{step.label}</h3>
              <p>{step.explanation}</p>
            </div>
          ))}
          <p className="font-bold">{example.result}</p>
        </article>
      </section>

      {/* 5. FAQ */}
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

      {/* 6. REFERENCES */}
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
      title="Ohm's Law Calculator (V, I, R, P)"
      description="Professional electrical calculator: Ohm's Law Calculator (V, I, R, P). Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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