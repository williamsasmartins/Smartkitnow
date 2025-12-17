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
  // Inputs: frequency (Hz) or wavelength (nm or m)
  // User can select input type: Frequency or Wavelength
  // Constants:
  // Planck's constant h = 6.62607015 × 10⁻³⁴ J·s
  // Speed of light c = 2.998 × 10⁸ m/s

  const PLANCK_CONSTANT = 6.62607015e-34; // J·s
  const SPEED_OF_LIGHT = 2.998e8; // m/s

  const [inputs, setInputs] = useState({
    inputType: "frequency", // "frequency" or "wavelength"
    frequency: "", // in Hz
    wavelength: "", // in nm or m (user selects unit)
    wavelengthUnit: "nm", // "nm" or "m"
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic in useMemo
  const results = useMemo(() => {
    // Parse inputs
    const freq = parseFloat(inputs.frequency);
    const wlRaw = parseFloat(inputs.wavelength);
    const wlUnit = inputs.wavelengthUnit;

    // Validation
    if (inputs.inputType === "frequency") {
      if (isNaN(freq) || freq <= 0) {
        return {
          value: "Waiting...",
          label: "Enter a valid frequency &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      // Calculate E = h * f
      const energy = PLANCK_CONSTANT * freq; // Joules

      // Format output
      const displayVal =
        energy > 10000 || energy < 0.001
          ? energy.toExponential(4)
          : energy.toFixed(6);

      return {
        value: `${displayVal} Joules`,
        label: "Photon Energy",
        subtext: `Using frequency f = ${freq.toLocaleString()} Hz`,
        warning: null,
        formulaUsed: "E = h × f",
      };
    } else if (inputs.inputType === "wavelength") {
      if (isNaN(wlRaw) || wlRaw <= 0) {
        return {
          value: "Waiting...",
          label: "Enter a valid wavelength &gt; 0",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      // Convert wavelength to meters if needed
      const wavelengthMeters = wlUnit === "nm" ? wlRaw * 1e-9 : wlRaw;

      if (wavelengthMeters <= 0) {
        return {
          value: "Waiting...",
          label: "Wavelength must be &gt; 0 meters",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }

      // Calculate frequency f = c / λ
      const freqCalc = SPEED_OF_LIGHT / wavelengthMeters;

      // Calculate energy E = h * f
      const energy = PLANCK_CONSTANT * freqCalc;

      // Format output
      const displayVal =
        energy > 10000 || energy < 0.001
          ? energy.toExponential(4)
          : energy.toFixed(6);

      return {
        value: `${displayVal} Joules`,
        label: "Photon Energy",
        subtext: `Using wavelength λ = ${wlRaw.toLocaleString()} ${wlUnit}`,
        warning: null,
        formulaUsed: "E = h × (c / λ)",
      };
    }

    return {
      value: "Waiting...",
      label: "Enter input values",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is photon energy and why is it important?",
      answer:
        "Photon energy is the amount of energy carried by a single photon, which is a quantum of electromagnetic radiation. It is directly proportional to the frequency of the photon and inversely proportional to its wavelength. Understanding photon energy is crucial in fields like quantum physics, spectroscopy, and telecommunications, where energy quantization affects how light interacts with matter.",
    },
    {
      question: "How do frequency and wavelength relate to photon energy?",
      answer:
        "Frequency and wavelength are inversely related properties of light. Photon energy increases with frequency and decreases with wavelength. This relationship is expressed by the formula E = h × f, where h is Planck's constant and f is frequency. Alternatively, since frequency equals the speed of light divided by wavelength, energy can also be calculated using wavelength.",
    },
    {
      question: "Where is the photon energy calculation applied in real life?",
      answer:
        "Photon energy calculations are essential in designing solar cells, lasers, and LED lights, where precise energy levels determine efficiency and color. It is also used in medical imaging and radiation therapies to understand how photons interact with tissues. Additionally, astrophysicists use photon energy to analyze light from stars and galaxies, revealing their composition and behavior.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Input Type Selector */}
      <div>
        <Label htmlFor="inputType" className="mb-1 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
          <Zap className="w-5 h-5 text-yellow-500" /> Select Input Type
        </Label>
        <Select
          value={inputs.inputType}
          onValueChange={(val) => setInputs((prev) => ({ ...prev, inputType: val }))}
          id="inputType"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select input type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frequency">Frequency (Hz)</SelectItem>
            <SelectItem value="wavelength">Wavelength</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Frequency Input */}
      {inputs.inputType === "frequency" && (
        <div>
          <Label htmlFor="frequency" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> Frequency (Hz)
          </Label>
          <Input
            id="frequency"
            type="number"
            min="0"
            step="any"
            placeholder="Enter frequency in Hertz"
            value={inputs.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
            aria-describedby="frequency-desc"
          />
          <p id="frequency-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Frequency must be &gt; 0 Hertz (Hz).
          </p>
        </div>
      )}

      {/* Wavelength Input */}
      {inputs.inputType === "wavelength" && (
        <>
          <div>
            <Label htmlFor="wavelength" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Wavelength
            </Label>
            <div className="flex gap-2">
              <Input
                id="wavelength"
                type="number"
                min="0"
                step="any"
                placeholder="Enter wavelength"
                value={inputs.wavelength}
                onChange={(e) => handleInputChange("wavelength", e.target.value)}
                aria-describedby="wavelength-desc"
              />
              <Select
                value={inputs.wavelengthUnit}
                onValueChange={(val) => handleInputChange("wavelengthUnit", val)}
                aria-label="Select wavelength unit"
                className="w-24"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nm">nm</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p id="wavelength-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Wavelength must be &gt; 0 nanometers (nm) or meters (m).
            </p>
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
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
              <strong>Science Fact:</strong> Always ensure units are consistent; convert nanometers to meters when calculating photon energy from wavelength.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Photon Energy Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Photons are the fundamental particles of light and other forms of electromagnetic radiation. Each photon carries a discrete amount of energy, known as photon energy, which is directly proportional to its frequency and inversely proportional to its wavelength. This calculator allows you to determine the energy of a photon by inputting either its frequency or wavelength, using the fundamental principles of quantum physics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The energy of a photon is crucial in understanding phenomena such as the photoelectric effect, spectroscopy, and the behavior of atoms and molecules when interacting with light. This knowledge is applied in technologies ranging from solar panels to lasers and medical imaging devices.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that frequency must be entered in Hertz (Hz), and wavelength can be entered in nanometers (nm) or meters (m). The calculator automatically converts units as necessary to provide accurate results in Joules.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`E = h × f

where:
  E = Photon energy (Joules)
  h = Planck's constant = 6.62607015 × 10⁻³⁴ J·s
  f = Frequency of the photon (Hertz)

Alternatively, since f = c / λ:

E = h × (c / λ)

where:
  c = Speed of light = 2.998 × 10⁸ m/s
  λ = Wavelength of the photon (meters)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem: Calculate the energy of a photon with a wavelength of 500 nm, which corresponds to green light.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Wavelength λ = 500 nm = 500 × 10⁻⁹ m = 5.0 × 10⁻⁷ m
          </li>
          <li>
            <strong>Step 1:</strong> Calculate frequency f = c / λ = (2.998 × 10⁸ m/s) / (5.0 × 10⁻⁷ m) = 5.996 × 10¹⁴ Hz
          </li>
          <li>
            <strong>Step 2:</strong> Calculate energy E = h × f = (6.62607015 × 10⁻³⁴ J·s) × (5.996 × 10¹⁴ Hz) = 3.972 × 10⁻¹⁹ Joules
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
        formula: "E = h × f or E = h × (c / λ)",
        variables: [
          { symbol: "E", description: "Photon energy in Joules (J)" },
          { symbol: "h", description: "Planck's constant = 6.62607015 × 10⁻³⁴ J·s" },
          { symbol: "f", description: "Frequency in Hertz (Hz)" },
          { symbol: "c", description: "Speed of light = 2.998 × 10⁸ m/s" },
          { symbol: "λ", description: "Wavelength in meters (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the energy of a photon with wavelength 500 nm (green light).",
        steps: [
          { label: "1", explanation: "Convert wavelength to meters: 500 nm = 5.0 × 10⁻⁷ m." },
          { label: "2", explanation: "Calculate frequency: f = c / λ = 2.998 × 10⁸ / 5.0 × 10⁻⁷ = 5.996 × 10¹⁴ Hz." },
          { label: "3", explanation: "Calculate energy: E = h × f = 6.62607015 × 10⁻³⁴ × 5.996 × 10¹⁴ = 3.972 × 10⁻¹⁹ Joules." },
        ],
        result: "Photon energy ≈ 3.972 × 10⁻¹⁹ Joules.",
      }}
      relatedCalculators={[
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
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