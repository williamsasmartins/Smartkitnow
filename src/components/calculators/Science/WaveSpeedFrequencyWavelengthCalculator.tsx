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
  // Inputs: wave speed (v), frequency (f), wavelength (λ)
  // User can input any two, calculate the third.
  // Units: speed (m/s), frequency (Hz), wavelength (m)
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

  const results = useMemo(() => {
    const v = parseFloat(inputs.waveSpeed);
    const f = parseFloat(inputs.frequency);
    const lambda = parseFloat(inputs.wavelength);

    // Count how many inputs are valid numbers
    const validInputs = [v, f, lambda].filter((x) => !isNaN(x));

    // Validation: Need exactly two inputs to calculate the third
    if (validInputs.length < 2) {
      return {
        value: "Waiting...",
        label: "Enter any two values to calculate the third",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (validInputs.length > 2) {
      // Check consistency: v = f * λ
      if (Math.abs(v - f * lambda) > 1e-6) {
        return {
          value: "Error",
          label: "Inconsistent inputs",
          subtext: "Wave speed must equal frequency × wavelength",
          warning:
            "Inputs do not satisfy the wave equation: v = f × λ. Please check your values.",
          formulaUsed: "v = f × λ",
        };
      }
      // All inputs consistent, no calculation needed
      return {
        value: `${v.toFixed(4)} m/s`,
        label: "Wave Speed",
        subtext: "All inputs consistent",
        warning: null,
        formulaUsed: "v = f × λ",
      };
    }

    // Exactly two inputs: calculate the third
    // Cases:
    // 1) v and f given => λ = v / f
    if (!isNaN(v) && !isNaN(f) && isNaN(lambda)) {
      if (f === 0) {
        return {
          value: "Error",
          label: "Frequency cannot be zero",
          subtext: "",
          warning: "Frequency must be greater than zero to calculate wavelength.",
          formulaUsed: "λ = v / f",
        };
      }
      const res = v / f;
      const displayVal =
        res > 10000 || res < 0.001 ? res.toExponential(4) : res.toFixed(4);
      return {
        value: `${displayVal} m`,
        label: "Wavelength",
        subtext: "Calculated from wave speed and frequency",
        warning: null,
        formulaUsed: "λ = v / f",
      };
    }
    // 2) v and λ given => f = v / λ
    if (!isNaN(v) && !isNaN(lambda) && isNaN(f)) {
      if (lambda === 0) {
        return {
          value: "Error",
          label: "Wavelength cannot be zero",
          subtext: "",
          warning: "Wavelength must be greater than zero to calculate frequency.",
          formulaUsed: "f = v / λ",
        };
      }
      const res = v / lambda;
      const displayVal =
        res > 10000 || res < 0.001 ? res.toExponential(4) : res.toFixed(4);
      return {
        value: `${displayVal} Hz`,
        label: "Frequency",
        subtext: "Calculated from wave speed and wavelength",
        warning: null,
        formulaUsed: "f = v / λ",
      };
    }
    // 3) f and λ given => v = f × λ
    if (!isNaN(f) && !isNaN(lambda) && isNaN(v)) {
      const res = f * lambda;
      const displayVal =
        res > 10000 || res < 0.001 ? res.toExponential(4) : res.toFixed(4);
      return {
        value: `${displayVal} m/s`,
        label: "Wave Speed",
        subtext: "Calculated from frequency and wavelength",
        warning: null,
        formulaUsed: "v = f × λ",
      };
    }

    // Fallback
    return {
      value: "Waiting...",
      label: "Enter any two values to calculate the third",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the relationship between wave speed, frequency, and wavelength?",
      answer:
        "Wave speed (v), frequency (f), and wavelength (λ) are related by the wave equation v = f × λ. This means the speed of a wave equals its frequency multiplied by its wavelength. Understanding this relationship helps in analyzing wave behavior in various media, such as sound waves in air or light waves in vacuum.",
    },
    {
      question: "Why must exactly two values be provided to calculate the third?",
      answer:
        "The wave equation involves three variables, so knowing any two allows calculation of the third. Providing fewer than two values leaves the system underdetermined, while providing all three requires consistency checks. This ensures accurate and meaningful results in wave analysis.",
    },
    {
      question: "Where is the wave speed / frequency / wavelength relationship applied in real life?",
      answer:
        "This relationship is fundamental in fields like acoustics, optics, and telecommunications. Engineers use it to design musical instruments, optimize fiber optic cables, and analyze seismic waves. It also helps meteorologists understand atmospheric wave patterns and astronomers study electromagnetic waves from distant stars.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="waveSpeed" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-4 h-4 text-blue-600" /> Wave Speed (v)
          </Label>
          <Input
            id="waveSpeed"
            type="text"
            placeholder="m/s"
            value={inputs.waveSpeed}
            onChange={(e) => handleInputChange("waveSpeed", e.target.value)}
            aria-describedby="waveSpeedHelp"
          />
          <p id="waveSpeedHelp" className="text-xs text-slate-500 mt-1">
            Enter wave speed in meters per second (m/s)
          </p>
        </div>
        <div>
          <Label htmlFor="frequency" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-4 h-4 text-green-600" /> Frequency (f)
          </Label>
          <Input
            id="frequency"
            type="text"
            placeholder="Hz"
            value={inputs.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
            aria-describedby="frequencyHelp"
          />
          <p id="frequencyHelp" className="text-xs text-slate-500 mt-1">
            Enter frequency in Hertz (Hz)
          </p>
        </div>
        <div>
          <Label htmlFor="wavelength" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-4 h-4 text-purple-600" /> Wavelength (λ)
          </Label>
          <Input
            id="wavelength"
            type="text"
            placeholder="m"
            value={inputs.wavelength}
            onChange={(e) => handleInputChange("wavelength", e.target.value)}
            aria-describedby="wavelengthHelp"
          />
          <p id="wavelengthHelp" className="text-xs text-slate-500 mt-1">
            Enter wavelength in meters (m)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No explicit calculation trigger needed; calculation is reactive
            // But button is kept for UX consistency
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
              <strong>Science Fact:</strong> Always ensure units are consistent (e.g., frequency in Hz, wavelength in meters) for accurate wave calculations.
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
          Understanding Wave Speed / Frequency / Wavelength
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Waves are disturbances that transfer energy through a medium or space without the transport of matter. The fundamental properties of waves include wave speed (v), frequency (f), and wavelength (λ). Wave speed is how fast the wave propagates through the medium, frequency is how many wave cycles pass a point per second, and wavelength is the distance between successive wave crests.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These properties are interconnected by the wave equation: <code>v = f × λ</code>. This means that if you know any two of these quantities, you can calculate the third. For example, sound waves in air travel at approximately 343 m/s at room temperature, so if you know the frequency of a sound, you can find its wavelength.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding this relationship is essential in many scientific and engineering fields, including acoustics, optics, telecommunications, and seismology. It helps in designing musical instruments, analyzing light spectra, and even studying waves on the ocean surface.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`v = f × λ

Where:
  v (wave speed) is in meters per second (m/s)
  f (frequency) is in Hertz (Hz), cycles per second
  λ (wavelength) is in meters (m)

Note: Use consistent units to ensure correct calculations.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem involving sound waves:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> The frequency of a sound wave is 440 Hz (the musical note A4), and the speed of sound in air is approximately 343 m/s.
          </li>
          <li>
            <strong>Step 1:</strong> Use the wave equation to find the wavelength: λ = v / f = 343 m/s ÷ 440 Hz ≈ 0.7795 m.
          </li>
          <li>
            <strong>Result:</strong> The wavelength of the 440 Hz sound wave in air is approximately 0.7795 meters.
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
          { symbol: "v", description: "Wave speed in meters per second (m/s)" },
          { symbol: "f", description: "Frequency in Hertz (Hz)" },
          { symbol: "λ", description: "Wavelength in meters (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the wavelength of a 440 Hz sound wave traveling at 343 m/s in air.",
        steps: [
          { label: "1", explanation: "Identify known values: frequency f = 440 Hz, wave speed v = 343 m/s." },
          { label: "2", explanation: "Apply the formula λ = v / f." },
          { label: "3", explanation: "Calculate λ = 343 / 440 ≈ 0.7795 meters." },
        ],
        result: "The wavelength of the sound wave is approximately 0.7795 meters.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
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