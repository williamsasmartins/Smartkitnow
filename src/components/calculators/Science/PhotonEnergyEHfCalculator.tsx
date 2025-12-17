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
  const [inputs, setInputs] = useState({
    frequency: "",
    unit: "Hz",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  const PLANCK_CONSTANT = 6.62607015e-34; // J·s

  // Frequency unit multipliers to Hz
  const frequencyUnitMultipliers = {
    Hz: 1,
    kHz: 1e3,
    MHz: 1e6,
    GHz: 1e9,
    THz: 1e12,
  };

  const results = useMemo(() => {
    const freqRaw = inputs.frequency.trim();
    const freqNum = Number(freqRaw);
    const unit = inputs.unit;

    if (!freqRaw) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "E = h × f",
      };
    }

    if (isNaN(freqNum)) {
      return {
        value: "Invalid input",
        label: "",
        subtext: "",
        warning: "Frequency must be a valid number.",
        formulaUsed: "E = h × f",
      };
    }

    if (freqNum < 0) {
      return {
        value: "Invalid input",
        label: "",
        subtext: "",
        warning: "Frequency cannot be negative. Please enter a value &ge; 0.",
        formulaUsed: "E = h × f",
      };
    }

    const freqHz = freqNum * (frequencyUnitMultipliers[unit] ?? 1);

    // Calculate photon energy: E = h * f
    const energyJoules = PLANCK_CONSTANT * freqHz;

    // Format energy in scientific notation with 4 decimals
    const energyFormatted = energyJoules.toExponential(4) + " Joules";

    // Provide subtext with frequency in Hz
    const freqFormatted =
      freqHz >= 1e9
        ? (freqHz / 1e9).toFixed(4) + " × 10⁹ Hz"
        : freqHz >= 1e6
        ? (freqHz / 1e6).toFixed(4) + " × 10⁶ Hz"
        : freqHz >= 1e3
        ? (freqHz / 1e3).toFixed(4) + " × 10³ Hz"
        : freqHz.toFixed(4) + " Hz";

    return {
      value: energyFormatted,
      label: "Photon Energy",
      subtext: `Calculated using frequency = ${freqFormatted}`,
      warning: null,
      formulaUsed: "E = h × f",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is photon energy and why is it important?",
      answer:
        "Photon energy is the amount of energy carried by a single photon, the fundamental particle of light. It is directly proportional to the frequency of the photon and is crucial in understanding phenomena in quantum physics, such as the photoelectric effect and atomic transitions.",
    },
    {
      question: "How do I convert frequency units for this calculator?",
      answer:
        "You can enter frequency values in Hertz (Hz), kilohertz (kHz), megahertz (MHz), gigahertz (GHz), or terahertz (THz). The calculator automatically converts these units to Hertz for accurate energy calculation.",
    },
    {
      question: "Can the photon energy be zero or negative?",
      answer:
        "Photon energy cannot be negative because frequency cannot be negative. If frequency is zero, photon energy is zero, meaning no photon energy is present. This calculator warns if negative frequencies are entered.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="frequency" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <Zap className="w-5 h-5 text-yellow-600" />
          Frequency
        </Label>
        <div className="flex gap-2">
          <Input
            id="frequency"
            type="text"
            placeholder="Enter frequency"
            value={inputs.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
            aria-describedby="frequency-desc"
          />
          <Select
            value={inputs.unit}
            onValueChange={(value) => handleInputChange("unit", value)}
            aria-label="Select frequency unit"
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hz">Hz</SelectItem>
              <SelectItem value="kHz">kHz</SelectItem>
              <SelectItem value="MHz">MHz</SelectItem>
              <SelectItem value="GHz">GHz</SelectItem>
              <SelectItem value="THz">THz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p id="frequency-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter the frequency of the photon. Frequency must be a number &ge; 0.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit calculation needed on click since useMemo updates automatically
          }}
          aria-label="Calculate photon energy"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ frequency: "", unit: "Hz" })}
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
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Photon Energy Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Photons are elementary particles representing quanta of light and other electromagnetic radiation. Each photon carries energy proportional to its frequency. The Photon Energy Calculator helps you determine the energy of a photon by inputting its frequency. This is essential in quantum physics, where energy quantization explains phenomena like the photoelectric effect and atomic emission spectra.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Frequency is the number of oscillations or waves per second, measured in Hertz (Hz). Higher frequency photons carry more energy. For example, ultraviolet light photons have higher frequencies and energies than visible light photons. Understanding photon energy is fundamental in fields such as spectroscopy, photonics, and quantum computing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use this calculator by entering the frequency of the photon in various units (Hz, kHz, MHz, GHz, THz). The calculator converts the frequency to Hertz and computes the energy using Planck's constant. Remember, frequency must be a non-negative number, as negative frequencies are physically meaningless.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`E = h × f

Where:
E = Photon energy (Joules)
h = Planck's constant (6.62607015 × 10⁻³⁴ J·s)
f = Frequency of the photon (Hertz, Hz)

Note: Frequency must be &ge; 0.`}
        </pre>
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
      description="Calculate the energy of a photon. Use Planck's constant and frequency (E=hf) to solve quantum physics problems."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "E = h × f",
        variables: [
          { symbol: "E", description: "Photon energy in Joules (J)" },
          { symbol: "h", description: "Planck's constant (6.62607015 × 10⁻³⁴ J·s)" },
          { symbol: "f", description: "Frequency of the photon in Hertz (Hz)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the energy of a photon with a frequency of 5.0 × 10¹⁴ Hz (visible light).",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the frequency: f = 5.0 × 10¹⁴ Hz.",
          },
          {
            label: "2",
            explanation:
              "Use Planck's constant: h = 6.62607015 × 10⁻³⁴ J·s.",
          },
          {
            label: "3",
            explanation:
              "Calculate energy: E = h × f = 6.62607015 × 10⁻³⁴ × 5.0 × 10¹⁴ = 3.313 × 10⁻¹⁹ Joules.",
          },
        ],
        result: "Photon energy is approximately 3.313 × 10⁻¹⁹ Joules.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Escape Velocity Calculator", url: "/science/escape-velocity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law Calculator", url: "/science/ideal-gas-law-pv-nrt", icon: "🧪" },
        { title: "Specific Heat Calculator", url: "/science/specific-heat-q-mc-delta-t", icon: "🔥" },
        { title: "Gravity on Other Planets Calculator", url: "/science/gravity-on-other-planets-calculator", icon: "🪐" },
        { title: "Molar Mass Calculator", url: "/science/molar-mass-calculator", icon: "🧪" },
        { title: "Heat Transfer (Conduction) Calculator", url: "/science/heat-transfer-conduction", icon: "🔥" },
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