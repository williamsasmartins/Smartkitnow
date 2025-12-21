import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Lightbulb, RotateCcw, ExternalLink, Sparkles } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const charToNumberMap: Record<string, string> = {
  O: "0",
  I: "1",
  Z: "2",
  E: "3",
  A: "4",
  S: "5",
  G: "6",
  L: "7",
  B: "8",
  T: "9",
};

function generateUpsideDownNumber(word: string): string | null {
  if (!word) return null;
  // Convert word to uppercase and map each letter to its upside-down calculator number
  const mapped = [...word.toUpperCase()]
    .map((ch) => charToNumberMap[ch] ?? null)
    .join("");
  // If any character was unmapped (null), return null to indicate invalid input
  if (mapped.includes("null")) return null;
  // If any character is unmapped (null), filter them out and return null if empty
  if ([...word.toUpperCase()].some((ch) => !(ch in charToNumberMap))) return null;
  return mapped;
}

export default function CalculatorWordGeneratorUpsideDownCalculator() {
  const [inputs, setInputs] = useState<{ word?: string }>({});
  const handleInputChange = useCallback((n: string, v: string) => {
    // Only allow letters and spaces, trim spaces
    const sanitized = v.toUpperCase().replace(/[^A-Z]/g, "");
    setInputs((p) => ({ ...p, [n]: sanitized }));
  }, []);

  const results = useMemo(() => {
    const word = inputs.word ?? "";
    if (!word) {
      return { value: null, label: "", subtext: "", color: "", icon: null };
    }
    // Validate input: only letters A-Z allowed
    if (/[^A-Z]/.test(word)) {
      return {
        value: null,
        label: "Invalid input",
        subtext: "Please enter letters A-Z only.",
        color: "text-red-600",
        icon: <RotateCcw />,
      };
    }
    // Generate upside-down number
    const number = generateUpsideDownNumber(word);
    if (!number) {
      return {
        value: null,
        label: "Cannot generate number",
        subtext: "Some letters cannot be converted to calculator numbers.",
        color: "text-red-600",
        icon: <RotateCcw />,
      };
    }
    return {
      value: number,
      label: `Upside-Down Number for "${word}"`,
      subtext: "Turn your calculator upside down to see the word!",
      color: "text-blue-600",
      icon: <Smile />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Which letters can be spelled using calculator numbers?",
      answer:
        "Only certain letters can be represented by numbers on a calculator when turned upside down. Common letters include O (0), I (1), Z (2), E (3), A (4), S (5), G (6), L (7), B (8), and T (9). Letters outside this set cannot be converted.",
    },
    {
      question: "Why do some words not generate a number?",
      answer:
        "If the word contains letters that don't have a corresponding calculator number, the generator cannot produce a valid number. Please use only letters that can be mapped to numbers as per the calculator upside-down alphabet.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="word" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Enter a Word (Letters A-Z only)
        </Label>
        <Input
          id="word"
          type="text"
          placeholder="e.g. HELLO, ZOMBIE"
          value={inputs.word ?? ""}
          onChange={(e) => handleInputChange("word", e.target.value)}
          spellCheck={false}
          autoComplete="off"
          maxLength={12}
          className="uppercase"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special calculation needed on click, result updates automatically
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Generate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
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

      {!results.value && results.label && (
        <p className={`mt-4 text-center font-semibold ${results.color}`}>{results.label}</p>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Calculator Word Generator (Upside-Down)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Calculator Word Generator (Upside-Down) transforms words into numbers that resemble letters when a calculator is flipped upside down. This playful technique has been popular since calculators became widespread, allowing users to spell words like "HELLO" or "ZOMBIE" using numbers. The generator maps each letter to a corresponding digit that visually resembles it when inverted, creating a fun and nostalgic experience.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool only supports letters that can be represented by calculator digits, ensuring accurate and recognizable results. By entering your word, you can instantly see the number sequence needed to display it on a calculator screen upside down.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The tradition of spelling words on calculators dates back to the 1970s and 1980s when students discovered that certain numbers resembled letters when turned upside down. This simple trick became a popular pastime, inspiring countless creative messages and jokes.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calculator Word Generator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter a word using letters A through Z into the input field. The generator will convert each letter into a corresponding number that, when the calculator is flipped upside down, spells out your word. If your word contains letters that cannot be represented, the tool will notify you to adjust your input.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering your word, click the "Generate" button to see the number sequence. You can then try typing this number into a physical or virtual calculator and flip it to reveal your word. Use the reset button to clear the input and try new words.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">{question}</dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Calculator_spelling"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Calculator Spelling <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Wikipedia article explaining the history and examples of calculator spelling.
            </p>
          </li>
          <li>
            <a
              href="https://www.calculatorsoup.com/calculators/fun/calculator-spelling.php"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Calculator Spelling Tool <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An interactive online tool for calculator spelling and number-word conversions.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calculator Word Generator (Upside-Down)"
      description="Write words on a calculator. Generate the numbers needed to spell 'HELLO', 'ZOMBIE', and other classics when turned upside down."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Number = ∑ (Letter → Digit)",
        variables: [
          { symbol: "Letter", description: "Each letter in the input word" },
          { symbol: "Digit", description: "Corresponding calculator number when flipped" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Generate the number for the word 'HELLO'.",
        steps: [
          { label: "1", explanation: "Enter 'HELLO' into the input field." },
          { label: "2", explanation: "The generator converts letters to numbers: H (not supported), E → 3, L → 7, O → 0." },
          { label: "3", explanation: "Since H is unsupported, adjust the word or try 'SHELL' instead." },
          { label: "4", explanation: "For 'SHELL', the output is 53771." },
        ],
        result: "53771 (which spells 'SHELL' upside down on a calculator).",
      }}
      relatedCalculators={[
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
        { title: "Love Meter (Name Compatibility)", url: "/funny/love-meter", icon: "❤️" },
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
        { title: "Netflix 'Just One More Episode' Timer", url: "/funny/netflix-one-more-episode-timer", icon: "🤪" },
        { title: "Pokémon GO Weight Loss Calculator", url: "/funny/pokemon-go-weight-loss", icon: "🤪" },
        { title: "Drake Equation Calculator", url: "/funny/drake-equation-calculator", icon: "🤪" },
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