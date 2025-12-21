import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Lightbulb, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DrakeEquationCalculator() {
  // Inputs correspond to the Drake Equation variables:
  // N = R* × fp × ne × fl × fi × fc × L
  // Where:
  // R* = average rate of star formation per year in our galaxy
  // fp = fraction of those stars that have planets
  // ne = average number of planets that could support life per star that has planets
  // fl = fraction of planets that could support life that actually develop life
  // fi = fraction of planets with life that develop intelligent life
  // fc = fraction of civilizations that develop technology that releases detectable signs of their existence
  // L = length of time such civilizations release detectable signals (in years)

  const [inputs, setInputs] = useState({
    Rstar: "",
    fp: "",
    ne: "",
    fl: "",
    fi: "",
    fc: "",
    L: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals, empty string allowed
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    // Parse inputs as floats
    const Rstar = parseFloat(inputs.Rstar);
    const fp = parseFloat(inputs.fp);
    const ne = parseFloat(inputs.ne);
    const fl = parseFloat(inputs.fl);
    const fi = parseFloat(inputs.fi);
    const fc = parseFloat(inputs.fc);
    const L = parseFloat(inputs.L);

    // If any input is empty or NaN, return neutral state (no error)
    if (
      [Rstar, fp, ne, fl, fi, fc, L].some(
        (v) => isNaN(v) || v === null || v === undefined
      )
    ) {
      return { value: null };
    }

    // Validate inputs are within reasonable ranges
    // All fractions should be between 0 and 1
    const fractions = [fp, fl, fi, fc];
    if (
      fractions.some((f) => f < 0 || f > 1) ||
      Rstar < 0 ||
      ne < 0 ||
      L < 0
    ) {
      return {
        value: null,
        label: "Invalid input",
        subtext: "Please enter valid positive numbers and fractions between 0 and 1.",
        color: "text-red-600",
        icon: <RotateCcw />,
      };
    }

    // Calculate N
    const N = Rstar * fp * ne * fl * fi * fc * L;

    // Format result with commas and max 2 decimals
    const formattedN =
      N < 0.01 ? N.toExponential(2) : N.toLocaleString("en-US", { maximumFractionDigits: 2 });

    return {
      value: formattedN,
      label: "Estimated Number of Communicative Civilizations",
      subtext:
        "Based on the Drake Equation, this is the estimated number of active, communicative extraterrestrial civilizations in our galaxy.",
      color: "text-blue-600",
      icon: <Smile />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Drake Equation?",
      answer:
        "The Drake Equation is a probabilistic formula used to estimate the number of active, communicative extraterrestrial civilizations in the Milky Way galaxy. It was developed by Frank Drake in 1961 to stimulate scientific dialogue about the search for extraterrestrial life.",
    },
    {
      question: "Why are some inputs fractions between 0 and 1?",
      answer:
        "Many factors in the Drake Equation represent probabilities or fractions, such as the fraction of stars with planets or the fraction of planets that develop life. These values must be between 0 and 1 to represent realistic probabilities.",
    },
    {
      question: "Can the Drake Equation give an exact number?",
      answer:
        "No, the Drake Equation provides an estimate based on assumptions and current scientific understanding. Many of its parameters are uncertain, so results should be interpreted as rough approximations rather than precise counts.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="Rstar">R* (Star Formation Rate per Year)</Label>
          <Input
            id="Rstar"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 1.5"
            value={inputs.Rstar}
            onChange={(e) => handleInputChange("Rstar", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Average number of new stars formed per year in our galaxy.
          </p>
        </div>

        <div>
          <Label htmlFor="fp">fp (Fraction of Stars with Planets)</Label>
          <Input
            id="fp"
            type="text"
            inputMode="decimal"
            placeholder="0 to 1"
            value={inputs.fp}
            onChange={(e) => handleInputChange("fp", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Fraction of stars that have planetary systems (0 to 1).
          </p>
        </div>

        <div>
          <Label htmlFor="ne">ne (Habitable Planets per Star)</Label>
          <Input
            id="ne"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 2"
            value={inputs.ne}
            onChange={(e) => handleInputChange("ne", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Average number of planets that could support life per star with planets.
          </p>
        </div>

        <div>
          <Label htmlFor="fl">fl (Fraction that Develop Life)</Label>
          <Input
            id="fl"
            type="text"
            inputMode="decimal"
            placeholder="0 to 1"
            value={inputs.fl}
            onChange={(e) => handleInputChange("fl", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Fraction of habitable planets where life actually appears (0 to 1).
          </p>
        </div>

        <div>
          <Label htmlFor="fi">fi (Fraction that Develop Intelligence)</Label>
          <Input
            id="fi"
            type="text"
            inputMode="decimal"
            placeholder="0 to 1"
            value={inputs.fi}
            onChange={(e) => handleInputChange("fi", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Fraction of planets with life that develop intelligent life (0 to 1).
          </p>
        </div>

        <div>
          <Label htmlFor="fc">fc (Fraction that Communicate)</Label>
          <Input
            id="fc"
            type="text"
            inputMode="decimal"
            placeholder="0 to 1"
            value={inputs.fc}
            onChange={(e) => handleInputChange("fc", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
            Fraction of intelligent civilizations that develop detectable communication (0 to 1).
          </p>
        </div>

        <div>
          <Label htmlFor="L">L (Length of Communicative Phase in Years)</Label>
          <Input
            id="L"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 10000"
            value={inputs.L}
            onChange={(e) => handleInputChange("L", e.target.value)}
          />
          <p className="text-sm text-slate-500 mt-1">
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
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              Rstar: "",
              fp: "",
              ne: "",
              fl: "",
              fi: "",
              fc: "",
              L: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              {results.label}
            </p>
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
          The Drake Equation is a scientific formula created to estimate the number of active,
          communicative extraterrestrial civilizations in our Milky Way galaxy. It combines
          astrophysical, biological, and technological factors to provide a probabilistic
          estimate. While many of its parameters remain uncertain, it serves as a valuable
          framework for thinking about the search for alien life.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to input your own estimates for each factor, helping you
          explore how different assumptions affect the final result. By adjusting these values,
          you can better understand the complexities and uncertainties involved in the search
          for extraterrestrial intelligence.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The Drake Equation was first proposed by astronomer Frank Drake in 1961 during a
            meeting at the National Radio Astronomy Observatory. It was intended more as a
            way to stimulate discussion than to provide a definitive answer, but it remains
            a cornerstone of SETI (Search for Extraterrestrial Intelligence) research today.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use the Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter your estimates for each parameter of the Drake Equation in the input fields.
          Use decimal values between 0 and 1 for fractions, and positive numbers for counts
          and rates. If you are unsure, try using commonly accepted scientific estimates as a
          starting point.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After filling in the inputs, click the "Calculate" button to see the estimated number
          of communicative civilizations. You can reset the inputs anytime using the "Reset"
          button to start fresh. Experimenting with different values can help you appreciate
          the uncertainties and possibilities in the search for alien life.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Drake_equation"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Drake Equation - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm mt-1">
              Comprehensive overview of the Drake Equation, its parameters, and scientific context.
            </p>
          </li>
          <li>
            <a
              href="https://seti.org/drake-equation-index/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              SETI Institute - Drake Equation <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm mt-1">
              Educational resources and explanations from the Search for Extraterrestrial Intelligence Institute.
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
        title: "The Drake Equation",
        formula: "N = R* × fp × ne × fl × fi × fc × L",
        variables: [
          { symbol: "N", description: "Number of communicative civilizations" },
          { symbol: "R*", description: "Average rate of star formation per year" },
          { symbol: "fp", description: "Fraction of stars with planets" },
          { symbol: "ne", description: "Number of habitable planets per star" },
          { symbol: "fl", description: "Fraction of habitable planets that develop life" },
          { symbol: "fi", description: "Fraction of life-bearing planets that develop intelligence" },
          { symbol: "fc", description: "Fraction of intelligent civilizations that communicate" },
          { symbol: "L", description: "Length of time civilizations release detectable signals (years)" },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Using commonly accepted estimates to calculate the number of communicative civilizations.",
        steps: [
          {
            label: "1",
            explanation:
              "Assume 1.5 stars form per year (R* = 1.5).",
          },
          {
            label: "2",
            explanation:
              "70% of stars have planets (fp = 0.7).",
          },
          {
            label: "3",
            explanation:
              "Each star with planets has 2 habitable planets on average (ne = 2).",
          },
          {
            label: "4",
            explanation:
              "60% of habitable planets develop life (fl = 0.6).",
          },
          {
            label: "5",
            explanation:
              "13% of life-bearing planets develop intelligence (fi = 0.13).",
          },
          {
            label: "6",
            explanation:
              "20% of intelligent civilizations communicate (fc = 0.2).",
          },
          {
            label: "7",
            explanation:
              "Civilizations communicate for 10,000 years on average (L = 10000).",
          },
        ],
        result:
          "N = 1.5 × 0.7 × 2 × 0.6 × 0.13 × 0.2 × 10000 ≈ 327.6 communicative civilizations.",
      }}
      relatedCalculators={[
        {
          title: "Pizza Size/Price Comparison Calculator",
          url: "/funny/pizza-size-price-comparison",
          icon: "🍕",
        },
        {
          title: "Crinkle Crankle Wall Brick Saver",
          url: "/funny/crinkle-crankle-wall-brick-saver",
          icon: "🤪",
        },
        {
          title: "Time Travel Energy Requirement",
          url: "/funny/time-travel-energy-requirement",
          icon: "✈️",
        },
        {
          title: "Pizza Slices per Person & Regret Index",
          url: "/funny/pizza-slices-per-person-regret-index",
          icon: "🍕",
        },
        {
          title: "First-Date Awkwardness Meter",
          url: "/funny/first-date-awkwardness-meter",
          icon: "❤️",
        },
        {
          title: "Life Value Estimator (Worth in Tacos)",
          url: "/funny/life-value-in-tacos",
          icon: "🍩",
        },
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