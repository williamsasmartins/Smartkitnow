import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, FlaskConical, Zap, Orbit, Thermometer, Scale, Waves, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const R = 8.314462618; // J/(mol·K) - Ideal gas constant precise value

export default function IdealGasLawPvNrtCalculator() {
  const [inputs, setInputs] = useState({
    pressure: "",
    volume: "",
    moles: "",
    temperature: "",
    solveFor: "pressure",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { pressure, volume, moles, temperature, solveFor } = inputs;

    // Parse inputs to floats
    const P = parseFloat(pressure);
    const V = parseFloat(volume);
    const n = parseFloat(moles);
    const T = parseFloat(temperature);

    // Validation and warnings
    let warning = null;

    // Check for negative or zero values where physically invalid
    if (solveFor !== "pressure" && P !== undefined && !isNaN(P) && P <= 0) {
      warning = "Pressure must be greater than 0 Pa.";
    }
    if (solveFor !== "volume" && V !== undefined && !isNaN(V) && V <= 0) {
      warning = "Volume must be greater than 0 m³.";
    }
    if (solveFor !== "moles" && n !== undefined && !isNaN(n) && n <= 0) {
      warning = "Amount of substance (moles) must be greater than 0 mol.";
    }
    if (solveFor !== "temperature" && T !== undefined && !isNaN(T) && T <= 0) {
      warning = "Temperature must be greater than 0 K.";
    }

    // If any required input is missing or invalid, wait
    const requiredInputs = {
      pressure: ["volume", "moles", "temperature"],
      volume: ["pressure", "moles", "temperature"],
      moles: ["pressure", "volume", "temperature"],
      temperature: ["pressure", "volume", "moles"],
    };

    const missingInput = requiredInputs[solveFor].some(
      (key) => inputs[key] === "" || isNaN(parseFloat(inputs[key]))
    );

    if (missingInput) {
      return {
        value: "Waiting...",
        label: "Please enter all required inputs",
        subtext: null,
        warning: null,
        formulaUsed: null,
      };
    }

    if (warning) {
      return {
        value: "Error",
        label: "Invalid input detected",
        subtext: null,
        warning,
        formulaUsed: null,
      };
    }

    // Calculate based on PV = nRT
    // Units:
    // P in Pascals (Pa)
    // V in cubic meters (m³)
    // n in moles (mol)
    // T in Kelvin (K)
    // R = 8.314462618 J/(mol·K)

    let resultValue = null;
    let label = "";
    let formulaUsed = "";

    try {
      switch (solveFor) {
        case "pressure":
          // P = nRT / V
          if (V === 0) {
            return {
              value: "Error",
              label: "Volume cannot be zero",
              subtext: null,
              warning: "Volume must be greater than 0 m³.",
              formulaUsed: null,
            };
          }
          resultValue = (n * R * T) / V;
          label = "Pressure (P) in Pascals (Pa)";
          formulaUsed = "P = nRT / V";
          break;

        case "volume":
          // V = nRT / P
          if (P === 0) {
            return {
              value: "Error",
              label: "Pressure cannot be zero",
              subtext: null,
              warning: "Pressure must be greater than 0 Pa.",
              formulaUsed: null,
            };
          }
          resultValue = (n * R * T) / P;
          label = "Volume (V) in cubic meters (m³)";
          formulaUsed = "V = nRT / P";
          break;

        case "moles":
          // n = PV / RT
          if (T === 0) {
            return {
              value: "Error",
              label: "Temperature cannot be zero",
              subtext: null,
              warning: "Temperature must be greater than 0 K.",
              formulaUsed: null,
            };
          }
          resultValue = (P * V) / (R * T);
          label = "Amount of substance (n) in moles (mol)";
          formulaUsed = "n = PV / RT";
          break;

        case "temperature":
          // T = PV / nR
          if (n === 0) {
            return {
              value: "Error",
              label: "Moles cannot be zero",
              subtext: null,
              warning: "Amount of substance (moles) must be greater than 0 mol.",
              formulaUsed: null,
            };
          }
          resultValue = (P * V) / (n * R);
          label = "Temperature (T) in Kelvin (K)";
          formulaUsed = "T = PV / nR";
          break;

        default:
          return {
            value: "Waiting...",
            label: "Select a variable to solve for",
            subtext: null,
            warning: null,
            formulaUsed: null,
          };
      }
    } catch {
      return {
        value: "Error",
        label: "Calculation error",
        subtext: null,
        warning: "Please check your inputs.",
        formulaUsed: null,
      };
    }

    // Format result in scientific notation if very large or small
    const absResult = Math.abs(resultValue);
    const formattedValue =
      absResult !== 0 && (absResult < 0.001 || absResult > 1e5)
        ? resultValue.toExponential(4)
        : resultValue.toFixed(4);

    return {
      value: formattedValue,
      label,
      subtext: "Using R = 8.314462618 J/(mol·K)",
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Ideal Gas Law and when is it applicable?",
      answer:
        "The Ideal Gas Law (PV = nRT) relates the pressure, volume, temperature, and amount of an ideal gas. It assumes gas particles have negligible volume and no intermolecular forces. It is most accurate for gases at low pressure and high temperature, where real gases behave ideally.",
    },
    {
      question: "Why must temperature be in Kelvin for the Ideal Gas Law?",
      answer:
        "Temperature must be in Kelvin because the Ideal Gas Law is derived from absolute temperature scales. Kelvin starts at absolute zero (0 K), where molecular motion ceases. Using Celsius or Fahrenheit would yield incorrect results as they do not start at absolute zero.",
    },
    {
      question: "Can I use this calculator for real gases?",
      answer:
        "This calculator assumes ideal gas behavior. Real gases deviate from this law at high pressures and low temperatures due to molecular interactions and volume. For precise calculations with real gases, more complex equations like Van der Waals equation are required.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="solveFor" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            Solve for:
          </Label>
          <Select
            value={inputs.solveFor}
            onValueChange={(value) => handleInputChange("solveFor", value)}
          >
            <SelectTrigger aria-label="Select variable to solve for" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pressure">Pressure (P)</SelectItem>
              <SelectItem value="volume">Volume (V)</SelectItem>
              <SelectItem value="moles">Moles (n)</SelectItem>
              <SelectItem value="temperature">Temperature (T)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pressure input */}
        <div>
          <Label htmlFor="pressure" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <Scale className="w-5 h-5 text-blue-600" />
            Pressure (P) [Pascals, Pa]
          </Label>
          <Input
            id="pressure"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 101325"
            value={inputs.pressure}
            onChange={(e) => handleInputChange("pressure", e.target.value)}
            disabled={inputs.solveFor === "pressure"}
            aria-describedby="pressure-desc"
          />
          <p id="pressure-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Atmospheric pressure ≈ 101325 Pa
          </p>
        </div>

        {/* Volume input */}
        <div>
          <Label htmlFor="volume" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <Orbit className="w-5 h-5 text-blue-600" />
            Volume (V) [cubic meters, m³]
          </Label>
          <Input
            id="volume"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.025"
            value={inputs.volume}
            onChange={(e) => handleInputChange("volume", e.target.value)}
            disabled={inputs.solveFor === "volume"}
            aria-describedby="volume-desc"
          />
          <p id="volume-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            1 L = 0.001 m³
          </p>
        </div>

        {/* Moles input */}
        <div>
          <Label htmlFor="moles" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <Zap className="w-5 h-5 text-blue-600" />
            Amount of substance (n) [moles, mol]
          </Label>
          <Input
            id="moles"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1"
            value={inputs.moles}
            onChange={(e) => handleInputChange("moles", e.target.value)}
            disabled={inputs.solveFor === "moles"}
            aria-describedby="moles-desc"
          />
          <p id="moles-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Number of moles of gas
          </p>
        </div>

        {/* Temperature input */}
        <div>
          <Label htmlFor="temperature" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <Thermometer className="w-5 h-5 text-blue-600" />
            Temperature (T) [Kelvin, K]
          </Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 298"
            value={inputs.temperature}
            onChange={(e) => handleInputChange("temperature", e.target.value)}
            disabled={inputs.solveFor === "temperature"}
            aria-describedby="temperature-desc"
          />
          <p id="temperature-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Absolute temperature in Kelvin (K)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; calculation is reactive
          }}
          aria-label="Calculate Ideal Gas Law"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              pressure: "",
              volume: "",
              moles: "",
              temperature: "",
              solveFor: "pressure",
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Ideal Gas Law Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Ideal Gas Law is a fundamental equation in chemistry and physics that describes the behavior of ideal gases. It relates the pressure (P), volume (V), temperature (T), and amount of substance (n) of a gas through the formula PV = nRT, where R is the ideal gas constant. This calculator allows you to solve for any one of these variables when the others are known.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ideal gases are hypothetical gases that perfectly follow this law, assuming no intermolecular forces and that gas particles occupy no volume. While no real gas behaves perfectly ideally, many gases approximate this behavior under standard conditions of temperature and pressure.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When using this calculator, ensure that temperature is entered in Kelvin (K), volume in cubic meters (m³), pressure in Pascals (Pa), and amount of substance in moles (mol). The calculator will warn you if inputs are physically invalid, such as negative values or zero where not allowed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is ideal for students, educators, and professionals needing quick and accurate calculations related to gas laws, enhancing understanding and application of thermodynamics principles.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`PV = nRT

Where:
P = Pressure (Pascals, Pa)
V = Volume (cubic meters, m³)
n = Amount of substance (moles, mol)
R = Ideal gas constant = 8.314462618 J/(mol·K)
T = Temperature (Kelvin, K)

Rearranged formulas to solve for each variable:

Pressure:
P = (n × R × T) / V

Volume:
V = (n × R × T) / P

Moles:
n = (P × V) / (R × T)

Temperature:
T = (P × V) / (n × R)`}
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
      title="Ideal Gas Law Calculator"
      description="Solve Ideal Gas Law problems (PV = nRT). Calculate pressure, volume, temperature, or moles of a gas instantly."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "PV = nRT",
        variables: [
          { symbol: "P", description: "Pressure in Pascals (Pa)" },
          { symbol: "V", description: "Volume in cubic meters (m³)" },
          { symbol: "n", description: "Amount of substance in moles (mol)" },
          { symbol: "R", description: "Ideal gas constant = 8.314462618 J/(mol·K)" },
          { symbol: "T", description: "Temperature in Kelvin (K)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the pressure of 2 moles of an ideal gas contained in a 0.05 m³ container at 300 K.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify known values: n = 2 mol, V = 0.05 m³, T = 300 K, R = 8.314462618 J/(mol·K).",
          },
          {
            label: "2",
            explanation:
              "Use the formula P = nRT / V to calculate pressure.",
          },
          {
            label: "3",
            explanation:
              "Calculate: P = (2 × 8.314462618 × 300) / 0.05 = 99,773.56 Pa.",
          },
        ],
        result: "The pressure of the gas is approximately 9.9774 × 10⁴ Pascals (Pa).",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Blackbody Peak (Wien's Law) Estimator", url: "/science/blackbody-peak-wien-law-estimator", icon: "🧪" },
        { title: "Dilution Calculator (C₁V₁ = C₂V₂)", url: "/science/dilution-c1v1-c2v2", icon: "🧪" },
        { title: "Buffer (Henderson–Hasselbalch) Helper", url: "/science/buffer-henderson-hasselbalch-helper", icon: "🧪" },
        { title: "Stoichiometry & Limiting Reagent Solver", url: "/science/stoichiometry-limiting-reagent", icon: "🧪" },
        { title: "Kinematics Equations Solver (SUVAT)", url: "/science/kinematics-suvat-solver", icon: "🚀" },
        { title: "Wave Speed / Frequency / Wavelength", url: "/science/wave-speed-frequency-wavelength", icon: "🚀" },
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