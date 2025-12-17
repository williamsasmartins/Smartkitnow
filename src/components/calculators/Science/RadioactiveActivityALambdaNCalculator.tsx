import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RadioactiveActivityALambdaNCalculator() {
  // Inputs: decay constant (lambda, λ) in s⁻¹, number of undecayed nuclei (N)
  // Optional: input unit selector for λ (per second, per minute, per hour, per year)
  const [inputs, setInputs] = useState({
    lambdaValue: "",
    lambdaUnit: "s⁻¹",
    nucleiCount: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion factors for lambda units to per second (s⁻¹)
  const lambdaUnitToPerSecond = useMemo(() => ({
    "s⁻¹": 1,
    "min⁻¹": 1 / 60,
    "hr⁻¹": 1 / 3600,
    "yr⁻¹": 1 / (365.25 * 24 * 3600),
  }), []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { lambdaValue, lambdaUnit, nucleiCount } = inputs;

    // Validation
    if (
      lambdaValue === "" ||
      nucleiCount === "" ||
      isNaN(Number(lambdaValue)) ||
      isNaN(Number(nucleiCount))
    ) {
      return {
        value: "Waiting...",
        label: "Enter all inputs",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    const lambdaNum = Number(lambdaValue);
    const N = Number(nucleiCount);

    if (lambdaNum <= 0) {
      return {
        value: "Invalid",
        label: "Decay constant must be &gt; 0",
        subtext: "",
        warning: "Decay constant (λ) must be a positive number.",
        formulaUsed: "A = λN",
      };
    }
    if (N < 0) {
      return {
        value: "Invalid",
        label: "Number of nuclei must be &ge; 0",
        subtext: "",
        warning: "Number of undecayed nuclei (N) cannot be negative.",
        formulaUsed: "A = λN",
      };
    }

    // Convert lambda to per second
    const lambdaPerSecond = lambdaNum * (lambdaUnitToPerSecond[lambdaUnit] ?? 1);

    // Calculate activity A = λN (in decays per second, Bq)
    const activity = lambdaPerSecond * N;

    // Format output: if very large or small, use scientific notation
    const displayVal =
      activity === 0
        ? "0 Bq"
        : activity > 10000 || activity < 0.001
        ? `${activity.toExponential(4)} Bq`
        : `${activity.toFixed(4)} Bq`;

    return {
      value: displayVal,
      label: "Radioactive Activity (Becquerels)",
      subtext:
        "Activity (A) is the decay rate in decays per second (Bq). λ converted to s⁻¹ internally.",
      warning: null,
      formulaUsed: "A = λN",
    };
  }, [inputs, lambdaUnitToPerSecond]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is radioactive activity and why is it important?",
      answer:
        "Radioactive activity measures how many atomic nuclei decay per second in a radioactive sample. It is expressed in Becquerels (Bq). This value is crucial for understanding the intensity of radiation emitted, which is important in nuclear medicine, radiometric dating, and nuclear power safety. Accurate activity calculations help ensure safe handling and effective use of radioactive materials.",
    },
    {
      question: "How does the decay constant (λ) affect the activity?",
      answer:
        "The decay constant (λ) represents the probability per unit time that a nucleus will decay. A higher λ means nuclei decay faster, increasing the activity. Since activity A = λN, for a fixed number of nuclei, increasing λ directly increases the decay rate. This relationship helps predict how quickly a radioactive sample loses its radioactivity over time.",
    },
    {
      question: "Why do we use different units for the decay constant?",
      answer:
        "Decay constants can be expressed in various time units such as per second, per minute, per hour, or per year depending on the half-life of the isotope. For very long-lived isotopes, using per year is practical, while short-lived isotopes often use per second. This flexibility allows scientists to work with units that best suit the timescale of the radioactive process.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="lambdaValue" className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            Decay Constant (λ)
          </Label>
          <div className="flex gap-2">
            <Input
              id="lambdaValue"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 0.0001"
              value={inputs.lambdaValue}
              onChange={(e) => handleInputChange("lambdaValue", e.target.value)}
              aria-describedby="lambdaHelp"
            />
            <Select
              value={inputs.lambdaUnit}
              onValueChange={(val) => handleInputChange("lambdaUnit", val)}
              aria-label="Decay constant unit"
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="s⁻¹">s⁻¹</SelectItem>
                <SelectItem value="min⁻¹">min⁻¹</SelectItem>
                <SelectItem value="hr⁻¹">hr⁻¹</SelectItem>
                <SelectItem value="yr⁻¹">yr⁻¹</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p id="lambdaHelp" className="text-xs text-slate-500 mt-1">
            Decay constant units per second, minute, hour, or year.
          </p>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="nucleiCount" className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-green-600" />
            Number of Undecayed Nuclei (N)
          </Label>
          <Input
            id="nucleiCount"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 1e20"
            value={inputs.nucleiCount}
            onChange={(e) => handleInputChange("nucleiCount", e.target.value)}
            aria-describedby="nucleiHelp"
          />
          <p id="nucleiHelp" className="text-xs text-slate-500 mt-1">
            Enter the total number of undecayed nuclei (unitless count).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate radioactive activity"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              lambdaValue: "",
              lambdaUnit: "s⁻¹",
              nucleiCount: "",
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
              <strong>Science Fact:</strong> Radioactive activity is measured in Becquerels (Bq), which equals one decay per second. Always ensure λ is converted to per second units before calculation.
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
          Understanding Radioactive Activity Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Radioactive activity quantifies the rate at which unstable atomic nuclei decay, emitting radiation. It is a fundamental concept in nuclear physics and radiochemistry, representing the number of decays per second in a sample. The activity is directly proportional to both the decay constant (λ) and the number of undecayed nuclei (N). This calculator helps determine the activity, enabling scientists and engineers to assess radiation levels accurately.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This measurement is essential in various fields such as nuclear medicine, where it guides dosage for radiopharmaceuticals, and in environmental science for monitoring radioactive contamination. It also plays a critical role in nuclear power plant safety and radiometric dating techniques used in geology and archaeology.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The decay constant λ represents the probability per unit time that a nucleus will decay. It is often expressed in different time units depending on the isotope's half-life, such as per second, per minute, or per year. This calculator allows input of λ in multiple units and converts it internally to per second for accurate activity computation.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`A = λN

Where:
A = Radioactive activity (Becquerels, Bq)
λ = Decay constant (s⁻¹)
N = Number of undecayed nuclei (unitless count)

Note:
- 1 Bq = 1 decay per second
- λ must be converted to per second units before calculation
`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem to calculate the radioactive activity of a sample:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Decay constant λ = 0.00012 min⁻¹, Number of nuclei N = 5 × 10<sup>20</sup>
          </li>
          <li>
            <strong>Step 1:</strong> Convert λ from per minute to per second:
            <br />
            λ = 0.00012 min⁻¹ × (1 min / 60 s) = 2.0 × 10<sup>-6</sup> s⁻¹
          </li>
          <li>
            <strong>Step 2:</strong> Calculate activity A = λN:
            <br />
            A = 2.0 × 10<sup>-6</sup> s⁻¹ × 5 × 10<sup>20</sup> = 1.0 × 10<sup>15</sup> Bq
          </li>
          <li>
            <strong>Result:</strong> The sample has an activity of 1.0 × 10<sup>15</sup> Becquerels, meaning it undergoes 1.0 × 10<sup>15</sup> decays every second.
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
      title="Radioactive Activity Calculator"
      description="Calculate radioactive activity (A = λN). Determine the decay rate of a sample based on its decay constant."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "A = λN",
        variables: [
          { symbol: "A", description: "Radioactive activity (Becquerels, Bq)" },
          { symbol: "λ", description: "Decay constant (per second, s⁻¹)" },
          { symbol: "N", description: "Number of undecayed nuclei (unitless count)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the radioactive activity of a sample with a decay constant of 0.00012 min⁻¹ and 5 × 10²⁰ undecayed nuclei.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the decay constant λ from per minute to per second by dividing by 60.",
          },
          {
            label: "2",
            explanation:
              "Multiply the converted λ by the number of undecayed nuclei N to find the activity A.",
          },
        ],
        result:
          "The activity is 1.0 × 10¹⁵ Bq, meaning the sample undergoes 1.0 × 10¹⁵ decays per second.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
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