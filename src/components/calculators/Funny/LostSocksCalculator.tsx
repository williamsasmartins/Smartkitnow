import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LostSocksCalculator() {
  const [inputs, setInputs] = useState({ washesPerMonth: "", socksPerWash: "" });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and empty string
    if (/^\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const washes = Number(inputs.washesPerMonth);
    const socks = Number(inputs.socksPerWash);

    // Initial state safety: if inputs empty or zero, return neutral state
    if (!washes || !socks) {
      return { value: null };
    }

    /**
     * Lost Socks Probability Model:
     * 
     * Hypothesis: The more socks you wash per month and the more socks per wash,
     * the higher the chance of losing socks due to dryer portal theories and laundry mishaps.
     * 
     * Formula:
     *   Lost Socks per Month = washesPerMonth × socksPerWash × 0.05
     * 
     * Explanation:
     *   We assume a 5% loss rate per sock washed, based on anecdotal laundry loss statistics.
     */

    const lostSocks = washes * socks * 0.05;

    // Format value to 2 decimals, but if < 1 show as "< 1"
    const displayValue = lostSocks < 1 ? "< 1" : lostSocks.toFixed(2);

    return {
      value: displayValue,
      label: "Estimated Lost Socks per Month",
      subtext:
        lostSocks < 1
          ? "Less than one sock lost on average per month."
          : "Average number of socks lost based on your laundry habits.",
      color: "text-blue-600",
      icon: <Sparkles className="mx-auto h-12 w-12 text-blue-500" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do socks get lost in the laundry?",
      answer:
        "Socks often get lost due to static cling, slipping behind machines, or getting stuck inside other clothes. The dryer portal theory humorously suggests socks get 'teleported' to another dimension!",
    },
    {
      question: "Can I prevent losing socks?",
      answer:
        "Using mesh laundry bags, pairing socks with clips, or washing smaller loads can reduce sock loss. Regularly checking behind and inside machines also helps.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="washesPerMonth" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Number of Laundry Washes per Month
          </Label>
          <Input
            id="washesPerMonth"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 8"
            value={inputs.washesPerMonth}
            onChange={(e) => handleInputChange("washesPerMonth", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="socksPerWash" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Average Number of Socks per Wash
          </Label>
          <Input
            id="socksPerWash"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 10"
            value={inputs.socksPerWash}
            onChange={(e) => handleInputChange("socksPerWash", e.target.value)}
          />
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
          onClick={() => setInputs({ washesPerMonth: "", socksPerWash: "" })}
          className="flex-1 h-11"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Lost Socks Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Lost Socks Calculator estimates how many socks you might lose each month based on your laundry habits. By inputting how often you wash clothes and the average number of socks per wash, you get a fun yet insightful estimate of sock loss. This calculator is inspired by the common mystery of disappearing socks and the humorous "dryer portal" theory.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While the exact number of lost socks varies by household, this tool uses a simple 5% loss rate per sock washed, reflecting anecdotal evidence and laundry mishaps. It helps you understand the scale of the problem and encourages better laundry practices to minimize sock loss.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            On average, a household loses about 1.3 socks per month, which adds up to nearly 16 socks a year! This mystery has puzzled people for decades, inspiring many to invent sock clips and mesh laundry bags to keep pairs together.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the number of laundry washes you do per month and the average number of socks you include in each wash. The calculator will then estimate the number of socks you might lose monthly. Use this insight to adjust your laundry habits or try preventive measures like using mesh bags.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Remember, this is an estimate based on a general loss rate and your inputs. Actual sock loss can vary depending on factors like washing machine type, sock material, and how you sort laundry.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
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
              href="https://www.nytimes.com/2019/11/11/style/lost-socks-laundry.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              The New York Times: The Mystery of Lost Socks <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An article exploring the common phenomenon of lost socks and theories behind it.
            </p>
          </li>
          <li>
            <a
              href="https://www.rd.com/article/why-do-socks-disappear/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Reader's Digest: Why Do Socks Disappear? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Insights into the causes of sock loss and tips to prevent it.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Lost Socks Calculator"
      description="Solve the laundry mystery. Estimate the probability of losing a sock based on wash frequency and dryer portal theories."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "L = W × S × 0.05",
        variables: [
          { symbol: "L", description: "Estimated lost socks per month" },
          { symbol: "W", description: "Number of laundry washes per month" },
          { symbol: "S", description: "Average socks per wash" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "If you do 8 laundry washes per month and wash 10 socks each time, how many socks might you lose?",
        steps: [
          { label: "1", explanation: "Multiply washes by socks: 8 × 10 = 80 socks washed monthly." },
          { label: "2", explanation: "Apply 5% loss rate: 80 × 0.05 = 4 socks lost monthly." },
        ],
        result: "You might lose approximately 4 socks per month based on your laundry habits.",
      }}
      relatedCalculators={[
        { title: "Hot-Dog to Bun Mismatch Solver", url: "/funny/hot-dog-bun-mismatch-solver", icon: "🍩" },
        { title: "Keyboard Clicks per Day Estimator", url: "/funny/keyboard-clicks-per-day", icon: "💻" },
        { title: "Netflix 'Just One More Episode' Timer", url: "/funny/netflix-one-more-episode-timer", icon: "🤪" },
        { title: "Love Meter (Name Compatibility)", url: "/funny/love-meter", icon: "❤️" },
        { title: "Penguin Slap Power Calculator", url: "/funny/penguin-slap-power", icon: "🐈" },
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
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