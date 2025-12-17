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

const R = 8.314; // J/(mol·K) Ideal gas constant

export default function IdealGasLawPvNrtCalculator() {
  // Inputs: Pressure (P) in atm or Pa, Volume (V) in L or m³, Moles (n) in mol, Temperature (T) in K or °C
  // We allow user to select which variable to calculate: P, V, n, or T
  // Units for inputs will be selectable for user convenience

  const [inputs, setInputs] = useState({
    calculateFor: "P", // P, V, n, or T
    P: "",
    PUnit: "atm", // atm or Pa
    V: "",
    VUnit: "L", // L or m3
    n: "",
    nUnit: "mol", // mol only for now
    T: "",
    TUnit: "K", // K or C
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Convert input values to SI units for calculation:
  // Pressure: atm to Pa (1 atm = 101325 Pa)
  // Volume: L to m³ (1 L = 0.001 m³)
  // Temperature: °C to K (K = °C + 273.15)
  // Moles: mol (no conversion)

  const results = useMemo(() => {
    // Parse inputs to numbers
    const Praw = parseFloat(inputs.P);
    const Vraw = parseFloat(inputs.V);
    const nraw = parseFloat(inputs.n);
    const Traw = parseFloat(inputs.T);

    // Validate inputs for calculation
    // We need exactly 3 known variables to calculate the 4th
    // Check which variable to calculate
    const calcFor = inputs.calculateFor;

    // Helper to convert to SI units
    function toPa(p: number, unit: string) {
      if (unit === "atm") return p * 101325;
      if (unit === "Pa") return p;
      return NaN;
    }
    function toM3(v: number, unit: string) {
      if (unit === "L") return v * 0.001;
      if (unit === "m3") return v;
      return NaN;
    }
    function toK(t: number, unit: string) {
      if (unit === "K") return t;
      if (unit === "C") return t + 273.15;
      return NaN;
    }

    // Convert known inputs to SI
    const P = !isNaN(Praw) ? toPa(Praw, inputs.PUnit) : NaN;
    const V = !isNaN(Vraw) ? toM3(Vraw, inputs.VUnit) : NaN;
    const n = !isNaN(nraw) ? nraw : NaN;
    const T = !isNaN(Traw) ? toK(Traw, inputs.TUnit) : NaN;

    // Check for missing inputs
    // Count how many inputs are valid numbers
    const knowns = [P, V, n, T].filter((x) => !isNaN(x)).length;
    if (knowns < 3) {
      return {
        value: "Waiting...",
        label: "Enter at least 3 known values",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Validate physical constraints
    // All values must be positive except temperature in K must be > 0
    if (
      (calcFor !== "P" && (!P || P <= 0)) ||
      (calcFor !== "V" && (!V || V <= 0)) ||
      (calcFor !== "n" && (!n || n <= 0)) ||
      (calcFor !== "T" && (!T || T <= 0))
    ) {
      return {
        value: "Invalid input",
        label:
          "All known values must be positive and temperature must be &gt; 0 K",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculate the unknown variable using PV = nRT
    let resultValue = NaN;
    let resultLabel = "";
    let resultUnit = "";
    let formulaUsed = "";

    switch (calcFor) {
      case "P":
        // P = nRT / V
        if (isNaN(n) || isNaN(R) || isNaN(T) || isNaN(V) || V === 0) {
          return {
            value: "Invalid input",
            label: "Volume must be non-zero",
            subtext: "",
            warning: null,
            formulaUsed: null,
          };
        }
        resultValue = (n * R * T) / V; // in Pa
        resultLabel = "Pressure";
        resultUnit = "Pa";
        formulaUsed = "P = nRT / V";
        break;
      case "V":
        // V = nRT / P
        if (isNaN(n) || isNaN(R) || isNaN(T) || isNaN(P) || P === 0) {
          return {
            value: "Invalid input",
            label: "Pressure must be non-zero",
            subtext: "",
            warning: null,
            formulaUsed: null,
          };
        }
        resultValue = (n * R * T) / P; // in m³
        resultLabel = "Volume";
        resultUnit = "m³";
        formulaUsed = "V = nRT / P";
        break;
      case "n":
        // n = PV / RT
        if (isNaN(P) || isNaN(V) || isNaN(R) || isNaN(T) || T === 0) {
          return {
            value: "Invalid input",
            label: "Temperature must be &gt; 0 K",
            subtext: "",
            warning: null,
            formulaUsed: null,
          };
        }
        resultValue = (P * V) / (R * T); // in mol
        resultLabel = "Moles";
        resultUnit = "mol";
        formulaUsed = "n = PV / RT";
        break;
      case "T":
        // T = PV / nR
        if (isNaN(P) || isNaN(V) || isNaN(n) || isNaN(R) || n === 0) {
          return {
            value: "Invalid input",
            label: "Moles must be non-zero",
            subtext: "",
            warning: null,
            formulaUsed: null,
          };
        }
        resultValue = (P * V) / (n * R); // in K
        resultLabel = "Temperature";
        resultUnit = "K";
        formulaUsed = "T = PV / nR";
        break;
      default:
        return {
          value: "Error",
          label: "Unknown calculation variable",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
    }

    // Format output: use scientific notation if very large or small
    let displayVal: string;
    if (resultValue === 0) {
      displayVal = "0";
    } else if (
      Math.abs(resultValue) >= 10000 ||
      Math.abs(resultValue) < 0.001
    ) {
      displayVal = resultValue.toExponential(4);
    } else {
      displayVal = resultValue.toFixed(4);
    }

    // Add units clearly
    displayVal += ` ${resultUnit}`;

    return {
      value: displayVal,
      label: resultLabel,
      subtext:
        "Calculated using SI units internally. Input units converted accordingly.",
      warning: null,
      formulaUsed,
    };
  }, [
    inputs.P,
    inputs.PUnit,
    inputs.V,
    inputs.VUnit,
    inputs.n,
    inputs.nUnit,
    inputs.T,
    inputs.TUnit,
    inputs.calculateFor,
  ]);

  // FAQs
  const faqs = [
    {
      question: "What is the Ideal Gas Law and why is it important?",
      answer:
        "The Ideal Gas Law (PV = nRT) is a fundamental equation in chemistry and physics that relates pressure, volume, temperature, and moles of an ideal gas. It is important because it provides a simple model to predict the behavior of gases under various conditions, essential for laboratory experiments, engineering applications, and understanding atmospheric phenomena.",
    },
    {
      question: "When should I use the Ideal Gas Law calculator?",
      answer:
        "Use this calculator when you know any three of the four variables (pressure, volume, temperature, or moles) of an ideal gas and want to find the fourth. It is especially useful in chemistry labs, engineering processes involving gases, and physics problems involving gas behavior under different conditions.",
    },
    {
      question: "Why do I need to convert temperature to Kelvin?",
      answer:
        "Temperature must be in Kelvin for the Ideal Gas Law because the equation is derived from absolute temperature scales. Kelvin starts at absolute zero (0 K), where molecular motion theoretically stops. Using Celsius or Fahrenheit would give incorrect results as they do not start at absolute zero.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget inputs
  const widget = (
    <div className="space-y-6">
      {/* Select variable to calculate */}
      <div>
        <Label htmlFor="calculateFor" className="mb-1 font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Calculate for:
        </Label>
        <Select
          value={inputs.calculateFor}
          onValueChange={(val) => handleInputChange("calculateFor", val)}
          id="calculateFor"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="P">Pressure (P)</SelectItem>
            <SelectItem value="V">Volume (V)</SelectItem>
            <SelectItem value="n">Moles (n)</SelectItem>
            <SelectItem value="T">Temperature (T)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs for P, V, n, T */}
      {/* Disable input for the variable to calculate */}
      {/* Pressure input */}
      <div>
        <Label htmlFor="P" className="mb-1 font-semibold flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-600" />
          Pressure (P)
        </Label>
        <div className="flex gap-2">
          <Input
            id="P"
            type="number"
            step="any"
            placeholder="Enter pressure"
            value={inputs.P}
            onChange={(e) => handleInputChange("P", e.target.value)}
            disabled={inputs.calculateFor === "P"}
            aria-describedby="P-help"
          />
          <Select
            value={inputs.PUnit}
            onValueChange={(val) => handleInputChange("PUnit", val)}
            disabled={inputs.calculateFor === "P"}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atm">atm</SelectItem>
              <SelectItem value="Pa">Pa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p id="P-help" className="text-xs text-slate-500 mt-1">
          Pressure units: atmospheres (atm) or pascals (Pa).
        </p>
      </div>

      {/* Volume input */}
      <div>
        <Label htmlFor="V" className="mb-1 font-semibold flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-green-600" />
          Volume (V)
        </Label>
        <div className="flex gap-2">
          <Input
            id="V"
            type="number"
            step="any"
            placeholder="Enter volume"
            value={inputs.V}
            onChange={(e) => handleInputChange("V", e.target.value)}
            disabled={inputs.calculateFor === "V"}
            aria-describedby="V-help"
          />
          <Select
            value={inputs.VUnit}
            onValueChange={(val) => handleInputChange("VUnit", val)}
            disabled={inputs.calculateFor === "V"}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Liters (L)</SelectItem>
              <SelectItem value="m3">Cubic meters (m³)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p id="V-help" className="text-xs text-slate-500 mt-1">
          Volume units: liters (L) or cubic meters (m³).
        </p>
      </div>

      {/* Moles input */}
      <div>
        <Label htmlFor="n" className="mb-1 font-semibold flex items-center gap-2">
          <Atom className="w-5 h-5 text-purple-600" />
          Moles (n)
        </Label>
        <Input
          id="n"
          type="number"
          step="any"
          placeholder="Enter moles"
          value={inputs.n}
          onChange={(e) => handleInputChange("n", e.target.value)}
          disabled={inputs.calculateFor === "n"}
          aria-describedby="n-help"
        />
        <p id="n-help" className="text-xs text-slate-500 mt-1">
          Amount of substance in moles (mol).
        </p>
      </div>

      {/* Temperature input */}
      <div>
        <Label htmlFor="T" className="mb-1 font-semibold flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-red-600" />
          Temperature (T)
        </Label>
        <div className="flex gap-2">
          <Input
            id="T"
            type="number"
            step="any"
            placeholder="Enter temperature"
            value={inputs.T}
            onChange={(e) => handleInputChange("T", e.target.value)}
            disabled={inputs.calculateFor === "T"}
            aria-describedby="T-help"
          />
          <Select
            value={inputs.TUnit}
            onValueChange={(val) => handleInputChange("TUnit", val)}
            disabled={inputs.calculateFor === "T"}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="K">Kelvin (K)</SelectItem>
              <SelectItem value="C">Celsius (°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p id="T-help" className="text-xs text-slate-500 mt-1">
          Temperature units: Kelvin (K) or Celsius (°C).
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          aria-label="Calculate Ideal Gas Law"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              calculateFor: "P",
              P: "",
              PUnit: "atm",
              V: "",
              VUnit: "L",
              n: "",
              nUnit: "mol",
              T: "",
              TUnit: "K",
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Always ensure temperature is in
              Kelvin and pressure/volume units are consistent for accurate
              results.
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
          Understanding Ideal Gas Law Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Ideal Gas Law is a fundamental equation in physical sciences that
          describes the relationship between pressure (P), volume (V), amount
          of substance in moles (n), and temperature (T) of an ideal gas. It is
          expressed as <strong>PV = nRT</strong>, where R is the ideal gas
          constant. This law assumes gases behave ideally, meaning gas particles
          do not interact and occupy no volume themselves. While real gases
          deviate slightly, this law provides a close approximation under many
          conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to solve for any one of the four variables
          when the other three are known. It converts your inputs into SI units
          internally to ensure precise calculations. Remember, temperature must
          always be in Kelvin (K) for the formula to work correctly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Ideal Gas Law is widely used in chemistry labs for gas reactions,
          in engineering for designing pressurized systems, and in meteorology
          to understand atmospheric behavior. It is a cornerstone concept that
          bridges theory and practical applications in science and technology.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`PV = nRT

Where:
P = Pressure (Pa or atm)
V = Volume (m³ or L)
n = Amount of substance (mol)
R = Ideal gas constant (8.314 J/(mol·K))
T = Temperature (K)

Note:
- Pressure and volume units must be consistent.
- Temperature must be in Kelvin (K).
- 1 atm = 101325 Pa
- 1 L = 0.001 m³`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the Ideal Gas Law Calculator:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A gas occupies 10.0 L at 2.0 atm pressure and
            25°C. Calculate the number of moles (n).
          </li>
          <li>
            <strong>Step 1:</strong> Convert temperature to Kelvin: 25 + 273.15
            = 298.15 K.
          </li>
          <li>
            <strong>Step 2:</strong> Input P = 2.0 atm, V = 10.0 L, T = 298.15 K,
            select "Calculate for" = n.
          </li>
          <li>
            <strong>Result:</strong> The calculator computes n = PV / RT =
            (2.0 × 101325 Pa × 0.01 m³) / (8.314 × 298.15) ≈ 0.82 mol.
          </li>
        </ul>
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
      title="Ideal Gas Law Calculator"
      description="Solve Ideal Gas Law problems (PV = nRT). Calculate pressure, volume, temperature, or moles of a gas instantly."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "PV = nRT",
        variables: [
          { symbol: "P", description: "Pressure (Pa or atm)" },
          { symbol: "V", description: "Volume (m³ or L)" },
          { symbol: "n", description: "Amount of substance (mol)" },
          { symbol: "R", description: "Ideal gas constant (8.314 J/(mol·K))" },
          { symbol: "T", description: "Temperature (K)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the number of moles of gas in a 10 L container at 2 atm and 25°C.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert temperature to Kelvin: 25 + 273.15 = 298.15 K.",
          },
          {
            label: "2",
            explanation:
              "Use the formula n = PV / RT with P = 2 atm, V = 10 L, T = 298.15 K.",
          },
          {
            label: "3",
            explanation:
              "Calculate n = (2 × 101325 × 0.01) / (8.314 × 298.15) ≈ 0.82 mol.",
          },
        ],
        result: "Number of moles n ≈ 0.82 mol.",
      }}
      relatedCalculators={[
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
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