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

export default function BbqCharcoalSplitterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    participants: "",
    charcoalBags: "",
    charcoalBagWeight: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Convert weight to kilograms if imperial
  const charcoalWeightKg = useMemo(() => {
    const weight = parseFloat(inputs.charcoalBagWeight);
    if (isNaN(weight) || weight <= 0) return 0;
    if (inputs.unit === "imperial") {
      // pounds to kg
      return weight * 0.453592;
    }
    return weight;
  }, [inputs.charcoalBagWeight, inputs.unit]);

  // Number of charcoal bags
  const charcoalBagsNum = useMemo(() => {
    const bags = parseInt(inputs.charcoalBags);
    return isNaN(bags) || bags < 0 ? 0 : bags;
  }, [inputs.charcoalBags]);

  // Number of participants
  const participantsNum = useMemo(() => {
    const p = parseInt(inputs.participants);
    return isNaN(p) || p < 1 ? 0 : p;
  }, [inputs.participants]);

  // Total charcoal weight in kg
  const totalCharcoalKg = useMemo(() => charcoalBagsNum * charcoalWeightKg, [charcoalBagsNum, charcoalWeightKg]);

  // Calculate who brings charcoal: randomly pick one participant or split cost fairly
  // For fun, we will calculate the cost per person if charcoal cost is known (assumed $5 per kg)
  // and randomly pick who brings charcoal.

  // Assumed cost per kg charcoal
  const costPerKg = 5;

  // Total cost
  const totalCost = totalCharcoalKg * costPerKg;

  // Cost per person
  const costPerPerson = participantsNum > 0 ? totalCost / participantsNum : 0;

  // Randomly pick who brings charcoal (index from 1 to participantsNum)
  const [charcoalBringer, setCharcoalBringer] = useState(null);

  const calculate = () => {
    if (participantsNum < 1 || charcoalBagsNum < 1 || charcoalWeightKg <= 0) {
      setCharcoalBringer(null);
      return;
    }
    // Random pick
    const picker = Math.floor(Math.random() * participantsNum) + 1;
    setCharcoalBringer(picker);
  };

  const results = useMemo(() => {
    if (participantsNum < 1) {
      return {
        value: "",
        label: "",
        subtext: "Please enter a valid number of participants (at least 1).",
        color: "text-red-600",
        icon: <AlertTriangle />,
      };
    }
    if (charcoalBagsNum < 1 || charcoalWeightKg <= 0) {
      return {
        value: "",
        label: "",
        subtext: "Please enter valid charcoal bag count and weight.",
        color: "text-red-600",
        icon: <AlertTriangle />,
      };
    }
    if (charcoalBringer === null) {
      return {
        value: "",
        label: "",
        subtext: "Hit Calculate to find out who brings the charcoal!",
        color: "text-slate-600",
        icon: <Info />,
      };
    }
    return {
      value: `Participant #${charcoalBringer}`,
      label: "Brings the Charcoal 🔥",
      subtext: `Each participant's fair share is $${costPerPerson.toFixed(2)} based on ${totalCharcoalKg.toFixed(2)} kg of charcoal.`,
      color: "text-green-700",
      icon: <Flame />,
    };
  }, [participantsNum, charcoalBagsNum, charcoalWeightKg, charcoalBringer, costPerPerson, totalCharcoalKg]);

  const faqs = [
    {
      question: "Why is it so hard to decide who brings the charcoal at a BBQ?",
      answer:
        "The eternal BBQ dilemma stems from the fact that charcoal is often seen as a shared resource but requires upfront cost and effort from one person. This can lead to subtle social negotiations or even friendly disputes. Historically, communal cooking has always involved some form of resource sharing, but the 'who brings what' question remains a classic test of friendship and fairness.",
    },
    {
      question: "How does this splitter tool make BBQ planning easier?",
      answer:
        "This tool combines a bit of math with a dash of randomness to fairly assign the charcoal duty, removing awkwardness and guesswork. By inputting the number of participants and charcoal details, it calculates each person's fair share and randomly picks who brings the charcoal. This way, everyone stays happy and the BBQ vibes remain strong.",
    },
    {
      question: "Can I customize the charcoal bag weight and units?",
      answer:
        "Absolutely! Whether you measure charcoal bags in kilograms or pounds, this splitter adapts to your preference. This flexibility ensures accurate calculations no matter where you are in the world, honoring global BBQ traditions from Texas to Tokyo.",
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
          <Label htmlFor="participants">Number of Participants</Label>
          <Input
            id="participants"
            type="number"
            min={1}
            placeholder="e.g. 5"
            value={inputs.participants}
            onChange={(e) => handleInputChange("participants", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="charcoalBags">Number of Charcoal Bags</Label>
          <Input
            id="charcoalBags"
            type="number"
            min={0}
            placeholder="e.g. 3"
            value={inputs.charcoalBags}
            onChange={(e) => handleInputChange("charcoalBags", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="charcoalBagWeight">
            Weight per Charcoal Bag ({inputs.unit === "metric" ? "kg" : "lbs"})
          </Label>
          <Input
            id="charcoalBagWeight"
            type="number"
            min={0}
            step="0.01"
            placeholder={inputs.unit === "metric" ? "e.g. 2.5" : "e.g. 5.5"}
            value={inputs.charcoalBagWeight}
            onChange={(e) => handleInputChange("charcoalBagWeight", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={calculate}
          disabled={participantsNum < 1 || charcoalBagsNum < 1 || charcoalWeightKg <= 0}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              participants: "",
              charcoalBags: "",
              charcoalBagWeight: "",
            }) || setCharcoalBringer(null)
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding BBQ 'Who Brings the Charcoal?' Splitter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The question of who brings the charcoal to a BBQ might seem trivial, but it’s a social ritual steeped in tradition and fairness. Charcoal, the fiery heart of many outdoor grills, represents both cost and effort, making it a coveted responsibility or a dreaded chore depending on who you ask. This splitter tool helps dissolve the tension by combining math and chance, ensuring that the burden (and glory) of bringing the charcoal is shared fairly among friends. By quantifying the charcoal weight and participant count, it calculates each person’s fair share and randomly assigns the duty, keeping the BBQ spirit alive and harmonious.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Charcoal grilling dates back thousands of years, with evidence of its use in ancient China around 3000 BCE. Interestingly, the word “charcoal” comes from the Old English “cearu,” meaning “care” or “concern,” reflecting the careful preparation needed to create this essential fuel. Today, charcoal remains a beloved BBQ staple worldwide, with countries like the United States consuming over 1.5 billion pounds annually during grilling season alone!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by selecting your preferred unit system—metric or imperial—to match your charcoal bag labels. Enter the number of participants attending the BBQ, then input how many charcoal bags you have and their individual weight. Once all fields are filled, hit the Calculate button to reveal which participant is tasked with bringing the charcoal. The tool also shows each person’s fair monetary share based on an estimated charcoal cost, making it easier to settle expenses without awkward conversations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          If you want to start fresh or plan another BBQ, simply hit Reset to clear all inputs. This tool is designed to keep your BBQ planning smooth and fun, so you can focus on the sizzle and the smiles rather than the logistics.
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
            <a href="https://www.history.com/news/history-of-barbecue" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              The History of Barbecue <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A fascinating dive into how barbecue evolved from ancient cooking techniques to a global culinary phenomenon.
            </p>
          </li>
          <li>
            <a href="https://www.nrdc.org/stories/charcoal-vs-propane-which-bbq-better-environment" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Charcoal vs. Propane: Which BBQ is Better for the Environment? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An insightful comparison of charcoal and propane grilling, including environmental impacts and flavor profiles.
            </p>
          </li>
          <li>
            <a href="https://www.bonappetit.com/story/charcoal-grilling-tips" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Charcoal Grilling Tips for Beginners <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Expert advice on mastering the art of charcoal grilling to impress your friends at the next BBQ.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BBQ 'Who Brings the Charcoal?' Splitter"
      description="Settle BBQ disputes fairly. A randomizer tool to decide who buys the charcoal, who brings the meat, and who just brings the vibes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Cost per person = (Number of Bags × Weight per Bag × Cost per kg) ÷ Number of Participants",
        variables: [
          { symbol: "Number of Bags", description: "Total charcoal bags brought" },
          { symbol: "Weight per Bag", description: "Weight of each charcoal bag in kg or lbs" },
          { symbol: "Cost per kg", description: "Estimated cost of charcoal per kilogram ($5 used here)" },
          { symbol: "Number of Participants", description: "Total people sharing the BBQ" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Five friends plan a BBQ with 3 charcoal bags, each weighing 2.5 kg.",
        steps: [
          { label: "1", explanation: "Calculate total charcoal weight: 3 bags × 2.5 kg = 7.5 kg." },
          { label: "2", explanation: "Estimate total cost: 7.5 kg × $5 = $37.50." },
          { label: "3", explanation: "Divide cost by participants: $37.50 ÷ 5 = $7.50 each." },
          { label: "4", explanation: "Randomly select one friend to bring the charcoal." },
        ],
        result: "Participant #3 is chosen to bring the charcoal, and everyone chips in $7.50.",
      }}
      relatedCalculators={[
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🤪" },
        { title: "Pizza Slices per Person & Regret Index", url: "/funny/pizza-slices-per-person-regret-index", icon: "🍕" },
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
        { title: "Coffee Strength vs Productivity Score", url: "/funny/coffee-strength-vs-productivity-meme", icon: "☕" },
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
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