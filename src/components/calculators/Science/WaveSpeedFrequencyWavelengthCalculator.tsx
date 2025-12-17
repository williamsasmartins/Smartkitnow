import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Waves, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function WaveSpeedFrequencyWavelengthCalculator() {
  // Inputs: waveSpeed (v), frequency (f), wavelength (λ)
  // User must provide exactly two to calculate the third.
  const [inputs, setInputs] = useState({
    waveSpeed: "",
    frequency: "",
    wavelength: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const v = parseFloat(inputs.waveSpeed);
    const f = parseFloat(inputs.frequency);
    const lambda = parseFloat(inputs.wavelength);

    // Count how many inputs are valid numbers
    const validInputs = [v, f, lambda].filter((x) => !isNaN(x));
    if (validInputs.length < 2) {
      return {
        value: "Waiting...",
        label: "Enter at least two values",
        subtext: "Provide any two of wave speed, frequency, or wavelength to calculate the third.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Validation: all positive numbers (wave properties cannot be zero or negative)
    if (
      (inputs.waveSpeed !== "" && (isNaN(v) || v <= 0)) ||
      (inputs.frequency !== "" && (isNaN(f) || f <= 0)) ||
      (inputs.wavelength !== "" && (isNaN(lambda) || lambda <= 0))
    ) {
      return {
        value: "Invalid input",
        label: "All inputs must be positive numbers",
        subtext: "Wave speed, frequency, and wavelength must be &gt; 0.",
        warning: "Please enter positive values only.",
        formulaUsed: null,
      };
    }

    // Calculate the missing value using v = f * λ
    let calculatedValue = null;
    let calculatedLabel = "";
    let formulaUsed = "";
    let displayVal = "";

    if (isNaN(v)) {
      // Calculate wave speed: v = f * λ
      calculatedValue = f * lambda;
      calculatedLabel = "Wave Speed (m/s)";
      formulaUsed = "v = f × λ";
    } else if (isNaN(f)) {
      // Calculate frequency: f = v / λ
      calculatedValue = v / lambda;
      calculatedLabel = "Frequency (Hz)";
      formulaUsed = "f = v ÷ λ";
    } else if (isNaN(lambda)) {
      // Calculate wavelength: λ = v / f
      calculatedValue = v / f;
      calculatedLabel = "Wavelength (m)";
      formulaUsed = "λ = v ÷ f";
    } else {
      // All three provided, check consistency
      const lhs = v;
      const rhs = f * lambda;
      const diff = Math.abs(lhs - rhs);
      if (diff > 1e-6) {
        return {
          value: "Inconsistent inputs",
          label: "Inputs do not satisfy v = f × λ",
          subtext: `Difference: ${diff.toExponential(4)}`,
          warning: "Please check your inputs for consistency.",
          formulaUsed: "v = f × λ",
        };
      }
      // If consistent, just show wave speed as result
      calculatedValue = v;
      calculatedLabel = "Wave Speed (m/s)";
      formulaUsed = "v = f × λ";
    }

    // Format output: use scientific notation if very large or small
    if (calculatedValue !== null) {
      if (calculatedValue >= 10000 || calculatedValue < 0.001) {
        displayVal = calculatedValue.toExponential(4);
      } else {
        displayVal = calculatedValue.toFixed(4);
      }
    }

    return {
      value: displayVal,
      label: calculatedLabel,
      subtext: "Units: m/s for speed, Hz for frequency, meters for wavelength",
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why do wave speed, frequency, and wavelength relate as v = f × λ?",
      answer:
        "The wave equation v = f × λ expresses the fundamental relationship between how fast a wave travels (wave speed), how often the wave oscillates per second (frequency), and the distance between successive wave peaks (wavelength). This relationship holds for all types of waves, including sound, light, and water waves, and is essential for understanding wave behavior in physics and engineering.",
    },
    {
      question: "How is this calculation used in real-world applications?",
      answer:
        "This calculation is crucial in many fields such as telecommunications, where engineers design antennas based on wavelength and frequency. In acoustics, it helps in tuning musical instruments and designing auditoriums. In oceanography, wave speed and wavelength calculations assist in predicting wave patterns and their impact on coastal structures.",
    },
    {
      question: "What units should I use when inputting values?",
      answer:
        "Always use meters per second (m/s) for wave speed, hertz (Hz) for frequency, and meters (m) for wavelength. Consistent units ensure accurate calculations. If you have values in other units, convert them before using this calculator to avoid errors.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="waveSpeed" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-5 h-5 text-blue-600" /> Wave Speed (v)
          </Label>
          <Input
            id="waveSpeed"
            type="text"
            placeholder="m/s"
            value={inputs.waveSpeed}
            onChange={(e) => handleInputChange("waveSpeed", e.target.value)}
            aria-describedby="waveSpeedHelp"
          />
          <p id="waveSpeedHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter wave speed in meters per second (m/s).
          </p>
        </div>

        <div>
          <Label htmlFor="frequency" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-5 h-5 text-yellow-600" /> Frequency (f)
          </Label>
          <Input
            id="frequency"
            type="text"
            placeholder="Hz"
            value={inputs.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
            aria-describedby="frequencyHelp"
          />
          <p id="frequencyHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter frequency in hertz (Hz).
          </p>
        </div>

        <div>
          <Label htmlFor="wavelength" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Orbit className="w-5 h-5 text-purple-600" /> Wavelength (λ)
          </Label>
          <Input
            id="wavelength"
            type="text"
            placeholder="m"
            value={inputs.wavelength}
            onChange={(e) => handleInputChange("wavelength", e.target.value)}
            aria-describedby="wavelengthHelp"
          />
          <p id="wavelengthHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter wavelength in meters (m).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate wave property"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ waveSpeed: "", frequency: "", wavelength: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> The wave equation v = f × λ applies universally to all wave types, from sound waves traveling through air to electromagnetic waves in space.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Wave Speed / Frequency / Wavelength</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Waves are disturbances that transfer energy through a medium or space without transporting matter. The <strong>wave speed</strong> (v) is how fast the wave propagates through the medium, measured in meters per second (m/s). The <strong>frequency</strong> (f) is the number of oscillations or cycles the wave completes per second, measured in hertz (Hz). The <strong>wavelength</strong> (λ) is the distance between two consecutive points in phase on the wave, such as crest to crest, measured in meters (m).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These three properties are intrinsically linked by the fundamental wave equation: <em>v = f × λ</em>. This means the wave speed equals the product of frequency and wavelength. If you know any two of these properties, you can calculate the third. This relationship holds true for all wave types, including sound waves, light waves, and water waves.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding this relationship is essential in fields like acoustics, optics, telecommunications, and oceanography. For example, radio engineers use it to design antennas tuned to specific frequencies and wavelengths, while oceanographers use it to predict wave behavior in seas and oceans.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`v = f × λ

Where:
  v (wave speed) is in meters per second (m/s)
  f (frequency) is in hertz (Hz)
  λ (wavelength) is in meters (m)

Note: To calculate any one of these variables, rearrange the formula:
  f = v ÷ λ
  λ = v ÷ f

All values must be positive numbers.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the wave equation:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> A wave has a frequency of 500 Hz and a wavelength of 0.68 meters.</li>
          <li><strong>Step 1:</strong> Use the formula v = f × λ to find the wave speed.</li>
          <li><strong>Step 2:</strong> Calculate v = 500 Hz × 0.68 m = 340 m/s.</li>
          <li><strong>Result:</strong> The wave speed is 340 meters per second, which matches the speed of sound in air at room temperature.</li>
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Wave Speed / Frequency / Wavelength"
      description="Calculate wave properties. Find the relationship between wave speed, frequency, and wavelength with the wave equation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "v = f × λ",
        variables: [
          { symbol: "v", description: "Wave speed (meters per second, m/s)" },
          { symbol: "f", description: "Frequency (hertz, Hz)" },
          { symbol: "λ", description: "Wavelength (meters, m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the wave speed of a wave with frequency 500 Hz and wavelength 0.68 meters.",
        steps: [
          { label: "1", explanation: "Identify given values: f = 500 Hz, λ = 0.68 m." },
          { label: "2", explanation: "Apply the formula v = f × λ." },
          { label: "3", explanation: "Calculate v = 500 × 0.68 = 340 m/s." },
        ],
        result: "The wave speed is 340 meters per second.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}