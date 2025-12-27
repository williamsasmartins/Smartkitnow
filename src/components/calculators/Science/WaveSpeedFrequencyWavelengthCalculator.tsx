import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Waves, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function WaveSpeedFrequencyWavelengthCalculator() {
  type KnownVariable = "waveSpeed" | "frequency" | "wavelength";
  const [knownVariable, setKnownVariable] = useState<KnownVariable>("waveSpeed");
  const [inputs, setInputs] = useState<{ waveSpeed?: string; frequency?: string; wavelength?: string }>({});

  const handleInputChange = useCallback((name: keyof typeof inputs, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Parse inputs as floats
    const waveSpeed = inputs.waveSpeed ? parseFloat(inputs.waveSpeed) : NaN;
    const frequency = inputs.frequency ? parseFloat(inputs.frequency) : NaN;
    const wavelength = inputs.wavelength ? parseFloat(inputs.wavelength) : NaN;

    // Validate inputs: must be positive numbers
    const isPositive = (n: number) => !isNaN(n) && n > 0;

    // Initialize result object
    let value = "Waiting...";
    let label = "";
    let subtext = "";
    let warning: string | null = null;
    let formulaUsed = "";

    // Calculation logic based on known variable
    if (knownVariable === "waveSpeed") {
      // waveSpeed = frequency * wavelength
      if (!isPositive(waveSpeed)) {
        warning = "Please enter a valid positive wave speed (m/s).";
      } else if (!isPositive(frequency) && !isPositive(wavelength)) {
        warning = "Please enter frequency or wavelength to calculate the missing variable.";
      } else if (isPositive(frequency) && !isPositive(wavelength)) {
        // Calculate wavelength = waveSpeed / frequency
        const calcWavelength = waveSpeed / frequency;
        if (calcWavelength <= 0) {
          warning = "Calculated wavelength is not physically valid.";
        } else {
          value = calcWavelength.toExponential(4) + " m";
          label = "Wavelength";
          formulaUsed = "λ = v / f";
          subtext = `Calculated from wave speed (${waveSpeed.toExponential(4)} m/s) and frequency (${frequency.toExponential(4)} Hz).`;
        }
      } else if (!isPositive(frequency) && isPositive(wavelength)) {
        // Calculate frequency = waveSpeed / wavelength
        const calcFrequency = waveSpeed / wavelength;
        if (calcFrequency <= 0) {
          warning = "Calculated frequency is not physically valid.";
        } else {
          value = calcFrequency.toExponential(4) + " Hz";
          label = "Frequency";
          formulaUsed = "f = v / λ";
          subtext = `Calculated from wave speed (${waveSpeed.toExponential(4)} m/s) and wavelength (${wavelength.toExponential(4)} m).`;
        }
      } else if (isPositive(frequency) && isPositive(wavelength)) {
        // Check consistency: v ?= f * λ
        const expectedV = frequency * wavelength;
        const diff = Math.abs(expectedV - waveSpeed);
        if (diff / waveSpeed > 0.01) {
          warning =
            "Input values are inconsistent: wave speed should equal frequency × wavelength.";
        } else {
          value = waveSpeed.toExponential(4) + " m/s";
          label = "Wave Speed (consistent)";
          formulaUsed = "v = f × λ";
          subtext = `Inputs satisfy the wave equation within 1% tolerance.`;
        }
      } else {
        warning = "Please enter frequency or wavelength along with wave speed.";
      }
    } else if (knownVariable === "frequency") {
      // frequency = waveSpeed / wavelength
      if (!isPositive(frequency)) {
        warning = "Please enter a valid positive frequency (Hz).";
      } else if (!isPositive(waveSpeed) && !isPositive(wavelength)) {
        warning = "Please enter wave speed or wavelength to calculate the missing variable.";
      } else if (isPositive(waveSpeed) && !isPositive(wavelength)) {
        // Calculate wavelength = waveSpeed / frequency
        const calcWavelength = waveSpeed / frequency;
        if (calcWavelength <= 0) {
          warning = "Calculated wavelength is not physically valid.";
        } else {
          value = calcWavelength.toExponential(4) + " m";
          label = "Wavelength";
          formulaUsed = "λ = v / f";
          subtext = `Calculated from wave speed (${waveSpeed.toExponential(4)} m/s) and frequency (${frequency.toExponential(4)} Hz).`;
        }
      } else if (!isPositive(waveSpeed) && isPositive(wavelength)) {
        // Calculate waveSpeed = frequency * wavelength
        const calcWaveSpeed = frequency * wavelength;
        if (calcWaveSpeed <= 0) {
          warning = "Calculated wave speed is not physically valid.";
        } else {
          value = calcWaveSpeed.toExponential(4) + " m/s";
          label = "Wave Speed";
          formulaUsed = "v = f × λ";
          subtext = `Calculated from frequency (${frequency.toExponential(4)} Hz) and wavelength (${wavelength.toExponential(4)} m).`;
        }
      } else if (isPositive(waveSpeed) && isPositive(wavelength)) {
        // Check consistency: f ?= v / λ
        const expectedF = waveSpeed / wavelength;
        const diff = Math.abs(expectedF - frequency);
        if (diff / frequency > 0.01) {
          warning =
            "Input values are inconsistent: frequency should equal wave speed ÷ wavelength.";
        } else {
          value = frequency.toExponential(4) + " Hz";
          label = "Frequency (consistent)";
          formulaUsed = "f = v / λ";
          subtext = `Inputs satisfy the wave equation within 1% tolerance.`;
        }
      } else {
        warning = "Please enter wave speed or wavelength along with frequency.";
      }
    } else if (knownVariable === "wavelength") {
      // wavelength = waveSpeed / frequency
      if (!isPositive(wavelength)) {
        warning = "Please enter a valid positive wavelength (m).";
      } else if (!isPositive(waveSpeed) && !isPositive(frequency)) {
        warning = "Please enter wave speed or frequency to calculate the missing variable.";
      } else if (isPositive(waveSpeed) && !isPositive(frequency)) {
        // Calculate frequency = waveSpeed / wavelength
        const calcFrequency = waveSpeed / wavelength;
        if (calcFrequency <= 0) {
          warning = "Calculated frequency is not physically valid.";
        } else {
          value = calcFrequency.toExponential(4) + " Hz";
          label = "Frequency";
          formulaUsed = "f = v / λ";
          subtext = `Calculated from wave speed (${waveSpeed.toExponential(4)} m/s) and wavelength (${wavelength.toExponential(4)} m).`;
        }
      } else if (!isPositive(waveSpeed) && isPositive(frequency)) {
        // Calculate waveSpeed = frequency * wavelength
        const calcWaveSpeed = frequency * wavelength;
        if (calcWaveSpeed <= 0) {
          warning = "Calculated wave speed is not physically valid.";
        } else {
          value = calcWaveSpeed.toExponential(4) + " m/s";
          label = "Wave Speed";
          formulaUsed = "v = f × λ";
          subtext = `Calculated from frequency (${frequency.toExponential(4)} Hz) and wavelength (${wavelength.toExponential(4)} m).`;
        }
      } else if (isPositive(waveSpeed) && isPositive(frequency)) {
        // Check consistency: λ ?= v / f
        const expectedLambda = waveSpeed / frequency;
        const diff = Math.abs(expectedLambda - wavelength);
        if (diff / wavelength > 0.01) {
          warning =
            "Input values are inconsistent: wavelength should equal wave speed ÷ frequency.";
        } else {
          value = wavelength.toExponential(4) + " m";
          label = "Wavelength (consistent)";
          formulaUsed = "λ = v / f";
          subtext = `Inputs satisfy the wave equation within 1% tolerance.`;
        }
      } else {
        warning = "Please enter wave speed or frequency along with wavelength.";
      }
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs, knownVariable]);

  const faqs = [
    {
      question: "How are wave speed, frequency, and wavelength related?",
      answer:
        "Wave speed, frequency, and wavelength are related by the wave equation: v = f × λ. This means the speed of a wave equals its frequency multiplied by its wavelength. If you know any two of these properties, you can calculate the third using this fundamental relationship.",
    },
    {
      question: "What units should I use for wave speed, frequency, and wavelength?",
      answer:
        "Wave speed is typically measured in meters per second (m/s), frequency in hertz (Hz), and wavelength in meters (m). Using consistent SI units ensures accurate calculations and meaningful results.",
    },
    {
      question: "Can wave speed change depending on the medium?",
      answer:
        "Yes, wave speed depends on the medium through which the wave travels. For example, sound waves travel faster in solids than in gases. The frequency remains constant when a wave passes between media, but wavelength and speed can change.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Select known variable */}
      <div>
        <Label htmlFor="knownVariable" className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-slate-100">
          <Waves className="w-5 h-5 text-blue-600" />
          Known Variable
        </Label>
        <Select
          value={knownVariable}
          onValueChange={(val) => {
            setKnownVariable(val as KnownVariable);
            setInputs({});
          }}
          id="knownVariable"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waveSpeed">Wave Speed (v)</SelectItem>
            <SelectItem value="frequency">Frequency (f)</SelectItem>
            <SelectItem value="wavelength">Wavelength (λ)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="waveSpeed" className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-slate-100">
            <Waves className="w-4 h-4 text-blue-600" />
            Wave Speed (v) [m/s]
          </Label>
          <Input
            id="waveSpeed"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 340"
            value={inputs.waveSpeed ?? ""}
            onChange={(e) => handleInputChange("waveSpeed", e.target.value)}
            disabled={knownVariable === "waveSpeed"}
            aria-describedby="waveSpeedHelp"
          />
          {knownVariable === "waveSpeed" && (
            <p id="waveSpeedHelp" className="text-xs text-slate-500 mt-1">
              Enter known wave speed
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="frequency" className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-slate-100">
            <Waves className="w-4 h-4 text-blue-600" />
            Frequency (f) [Hz]
          </Label>
          <Input
            id="frequency"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 256"
            value={inputs.frequency ?? ""}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
            disabled={knownVariable === "frequency"}
            aria-describedby="frequencyHelp"
          />
          {knownVariable === "frequency" && (
            <p id="frequencyHelp" className="text-xs text-slate-500 mt-1">
              Enter known frequency
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="wavelength" className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-slate-100">
            <Waves className="w-4 h-4 text-blue-600" />
            Wavelength (λ) [m]
          </Label>
          <Input
            id="wavelength"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1.33"
            value={inputs.wavelength ?? ""}
            onChange={(e) => handleInputChange("wavelength", e.target.value)}
            disabled={knownVariable === "wavelength"}
            aria-describedby="wavelengthHelp"
          />
          {knownVariable === "wavelength" && (
            <p id="wavelengthHelp" className="text-xs text-slate-500 mt-1">
              Enter known wavelength
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed; calculation is reactive
          }}
          type="button"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Wave Speed / Frequency / Wavelength</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Waves are disturbances that transfer energy through a medium without transferring matter. The three fundamental properties of waves are wave speed (v), frequency (f), and wavelength (λ). Wave speed is how fast the wave propagates through the medium, frequency is how many wave cycles pass a point per second, and wavelength is the distance between successive wave crests or troughs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These properties are intrinsically linked by the wave equation: <code>v = f × λ</code>. This means the speed of a wave equals its frequency multiplied by its wavelength. If you know any two of these variables, you can calculate the third. This relationship holds true for all types of waves, including sound waves, light waves, and water waves.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          It is important to use consistent units when working with these variables: wave speed in meters per second (m/s), frequency in hertz (Hz), and wavelength in meters (m). Understanding this relationship helps in fields ranging from acoustics to optics and oceanography.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that wave speed can change depending on the medium, but frequency remains constant when a wave passes from one medium to another. Consequently, wavelength adjusts to maintain the relationship defined by the wave equation.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`v = f × λ

Where:
v = Wave speed (m/s)
f = Frequency (Hz)
λ = Wavelength (m)

Rearranged formulas:
f = v ÷ λ
λ = v ÷ f`}
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Wave%20Properties%20Physics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wave Properties Physics - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Wave Properties Physics, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Wave%20Properties%20Physics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wave Properties Physics - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Wave Properties Physics at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://www.physicsclassroom.com/search?q=Wave%20Properties%20Physics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wave Properties Physics - The Physics Classroom
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Explore student-friendly tutorials, interactives, and concept builders related to Wave Properties Physics designed to improve understanding of physics principles.
            </p>
          </li>
          <li>
            <a href="http://hyperphysics.phy-astr.gsu.edu/hbase/hph.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Wave Properties Physics - HyperPhysics
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Navigate the HyperPhysics concept map to find concise summaries and calculation examples for Wave Properties Physics.
            </p>
          </li>
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
        scenario:
          "A sound wave travels at 340 m/s and has a frequency of 256 Hz. Calculate its wavelength.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify known values: wave speed v = 340 m/s, frequency f = 256 Hz.",
          },
          {
            label: "2",
            explanation:
              "Use the formula λ = v ÷ f to find the wavelength.",
          },
          {
            label: "3",
            explanation:
              "Calculate λ = 340 ÷ 256 ≈ 1.3281 meters.",
          },
        ],
        result: "The wavelength of the sound wave is approximately 1.3281 meters.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Momentum & Impulse Calculator", url: "/science/momentum-impulse-calculator", icon: "🧪" },
        { title: "Radioactive Activity Calculator", url: "/science/radioactive-activity-a-lambda-n", icon: "🧪" },
        { title: "Kinematics Equations Solver (SUVAT)", url: "/science/kinematics-suvat-solver", icon: "🚀" },
        { title: "Heat Transfer (Conduction) Calculator", url: "/science/heat-transfer-conduction", icon: "🔥" },
        { title: "Density / Specific Gravity Calculator", url: "/science/density-specific-gravity-calculator", icon: "🪐" },
        { title: "Dilution Calculator (C₁V₁ = C₂V₂)", url: "/science/dilution-c1v1-c2v2", icon: "🧪" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References & Resources" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}