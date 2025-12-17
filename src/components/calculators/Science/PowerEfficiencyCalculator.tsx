import { useState, useMemo, useCallback } from "react";
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
// ⚠️ SAFE ICONS ONLY
import {
  Atom,
  FlaskConical,
  Zap,
  Orbit,
  Thermometer,
  Scale,
  Waves,
  Info,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PowerEfficiencyCalculator() {
  // Inputs: work done (Joules), time (seconds), useful energy output (Joules), total energy input (Joules)
  // Calculate power = work / time (W)
  // Calculate efficiency = (useful energy output / total energy input) * 100 (%)

  const [inputs, setInputs] = useState({
    workDone: "",
    time: "",
    usefulEnergy: "",
    totalEnergy: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const g = 9.81; // m/s² (not used here but scientific constant)
    const c = 2.998e8; // m/s (not used here but scientific constant)

    // Parse inputs to floats
    const workDone = parseFloat(inputs.workDone);
    const time = parseFloat(inputs.time);
    const usefulEnergy = parseFloat(inputs.usefulEnergy);
    const totalEnergy = parseFloat(inputs.totalEnergy);

    // Initialize result object
    let powerValue: number | null = null;
    let efficiencyValue: number | null = null;
    let warning: string | null = null;

    // Validate inputs for power calculation
    if (
      !isNaN(workDone) &&
      !isNaN(time) &&
      time > 0 &&
      workDone >= 0
    ) {
      powerValue = workDone / time; // Watts (W)
    } else if (
      inputs.workDone !== "" ||
      inputs.time !== ""
    ) {
      warning = "Please enter valid positive numbers for Work Done and Time (Time &gt; 0).";
    }

    // Validate inputs for efficiency calculation
    if (
      !isNaN(usefulEnergy) &&
      !isNaN(totalEnergy) &&
      totalEnergy > 0 &&
      usefulEnergy >= 0
    ) {
      efficiencyValue = (usefulEnergy / totalEnergy) * 100; // Percentage (%)
      if (efficiencyValue > 100) {
        warning =
          "Efficiency cannot exceed 100%. Please check your energy input values.";
      }
    } else if (
      inputs.usefulEnergy !== "" ||
      inputs.totalEnergy !== ""
    ) {
      warning = warning
        ? warning +
          " Also, please enter valid positive numbers for Useful and Total Energy (Total Energy &gt; 0)."
        : "Please enter valid positive numbers for Useful and Total Energy (Total Energy &gt; 0).";
    }

    // Format results with units and scientific notation if needed
    const formatNumber = (num: number, unit: string) => {
      if (num !== 0 && (Math.abs(num) < 1e-4 || Math.abs(num) >= 1e6)) {
        return num.toExponential(4) + " " + unit;
      }
      return num.toLocaleString(undefined, { maximumFractionDigits: 4 }) + " " + unit;
    };

    return {
      power: powerValue !== null ? formatNumber(powerValue, "W") : null,
      efficiency:
        efficiencyValue !== null
          ? efficiencyValue.toFixed(2) + " %"
          : null,
      warning,
      formulaUsedPower: "Power = Work Done / Time",
      formulaUsedEfficiency: "Efficiency = (Useful Energy Output / Total Energy Input) × 100",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is power in physics?",
      answer:
        "Power is the rate at which work is done or energy is transferred over time. It is measured in Watts (W), where 1 Watt equals 1 Joule per second. Understanding power helps analyze how quickly machines or systems perform work.",
    },
    {
      question: "How is efficiency calculated?",
      answer:
        "Efficiency measures how effectively energy input is converted into useful output energy. It is expressed as a percentage and calculated by dividing useful energy output by total energy input, then multiplying by 100. Efficiency cannot exceed 100%.",
    },
    {
      question: "Why can efficiency never be greater than 100%?",
      answer:
        "Efficiency greater than 100% would imply that a system produces more energy than it consumes, violating the law of conservation of energy. Real systems always lose some energy due to friction, heat, or other inefficiencies.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="workDone" className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            Work Done (Joules)
          </Label>
          <Input
            id="workDone"
            type="text"
            placeholder="e.g. 500"
            value={inputs.workDone}
            onChange={(e) => handleInputChange("workDone", e.target.value)}
            aria-describedby="workDone-desc"
          />
          <p id="workDone-desc" className="text-xs text-slate-500 mt-1">
            Total work done or energy transferred (J)
          </p>
        </div>

        <div>
          <Label htmlFor="time" className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-red-600" />
            Time (seconds)
          </Label>
          <Input
            id="time"
            type="text"
            placeholder="e.g. 10"
            value={inputs.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            aria-describedby="time-desc"
          />
          <p id="time-desc" className="text-xs text-slate-500 mt-1">
            Duration over which work is done (s)
          </p>
        </div>

        <div>
          <Label htmlFor="usefulEnergy" className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-green-600" />
            Useful Energy Output (Joules)
          </Label>
          <Input
            id="usefulEnergy"
            type="text"
            placeholder="e.g. 400"
            value={inputs.usefulEnergy}
            onChange={(e) => handleInputChange("usefulEnergy", e.target.value)}
            aria-describedby="usefulEnergy-desc"
          />
          <p id="usefulEnergy-desc" className="text-xs text-slate-500 mt-1">
            Energy effectively used by the system (J)
          </p>
        </div>

        <div>
          <Label htmlFor="totalEnergy" className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-600" />
            Total Energy Input (Joules)
          </Label>
          <Input
            id="totalEnergy"
            type="text"
            placeholder="e.g. 500"
            value={inputs.totalEnergy}
            onChange={(e) => handleInputChange("totalEnergy", e.target.value)}
            aria-describedby="totalEnergy-desc"
          />
          <p id="totalEnergy-desc" className="text-xs text-slate-500 mt-1">
            Total energy supplied to the system (J)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          aria-label="Calculate power and efficiency"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              workDone: "",
              time: "",
              usefulEnergy: "",
              totalEnergy: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {(results.power !== null || results.efficiency !== null) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              {results.power !== null && (
                <>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                    {results.formulaUsedPower}
                  </p>
                  <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                    {results.power}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                    Power (Watts)
                  </p>
                </>
              )}
              {results.efficiency !== null && (
                <>
                  <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-3 uppercase tracking-wider mt-8">
                    {results.formulaUsedEfficiency}
                  </p>
                  <p className="text-5xl font-extrabold text-indigo-900 dark:text-white">
                    {results.efficiency}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                    Efficiency (%)
                  </p>
                </>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Power &amp; Efficiency Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Power and efficiency are fundamental concepts in physics and engineering that describe how energy is used and transferred in systems. Power quantifies the rate at which work is done or energy is converted, measured in Watts (W), representing Joules per second. Efficiency, expressed as a percentage, indicates how effectively a system converts input energy into useful output energy without losses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to determine both power and efficiency by inputting relevant values such as work done, time, useful energy output, and total energy input. By understanding these values, students and professionals can analyze mechanical systems, engines, and other devices to optimize performance and reduce energy waste.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate calculations of power and efficiency are crucial in fields ranging from renewable energy to automotive engineering. This tool helps bridge theoretical knowledge with practical application, fostering deeper comprehension of energy principles.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula &amp; Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Power (P) = Work Done (W) / Time (t)
P = W / t

Efficiency (η) = (Useful Energy Output / Total Energy Input) × 100%
η = (E_{useful} / E_{total}) × 100%

Where:
  P = Power (Watts, W)
  W = Work Done (Joules, J)
  t = Time (seconds, s)
  η = Efficiency (percent, %)
  E_{useful} = Useful Energy Output (Joules, J)
  E_{total} = Total Energy Input (Joules, J)`}
        </pre>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Power &amp; Efficiency Calculator"
      description="Determine Power and Efficiency. Calculate the rate of work done and the energy efficiency of mechanical systems or engines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Power (P) = Work Done (W) / Time (t)
Efficiency (η) = (Useful Energy Output / Total Energy Input) × 100%`,
        variables: [
          { symbol: "P", description: "Power (Watts, W)" },
          { symbol: "W", description: "Work Done (Joules, J)" },
          { symbol: "t", description: "Time (seconds, s)" },
          {
            symbol: "η",
            description: "Efficiency (percent, %)",
          },
          {
            symbol: "E_{useful}",
            description: "Useful Energy Output (Joules, J)",
          },
          {
            symbol: "E_{total}",
            description: "Total Energy Input (Joules, J)",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A machine does 1000 Joules of work in 20 seconds. It outputs 800 Joules of useful energy from a total energy input of 1000 Joules. Calculate its power and efficiency.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate power: Power = Work Done / Time = 1000 J / 20 s = 50 W.",
          },
          {
            label: "2",
            explanation:
              "Calculate efficiency: Efficiency = (Useful Energy Output / Total Energy Input) × 100% = (800 J / 1000 J) × 100% = 80%.",
          },
        ],
        result: "Power = 50 W, Efficiency = 80 %",
      }}
      relatedCalculators={[
        {
          title: "Half-Life / Exponential Decay Calculator",
          url: "/science/half-life-exponential-decay",
          icon: "⚛️",
        },
        {
          title: "Projectile Motion Calculator",
          url: "/science/projectile-motion-calculator",
          icon: "🚀",
        },
        {
          title: "Gravity on Other Planets Calculator",
          url: "/science/gravity-on-other-planets-calculator",
          icon: "🪐",
        },
        {
          title: "Stoichiometry & Limiting Reagent Solver",
          url: "/science/stoichiometry-limiting-reagent",
          icon: "🧪",
        },
        {
          title: "Uniform Circular Motion Calculator",
          url: "/science/uniform-circular-motion-centripetal",
          icon: "🚀",
        },
        {
          title: "Photon Energy Calculator",
          url: "/science/photon-energy-e-hf",
          icon: "🔥",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}