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

export default function RadioactiveActivityALambdaNCalculator() {
  const [inputs, setInputs] = useState({
    decayConstant: "",
    numberOfAtoms: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const λ = parseFloat(inputs.decayConstant);
    const N = parseFloat(inputs.numberOfAtoms);

    if (isNaN(λ) || λ <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Decay constant (λ) must be a positive number.",
        formulaUsed: "A = λN",
      };
    }
    if (isNaN(N) || N < 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Number of atoms (N) must be a non-negative number.",
        formulaUsed: "A = λN",
      };
    }

    // Calculate activity A = λ * N
    const A = λ * N;

    // Format result in scientific notation with 4 decimals
    const formattedA = A.toExponential(4);

    return {
      value: `${formattedA} Bq`,
      label: "Radioactive Activity (Becquerels)",
      subtext: "1 Bq = 1 decay per second",
      warning: null,
      formulaUsed: "A = λN",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is radioactive activity and why is it important?",
      answer:
        "Radioactive activity measures the rate at which unstable atomic nuclei decay, emitting radiation. It is expressed in Becquerels (Bq), representing decays per second. Understanding activity helps scientists assess the intensity of radiation, ensuring safety in medical, industrial, and environmental applications.",
    },
    {
      question: "How do the decay constant and number of atoms affect activity?",
      answer:
        "The decay constant (λ) indicates the probability per unit time that a nucleus will decay, while the number of atoms (N) is how many unstable nuclei are present. Activity (A) is directly proportional to both: increasing either λ or N increases the activity, meaning more decays occur per second.",
    },
    {
      question: "Can the decay constant be zero or negative?",
      answer:
        "No. The decay constant must be a positive number because it represents a probability rate of decay. A zero or negative value is physically meaningless and invalid in calculations of radioactive activity.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="decayConstant" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-5 h-5 text-yellow-600" />
            Decay Constant (λ) [1/s]
          </Label>
          <Input
            id="decayConstant"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 0.00012"
            value={inputs.decayConstant}
            onChange={(e) => handleInputChange("decayConstant", e.target.value)}
            aria-describedby="decayConstantHelp"
          />
          <p id="decayConstantHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            The probability per second that a nucleus will decay (λ &gt; 0).
          </p>
        </div>

        <div>
          <Label htmlFor="numberOfAtoms" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Atom className="w-5 h-5 text-indigo-600" />
            Number of Atoms (N)
          </Label>
          <Input
            id="numberOfAtoms"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 1.5e20"
            value={inputs.numberOfAtoms}
            onChange={(e) => handleInputChange("numberOfAtoms", e.target.value)}
            aria-describedby="numberOfAtomsHelp"
          />
          <p id="numberOfAtomsHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total unstable atoms present in the sample (N &ge; 0).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed; calculation is reactive
          }}
          aria-label="Calculate Radioactive Activity"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ decayConstant: "", numberOfAtoms: "" })}
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
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">{results.formulaUsed || "Calculated Result"}</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left" role="alert">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Radioactive Activity Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Radioactive activity quantifies how many atomic nuclei in a radioactive sample decay per second. It is a fundamental measure in nuclear physics and radiological science, expressed in Becquerels (Bq), where 1 Bq equals one decay per second. This calculator helps determine the activity based on the decay constant (λ), which is the probability per second of decay for a single nucleus, and the total number of radioactive atoms (N) in the sample.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The activity is crucial for applications ranging from medical diagnostics and treatment to nuclear power and environmental monitoring. Knowing the activity allows scientists and engineers to assess radiation intensity, ensure safety protocols, and predict the behavior of radioactive materials over time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool assumes the decay constant is positive and the number of atoms is non-negative. If either input is invalid, the calculator will prompt for correction. The result is presented in scientific notation for clarity, especially when dealing with very large or very small values.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`A = λN

Where:
  A = Radioactive activity (Becquerels, Bq)
  λ = Decay constant (probability of decay per second, 1/s)
  N = Number of radioactive atoms (unitless count)

Notes:
- λ must be &gt; 0
- N must be ≥ 0
- 1 Bq = 1 decay per second`}
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
          { symbol: "λ", description: "Decay constant (probability of decay per second, 1/s)" },
          { symbol: "N", description: "Number of radioactive atoms (unitless count)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the radioactive activity of a sample containing 2.5 × 10²¹ atoms with a decay constant of 0.00015 1/s.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the decay constant λ = 0.00015 1/s and number of atoms N = 2.5 × 10²¹.",
          },
          {
            label: "2",
            explanation: "Apply the formula A = λN.",
          },
          {
            label: "3",
            explanation:
              "Calculate A = 0.00015 × 2.5 × 10²¹ = 3.75 × 10¹⁷ Bq.",
          },
        ],
        result: "The radioactive activity is 3.75 × 10¹⁷ Becquerels (Bq).",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Force, Work & Energy Calculator", url: "/science/force-work-energy-calculator", icon: "🚀" },
        { title: "Dilution Calculator (C₁V₁ = C₂V₂)", url: "/science/dilution-c1v1-c2v2", icon: "🧪" },
        { title: "Snell’s Law & Critical Angle Calculator", url: "/science/snells-law-critical-angle", icon: "🌈" },
        { title: "Momentum & Impulse Calculator", url: "/science/momentum-impulse-calculator", icon: "🧪" },
        { title: "ppm / ppb Concentration Converter", url: "/science/ppm-ppb-concentration-converter", icon: "🧪" },
        { title: "Projectile Motion Calculator", url: "/science/projectile-motion-calculator", icon: "🚀" },
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