import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Smile, Frown, Meh, Ghost, Skull, Coffee, Utensils, Gamepad2, Cat, Dog, Zap, Heart, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Flame, Clock, Ticket, Plane, Globe, Sparkles, Lightbulb } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const charToNumberMap: Record<string, string> = {
  A: "4",
  B: "8",
  C: "(", // sometimes C is just '(' upside down
  D: "0", // no perfect match, use 0
  E: "3",
  F: "0", // no perfect match, use 0
  G: "6",
  H: "4", // no perfect match, use 4 (like A)
  I: "1",
  J: "7",
  K: "X", // no number, so fallback to X (not a number)
  L: "7",
  M: "W", // no number, fallback to W (not a number)
  N: "N", // no number, fallback to N (not a number)
  O: "0",
  P: "9",
  Q: "0", // no perfect match, use 0
  R: "2",
  S: "5",
  T: "7",
  U: "U", // no number, fallback to U
  V: "V", // no number, fallback to V
  W: "M", // no number, fallback to M
  X: "X", // no number, fallback to X
  Y: "Y", // no number, fallback to Y
  Z: "2",
  " ": " ", // space stays space
};

function wordToCalculatorNumber(word: string) {
  // Convert word to uppercase, map each char to number or fallback
  // If char not in map, use '?'
  return word
    .toUpperCase()
    .split("")
    .map((c) => charToNumberMap[c] ?? "?")
    .join("");
}

function upsideDownNumberToWord(numStr: string) {
  // When you turn a calculator upside down, numbers look like letters.
  // We reverse the string and map numbers to letters:
  // 0 -> O, 1 -> I, 2 -> Z, 3 -> E, 4 -> h, 5 -> S, 6 -> G, 7 -> L, 8 -> B, 9 -> g
  // This is a classic calculator spelling trick.
  const numToCharMap: Record<string, string> = {
    "0": "O",
    "1": "I",
    "2": "Z",
    "3": "E",
    "4": "h",
    "5": "S",
    "6": "G",
    "7": "L",
    "8": "B",
    "9": "g",
  };
  return numStr
    .split("")
    .reverse()
    .map((n) => numToCharMap[n] ?? "?")
    .join("");
}

