import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Zap, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PhotonEnergyEHfCalculator() {
  // Inputs: frequency (Hz) or wavelength (nm, μm, m)
  // User can select input type, then enter value
  const [inputs, setInputs] = useState({
    inputType: "frequency", // "frequency" or "wavelength"
    frequency: "", // in Hz
    wavelength: "", // in meters internally, but input in nm or μm or m
    wavelengthUnit: "nm", // nm, μm, m
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  const PLANCK_CONSTANT = 6.62607015e-34; // J·s (exact)
  const SPEED_OF_LIGHT = 2.998e8; // m/s (approximate)

  // Convert wavelength input to meters
  const wavelengthInMeters = useMemo(() => {
    const val = parseFloat(inputs.wavelength);
    if (isNaN(val) || val <= 0) return null;
    switch (inputs.wavelengthUnit) {
      case "nm":
        return val * 1e-9;
      case "μm":
        return val * 1e-6;
      case "m":
        return val;
      default:
        return null;
    }
  }, [inputs.wavelength, inputs.wavelengthUnit]);

  // Parse frequency input
  const frequencyValue = useMemo(() => {
    const val = parseFloat(inputs.frequency);
    if (isNaN(val) || val <= 0) return null;
    return val;
  }, [inputs.frequency]);

  // Calculation logic
  const results = useMemo(() => {
    // Validation
    if (inputs.inputType === "frequency") {
      if (!frequencyValue) {
        return {
          value: "Waiting...",
          label: "Enter frequency &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      // E = h * f
      const energy = PLANCK_CONSTANT * frequencyValue; // Joules

      // Format output
      const displayVal =
        energy > 10000 || energy < 0.001
          ? energy.toExponential(4) + " Joules"
          : energy.toFixed(6) + " Joules";

      return {
        value: displayVal,
        label: "Photon Energy",
        subtext: `Using frequency f = ${frequencyValue.toExponential(
          4
        )} Hz and Planck's constant h = ${PLANCK_CONSTANT.toExponential(4)} J·s`,
        warning: null,
        formulaUsed: "E = h × f",
      };
    } else if (inputs.inputType === "wavelength") {
      if (!wavelengthInMeters) {
        return {
          value: "Waiting...",
          label: "Enter wavelength &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      // f = c / λ
      const frequency = SPEED_OF_LIGHT / wavelengthInMeters;
      // E = h * f
      const energy = PLANCK_CONSTANT * frequency;

      // Format output
      const displayVal =
        energy > 10000 || energy < 0.001
          ? energy.toExponential(4) + " Joules"
          : energy.toFixed(6) + " Joules";

      return {
        value: displayVal,
        label: "Photon Energy",
        subtext: `Using wavelength λ = ${wavelengthInMeters.toExponential(
          4
        )} m, speed of light c = ${SPEED_OF_LIGHT.toExponential(
          4
        )} m/s, and Planck's constant h = ${PLANCK_CONSTANT.toExponential(4)} J·s`,
        warning: null,
        formulaUsed: "E = h × (c / λ)",
      };
    }
    return {
      value: "Waiting...",
      label: "Select input type and enter value",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs.inputType, frequencyValue, wavelengthInMeters]);

  // FAQs
  const faqs = [
    {
      question: "What is photon energy and why is it important?",
      answer:
        "Photon energy is the amount of energy carried by a single photon, the fundamental particle of light. It is directly proportional to the frequency of the light and inversely proportional to its wavelength. Understanding photon energy is crucial in fields like quantum physics, spectroscopy, and photochemistry, where it helps explain phenomena such as the photoelectric effect and energy transitions in atoms.",
    },
    {
      question: "How do frequency and wavelength relate to photon energy?",
      answer:
        "Photon energy is calculated using the formula E = hf, where h is Planck's constant and f is the frequency of the photon. Since frequency and wavelength are inversely related by the speed of light (f = c/λ), photon energy can also be expressed as E = hc/λ. This means higher frequency (or shorter wavelength) photons have more energy, which is fundamental in understanding electromagnetic radiation.",
    },
    {
      question: "Where is the photon energy calculation applied in real life?",
      answer:
        "Photon energy calculations are essential in designing solar cells, lasers, and LED lights, where controlling photon energies determines efficiency and color. In astronomy, it helps analyze the energy output of stars and cosmic phenomena. Additionally, in medical physics, photon energy is critical for radiation therapies and diagnostic imaging technologies.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Input Type Selector */}
      <div>
        <Label htmlFor="inputType" className="mb-1 inline-block font-semibold">
          Select Input Type
        </Label>
        <Select
          value={inputs.inputType}
          onValueChange={(val) => handleInputChange("inputType", val)}
          id="inputType"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select input type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frequency">
              Frequency (Hz) <Zap className="inline ml-1 w-4 h-4" />
            </SelectItem>
            <SelectItem value="wavelength">
              Wavelength (nm, μm, m) <Atom className="inline ml-1 w-4 h-4" />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Frequency Input */}
      {inputs.inputType === "frequency" && (
        <div>
          <Label htmlFor="frequency" className="mb-1 inline-block font-semibold">
            Frequency (Hz)
          </Label>
          <Input
            id="frequency"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5.0e14"
            value={inputs.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Enter frequency in Hertz (Hz). Must be &gt; 0.
          </p>
        </div>
      )}

      {/* Wavelength Input */}
      {inputs.inputType === "wavelength" && (
        <>
          <div>
            <Label htmlFor="wavelength" className="mb-1 inline-block font-semibold">
              Wavelength
            </Label>
            <div className="flex gap-2">
              <Input
                id="wavelength"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 500"
                value={inputs.wavelength}
                onChange={(e) => handleInputChange("wavelength", e.target.value)}
              />
              <Select
                value={inputs.wavelengthUnit}
                onValueChange={(val) => handleInputChange("wavelengthUnit", val)}
                aria-label="Select wavelength unit"
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nm">nm</SelectItem>
                  <SelectItem value="μm">μm</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Enter wavelength and select unit. Must be &gt; 0.
            </p>
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate photon energy"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              inputType: "frequency",
              frequency: "",
              wavelength: "",
              wavelengthUnit: "nm",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
              <strong>Science Fact:</strong> Photon energy is fundamental in quantum mechanics and is measured in Joules. Always ensure frequency is in Hertz and wavelength in meters for accurate results.
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
          Understanding Photon Energy Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Photons are the fundamental particles of light and other forms of electromagnetic radiation. Each photon carries a discrete amount of energy known as photon energy. This energy is directly proportional to the frequency of the photon and inversely proportional to its wavelength. The Photon Energy Calculator allows you to compute this energy by entering either the frequency or the wavelength of the photon.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculation is essential in quantum physics, where energy quantization explains phenomena such as the photoelectric effect and atomic emission spectra. By understanding photon energy, scientists and engineers can design devices like solar cells, lasers, and LEDs, and analyze cosmic radiation in astronomy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always remember to use consistent units: frequency in Hertz (Hz) and wavelength in meters (m). The calculator supports common wavelength units like nanometers (nm) and micrometers (μm), converting them internally for accurate results.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`E = h × f

or equivalently,

E = h × (c / λ)

where:
  E = Photon energy (Joules)
  h = Planck's constant = 6.62607015 × 10⁻³⁴ J·s
  f = Frequency of the photon (Hz)
  c = Speed of light = 2.998 × 10⁸ m/s
  λ = Wavelength of the photon (meters)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem calculating the energy of a photon with a wavelength of 500 nm, which corresponds to green light.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Wavelength λ = 500 nm = 500 × 10⁻⁹ m = 5.0 × 10⁻⁷ m
          </li>
          <li>
            <strong>Step 1:</strong> Calculate frequency f = c / λ = (2.998 × 10⁸ m/s) / (5.0 × 10⁻⁷ m) = 5.996 × 10¹⁴ Hz
          </li>
          <li>
            <strong>Step 2:</strong> Calculate photon energy E = h × f = (6.62607015 × 10⁻³⁴ J·s) × (5.996 × 10¹⁴ Hz) ≈ 3.972 × 10⁻¹⁹ Joules
          </li>
          <li>
            <strong>Result:</strong> The photon energy is approximately 3.972 × 10⁻¹⁹ Joules.
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
      title="Photon Energy Calculator"
      description="Calculate the energy of a photon. Use Planck's constant and frequency (E=hf) or wavelength (E=hc/λ) to solve quantum physics problems."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "E = h × f  or  E = h × (c / λ)",
        variables: [
          { symbol: "E", description: "Photon energy in Joules (J)" },
          { symbol: "h", description: "Planck's constant = 6.62607015 × 10⁻³⁴ J·s" },
          { symbol: "f", description: "Frequency in Hertz (Hz)" },
          { symbol: "c", description: "Speed of light = 2.998 × 10⁸ meters per second (m/s)" },
          { symbol: "λ", description: "Wavelength in meters (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the energy of a photon with wavelength 500 nm (green light).",
        steps: [
          { label: "1", explanation: "Convert wavelength to meters: 500 nm = 5.0 × 10⁻⁷ m." },
          { label: "2", explanation: "Calculate frequency: f = c / λ = 2.998 × 10⁸ / 5.0 × 10⁻⁷ = 5.996 × 10¹⁴ Hz." },
          { label: "3", explanation: "Calculate energy: E = h × f = 6.62607015 × 10⁻³⁴ × 5.996 × 10¹⁴ ≈ 3.972 × 10⁻¹⁹ Joules." },
        ],
        result: "Photon energy ≈ 3.972 × 10⁻¹⁹ Joules.",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "Orbit" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "Zap" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "Waves" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "FlaskConical" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "Thermometer" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "Zap" },
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