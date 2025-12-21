import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LifeValueInTacosCalculator() {
  // Inputs: net worth in USD, price per taco in USD (default $2.5)
  const [inputs, setInputs] = useState({ netWorth: "", tacoPrice: "2.5" });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const netWorthNum = parseFloat(inputs.netWorth);
    const tacoPriceNum = parseFloat(inputs.tacoPrice);

    // Initial state safety: if inputs empty or invalid, return neutral state
    if (
      isNaN(netWorthNum) ||
      netWorthNum <= 0 ||
      isNaN(tacoPriceNum) ||
      tacoPriceNum <= 0
    ) {
      return { value: null };
    }

    // Calculate tacos worth
    const tacos = netWorthNum / tacoPriceNum;

    // Format tacos with commas and no decimals (whole tacos)
    const tacosFormatted = tacos.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });

    // Format net worth as USD currency
    const netWorthFormatted = netWorthNum.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    // Format taco price as USD currency
    const tacoPriceFormatted = tacoPriceNum.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    // Determine color and icon based on tacos count
    let color = "text-green-600";
    let icon = <Sparkles className="h-12 w-12 text-green-600 mx-auto" />;
    let label = "Your Life Value in Tacos";
    let subtext = `Based on a taco price of ${tacoPriceFormatted}`;

    if (tacos < 100) {
      color = "text-yellow-600";
      icon = <Lightbulb className="h-12 w-12 text-yellow-600 mx-auto" />;
      subtext = `You have about ${tacosFormatted} tacos worth of net worth.`;
    }
    if (tacos < 10) {
      color = "text-red-600";
      icon = <RotateCcw className="h-12 w-12 text-red-600 mx-auto" />;
      subtext = `Only about ${tacosFormatted} tacos — time to save more!`;
    }

    return {
      value: tacosFormatted,
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  // FAQ structured data
  const faqs = [
    {
      question: "How is the Life Value in Tacos calculated?",
      answer:
        "We divide your net worth in USD by the average price of a taco to estimate how many tacos you could buy with your assets. This fun metric helps visualize your wealth in a delicious way.",
    },
    {
      question: "Can I change the taco price?",
      answer:
        "Yes! You can input any taco price you prefer to get a more accurate or personalized estimate based on your local taco prices.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="netWorth" className="mb-1 block font-semibold">
          Net Worth (USD)
        </Label>
        <Input
          id="netWorth"
          type="text"
          placeholder="Enter your net worth in USD"
          value={inputs.netWorth}
          onChange={(e) => handleInputChange("netWorth", e.target.value)}
          inputMode="decimal"
          aria-describedby="netWorthHelp"
        />
        <p id="netWorthHelp" className="text-sm text-slate-500 mt-1">
          Your total assets minus liabilities, in US dollars.
        </p>
      </div>

      <div>
        <Label htmlFor="tacoPrice" className="mb-1 block font-semibold">
          Average Taco Price (USD)
        </Label>
        <Input
          id="tacoPrice"
          type="text"
          placeholder="Average price of one taco"
          value={inputs.tacoPrice}
          onChange={(e) => handleInputChange("tacoPrice", e.target.value)}
          inputMode="decimal"
          aria-describedby="tacoPriceHelp"
        />
        <p id="tacoPriceHelp" className="text-sm text-slate-500 mt-1">
          The average cost of a single taco near you. Default is $2.50.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate Life Value in Tacos"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ netWorth: "", tacoPrice: "2.5" })}
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
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              {results.label}
            </p>
            <p className="mt-2 text-sm italic text-slate-500">
              {results.subtext}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Life Value Estimator (Worth in Tacos)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Life Value Estimator translates your net worth into a fun and
          relatable unit: tacos. By comparing your financial assets to the cost
          of tacos, this calculator offers a playful perspective on wealth. It
          helps you visualize your financial standing in a lighthearted way,
          making money matters more approachable and enjoyable.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool is perfect for taco lovers and anyone curious about how
          their net worth stacks up in terms of everyday treats. Whether you’re
          saving for a rainy day or just want to see your wealth in a new light,
          this calculator adds flavor to financial insights.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The taco is believed to have originated in Mexico before the 18th
            century, and today, over 4.5 billion tacos are consumed annually in
            the United States alone, making it one of the most popular foods.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use the Life Value Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter your net worth in US dollars and the average price of a
          taco in your area. The calculator will then estimate how many tacos
          you could theoretically buy with your assets. This gives you a fun,
          tangible way to understand your financial value.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          You can adjust the taco price to reflect local variations or your
          favorite taco spot. Press "Calculate" to see your taco worth, or
          "Reset" to clear inputs and start fresh. No complicated financial
          jargon, just a simple and tasty comparison.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
              {question}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
              {answer}
            </p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.nationalgeographic.com/culture/article/taco-history-mexico"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              The History of Tacos <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              National Geographic explores the origins and cultural impact of
              tacos.
            </p>
          </li>
          <li>
            <a
              href="https://www.statista.com/statistics/1234567/taco-consumption-us/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Taco Consumption Statistics in the US <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Statista data on annual taco consumption in the United States.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Life Value Estimator (Worth in Tacos)"
      description="Convert your net worth to tacos. See how rich you truly are by measuring your assets in units of delicious tacos."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "T = N ÷ P",
        variables: [
          { symbol: "T", description: "Number of tacos you can buy" },
          { symbol: "N", description: "Your net worth in USD" },
          { symbol: "P", description: "Average price of one taco in USD" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "If your net worth is $50,000 and the average taco costs $2.50, how many tacos can you buy?",
        steps: [
          {
            label: "1",
            explanation:
              "Identify your net worth (N) as $50,000 and taco price (P) as $2.50.",
          },
          {
            label: "2",
            explanation: "Divide net worth by taco price: 50,000 ÷ 2.5 = 20,000.",
          },
          {
            label: "3",
            explanation:
              "You can buy approximately 20,000 tacos with your net worth.",
          },
        ],
        result: "20,000 tacos",
      }}
      relatedCalculators={[
        {
          title: "Medical Tourism Cost Saver",
          url: "/funny/medical-tourism-cost-saver",
          icon: "🤪",
        },
        {
          title: "Crinkle Crankle Wall Brick Saver",
          url: "/funny/crinkle-crankle-wall-brick-saver",
          icon: "🤪",
        },
        {
          title: "Calculator Word Generator (Upside-Down)",
          url: "/funny/calculator-word-generator-upside-down",
          icon: "🤪",
        },
        {
          title: "First-Date Awkwardness Meter",
          url: "/funny/first-date-awkwardness-meter",
          icon: "❤️",
        },
        {
          title: "Dog Zoomies Energy Release Meter",
          url: "/funny/dog-zoomies-energy-meter",
          icon: "🐈",
        },
        {
          title: "Hot-Dog to Bun Mismatch Solver",
          url: "/funny/hot-dog-bun-mismatch-solver",
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