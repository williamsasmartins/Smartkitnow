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

export default function CableAmpacityByDistanceCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    length: "",
    amps: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation Logic:
   * 
   * This calculator estimates the minimum cable ampacity required based on the load current (amps)
   * and the cable length (distance) to compensate for voltage drop.
   * 
   * Assumptions:
   * - Voltage drop limit: 3% (typical for branch circuits)
   * - Voltage: 120V (single phase)
   * - Resistivity of copper: 12.9 ohms per 1000 ft (approx)
   * - Formula for voltage drop: Vdrop = 2 * Length * Current * Resistance per ft
   * - Ampacity adjusted = Current / (1 - VoltageDrop%)
   * 
   * The result is the minimum ampacity cable rating to safely carry the load over the distance.
   * 
   * Units:
   * - Length: feet (imperial) or meters (metric)
   * - Amps: load current in amperes
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const amps = parseFloat(inputs.amps);
    const unit = inputs.unit;

    if (isNaN(length) || length <= 0 || isNaN(amps) || amps <= 0) {
      return {
        primary: "—",
        secondary: "Invalid input",
        details: "Please enter positive numeric values for length and amps.",
        feedback: "",
      };
    }

    // Constants
    const voltage = 120; // volts, typical branch circuit voltage
    const voltageDropLimit = 0.03; // 3% voltage drop allowed
    // Resistance per unit length of copper conductor (ohms per foot or meter)
    // Copper resistivity approx 1.68e-8 ohm-meters
    // Resistance R = resistivity * length / area, but area unknown here.
    // Instead, use typical resistance per 1000 ft = 12.9 ohms for 14 AWG copper.
    // For simplicity, use resistance per unit length:
    // 12.9 ohms / 1000 ft = 0.0129 ohms/ft
    // For metric, convert ohms/meter:
    // 12.9 ohms / 304.8 m = ~0.0424 ohms/km = 0.0000424 ohms/m (too low)
    // Actually, 12.9 ohms/1000 ft = 0.0129 ohms/ft
    // 1 ft = 0.3048 m, so ohms/m = 0.0129 / 0.3048 = 0.04235 ohms/m

    const resistancePerUnitLength =
      unit === "imperial" ? 0.0129 : 0.04235; // ohms per ft or m

    // Voltage drop = 2 * Length * Current * Resistance per unit length
    // Factor 2 because current goes and returns (round trip)
    const voltageDrop = 2 * length * amps * resistancePerUnitLength;

    // Voltage drop percentage
    const voltageDropPercent = voltageDrop / voltage;

    // If voltage drop exceeds limit, ampacity must be increased
    // Adjusted ampacity = amps / (1 - voltageDropLimit)
    // But if voltageDropPercent < voltageDropLimit, no adjustment needed

    let adjustedAmps = amps;
    let details = "";

    if (voltageDropPercent > voltageDropLimit) {
      // Increase ampacity to compensate voltage drop
      adjustedAmps = amps / (1 - voltageDropLimit);
      details = `Voltage drop is ${(voltageDropPercent * 100).toFixed(
        2
      )}%, which exceeds the 3% limit. Minimum cable ampacity increased to compensate.`;
    } else {
      details = `Voltage drop is ${(voltageDropPercent * 100).toFixed(
        2
      )}%, within the acceptable 3% limit.`;
    }

    // Round adjusted amps to nearest whole number
    adjustedAmps = Math.ceil(adjustedAmps);

    return {
      primary: adjustedAmps.toString(),
      secondary: "Minimum Cable Ampacity (A)",
      details,
      feedback:
        voltageDropPercent > voltageDropLimit
          ? "Consider upsizing cable to reduce voltage drop."
          : "Cable size is sufficient for the load and distance.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is cable ampacity and why does distance matter?",
      answer:
        "Cable ampacity is the maximum amount of electric current a cable can safely carry without overheating. Distance matters because as current travels through a cable, voltage drops occur due to the cable's resistance. Longer distances increase voltage drop, which can reduce the performance of electrical equipment and cause safety issues. Therefore, cable ampacity must be adjusted to compensate for voltage drop over distance.",
    },
    {
      question: "Why is a 3% voltage drop limit used in this calculator?",
      answer:
        "A 3% voltage drop limit is a common industry standard for branch circuits to ensure efficient and safe operation of electrical devices. Keeping voltage drop within 3% helps maintain proper voltage levels at the load, preventing equipment malfunction and excessive energy loss. This calculator uses the 3% limit to determine if cable ampacity needs to be increased to compensate for voltage drop.",
    },
    {
      question: "Can I use this calculator for both metric and imperial units?",
      answer:
        "Yes, this calculator supports both imperial (feet) and metric (meters) units for cable length. You can select your preferred unit system from the dropdown menu. The calculations adjust accordingly to provide accurate ampacity recommendations based on the unit selected.",
    },
    {
      question: "Does this calculator consider different cable materials or voltages?",
      answer:
        "This calculator assumes copper conductors and a standard voltage of 120V for single-phase circuits. Different materials like aluminum have different resistances, and higher voltages affect voltage drop calculations. For specialized cases, consult detailed engineering tables or a professional engineer to ensure compliance with local electrical codes.",
    },
    {
      question: "What safety precautions should I take when selecting cable ampacity?",
      answer:
        "Always ensure that the selected cable ampacity meets or exceeds the calculated minimum to prevent overheating and fire hazards. Consider environmental factors such as ambient temperature, cable bundling, and insulation type, which can affect ampacity. When in doubt, consult the National Electrical Code (NEC) and a licensed electrician or engineer to verify your cable sizing.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You need to supply a 120V branch circuit to a workshop located 150 feet away, and the expected load current is 30 amps. You want to ensure the cable size is sufficient to avoid excessive voltage drop.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Select 'Imperial (ft)' as the unit since the distance is in feet.",
      },
      {
        label: "Step 2",
        explanation: "Enter 150 for the length (distance to the load).",
      },
      {
        label: "Step 3",
        explanation: "Enter 30 for the load current in amps.",
      },
      {
        label: "Step 4",
        explanation:
          "Click 'Calculate' to see the minimum cable ampacity required to compensate for voltage drop.",
      },
    ],
    result:
      "The calculator shows a minimum cable ampacity of 31 amps, indicating that the cable should be sized for at least 31 amps to keep voltage drop within 3%.",
  };

  const references = [
    {
      title: "National Electrical Code (NEC) - Voltage Drop Guidelines",
      description:
        "Official NEC guidelines recommend limiting voltage drop to 3% for branch circuits to ensure safety and efficiency.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Copper Wire Resistance and Voltage Drop",
      description:
        "Technical reference on copper wire resistivity and how it affects voltage drop over distance.",
      url: "https://www.engineeringtoolbox.com/resistivity-conductivity-d_418.html",
    },
    {
      title: "Voltage Drop Calculator by Southwire",
      description:
        "An online voltage drop calculator for various wire sizes and materials.",
      url: "https://www.southwire.com/calculators/voltage-drop-calculator",
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
            placeholder="Enter load current in amps"
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No extra action needed, calculation is reactive
        }}
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
            <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-400">
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
            Select the unit system for the cable length: Imperial (feet) or
            Metric (meters).
          </li>
          <li>Enter the cable length (distance from power source to load).</li>
          <li>Enter the expected load current in amperes (amps).</li>
          <li>Click the "Calculate" button to compute the minimum cable ampacity.</li>
          <li>
            Review the result and details to determine if cable upsizing is
            necessary to compensate for voltage drop.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Cable Ampacity by Distance Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Cable ampacity refers to the maximum current a cable can safely carry
            without exceeding its temperature rating. When electrical current
            flows through a conductor, it encounters resistance which causes a
            voltage drop along the cable length. Excessive voltage drop can lead
            to inefficient operation of electrical equipment and potential safety
            hazards.
          </p>
          <p>
            This calculator helps estimate the minimum cable ampacity required to
            compensate for voltage drop over a given distance. It assumes copper
            conductors and a standard 120V single-phase voltage supply. The
            calculation uses a 3% voltage drop limit, which is a common industry
            standard for branch circuits.
          </p>
          <p>
            By inputting the cable length and load current, the calculator
            determines if the cable ampacity needs to be increased to maintain
            voltage within acceptable limits. If the voltage drop exceeds 3%,
            the calculator suggests a higher ampacity rating to ensure safe and
            efficient operation.
          </p>
          <p>
            Always verify cable sizing with local electrical codes and consider
            other factors such as ambient temperature, cable insulation type, and
            installation conditions. When in doubt, consult a licensed
            electrician or electrical engineer.
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
            <strong>Warning:</strong> Undersizing cables can cause excessive
            voltage drop, overheating, and fire hazards. Always ensure the cable
            ampacity meets or exceeds the calculated minimum.
          </p>
          <p>
            Do not rely solely on this calculator for final cable sizing. It does
            not account for all factors such as ambient temperature, conduit fill,
            or cable bundling, which can affect ampacity.
          </p>
          <p>
            Always cross-reference your results with the National Electrical Code
            (NEC) tables and consult a licensed professional for critical or
            complex installations.
          </p>
          <p>
            Using incorrect units or inputting invalid values can lead to wrong
            results. Double-check your inputs before making decisions.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-2">
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
      title="Cable Ampacity by Distance Calculator"
      description="Professional electrical calculator: Cable Ampacity by Distance Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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