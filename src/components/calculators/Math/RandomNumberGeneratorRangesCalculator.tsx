import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sigma,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RandomNumberGeneratorRangesCalculator() {
  const [inputs, setInputs] = useState({
    min: "",
    max: "",
    decimals: "0",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const minNum = parseFloat(inputs.min);
    const maxNum = parseFloat(inputs.max);
    const decimalsNum = parseInt(inputs.decimals, 10);

    let warning: string | null = null;
    let value: string | number = "";
    const label = "Random Number";
    let subtext = "";
    const formulaUsed = "Random Number Generation Formula";

    if (
      Number.isNaN(minNum) ||
      Number.isNaN(maxNum) ||
      Number.isNaN(decimalsNum) ||
      decimalsNum < 0 ||
      decimalsNum > 10
    ) {
      warning =
        "Please enter valid numeric inputs. Decimals must be between 0 and 10.";
      return { value: "", label, subtext, warning, formulaUsed };
    }

    if (minNum > maxNum) {
      warning = "Minimum value cannot be greater than maximum value.";
      return { value: "", label, subtext, warning, formulaUsed };
    }

    // Generate random number in range [min, max]
    // Formula: random = min + (max - min) * Math.random()
    const randomRaw = minNum + (maxNum - minNum) * Math.random();

    // Format with fixed decimals
    value = randomRaw.toFixed(decimalsNum);

    subtext = `Random number between ${minNum} and ${maxNum} with ${decimalsNum} decimal${decimalsNum !== 1 ? "s" : ""
      }.`;

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a random number generator with ranges?",
      answer:
        "A random number generator with ranges produces a number that lies within a specified minimum and maximum boundary. This is useful in simulations, games, and statistical sampling where controlled randomness is required.",
    },
    {
      question: "How do I specify decimal precision in the generator?",
      answer:
        "You can set the number of decimal places for the generated random number. The generator will round the result to the specified precision using standard rounding rules.",
    },
    {
      question: "What happens if the minimum value is greater than the maximum?",
      answer:
        "The calculator will show a warning because the minimum value must be less than or equal to the maximum value to define a valid range.",
    },
    {
      question: "Can I generate integers only?",
      answer:
        "Yes, by setting the decimal precision to zero, the generator will produce whole numbers within the specified range.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="min" className="font-semibold">
            Minimum Value
          </Label>
          <Input
            id="min"
            type="number"
            step="any"
            value={inputs.min}
            onChange={(e) => handleInputChange("min", e.target.value)}
            placeholder="e.g. 0"
            aria-describedby="min-desc"
          />
          <p id="min-desc" className="text-xs text-slate-500 mt-1">
            Enter the minimum range value.
          </p>
        </div>
        <div>
          <Label htmlFor="max" className="font-semibold">
            Maximum Value
          </Label>
          <Input
            id="max"
            type="number"
            step="any"
            value={inputs.max}
            onChange={(e) => handleInputChange("max", e.target.value)}
            placeholder="e.g. 100"
            aria-describedby="max-desc"
          />
          <p id="max-desc" className="text-xs text-slate-500 mt-1">
            Enter the maximum range value.
          </p>
        </div>
        <div>
          <Label htmlFor="decimals" className="font-semibold">
            Decimal Places
          </Label>
          <Input
            id="decimals"
            type="number"
            min={0}
            max={10}
            value={inputs.decimals}
            onChange={(e) => {
              // Clamp decimals between 0 and 10
              const val = e.target.value;
              if (val === "") {
                handleInputChange("decimals", "");
                return;
              }
              let num = parseInt(val, 10);
              if (Number.isNaN(num)) return;
              if (num < 0) num = 0;
              if (num > 10) num = 10;
              handleInputChange("decimals", num.toString());
            }}
            placeholder="0"
            aria-describedby="decimals-desc"
          />
          <p id="decimals-desc" className="text-xs text-slate-500 mt-1">
            Number of decimal places (0-10).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state with same values
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate random number"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ min: "", max: "", decimals: "0" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "" && (
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
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Random Number Generator (ranges)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A random number generator that works within specified ranges produces
          a number that lies between a minimum and maximum value. This tool is
          essential in various fields such as statistics, computer simulations,
          gaming, and decision-making processes where controlled randomness is
          required. By defining the range, users can ensure the generated number
          fits the desired constraints.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The precision of the generated number can also be controlled by
          specifying the number of decimal places. This allows for flexibility
          whether you need whole numbers or numbers with fractional parts. The
          generator uses a uniform distribution, meaning every number within the
          range has an equal chance of being selected.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is highly useful for statistical sampling, random testing,
          or any scenario where unpredictability within defined limits is
          necessary. It ensures fairness and randomness while respecting the
          boundaries set by the user.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          {`random = min + (max - min) × R

where:
- min = minimum value of the range
- max = maximum value of the range
- R = random decimal from 0 (inclusive) to 1 (exclusive) generated by Math.random()`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Random Numbers in Simulation, Cryptography, and Sampling
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Random number generation has fundamentally different requirements depending on the application. For simulations and games, pseudo-random number generators (PRNGs) are sufficient — they produce statistically random-looking sequences from a deterministic seed. For cryptography and security, cryptographically secure pseudo-random number generators (CSPRNGs) are required — they must be computationally infeasible to predict, even knowing previous outputs. Using a PRNG for key generation is a critical security vulnerability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Monte Carlo simulations use thousands or millions of random samples to estimate complex probabilities. To estimate the probability of a portfolio losing more than 10% in a month: sample random monthly returns from the historical distribution, compute portfolio value under each, count outcomes below -10%. With 100,000 trials, you estimate the probability to within +/- 0.1 percentage points. Monte Carlo is used in risk management, options pricing (Black-Scholes assumes normally distributed returns), and physics simulations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Statistical sampling uses random number generators to select representative samples from populations. A simple random sample assigns every population member a number, then selects those matching a random draw. Stratified sampling divides the population into groups and randomly samples from each. Cluster sampling randomly selects groups and samples all members of chosen groups. Each design balances cost, feasibility, and statistical efficiency differently.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Game design and procedural generation use controlled randomness to create varied, replayable experiences. A seeded random number generator produces the same level layout every time when given the same seed — useful for sharing 'seeds' that reproduce specific game worlds. Adjusting the distribution (uniform vs. weighted vs. normal) shapes the player experience: weighted random makes rare items appropriately uncommon without making them impossible.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          FAQ
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
      title="Random Number Generator (ranges)"
      description="Generate random numbers within a specific range. Perfect for statistical sampling, games, or picking a random winner."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `random = min + (max - min) × R`,
        variables: [
          { symbol: "min", description: "Minimum value of the range" },
          { symbol: "max", description: "Maximum value of the range" },
          {
            symbol: "R",
            description:
              "Random decimal from 0 (inclusive) to 1 (exclusive) generated by Math.random()",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Generate a random number between 5 and 15 with 2 decimal places.",
        steps: [
          {
            label: "1",
            explanation:
              "Set the minimum value to 5 and the maximum value to 15.",
          },
          {
            label: "2",
            explanation:
              "Set the decimal places to 2 to get a number with two digits after the decimal point.",
          },
          {
            label: "3",
            explanation: "Click Calculate to generate the random number.",
          },
        ],
        result:
          "A random number such as 9.37 will be generated, lying between 5.00 and 15.00.",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        {
          title: "Quadratic Equation Solver",
          url: "/math/quadratic-equation-solver",
          icon: "📐",
        },
        {
          title: "Standard Deviation",
          url: "/math/standard-deviation-variance",
          icon: "📊",
        },
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
        },
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