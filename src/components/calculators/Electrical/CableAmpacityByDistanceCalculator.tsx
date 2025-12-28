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
    gauge: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // NEC typical ampacity ratings for copper THHN wire at 75°C insulation (in amps)
  // Keys are string to avoid octal literals issues
  // Source: NEC Table 310.16 (2017) - simplified common sizes
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
  };

  // Resistivity of copper at 75°C in ohms per 1000 ft (approximate)
  // Source: NEC Chapter 9, Table 8
  // Resistances for common wire gauges (ohms per 1000 ft)
  const copperResistanceTableOhmPer1000ft: Record<string, number> = {
    "14": 3.07,
    "12": 1.93,
    "10": 1.21,
    "8": 0.764,
    "6": 0.491,
    "4": 0.308,
    "3": 0.245,
    "2": 0.194,
    "1": 0.154,
    "1/0": 0.122,
    "2/0": 0.0976,
    "3/0": 0.0775,
    "4/0": 0.0615,
  };

  // Voltage drop calculation formula:
  // Vdrop = 2 * Length * Current * Resistance per unit length
  // Length is one-way, so multiplied by 2 for round trip
  // Resistance per unit length is ohms per foot or meter depending on units
  // We calculate voltage drop percentage = (Vdrop / Voltage) * 100
  // Assume nominal voltage 120V or 240V depending on load type (we'll use 120V for example)

  // For this calculator, we will:
  // - Take Length (ft or m)
  // - Amps (load current)
  // - Wire Gauge (AWG)
  // Output:
  // - Max ampacity for wire gauge (from table)
  // - Voltage drop (volts and % assuming 120V)
  // - Safety feedback if amps exceed ampacity or voltage drop > 3%

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const ampsNum = parseFloat(inputs.amps);
    const gauge = inputs.gauge.trim();

    if (
      !lengthNum ||
      lengthNum <= 0 ||
      !ampsNum ||
      ampsNum <= 0 ||
      !gauge ||
      !(gauge in wireAmpacityTable)
    ) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter valid Length, Amps, and select a valid Gauge.",
        feedback: "",
      };
    }

    // Convert length to feet if metric
    const lengthFeet =
      inputs.unit === "metric" ? lengthNum * 3.28084 : lengthNum;

    // Get ampacity and resistance
    const ampacity = wireAmpacityTable[gauge];
    const resistancePer1000ft = copperResistanceTableOhmPer1000ft[gauge];

    // Resistance per foot
    const resistancePerFoot = resistancePer1000ft / 1000;

    // Voltage drop calculation (Vdrop = 2 * L * I * R)
    const voltageDropVolts = 2 * lengthFeet * ampsNum * resistancePerFoot;

    // Assume nominal voltage 120V for calculation of %
    const nominalVoltage = 120;
    const voltageDropPercent = (voltageDropVolts / nominalVoltage) * 100;

    // Safety checks
    let feedback = "";
    if (ampsNum > ampacity) {
      feedback += `Warning: The load current (${ampsNum}A) exceeds the ampacity of the selected wire gauge (${ampacity}A). This can cause overheating and fire hazards. `;
    }
    if (voltageDropPercent > 3) {
      feedback += `Voltage drop is ${voltageDropPercent.toFixed(
        2
      )}%, which exceeds the recommended maximum of 3%. Consider using a larger gauge or shorter cable length.`;
    }
    if (!feedback) {
      feedback = "Load current and voltage drop are within safe limits.";
    }

    return {
      primary: `${voltageDropVolts.toFixed(2)} V`,
      secondary: `Voltage Drop (${voltageDropPercent.toFixed(2)}%)`,
      details: `Ampacity of ${gauge} AWG wire: ${ampacity} A. Nominal voltage assumed: ${nominalVoltage} V.`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is cable ampacity and why does distance matter?",
      answer:
        "Cable ampacity is the maximum current a conductor can safely carry without exceeding its temperature rating. Distance affects ampacity calculations because longer cables have higher resistance, which causes voltage drop and power loss. Excessive voltage drop can damage equipment and reduce efficiency, so it's critical to consider both ampacity and distance when selecting wire size.",
    },
    {
      question: "Why do we multiply length by 2 in voltage drop calculations?",
      answer:
        "The length is multiplied by 2 because electrical current flows through the conductor to the load and returns via the neutral or ground conductor, effectively doubling the total length the current travels. This round-trip distance is essential to accurately calculate voltage drop and ensure safety and performance.",
    },
    {
      question: "What are the consequences of exceeding wire ampacity?",
      answer:
        "Exceeding wire ampacity can cause the conductor to overheat, degrading insulation and potentially causing electrical fires. It also leads to energy losses and reduced lifespan of electrical components. Properly sizing wires according to ampacity tables and considering distance ensures safe and efficient electrical installations.",
    },
    {
      question: "How does voltage drop affect electrical devices?",
      answer:
        "Voltage drop reduces the voltage available at the load, which can cause electrical devices to operate inefficiently or malfunction. Motors may overheat, lights may dim, and sensitive electronics can fail prematurely. Maintaining voltage drop below recommended limits (usually 3%) preserves device performance and longevity.",
    },
    {
      question: "Can I use this calculator for aluminum conductors?",
      answer:
        "This calculator uses copper wire properties and ampacity values. Aluminum conductors have different resistance and ampacity characteristics, so using this calculator for aluminum wires will yield inaccurate results. For aluminum conductors, consult NEC tables specific to aluminum and adjust calculations accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Running 150 feet of 12 AWG copper THHN wire to supply a 20A load in a residential setting.",
    steps: [
      {
        label: "Step 1: Input Length",
        explanation:
          "Enter 150 feet as the cable length since the run is 150 feet one-way.",
      },
      {
        label: "Step 2: Input Load Current",
        explanation:
          "Enter 20 amps as the expected load current for the circuit.",
      },
      {
        label: "Step 3: Select Wire Gauge",
        explanation:
          "Select 12 AWG wire, a common size for 20A circuits in residential wiring.",
      },
      {
        label: "Step 4: Calculate",
        explanation:
          "The calculator will compute the voltage drop and check if the wire ampacity is sufficient for the load and distance.",
      },
    ],
    result:
      "The voltage drop is approximately 7.74 volts (6.45%), which exceeds the recommended 3% limit. Although 12 AWG wire is rated for 25A, the voltage drop is high due to the long distance. Consider using 10 AWG wire or reducing cable length to maintain voltage drop within safe limits.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "Voltage Drop Calculations - Mike Holt",
      description:
        "Comprehensive guide on voltage drop and conductor sizing.",
      url: "https://www.mikeholt.com/",
    },
    {
      title: "Copper Wire Resistance Table",
      description:
        "Standard resistance values for copper conductors at 75°C.",
      url: "https://www.engineeringtoolbox.com/copper-wire-resistance-d_419.html",
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
            min={0}
            step="any"
            placeholder={`Enter length in ${inputs.unit === "imperial" ? "feet" : "meters"}`}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Load Current (Amps)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="Enter load current (A)"
            value={inputs.amps}
            onChange={(e) => handleInputChange("amps", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Wire Gauge (AWG)</Label>
          <Select
            value={inputs.gauge}
            onValueChange={(v) => handleInputChange("gauge", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gauge" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(wireAmpacityTable).map((g) => (
                <SelectItem key={g} value={g}>
                  {g} AWG
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate Cable Ampacity by Distance"
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
                results.feedback.toLowerCase().includes("warning")
                  ? "text-amber-900"
                  : "text-green-700"
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
            Select the unit system: Imperial (feet) or Metric (meters) for your
            cable length.
          </li>
          <li>
            Enter the one-way length of the cable run. This is the distance from
            the power source to the load.
          </li>
          <li>Input the expected load current in amperes (A).</li>
          <li>
            Choose the wire gauge (AWG) you plan to use for the cable. The
            calculator supports common copper wire sizes.
          </li>
          <li>
            Click the Calculate button to see the voltage drop and ampacity
            safety feedback.
          </li>
          <li>
            Review the results to ensure your wire size is adequate for the load
            and distance.
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
            Cable ampacity refers to the maximum current a conductor can safely
            carry without exceeding its temperature rating. The ampacity depends
            on wire gauge, insulation type, ambient temperature, and installation
            conditions. The National Electrical Code (NEC) provides ampacity
            tables that electricians and engineers use to select appropriate wire
            sizes.
          </p>
          <p>
            Distance plays a crucial role because electrical cables have inherent
            resistance. As current flows through the conductor, voltage drops
            along the length of the cable, reducing the voltage available at the
            load. Excessive voltage drop can cause equipment malfunction,
            overheating, and energy loss.
          </p>
          <p>
            This calculator estimates voltage drop based on cable length, load
            current, and wire gauge using standard copper conductor resistance
            values. It also compares the load current to the ampacity of the
            selected wire to ensure safety compliance. For longer runs or higher
            loads, upsizing the wire gauge reduces voltage drop and improves
            safety.
          </p>
          <p>
            Always consult the latest NEC tables and local electrical codes for
            precise requirements, and consider factors such as conduit fill,
            ambient temperature, and insulation type for detailed ampacity
            calculations.
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
            <strong>Warning:</strong> Electricity is dangerous and improper
            wiring can cause fires, shocks, or equipment damage. Always follow
            NEC guidelines and local codes.
          </p>
          <p>
            A common mistake is undersizing wire gauge to save cost, which leads
            to overheating and fire risk. Never exceed the ampacity rating of the
            wire.
          </p>
          <p>
            Ignoring voltage drop can cause equipment to malfunction or fail
            prematurely. For long cable runs, always calculate voltage drop and
            consider upsizing wire if drop exceeds 3%.
          </p>
          <p>
            This calculator assumes copper conductors and typical installation
            conditions. For aluminum wires, different ampacity and resistance
            values apply.
          </p>
          <p>
            When in doubt, consult a licensed electrician or electrical engineer
            to verify your wiring design.
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