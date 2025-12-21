import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Smile,
  Frown,
  Meh,
  Ghost,
  Skull,
  Coffee,
  Utensils,
  Gamepad2,
  Cat,
  Dog,
  Zap,
  Heart,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Flame,
  Clock,
  Ticket,
  Plane,
  Globe,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DrakeEquationCalculator() {
  // Drake Equation parameters are counts or abstract scores, no physical units, so no unit selector needed.
  const [inputs, setInputs] = useState({
    R_star: "", // average rate of star formation per year in our galaxy
    f_p: "", // fraction of those stars that have planets
    n_e: "", // average number of planets that could support life per star with planets
    f_l: "", // fraction of planets that actually develop life
    f_i: "", // fraction of life-bearing planets that develop intelligent life
    f_c: "", // fraction of civilizations that develop detectable communication
    L: "", // length of time such civilizations release detectable signals (years)
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    // Parse inputs as floats
    const R_star = parseFloat(inputs.R_star);
    const f_p = parseFloat(inputs.f_p);
    const n_e = parseFloat(inputs.n_e);
    const f_l = parseFloat(inputs.f_l);
    const f_i = parseFloat(inputs.f_i);
    const f_c = parseFloat(inputs.f_c);
    const L = parseFloat(inputs.L);

    // Validate inputs: all must be numbers and within logical ranges
    const invalidInput =
      [R_star, f_p, n_e, f_l, f_i, f_c, L].some(
        (v) => isNaN(v) || v < 0 || (v > 1 && v !== R_star && v !== n_e && v !== L)
      ) ||
      f_p > 1 ||
      f_l > 1 ||
      f_i > 1 ||
      f_c > 1;

    if (invalidInput) {
      return {
        value: "—",
        label: "Invalid input detected",
        subtext: "Please ensure all inputs are numbers and fractions are between 0 and 1.",
        color: "text-red-600",
        icon: <AlertTriangle className="mx-auto h-10 w-10" />,
      };
    }

    // Calculate Drake Equation: N = R* × fp × ne × fl × fi × fc × L
    const N = R_star * f_p * n_e * f_l * f_i * f_c * L;

    // Format result with commas and 2 decimals if > 1, else scientific notation for small values
    let displayValue = "";
    if (N === 0) {
      displayValue = "0";
    } else if (N < 0.01 && N > 0) {
      displayValue = N.toExponential(2);
    } else {
      displayValue = N.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    // Witty remarks based on result magnitude
    let label = "Estimated Communicative Civilizations";
    let subtext = "The number of active, communicative extraterrestrial civilizations in our galaxy.";
    let color = "text-blue-600";
    let icon = <Globe className="mx-auto h-10 w-10" />;

    if (N === 0) {
      label = "No Detectable Civilizations";
      subtext = "According to your inputs, there might be no communicative civilizations out there.";
      color = "text-gray-600";
      icon = <Ghost className="mx-auto h-10 w-10" />;
    } else if (N < 1) {
      label = "Less than one civilization";
      subtext = "Statistically, less than one civilization is detectable — but hope is not lost!";
      color = "text-yellow-600";
      icon = <Meh className="mx-auto h-10 w-10" />;
    } else if (N < 10) {
      label = "Few Civilizations Estimated";
      subtext = "A handful of civilizations might be out there, waiting to say hello.";
      color = "text-green-600";
      icon = <Smile className="mx-auto h-10 w-10" />;
    } else if (N >= 10) {
      label = "Many Civilizations Estimated";
      subtext = "The galaxy could be buzzing with intelligent life — time to tune your radio!";
      color = "text-purple-600";
      icon = <Sparkles className="mx-auto h-10 w-10" />;
    }

    return { value: displayValue, label, subtext, color, icon };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Drake Equation?",
      answer:
        "The Drake Equation is a probabilistic formula used to estimate the number of active, communicative extraterrestrial civilizations in the Milky Way galaxy. It was developed by Dr. Frank Drake in 1961 to stimulate scientific dialogue about the search for extraterrestrial intelligence (SETI).",
    },
    {
      question: "Why are some inputs fractions between 0 and 1?",
      answer:
        "Certain factors in the Drake Equation represent probabilities or fractions, such as the fraction of stars with planets or the fraction of planets where life actually develops. These values must logically be between 0 and 1 to represent realistic probabilities.",
    },
    {
      question: "Can the Drake Equation give a precise number?",
      answer:
        "No, the Drake Equation provides an estimate based on assumptions and current scientific understanding. Many of its parameters are uncertain, so the results should be interpreted as a range or a way to guide scientific inquiry rather than an exact count.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="R_star">R* (Star Formation Rate per Year)</Label>
          <Input
            id="R_star"
            type="text"
            placeholder="e.g., 1.5"
            value={inputs.R_star}
            onChange={(e) => handleInputChange("R_star", e.target.value)}
            aria-describedby="R_star_desc"
          />
          <p id="R_star_desc" className="text-sm text-slate-500 mt-1">
            Average number of new stars formed per year in our galaxy.
          </p>
        </div>

        <div>
          <Label htmlFor="f_p">fₚ (Fraction of Stars with Planets)</Label>
          <Input
            id="f_p"
            type="text"
            placeholder="Between 0 and 1, e.g., 0.5"
            value={inputs.f_p}
            onChange={(e) => handleInputChange("f_p", e.target.value)}
            aria-describedby="f_p_desc"
          />
          <p id="f_p_desc" className="text-sm text-slate-500 mt-1">
            Fraction of stars that have planetary systems.
          </p>
        </div>

        <div>
          <Label htmlFor="n_e">nₑ (Habitable Planets per Star with Planets)</Label>
          <Input
            id="n_e"
            type="text"
            placeholder="e.g., 2"
            value={inputs.n_e}
            onChange={(e) => handleInputChange("n_e", e.target.value)}
            aria-describedby="n_e_desc"
          />
          <p id="n_e_desc" className="text-sm text-slate-500 mt-1">
            Average number of planets that could support life per star with planets.
          </p>
        </div>

        <div>
          <Label htmlFor="f_l">fₗ (Fraction of Planets that Develop Life)</Label>
          <Input
            id="f_l"
            type="text"
            placeholder="Between 0 and 1, e.g., 0.33"
            value={inputs.f_l}
            onChange={(e) => handleInputChange("f_l", e.target.value)}
            aria-describedby="f_l_desc"
          />
          <p id="f_l_desc" className="text-sm text-slate-500 mt-1">
            Fraction of habitable planets where life actually appears.
          </p>
        </div>

        <div>
          <Label htmlFor="f_i">fᵢ (Fraction Developing Intelligent Life)</Label>
          <Input
            id="f_i"
            type="text"
            placeholder="Between 0 and 1, e.g., 0.01"
            value={inputs.f_i}
            onChange={(e) => handleInputChange("f_i", e.target.value)}
            aria-describedby="f_i_desc"
          />
          <p id="f_i_desc" className="text-sm text-slate-500 mt-1">
            Fraction of life-bearing planets where intelligent life evolves.
          </p>
        </div>

        <div>
          <Label htmlFor="f_c">f𝚌 (Fraction with Detectable Communication)</Label>
          <Input
            id="f_c"
            type="text"
            placeholder="Between 0 and 1, e.g., 0.1"
            value={inputs.f_c}
            onChange={(e) => handleInputChange("f_c", e.target.value)}
            aria-describedby="f_c_desc"
          />
          <p id="f_c_desc" className="text-sm text-slate-500 mt-1">
            Fraction of intelligent civilizations that develop detectable communication.
          </p>
        </div>

        <div>
          <Label htmlFor="L">L (Length of Detectable Signal in Years)</Label>
          <Input
            id="L"
            type="text"
            placeholder="e.g., 10000"
            value={inputs.L}
            onChange={(e) => handleInputChange("L", e.target.value)}
            aria-describedby="L_desc"
          />
          <p id="L_desc" className="text-sm text-slate-500 mt-1">
            Average length of time such civilizations release detectable signals.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate Drake Equation"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              R_star: "",
              f_p: "",
              n_e: "",
              f_l: "",
              f_i: "",
              f_c: "",
              L: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>{results.value}</p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">{results.label}</p>
            <p className="mt-2 text-sm italic text-slate-500">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Drake Equation Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Drake Equation is a groundbreaking formula that estimates the number of active, communicative extraterrestrial civilizations in our Milky Way galaxy. It combines astrophysical, biological, and technological factors to provide a probabilistic framework for the search for alien life. This calculator allows you to input your own assumptions for each parameter, helping you explore the vast uncertainties and possibilities in the cosmic neighborhood.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By adjusting values such as the rate of star formation or the fraction of planets that develop intelligent life, you can see how sensitive the final estimate is to each factor. This not only aids scientific curiosity but also sparks imagination about our place in the universe.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The Drake Equation was originally formulated in 1961 by Frank Drake to estimate how many civilizations might be out there, but many of its parameters remain highly uncertain. Interestingly, the famous SETI (Search for Extraterrestrial Intelligence) project was inspired by this equation, aiming to detect signals from alien civilizations.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter your best estimates for each parameter of the Drake Equation. For fractional inputs, ensure values are between 0 and 1, representing probabilities or fractions. For counts or rates, enter positive numbers. Once all inputs are filled, click "Calculate" to see the estimated number of communicative civilizations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          If you want to start fresh or try different scenarios, use the "Reset" button to clear all inputs. Experimenting with different values can reveal how sensitive the equation is to each factor and inspire deeper understanding of the challenges in detecting extraterrestrial intelligence.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside space-y-4 text-slate-700 dark:text-slate-300">
          {faqs.map(({ question, answer }, i) => (
            <li key={i}>
              <strong>{question}</strong>
              <p className="mt-1">{answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Drake_equation"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Drake Equation - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive overview of the Drake Equation, its parameters, and scientific context.
            </p>
          </li>
          <li>
            <a
              href="https://seti.berkeley.edu/drake-equation"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              SETI Institute - Drake Equation <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Insights from the SETI Institute on the equation's role in the search for extraterrestrial intelligence.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Drake Equation Calculator"
      description="Estimate alien life. Use the famous Drake Equation to calculate the number of active, communicative extraterrestrial civilizations."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "N = R* × fₚ × nₑ × fₗ × fᵢ × f𝚌 × L",
        variables: [
          { symbol: "N", description: "Number of communicative civilizations" },
          { symbol: "R*", description: "Average rate of star formation per year" },
          { symbol: "fₚ", description: "Fraction of stars with planets" },
          { symbol: "nₑ", description: "Number of habitable planets per star with planets" },
          { symbol: "fₗ", description: "Fraction of habitable planets with life" },
          { symbol: "fᵢ", description: "Fraction of life-bearing planets with intelligent life" },
          { symbol: "f𝚌", description: "Fraction of civilizations with detectable communication" },
          { symbol: "L", description: "Length of time civilizations release detectable signals (years)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Suppose 1.5 new stars form each year, half have planets, each has 2 habitable planets, one-third develop life, 1% develop intelligence, 10% communicate, and signals last 10,000 years.",
        steps: [
          { label: "1", explanation: "Multiply all parameters: 1.5 × 0.5 × 2 × 0.33 × 0.01 × 0.1 × 10000" },
          { label: "2", explanation: "Calculate the product to estimate the number of civilizations." },
        ],
        result: "Estimated communicative civilizations: approximately 5.",
      }}
      relatedCalculators={[
        { title: "Nickels to Crush Calculator", url: "/funny/nickels-to-crush-calculator", icon: "🤪" },
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
        { title: "Hot-Dog to Bun Mismatch Solver", url: "/funny/hot-dog-bun-mismatch-solver", icon: "🐈" },
        { title: "Coffee Addiction Meter", url: "/funny/coffee-addiction-meter", icon: "☕" },
        { title: "Meme Virality Calculator", url: "/funny/meme-virality-calculator", icon: "🤪" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}