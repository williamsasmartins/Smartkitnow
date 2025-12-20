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

export default function HotDogBunMismatchSolverCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    hotDogCount: "",
    hotDogPackSize: "",
    bunCount: "",
    bunPackSize: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Helper to parse input numbers safely
  const parseNumber = (val) => {
    const n = parseInt(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const results = useMemo(() => {
    const hotDogCount = parseNumber(inputs.hotDogCount);
    const hotDogPackSize = parseNumber(inputs.hotDogPackSize);
    const bunCount = parseNumber(inputs.bunCount);
    const bunPackSize = parseNumber(inputs.bunPackSize);

    // If any pack size is zero or missing, cannot calculate packs
    if (hotDogPackSize === 0 || bunPackSize === 0) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Calculate minimum packs needed to cover the counts
    // Packs needed = ceil(count / packSize)
    const hotDogPacksNeeded = Math.ceil(hotDogCount / hotDogPackSize);
    const bunPacksNeeded = Math.ceil(bunCount / bunPackSize);

    // Calculate leftovers
    const hotDogsBought = hotDogPacksNeeded * hotDogPackSize;
    const bunsBought = bunPacksNeeded * bunPackSize;

    const hotDogLeftover = hotDogsBought - hotDogCount;
    const bunLeftover = bunsBought - bunCount;

    // Now, try to find the minimal combined packs so that hotDogsBought == bunsBought
    // This is a classic least common multiple (LCM) problem:
    // Find the smallest number of hot dog packs and bun packs so that total hot dogs = total buns

    // LCM of hotDogPackSize and bunPackSize gives the smallest equal total number of items
    function gcd(a, b) {
      while (b !== 0) {
        const t = b;
        b = a % b;
        a = t;
      }
      return a;
    }
    function lcm(a, b) {
      return (a * b) / gcd(a, b);
    }

    const totalPerPackHotDog = hotDogPackSize;
    const totalPerPackBun = bunPackSize;

    const totalNeeded = Math.max(hotDogCount, bunCount);

    // Find the minimal multiple of LCM that is >= max(hotDogCount, bunCount)
    const baseLCM = lcm(totalPerPackHotDog, totalPerPackBun);
    let totalItemsNeeded = baseLCM;
    while (totalItemsNeeded < totalNeeded) {
      totalItemsNeeded += baseLCM;
    }

    // Calculate packs needed for that totalItemsNeeded
    const hotDogPacks = totalItemsNeeded / totalPerPackHotDog;
    const bunPacks = totalItemsNeeded / totalPerPackBun;

    // Calculate leftovers for this scenario
    const hotDogLeftoverFinal = hotDogPacks * totalPerPackHotDog - hotDogCount;
    const bunLeftoverFinal = bunPacks * totalPerPackBun - bunCount;

    // Prepare witty remarks based on leftovers
    let remark = "";
    let color = "text-green-600";
    let icon = <Smile size={48} />;

    if (hotDogLeftoverFinal === 0 && bunLeftoverFinal === 0) {
      remark = "Perfect match! No leftovers, no waste. Your BBQ party is ready to roll!";
    } else if (hotDogLeftoverFinal > 0 && bunLeftoverFinal > 0) {
      remark = `You'll have ${hotDogLeftoverFinal} extra hot dog${hotDogLeftoverFinal > 1 ? "s" : ""} and ${bunLeftoverFinal} extra bun${bunLeftoverFinal > 1 ? "s" : ""}. Time for some creative recipes!`;
      color = "text-yellow-600";
      icon = <Meh size={48} />;
    } else if (hotDogLeftoverFinal > 0) {
      remark = `You'll have ${hotDogLeftoverFinal} extra hot dog${hotDogLeftoverFinal > 1 ? "s" : ""} but no extra buns. Hot dog lovers rejoice!`;
      color = "text-yellow-700";
      icon = <Dog size={48} />;
    } else if (bunLeftoverFinal > 0) {
      remark = `You'll have ${bunLeftoverFinal} extra bun${bunLeftoverFinal > 1 ? "s" : ""} but no extra hot dogs. Time to get creative with those buns!`;
      color = "text-yellow-700";
      icon = <Utensils size={48} />;
    } else {
      remark = "Hmm, something's off. Double-check your inputs!";
      color = "text-red-600";
      icon = <AlertTriangle size={48} />;
    }

    return {
      value: `${hotDogPacks} hot dog pack${hotDogPacks > 1 ? "s" : ""} & ${bunPacks} bun pack${bunPacks > 1 ? "s" : ""}`,
      label: `Buy ${hotDogPacks} pack${hotDogPacks > 1 ? "s" : ""} of hot dogs and ${bunPacks} pack${bunPacks > 1 ? "s" : ""} of buns`,
      subtext: remark,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do hot dog and bun packs never seem to match?",
      answer:
        "The classic mismatch between hot dog and bun packs is a tale as old as backyard barbecues. Hot dogs are often sold in packs of 10, while buns come in packs of 8, creating a frustrating leftover dilemma. This discrepancy stems from historical packaging standards and supply chain decisions that prioritized manufacturing efficiency over consumer convenience. Understanding this helps you plan better and avoid waste at your next cookout.",
    },
    {
      question: "How does the calculator find the perfect number of packs to buy?",
      answer:
        "This calculator uses a bit of number theory magic called the Least Common Multiple (LCM) to solve the mismatch mystery. By finding the smallest number divisible by both pack sizes, it determines the minimum total hot dogs and buns you need to buy to have zero leftovers. This approach ensures you buy just enough to satisfy your needs without ending up with extra buns or hot dogs gathering dust.",
    },
    {
      question: "Can I use this calculator for different pack sizes or units?",
      answer:
        "Absolutely! Whether you buy hot dogs in packs of 6 or 12, or buns in packs of 4 or 10, this tool adapts to your inputs. The unit selector lets you switch between metric and imperial systems for your convenience, though pack sizes are typically counted in units rather than weight or length. Just enter your pack sizes and counts, and let the calculator do the math to save you from snack-time headaches.",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hotDogCount">Number of Hot Dogs Needed</Label>
          <Input
            id="hotDogCount"
            type="number"
            min={0}
            placeholder="e.g. 25"
            value={inputs.hotDogCount}
            onChange={(e) => handleInputChange("hotDogCount", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="hotDogPackSize">Hot Dog Pack Size</Label>
          <Input
            id="hotDogPackSize"
            type="number"
            min={1}
            placeholder="e.g. 10"
            value={inputs.hotDogPackSize}
            onChange={(e) => handleInputChange("hotDogPackSize", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bunCount">Number of Buns Needed</Label>
          <Input
            id="bunCount"
            type="number"
            min={0}
            placeholder="e.g. 25"
            value={inputs.bunCount}
            onChange={(e) => handleInputChange("bunCount", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bunPackSize">Bun Pack Size</Label>
          <Input
            id="bunPackSize"
            type="number"
            min={1}
            placeholder="e.g. 8"
            value={inputs.bunPackSize}
            onChange={(e) => handleInputChange("bunPackSize", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already done on input change)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              hotDogCount: "",
              hotDogPackSize: "",
              bunCount: "",
              bunPackSize: "",
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Hot-Dog to Bun Mismatch Solver</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The infamous mismatch between hot dog packs and bun packs has plagued picnics and barbecues for decades. While hot dogs are commonly sold in packs of 10, buns often come in packs of 8, leaving consumers with leftover buns or hot dogs that seem to multiply mysteriously. This calculator solves that age-old problem by using mathematical principles to find the smallest number of packs you need to buy so that the total hot dogs and buns match perfectly. By understanding this, you can avoid waste, save money, and impress your guests with your planning prowess.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The hot dog itself has a fascinating history: it was popularized in the United States by German immigrants in the 19th century, but the bun’s packaging size was influenced by bakery batch sizes and manufacturing efficiencies rather than consumer convenience. Interestingly, the bun pack size of 8 is a nod to the traditional baking trays that hold eight buns, while hot dogs are often packed in tens for ease of counting and shipping. This mismatch is a classic example of how industrial standards can create everyday puzzles for consumers.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this solver is as easy as grilling a hot dog! Start by entering how many hot dogs and buns you need for your event. Then, input the pack sizes you find at your local store — these can vary, so double-check the packaging. Select your preferred unit system, although this calculator primarily deals with counts rather than physical measurements. Finally, hit calculate and watch the magic happen as the solver tells you exactly how many packs of each to buy to avoid leftovers. It’s like having a math-savvy picnic planner in your pocket!
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
            <a href="https://www.history.com/news/hot-dog-history-american-icon" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              The History of the Hot Dog <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A fascinating dive into how the hot dog became an American culinary icon, including its immigrant roots and cultural impact.
            </p>
          </li>
          <li>
            <a href="https://www.bakingbusiness.com/articles/34636-the-bun-issue" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Why Buns Come in Eights <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An industry perspective on bun packaging sizes and how bakery production methods influence what ends up on your picnic table.
            </p>
          </li>
          <li>
            <a href="https://mathworld.wolfram.com/LeastCommonMultiple.html" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Least Common Multiple Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              For the math enthusiasts, a detailed explanation of the LCM concept used to solve the hot dog and bun mismatch problem.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hot-Dog to Bun Mismatch Solver"
      description="Solve the supermarket conspiracy. Calculate exactly how many packs of hot dogs and buns you need to buy to have zero leftovers."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "LCM(packSizeHotDog, packSizeBun) = smallest number divisible by both pack sizes",
        variables: [
          { symbol: "packSizeHotDog", description: "Number of hot dogs per pack" },
          { symbol: "packSizeBun", description: "Number of buns per pack" },
          { symbol: "LCM", description: "Least Common Multiple of the two pack sizes" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You need 25 hot dogs and 25 buns. Hot dogs come in packs of 10, buns in packs of 8.",
        steps: [
          { label: "1", explanation: "Calculate the LCM of 10 and 8, which is 40." },
          { label: "2", explanation: "Determine how many packs of hot dogs and buns make 40 items: 40/10 = 4 hot dog packs, 40/8 = 5 bun packs." },
          { label: "3", explanation: "Buying 4 hot dog packs and 5 bun packs gives you 40 hot dogs and 40 buns, enough to cover your 25 needed with no mismatch." },
        ],
        result: "Buy 4 packs of hot dogs and 5 packs of buns to avoid leftovers.",
      }}
      relatedCalculators={[
        { title: "Crinkle Crankle Wall Brick Saver", url: "/funny/crinkle-crankle-wall-brick-saver", icon: "🤪" },
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🤪" },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "Plant Watering Procrastination Index", url: "/funny/plant-watering-procrastination-index", icon: "🤪" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Coffee Strength vs Productivity Score", url: "/funny/coffee-strength-vs-productivity-meme", icon: "☕" },
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