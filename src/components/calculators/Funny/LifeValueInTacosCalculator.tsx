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

export default function LifeValueInTacosCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    netWorth: "",
    tacoPrice: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Constants
  // Average taco price default: $2.50 (US average street taco price approx)
  // 1 taco assumed to be a standard street taco with tortilla, meat, and toppings

  const results = useMemo(() => {
    const netWorthNum = parseFloat(inputs.netWorth);
    const tacoPriceNum = parseFloat(inputs.tacoPrice);

    if (isNaN(netWorthNum) || netWorthNum <= 0) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Use default taco price if not provided or invalid
    const tacoCost = !isNaN(tacoPriceNum) && tacoPriceNum > 0 ? tacoPriceNum : 2.5;

    // Calculate tacos worth
    const tacosWorth = netWorthNum / tacoCost;

    // Format tacos worth with commas and no decimals
    const tacosFormatted = tacosWorth.toLocaleString(undefined, { maximumFractionDigits: 0 });

    // Witty remarks based on tacos worth
    let label = "";
    let subtext = "";
    let color = "text-green-600";
    let icon = <Smile className="w-12 h-12 text-green-600" />;

    if (tacosWorth < 10) {
      label = "Just a Few Tacos";
      subtext = "Looks like your taco stash is modest, but hey, quality over quantity!";
      color = "text-yellow-600";
      icon = <Meh className="w-12 h-12 text-yellow-600" />;
    } else if (tacosWorth < 100) {
      label = "Taco Enthusiast";
      subtext = "Enough tacos to throw a small fiesta. Time to invite friends!";
      color = "text-blue-600";
      icon = <Utensils className="w-12 h-12 text-blue-600" />;
    } else if (tacosWorth < 1000) {
      label = "Taco Tycoon";
      subtext = "You could open a taco truck or two. The taco empire awaits!";
      color = "text-purple-600";
      icon = <Gamepad2 className="w-12 h-12 text-purple-600" />;
    } else if (tacosWorth < 10000) {
      label = "Taco Legend";
      subtext = "Your taco worth is legendary. You might just be the Taco King or Queen.";
      color = "text-red-600";
      icon = <Flame className="w-12 h-12 text-red-600" />;
    } else {
      label = "Taco God";
      subtext = "With this many tacos, you could feed entire cities. Bow down to the Taco God!";
      color = "text-orange-600";
      icon = <CrownIcon className="w-12 h-12 text-orange-600" />;
    }

    return {
      value: tacosFormatted,
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  // Crown icon fallback (lucide-react doesn't have Crown imported, so use Flame as substitute)
  // We'll replace CrownIcon with Flame for now
  const CrownIcon = Flame;

  const faqs = [
    {
      question: "Why measure life value in tacos?",
      answer:
        "Tacos are universally loved, affordable, and delicious, making them a fun and relatable unit of value. Measuring your net worth in tacos adds a playful twist to financial metrics, helping you visualize wealth in a tasty way. Plus, it’s a great conversation starter at parties or taco trucks!",
    },
    {
      question: "How is the taco price determined?",
      answer:
        "The default taco price is set at $2.50, reflecting the average cost of a street taco in the United States. However, taco prices vary globally depending on ingredients, location, and style. You can customize the taco price to better match your local taco scene or favorite taco joint.",
    },
    {
      question: "Can I use this calculator for other foods?",
      answer:
        "Absolutely! While this calculator is taco-themed, you can input any price per unit of your favorite food to estimate your worth in that delicious treat. Just replace the taco price with the cost of your chosen food item and enjoy the tasty perspective on your net worth.",
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
          <Label htmlFor="netWorth" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Your Net Worth ($)
          </Label>
          <Input
            id="netWorth"
            type="number"
            min="0"
            step="any"
            placeholder="Enter your net worth in dollars"
            value={inputs.netWorth}
            onChange={(e) => handleInputChange("netWorth", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="tacoPrice" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Price per Taco ($)
          </Label>
          <Input
            id="tacoPrice"
            type="number"
            min="0.01"
            step="any"
            placeholder="Default is $2.50"
            value={inputs.tacoPrice}
            onChange={(e) => handleInputChange("tacoPrice", e.target.value)}
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
          onClick={() => setInputs({ unit: "metric", netWorth: "", tacoPrice: "" })}
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
          Understanding Life Value Estimator (Worth in Tacos)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Life Value Estimator translates your net worth into an unexpectedly delicious unit: tacos. This playful approach helps you visualize wealth in a fun and relatable way, turning abstract numbers into mouthwatering tacos. By comparing your assets to tacos, you get a quirky perspective on your financial standing that’s both engaging and memorable. It’s a reminder that life’s value can be measured in joy—and what’s more joyful than tacos?
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Tacos have ancient roots dating back to the indigenous peoples of Mexico, who used tortillas as edible containers for various fillings. The word “taco” itself means “plug” or “wad” in Mexican Spanish, originally referring to the way miners used to pack gunpowder. Today, tacos are so beloved that the U.S. celebrates National Taco Day every October 4th, proving that tacos are more than just food—they’re a cultural phenomenon.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter your net worth in dollars and the price you pay for a taco in your area. If you’re unsure about the taco price, leave it blank to use the default average of $2.50. Hit calculate, and voilà! You’ll see how many tacos your wealth could buy. This calculator works best when you think of tacos as a fun unit of value, not a financial advisor’s tool.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Feel free to experiment by changing the taco price to reflect gourmet tacos, street tacos, or even taco trucks in your city. The more you tweak, the more you learn about the delicious economics behind your taco-worth. Remember, this is all in good fun—your true value is more than just tacos, but tacos sure make it tastier to think about!
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
              href="https://www.nationalgeographic.com/culture/article/taco-history-mexico-food"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Geographic: The History of Tacos <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An insightful dive into the origins and cultural significance of tacos in Mexico and beyond.
            </p>
          </li>
          <li>
            <a
              href="https://www.npr.org/sections/thesalt/2017/10/04/555544911/national-taco-day-celebrates-a-beloved-mexican-food"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NPR: National Taco Day Celebration <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Learn why October 4th is the day to celebrate tacos and how this tasty tradition took off in the U.S.
            </p>
          </li>
          <li>
            <a
              href="https://www.statista.com/statistics/1090091/average-price-of-tacos-in-the-us/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Statista: Average Taco Prices in the U.S. <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Up-to-date statistics on taco prices across different U.S. regions to help you customize your taco worth.
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
        formula: "Taco Worth = Net Worth ($) ÷ Price per Taco ($)",
        variables: [
          { symbol: "Net Worth ($)", description: "Your total assets minus liabilities in dollars." },
          { symbol: "Price per Taco ($)", description: "Cost of one taco in dollars, default is $2.50." },
        ],
      }}
      example={{
        title: "Example",
        scenario: "If your net worth is $50,000 and a taco costs $2.50, how many tacos can you buy?",
        steps: [
          { label: "1", explanation: "Identify your net worth: $50,000." },
          { label: "2", explanation: "Determine taco price: $2.50." },
          { label: "3", explanation: "Divide net worth by taco price: 50,000 ÷ 2.5 = 20,000 tacos." },
        ],
        result: "You could buy 20,000 tacos with your net worth!",
      }}
      relatedCalculators={[
        { title: "Coffee Strength vs Productivity Score", url: "/funny/coffee-strength-vs-productivity-meme", icon: "☕" },
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
        { title: "Nickels to Crush Calculator", url: "/funny/nickels-to-crush-calculator", icon: "🤪" },
        { title: "Love Meter (Name Compatibility)", url: "/funny/love-meter", icon: "❤️" },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "Rocks to Flood a Country Estimator", url: "/funny/rocks-to-flood-country", icon: "✈️" },
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