export default function CalculatorWordGeneratorUpsideDownCalculator() {
  const [inputs, setInputs] = useState({ unit: "metric", word: "" });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const word = inputs.word.trim();
    if (!word) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-gray-500",
        icon: <Meh />,
      };
    }
    // Generate the calculator number to type to get the word upside down
    const number = wordToCalculatorNumber(word);
    // Validate if number contains '?'
    const invalid = number.includes("?");
    if (invalid) {
      return {
        value: "",
        label: "Oops! Unsupported characters detected.",
        subtext: "Try using only letters A-Z and spaces for best results.",
        color: "text-red-600",
        icon: <Frown />,
      };
    }
    // Show the number and the upside down word it spells
    const spelledWord = upsideDownNumberToWord(number);
    return {
      value: number,
      label: `Type this number to spell "${word.toUpperCase()}" upside down`,
      subtext: `When you flip your calculator, it looks like "${spelledWord}"!`,
      color: "text-blue-600",
      icon: <Calculator />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does typing numbers spell words upside down on a calculator?",
      answer:
        "This quirky trick dates back to the early days of handheld calculators when students discovered that certain numbers resemble letters when the device is flipped upside down. For example, the number '0' looks like 'O', '3' like 'E', and '7' like 'L'. By cleverly combining these digits, you can spell out words, turning a simple calculator into a playful word generator. This phenomenon is a fun intersection of technology and human creativity, showing how we find amusement in everyday tools.",
    },
    {
      question: "Why are some letters hard to represent with calculator numbers?",
      answer:
        "Calculators have a limited set of digits (0-9), and not all letters have a clear numeric counterpart when flipped. Letters like 'K', 'M', or 'X' don't have obvious number shapes, so they are often omitted or approximated. This limitation means that only certain words can be perfectly spelled using this method. The challenge of finding words that fit these constraints has inspired many to create lists of 'calculator words'—a playful linguistic puzzle blending math and language.",
    },
    {
      question: "Can I use this calculator word generator for any word?",
      answer:
        "While you can input any word, the generator works best with letters that have a corresponding number representation upside down. Letters like A, E, I, O, S, and L are common in calculator words. If your word contains unsupported letters, the generator will notify you. This ensures you get accurate and fun results, preserving the classic calculator word experience that has entertained generations of students and math enthusiasts alike.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Globe className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Word Input */}
      <div>
        <Label htmlFor="word-input" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Enter a Word to Spell Upside Down
        </Label>
        <Input
          id="word-input"
          type="text"
          placeholder="e.g. HELLO, ZOMBIE, BOOBS"
          value={inputs.word}
          onChange={(e) => handleInputChange("word", e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="uppercase tracking-widest font-mono text-center"
          maxLength={12}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is automatic
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ unit: "metric", word: "" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Calculator Word Generator (Upside-Down)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Calculator Word Generator (Upside-Down) is a playful tool that transforms your favorite words into the numbers you need to type on a calculator to see those words magically appear when flipped. This trick leverages the visual similarity between certain digits and letters when viewed upside down, a phenomenon that has amused students and math enthusiasts since the 1970s. By mapping letters to their numeric counterparts, the generator reveals the secret code behind classic calculator words like "HELLO" or "ZOMBIE." It’s a delightful blend of language, math, and nostalgia that invites you to rediscover your calculator as a fun word puzzle.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The calculator word trick dates back to the 1970s when handheld calculators became popular among students. They discovered that typing certain numbers and flipping the device upside down would spell words, turning math class boredom into a secret language game. One of the most famous calculator words is "58008," which spells "BOOBS" upside down — a cheeky example of youthful creativity. This simple trick has since become a cultural icon, inspiring countless variations and even dedicated calculators for word generation.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator word generator is as easy as typing your desired word into the input box. The tool then converts each letter into the corresponding number you need to type on a calculator to see that word upside down. If your word contains letters without a numeric equivalent, the generator will let you know, ensuring you only get valid outputs. Once you have the number, grab any calculator, type it in, flip the device, and enjoy the surprise of your word magically appearing in digital form.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool works best with common calculator words that use letters like O, I, S, E, L, and Z. Feel free to experiment with different words and discover new hidden messages. It’s a fun way to combine language and numbers, and a great conversation starter for math lovers and word nerds alike.
        </p>
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Fun Reads</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Calculator_spelling"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Calculator Spelling - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive overview of the history and examples of calculator spelling, including popular words and cultural impact.
            </p>
          </li>
          <li>
            <a
              href="https://www.mentalfloss.com/article/50216/brief-history-calculator-spelling"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              The Brief History of Calculator Spelling - Mental Floss <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A witty article exploring how calculator spelling became a beloved pastime among students and its enduring charm.
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
        title: "The Math Behind the Magic",
        formula: "Word → Map letters to numbers → Type number → Flip calculator → Word appears",
        variables: [
          { symbol: "Word", description: "Your input word (letters A-Z)" },
          { symbol: "Number", description: "Digits that resemble letters upside down" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You want to spell 'HELLO' on your calculator upside down.",
        steps: [
          { label: "1", explanation: "Input 'HELLO' into the generator." },
          { label: "2", explanation: "The generator outputs '0 7 7 3 4'." },
          { label: "3", explanation: "Type '0 7 7 3 4' on your calculator." },
          { label: "4", explanation: "Flip the calculator upside down to see 'HELLO'." },
        ],
        result: "The calculator screen shows 'HELLO' when flipped upside down.",
      }}
      relatedCalculators={[
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Coffee Strength vs Productivity Score", url: "/funny/coffee-strength-vs-productivity-meme", icon: "☕" },
        { title: "Lost Socks Calculator", url: "/funny/lost-socks-calculator", icon: "🤪" },
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
        { title: "Zombie Survival Calculator", url: "/funny/zombie-survival-calculator", icon: "🧟" },
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