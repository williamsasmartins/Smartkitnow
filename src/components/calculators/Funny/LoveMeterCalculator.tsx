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

function sanitizeName(name: string) {
  return name.trim().toUpperCase().replace(/[^A-Z]/g, "");
}

function letterScore(letter: string) {
  // Assign a score to each letter A=1, B=2 ... Z=26
  return letter.charCodeAt(0) - 64;
}

function calculateCompatibility(name1: string, name2: string) {
  // Calculate sum of letter scores for each name
  const sum1 = name1.split("").reduce((acc, l) => acc + letterScore(l), 0);
  const sum2 = name2.split("").reduce((acc, l) => acc + letterScore(l), 0);

  // Compatibility score based on difference and sum
  const maxScore = 26 * Math.max(name1.length, name2.length);
  const diff = Math.abs(sum1 - sum2);
  const baseScore = 100 - (diff / maxScore) * 100;

  // Add some fun randomness based on combined length and letter uniqueness
  const combined = name1 + name2;
  const uniqueLetters = new Set(combined).size;
  const uniquenessBonus = (uniqueLetters / combined.length) * 10;

  let finalScore = Math.min(100, Math.max(0, baseScore + uniquenessBonus));

  return Math.round(finalScore);
}

export default function LoveMeterCalculator() {
  const [inputs, setInputs] = useState({ unit: "metric", name1: "", name2: "" });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const n1 = sanitizeName(inputs.name1 || "");
    const n2 = sanitizeName(inputs.name2 || "");

    if (!n1 || !n2) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-slate-500",
        icon: <Info />,
      };
    }

    const score = calculateCompatibility(n1, n2);

    let label = "";
    let subtext = "";
    let color = "";
    let icon = null;

    if (score > 85) {
      label = "True Soulmates";
      subtext = "Your names sing in perfect harmony, like a timeless love ballad.";
      color = "text-pink-600";
      icon = <Heart />;
    } else if (score > 65) {
      label = "Great Match";
      subtext = "There's a strong spark here, with plenty of room to grow together.";
      color = "text-rose-500";
      icon = <Smile />;
    } else if (score > 40) {
      label = "Potential Chemistry";
      subtext = "Some interesting vibes, but maybe a few bumps on the road ahead.";
      color = "text-yellow-600";
      icon = <Meh />;
    } else if (score > 20) {
      label = "Tricky Pairing";
      subtext = "Your names clash like oil and water — but opposites can attract!";
      color = "text-orange-600";
      icon = <Frown />;
    } else {
      label = "Star-Crossed";
      subtext = "Destined for drama or disaster? Sometimes love is a wild ride.";
      color = "text-red-700";
      icon = <Skull />;
    }

    return { value: `${score}%`, label, subtext, color, icon };
  }, [inputs]);

  const faqs = [
    {
      question: "How does the Love Meter calculate compatibility?",
      answer:
        "The Love Meter uses a playful algorithm that assigns numerical values to each letter in your names, then compares the sums to gauge harmony. This method is inspired by ancient numerology practices, where numbers were believed to reveal hidden truths about relationships. While not scientifically proven, it’s a fun way to spark conversations and explore name-based connections.",
    },
    {
      question: "Why do some names score higher than others?",
      answer:
        "Names with similar letter compositions tend to score higher because their numerical values align more closely, suggesting compatibility. This reflects an old belief that harmony in names could mirror harmony in relationships. However, the score also factors in uniqueness and length, adding a dash of unpredictability to keep things interesting.",
    },
    {
      question: "Can the Love Meter predict real relationship success?",
      answer:
        "While the Love Meter is entertaining and sometimes eerily accurate, it’s not a crystal ball for love. Real relationships depend on communication, trust, and shared values—things no algorithm can fully capture. Think of this tool as a charming icebreaker rather than a serious matchmaking device.",
    },
    {
      question: "Where did the idea of name compatibility originate?",
      answer:
        "The concept of name compatibility has roots in ancient cultures, including the Greeks and Romans, who believed names held mystical power. In medieval Europe, numerology and the study of letters were used to divine personality traits and fate. Today, it’s a popular theme in pop culture and dating apps, blending tradition with modern fun.",
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name1">Your Name</Label>
          <Input
            id="name1"
            placeholder="Enter your name"
            value={inputs.name1}
            onChange={(e) => handleInputChange("name1", e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="name2">Crush's Name</Label>
          <Input
            id="name2"
            placeholder="Enter your crush's name"
            value={inputs.name2}
            onChange={(e) => handleInputChange("name2", e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            /* Just triggers recalculation since useMemo depends on inputs */
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ unit: "metric", name1: "", name2: "" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Love Meter (Name Compatibility)</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Love Meter is a whimsical tool that measures the compatibility between two names by converting letters into numbers and comparing their sums. This playful approach draws inspiration from numerology, an ancient practice where numbers were believed to hold mystical significance and reveal hidden truths about personality and fate. While the Love Meter doesn’t claim scientific accuracy, it offers a fun way to explore the mysterious connections between names and relationships. It’s like a modern-day oracle, but with a wink and a smile.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Numerology dates back thousands of years to ancient civilizations like the Babylonians and Greeks, who believed numbers could unlock the secrets of the universe. The famous mathematician Pythagoras popularized the idea that numbers have spiritual meanings, influencing everything from personality analysis to love compatibility. Today, name compatibility tests are a fun cultural relic of this mystical tradition, blending ancient wisdom with modern romance.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Love Meter is as simple as typing in your name and your crush’s name, then hitting calculate. The tool will analyze the letters in both names, convert them into numerical values, and compute a compatibility score expressed as a percentage. This score reflects how closely your names align numerically, with a higher score suggesting greater harmony. Remember, it’s all in good fun—perfect for breaking the ice or adding a little magic to your day.
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
            <a href="https://www.history.com/topics/folklore/numerology" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              History of Numerology <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore how ancient cultures used numbers to interpret personality and fate, laying the groundwork for modern compatibility tests.
            </p>
          </li>
          <li>
            <a href="https://www.britannica.com/topic/numerology" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Numerology - Britannica <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive overview of numerology’s origins, practices, and cultural impact throughout history.
            </p>
          </li>
          <li>
            <a href="https://www.psychologytoday.com/us/blog/the-mating-game/201402/the-science-love" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              The Science of Love <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Understand the psychological and biological factors that influence real-world compatibility beyond names and numbers.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Love Meter (Name Compatibility)"
      description="Test name compatibility. A classic fun algorithm to see if you and your crush are a 100% match or destined for doom."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Compatibility Score = 100 - (|Sum(Name1) - Sum(Name2)| / MaxPossibleSum) * 100 + UniquenessBonus",
        variables: [
          { name: "Sum(Name)", description: "Sum of letter values (A=1, B=2, ..., Z=26)" },
          { name: "MaxPossibleSum", description: "Maximum possible sum based on longest name length" },
          { name: "UniquenessBonus", description: "Bonus based on unique letters in combined names" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate compatibility between 'Alice' and 'Bob'.",
        steps: [
          { label: "1", explanation: "Convert letters to numbers: Alice = 1+12+9+3+5=30, Bob = 2+15+2=19" },
          { label: "2", explanation: "Calculate difference: |30 - 19| = 11" },
          { label: "3", explanation: "Determine max sum (26 * 5 letters) = 130" },
          { label: "4", explanation: "Compute base score: 100 - (11/130)*100 ≈ 91.5" },
          { label: "5", explanation: "Add uniqueness bonus based on unique letters in 'ALICEBOB'" },
        ],
        result: "Final compatibility score is approximately 95%, indicating a strong match.",
      }}
      relatedCalculators={[
        { title: "Hot-Dog to Bun Mismatch Solver", url: "/funny/hot-dog-bun-mismatch-solver", icon: "🍩" },
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🤪" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Plant Watering Procrastination Index", url: "/funny/plant-watering-procrastination-index", icon: "🤪" },
        { title: "Death by Caffeine (Max Safe Intake)", url: "/funny/death-by-caffeine", icon: "☕" },
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
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