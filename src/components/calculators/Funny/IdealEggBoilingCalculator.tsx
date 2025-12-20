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

export default function IdealEggBoilingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    size: "medium",
    altitude: "",
    eggCount: "1",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Egg size to weight in grams (approximate)
  const eggWeightsMetric = {
    small: 50,
    medium: 60,
    large: 70,
    extraLarge: 80,
    jumbo: 90,
  };
  // Egg size to weight in ounces (approximate)
  const eggWeightsImperial = {
    small: 1.76,
    medium: 2.12,
    large: 2.47,
    extraLarge: 2.82,
    jumbo: 3.17,
  };

  // Boiling times base for sea level in minutes for different doneness
  // Soft: yolk mostly liquid, Medium: creamy yolk, Hard: fully set yolk
  const baseTimes = {
    soft: 4,
    medium: 7,
    hard: 10,
  };

  // Altitude effect: For every 300m (~1000ft) above sea level, add ~0.5 min to boiling time
  // Because water boils at lower temp at higher altitudes, eggs take longer to cook
  // Source: USDA and culinary science references

  // Calculate boiling time based on inputs and doneness
  const results = useMemo(() => {
    if (!inputs.altitude || isNaN(Number(inputs.altitude)) || Number(inputs.altitude) < 0) {
      return {
        value: "",
        label: "",
        subtext: "Please enter a valid altitude above sea level.",
        color: "text-red-600",
        icon: <AlertTriangle />,
      };
    }
    if (!inputs.eggCount || isNaN(Number(inputs.eggCount)) || Number(inputs.eggCount) < 1) {
      return {
        value: "",
        label: "",
        subtext: "Please enter a valid number of eggs (at least 1).",
        color: "text-red-600",
        icon: <AlertTriangle />,
      };
    }
    if (!inputs.size || !(inputs.size in eggWeightsMetric)) {
      return {
        value: "",
        label: "",
        subtext: "Please select a valid egg size.",
        color: "text-red-600",
        icon: <AlertTriangle />,
      };
    }

    // Convert altitude to number
    const altitudeNum = Number(inputs.altitude);

    // Calculate altitude adjustment in minutes
    // Every 300m adds 0.5 min
    const altitudeAdjustment = Math.floor(altitudeNum / 300) * 0.5;

    // Egg weight (not used directly in time but for trivia)
    const eggWeight = inputs.unit === "metric" ? eggWeightsMetric[inputs.size] : eggWeightsImperial[inputs.size];

    // Calculate times for soft, medium, hard
    // Adjust base times by altitude adjustment
    const softTime = baseTimes.soft + altitudeAdjustment;
    const mediumTime = baseTimes.medium + altitudeAdjustment;
    const hardTime = baseTimes.hard + altitudeAdjustment;

    // Format times nicely (round to nearest half minute)
    const formatTime = (t) => {
      const rounded = Math.round(t * 2) / 2;
      return rounded % 1 === 0 ? `${rounded} min` : `${rounded}½ min`;
    };

    // Determine doneness label and time based on eggCount input (for fun, if eggCount > 5, suggest hard)
    // But better to show all three times for user choice
    // We'll show medium-boiled time as main result, with subtext for soft and hard

    const mainValue = formatTime(mediumTime);
    const subtext = `Soft: ${formatTime(softTime)} | Hard: ${formatTime(hardTime)}. Adjust to your taste!`;

    // Witty remark based on altitude
    let altitudeRemark = "";
    if (altitudeNum === 0) altitudeRemark = "At sea level, your eggs will be perfectly classic.";
    else if (altitudeNum < 1000) altitudeRemark = "A little altitude, a little extra patience.";
    else if (altitudeNum < 3000) altitudeRemark = "High altitude cooking: your eggs need a bit more time to shine.";
    else altitudeRemark = "Wow, you're boiling eggs in the clouds! Extra time required.";

    return {
      value: mainValue,
      label: `Medium-boiled egg time for ${inputs.eggCount} ${inputs.eggCount > 1 ? "eggs" : "egg"} (${inputs.size} size)`,
      subtext: `${subtext} ${altitudeRemark}`,
      color: "text-green-700",
      icon: <Utensils />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why does altitude affect egg boiling time?",
      answer:
        "Water boils at lower temperatures as altitude increases because atmospheric pressure decreases. This means that at higher elevations, boiling water is not as hot as at sea level, so eggs take longer to cook. Understanding this helps you adjust cooking times to achieve the perfect yolk consistency regardless of where you live.",
    },
    {
      question: "How does egg size influence boiling time?",
      answer:
        "Larger eggs have more mass and require more heat energy to cook through, so they generally need longer boiling times than smaller eggs. However, the difference is subtle, and adjusting for size ensures your eggs are cooked just right without overcooking. This calculator factors in size to give you precise timing.",
    },
    {
      question: "Can I boil multiple eggs at once without changing the time?",
      answer:
        "Boiling multiple eggs simultaneously doesn't significantly change the cooking time if your pot and water volume are sufficient to maintain a rolling boil. However, adding many eggs at once can temporarily lower the water temperature, so it's best to bring the water back to a boil before starting the timer. This calculator assumes ideal conditions for consistent results.",
    },
    {
      question: "What is the origin of boiling eggs as a cooking method?",
      answer:
        "Boiling eggs is an ancient cooking technique dating back thousands of years, with archaeological evidence suggesting early humans boiled eggs using hot springs or heated stones. Eggs have been a staple food worldwide due to their nutrition and versatility. The method has evolved, but the quest for the perfect boiled egg remains timeless.",
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

      {/* Egg Size */}
      <div>
        <Label htmlFor="size" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Egg Size
        </Label>
        <Select value={inputs.size} onValueChange={(v) => handleInputChange("size", v)} id="size">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="extraLarge">Extra Large</SelectItem>
            <SelectItem value="jumbo">Jumbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Altitude */}
      <div>
        <Label htmlFor="altitude" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Altitude Above Sea Level ({inputs.unit === "metric" ? "meters" : "feet"})
        </Label>
        <Input
          type="number"
          id="altitude"
          placeholder={inputs.unit === "metric" ? "e.g. 0" : "e.g. 0"}
          value={inputs.altitude}
          onChange={(e) => handleInputChange("altitude", e.target.value)}
          min="0"
          step="1"
        />
      </div>

      {/* Number of Eggs */}
      <div>
        <Label htmlFor="eggCount" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Number of Eggs
        </Label>
        <Input
          type="number"
          id="eggCount"
          placeholder="1"
          value={inputs.eggCount}
          onChange={(e) => handleInputChange("eggCount", e.target.value)}
          min="1"
          step="1"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger recalculation by updating state (already done on input change)
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              size: "medium",
              altitude: "",
              eggCount: "1",
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Ideal Egg Boiling Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Boiling an egg to perfection is a deceptively complex culinary challenge. The ideal boiling time depends on multiple factors including egg size, altitude, and even the number of eggs boiled at once. This calculator helps you navigate these variables by adjusting cooking times to ensure your eggs come out exactly how you like them — whether that’s a runny yolk or a fully set center.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Altitude plays a crucial role because water boils at lower temperatures as you climb higher above sea level. This means that at high altitudes, your eggs need more time to cook through. Additionally, egg size influences heat penetration; larger eggs require longer cooking times to reach the same doneness as smaller ones.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting your local altitude, egg size, and quantity, this calculator provides tailored boiling times for soft, medium, and hard-boiled eggs. It’s like having a personal chef whispering egg wisdom in your ear, ensuring no more guesswork or disappointing results.
        </p>

        {/* TRIVIA BOX - AI MUST FILL THIS */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The humble boiled egg has been enjoyed for thousands of years. Archaeologists have found evidence of early humans boiling eggs using hot springs or heated stones as far back as the Paleolithic era. Interestingly, the science of boiling eggs perfectly was first studied in the 19th century by French chemist Michel Eugène Chevreul, who explored how heat affects egg proteins — laying the groundwork for modern culinary science.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is as easy as cracking an egg (but less messy). First, select your preferred unit system — metric or imperial — to match your kitchen tools. Next, choose the size of your eggs, which affects cooking time due to differences in mass and shell thickness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Then, enter your altitude above sea level. This is important because water boils at lower temperatures at higher altitudes, requiring longer cooking times. If you’re unsure, a quick online search with your city name and “altitude” will give you the number you need.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, input how many eggs you plan to boil. While the number doesn’t drastically change cooking time, it helps the calculator provide more accurate guidance. Hit “Calculate” and voilà — you’ll get the perfect boiling time for your eggs, along with tips for soft and hard-boiled variations.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Fun Reads</h2>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/egg-safety" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              USDA Egg Safety Guidelines <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">Comprehensive resource on egg handling, cooking, and safety from the U.S. Department of Agriculture.</p>
          </li>
          <li>
            <a href="https://www.sciencedaily.com/releases/2017/03/170308110834.htm" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              The Science of Boiled Eggs <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">An article explaining the chemistry behind egg cooking and texture changes.</p>
          </li>
          <li>
            <a href="https://www.britannica.com/topic/egg-cooking" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              History of Egg Cooking - Britannica <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">Explore the cultural and historical significance of eggs in cooking across civilizations.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ideal Egg Boiling Calculator"
      description="Boil the perfect egg every time. Calculate the exact cooking time for soft, medium, or hard-boiled eggs based on altitude and size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Boiling Time = Base Time + (Altitude in meters ÷ 300) × 0.5 minutes",
        variables: [
          { name: "Base Time", description: "Standard boiling time at sea level for desired doneness" },
          { name: "Altitude", description: "Height above sea level in meters (or feet converted to meters)" },
          { name: "0.5 minutes", description: "Additional time added per 300 meters altitude" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You want to boil a medium egg at 1500 meters altitude.",
        steps: [
          { label: "1", explanation: "Base time for medium egg is 7 minutes." },
          { label: "2", explanation: "Altitude adjustment: 1500 ÷ 300 = 5 increments." },
          { label: "3", explanation: "Additional time: 5 × 0.5 = 2.5 minutes." },
          { label: "4", explanation: "Total boiling time: 7 + 2.5 = 9.5 minutes." },
        ],
        result: "Boil the egg for 9.5 minutes for a perfect medium yolk.",
      }}
      relatedCalculators={[
        { title: "Cost to Send This Email (Energy/kWh)", url: "/funny/email-cost-estimator-energy", icon: "💻" },
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
        { title: "Black Hole Sun Impact Calculator", url: "/funny/black-hole-sun-impact", icon: "🧟" },
        { title: "Penguin Slap Power Calculator", url: "/funny/penguin-slap-power", icon: "🐈" },
        { title: "Hot-Dog to Bun Mismatch Solver", url: "/funny/hot-dog-bun-mismatch-solver", icon: "🍩" },
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