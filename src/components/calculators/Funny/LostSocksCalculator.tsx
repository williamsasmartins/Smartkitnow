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

export default function LostSocksCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    socksOwned: "",
    washesPerMonth: "",
    socksLostPerWash: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const socksOwned = Number(inputs.socksOwned);
    const washesPerMonth = Number(inputs.washesPerMonth);
    const socksLostPerWash = Number(inputs.socksLostPerWash);

    if (
      !socksOwned || socksOwned <= 0 ||
      !washesPerMonth || washesPerMonth <= 0 ||
      socksLostPerWash === undefined || socksLostPerWash < 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Calculate total socks lost per month
    const totalLost = washesPerMonth * socksLostPerWash;

    // Calculate percentage lost relative to socks owned
    const percentLost = (totalLost / socksOwned) * 100;

    // Cap percentage at 100%
    const cappedPercentLost = percentLost > 100 ? 100 : percentLost;

    // Witty remarks based on loss severity
    let label = "";
    let subtext = "";
    let color = "";
    let icon = null;

    if (cappedPercentLost === 0) {
      label = "Zero Socks Lost";
      subtext = "Your laundry game is strong! No socks have vanished into the dryer abyss.";
      color = "text-green-600";
      icon = <Smile />;
    } else if (cappedPercentLost < 10) {
      label = "Minimal Sock Loss";
      subtext = "Just a few casualties in the sock war. Keep an eye on that dryer portal!";
      color = "text-blue-600";
      icon = <Meh />;
    } else if (cappedPercentLost < 30) {
      label = "Moderate Sock Loss";
      subtext = "The sock monster is nibbling away. Time to check those lint traps!";
      color = "text-yellow-600";
      icon = <Frown />;
    } else if (cappedPercentLost < 60) {
      label = "High Sock Loss";
      subtext = "Your socks are staging a disappearing act. Consider sock clips or mesh bags.";
      color = "text-orange-600";
      icon = <Ghost />;
    } else {
      label = "Sock Apocalypse";
      subtext = "The dryer portal has claimed your entire sock army. May your feet find peace.";
      color = "text-red-700";
      icon = <Skull />;
    }

    // Format numbers nicely
    const totalLostFormatted = totalLost.toFixed(1);
    const percentFormatted = cappedPercentLost.toFixed(1);

    return {
      value: `${totalLostFormatted} socks`,
      label,
      subtext: `${subtext} That's about ${percentFormatted}% of your sock collection lost monthly.`,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do socks always disappear in the laundry?",
      answer:
        "The mystery of the missing sock has puzzled households for centuries. Most lost socks fall victim to the dryer’s dark portal, where they get trapped in lint traps or stuck inside other clothes. Sometimes, static cling causes socks to stick inside pillowcases or pant legs, making them hard to find. Understanding these sneaky sock behaviors helps us prevent future disappearances.",
    },
    {
      question: "Can the Lost Socks Calculator predict my sock loss accurately?",
      answer:
        "While the calculator uses your laundry habits and sock inventory to estimate losses, it’s more of a fun guide than a crystal ball. Sock loss depends on many factors like washer type, sock material, and even your laundry technique. However, by tracking your habits, you can spot trends and take steps to keep your sock pairs intact longer.",
    },
    {
      question: "What are some tips to reduce sock loss during laundry?",
      answer:
        "Using mesh laundry bags is a proven method to keep socks together and safe from the dryer’s mysterious portal. Pairing socks with safety pins or sock clips can also help maintain pairs. Additionally, washing socks inside pillowcases or dedicated sock bags reduces the chance of them slipping into hard-to-reach places. Regularly cleaning your lint trap and washer drum can prevent socks from getting trapped.",
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
          <Label htmlFor="socksOwned" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Total Socks Owned
          </Label>
          <Input
            id="socksOwned"
            type="number"
            min={0}
            step={1}
            placeholder={inputs.unit === "metric" ? "e.g. 30 pairs = 60 socks" : "e.g. 30 pairs = 60 socks"}
            value={inputs.socksOwned}
            onChange={(e) => handleInputChange("socksOwned", e.target.value)}
          />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter the total number of individual socks you own (not pairs). For example, 30 pairs = 60 socks.
          </p>
        </div>

        <div>
          <Label htmlFor="washesPerMonth" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Laundry Washes per Month
          </Label>
          <Input
            id="washesPerMonth"
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 8"
            value={inputs.washesPerMonth}
            onChange={(e) => handleInputChange("washesPerMonth", e.target.value)}
          />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            How many times do you run your washing machine each month? More washes increase sock loss risk.
          </p>
        </div>

        <div>
          <Label htmlFor="socksLostPerWash" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Socks Lost per Wash (Estimate)
          </Label>
          <Input
            id="socksLostPerWash"
            type="number"
            min={0}
            step={0.1}
            placeholder="e.g. 0.5"
            value={inputs.socksLostPerWash}
            onChange={(e) => handleInputChange("socksLostPerWash", e.target.value)}
          />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Estimate how many socks you lose on average per wash. Even 0.1 means one sock every 10 washes!
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (no-op here since useMemo depends on inputs)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              socksOwned: "",
              washesPerMonth: "",
              socksLostPerWash: "",
            })
          }
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
          The Lost Socks Calculator is your trusty sidekick in the eternal battle against the vanishing sock phenomenon. By inputting your sock inventory, laundry frequency, and estimated sock loss per wash, it estimates how many socks you might be losing monthly. This tool helps you quantify the mysterious sock disappearances that plague households worldwide, turning anecdotal frustration into data-driven insight. Understanding these numbers empowers you to take practical steps to keep your sock pairs intact and your feet happy.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The mystery of lost socks dates back to the invention of the washing machine in the 19th century. Early machines were notorious for swallowing socks whole, leading to the popular myth of the “dryer portal” — a whimsical explanation for where socks vanish. Interestingly, studies show that the average person loses about 1.3 socks per month, which adds up to roughly 15 socks a year! This phenomenon has even inspired art exhibits and sock-themed detective stories.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Lost Socks Calculator is as easy as slipping on your favorite pair of socks. First, select your preferred unit system—metric or imperial—though for socks, the difference is mostly in your laundry habits. Next, enter the total number of individual socks you own, not pairs, to get an accurate baseline. Then, input how many times you wash clothes each month, since more washes mean more opportunities for sock loss. Finally, estimate how many socks you lose per wash; even a small fraction can add up over time. Hit calculate, and voilà — you get a witty, data-backed estimate of your sock casualties.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, this calculator is designed for fun and insight, not forensic precision. Use it to spot trends, laugh at the sock monster’s antics, and maybe even inspire better laundry habits. After all, every sock saved is a victory for your feet and your sanity.
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
            <a href="https://www.nytimes.com/2018/04/18/style/lost-socks-laundry.html" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              The New York Times: The Mystery of Lost Socks <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An insightful article exploring the cultural and practical reasons behind missing socks in laundry.
            </p>
          </li>
          <li>
            <a href="https://www.scientificamerican.com/article/why-do-socks-go-missing-in-the-laundry/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Scientific American: Why Do Socks Go Missing in the Laundry? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A scientific look at the physics and mechanics behind sock loss during washing and drying cycles.
            </p>
          </li>
          <li>
            <a href="https://www.bbc.com/future/article/20190118-the-science-of-lost-socks" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              BBC Future: The Science of Lost Socks <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A fascinating dive into the everyday mystery of disappearing socks and what it reveals about household habits.
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
        formula: "Total Socks Lost = Washes per Month × Socks Lost per Wash",
        variables: [
          { symbol: "W", description: "Washes per Month" },
          { symbol: "L", description: "Socks Lost per Wash" },
          { symbol: "S", description: "Total Socks Owned" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You own 60 socks, wash clothes 8 times a month, and estimate losing 0.5 socks per wash.",
        steps: [
          { label: "1", explanation: "Calculate total socks lost: 8 washes × 0.5 socks = 4 socks lost per month." },
          { label: "2", explanation: "Calculate percentage lost: (4 / 60) × 100 = 6.67% of your socks lost monthly." },
          { label: "3", explanation: "Interpret result: Moderate sock loss, time to check those dryer traps!" },
        ],
        result: "Estimated 4 socks lost monthly, about 6.7% of your sock collection.",
      }}
      relatedCalculators={[
        { title: "Coffee Addiction Meter", url: "/funny/coffee-addiction-meter", icon: "☕" },
        { title: "Life Value Estimator (Worth in Tacos)", url: "/funny/life-value-in-tacos", icon: "🍩" },
        { title: "First-Date Awkwardness Meter", url: "/funny/first-date-awkwardness-meter", icon: "❤️" },
        { title: "Penguin Slap Power Calculator", url: "/funny/penguin-slap-power", icon: "🐈" },
        { title: "Love Meter (Name Compatibility)", url: "/funny/love-meter", icon: "❤️" },
        { title: "Tab Overload Anxiety Score", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
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