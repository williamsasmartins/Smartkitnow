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

export default function CatIgnoreOMeterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    catMood: "neutral",
    callVolume: 50,
    distance: "",
    catSleepiness: 50,
    catFamiliarity: 50,
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * The Cat Ignore-o-Meter estimates the probability your cat will acknowledge your call.
   * Factors:
   * - Cat Mood: Grumpy cats ignore more; happy cats less.
   * - Call Volume: Louder calls increase chance but can annoy.
   * - Distance: The farther the cat, the less likely it hears.
   * - Sleepiness: Sleepy cats ignore more.
   * - Familiarity: Cats familiar with your voice respond more.
   * 
   * Formula (simplified):
   * Base chance = 50%
   * Mood modifier: Happy +20%, Neutral 0%, Grumpy -20%
   * Volume modifier: (callVolume - 50) * 0.4% (max ±20%)
   * Distance modifier: -distance * 2% (max -50%)
   * Sleepiness modifier: -sleepiness * 0.3% (max -30%)
   * Familiarity modifier: +familiarity * 0.4% (max +40%)
   * 
   * Final chance = base + sum modifiers, clamped 0-100%
   */

  const results = useMemo(() => {
    if (
      inputs.distance === "" ||
      isNaN(Number(inputs.distance)) ||
      Number(inputs.distance) < 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    const baseChance = 50;

    // Mood modifier
    let moodMod = 0;
    switch (inputs.catMood) {
      case "happy":
        moodMod = 20;
        break;
      case "neutral":
        moodMod = 0;
        break;
      case "grumpy":
        moodMod = -20;
        break;
    }

    // Volume modifier
    // callVolume from 0 to 100, centered at 50
    const volMod = (inputs.callVolume - 50) * 0.4; // max ±20%

    // Distance modifier
    // Distance in meters or feet, convert to meters if imperial
    let distanceMeters = Number(inputs.distance);
    if (inputs.unit === "imperial") {
      distanceMeters = distanceMeters * 0.3048; // feet to meters
    }
    const distMod = -Math.min(distanceMeters * 2, 50); // max -50%

    // Sleepiness modifier
    const sleepMod = -Math.min(inputs.catSleepiness * 0.3, 30); // max -30%

    // Familiarity modifier
    const famMod = Math.min(inputs.catFamiliarity * 0.4, 40); // max +40%

    let finalChance = baseChance + moodMod + volMod + distMod + sleepMod + famMod;
    finalChance = Math.min(Math.max(finalChance, 0), 100);

    // Determine icon and color based on chance
    let icon = <Meh className="mx-auto text-yellow-500" size={48} />;
    let color = "text-yellow-600";
    let label = "Indifferent Cat";
    let subtext = "Your cat might glance your way... or not.";

    if (finalChance > 75) {
      icon = <Smile className="mx-auto text-green-600" size={48} />;
      color = "text-green-700";
      label = "Acknowledging Cat";
      subtext = "Your cat is likely to respond with a meow or a headbutt!";
    } else if (finalChance > 40) {
      icon = <Meh className="mx-auto text-yellow-500" size={48} />;
      color = "text-yellow-600";
      label = "Indifferent Cat";
      subtext = "Your cat might glance your way... or not.";
    } else if (finalChance > 10) {
      icon = <Frown className="mx-auto text-orange-600" size={48} />;
      color = "text-orange-600";
      label = "Ignoring Cat";
      subtext = "Your cat is probably pretending it didn’t hear you.";
    } else {
      icon = <Ghost className="mx-auto text-gray-400" size={48} />;
      color = "text-gray-500";
      label = "Phantom Cat";
      subtext = "You might as well be calling into the void.";
    }

    return {
      value: `${finalChance.toFixed(1)}%`,
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do cats often ignore their names?",
      answer:
        "Cats have evolved as solitary hunters, unlike dogs who are pack animals. This means they are less motivated to respond to social cues like names. Additionally, cats prioritize their own agenda and may choose to ignore calls if they’re busy or uninterested. Interestingly, studies show cats do recognize their names but often decide not to respond, which is their way of asserting independence.",
    },
    {
      question: "How does distance affect a cat’s likelihood to respond?",
      answer:
        "Sound intensity decreases with distance, so the farther you are, the less likely your cat will hear you clearly. Cats have excellent hearing, but environmental noise and obstacles can muffle your call. This calculator factors in distance to realistically estimate the chance your feline friend acknowledges your summons.",
    },
    {
      question: "Can the volume of my call really influence my cat’s response?",
      answer:
        "Yes, but with limits. Cats have sensitive hearing, so shouting too loudly might startle or annoy them rather than encourage a response. Moderate volume increases the chance of being heard without causing stress. This calculator balances volume to reflect that sweet spot between being heard and being irritating.",
    },
    {
      question: "What role does a cat’s mood play in ignoring me?",
      answer:
        "Cats communicate a lot through mood and body language. A grumpy or sleepy cat is far less likely to respond to your call than a happy or curious one. This calculator includes mood as a key factor because it directly influences their willingness to engage. Remember, a cat’s mood can change quickly, so timing your call matters!",
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

      {/* Cat Mood */}
      <div>
        <Label htmlFor="catMood" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Cat’s Mood
        </Label>
        <Select value={inputs.catMood} onValueChange={(v) => handleInputChange("catMood", v)} id="catMood">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="happy">Happy 😺</SelectItem>
            <SelectItem value="neutral">Neutral 😐</SelectItem>
            <SelectItem value="grumpy">Grumpy 😾</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Call Volume */}
      <div>
        <Label htmlFor="callVolume" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Call Volume ({inputs.callVolume})
        </Label>
        <input
          type="range"
          id="callVolume"
          min="0"
          max="100"
          value={inputs.callVolume}
          onChange={(e) => handleInputChange("callVolume", Number(e.target.value))}
          className="w-full"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={inputs.callVolume}
          aria-label="Call Volume"
        />
      </div>

      {/* Distance */}
      <div>
        <Label htmlFor="distance" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Distance to Cat ({inputs.unit === "metric" ? "meters" : "feet"})
        </Label>
        <Input
          id="distance"
          type="number"
          min="0"
          step="0.1"
          placeholder={inputs.unit === "metric" ? "e.g. 5" : "e.g. 16"}
          value={inputs.distance}
          onChange={(e) => handleInputChange("distance", e.target.value)}
        />
      </div>

      {/* Cat Sleepiness */}
      <div>
        <Label htmlFor="catSleepiness" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Cat’s Sleepiness ({inputs.catSleepiness})
        </Label>
        <input
          type="range"
          id="catSleepiness"
          min="0"
          max="100"
          value={inputs.catSleepiness}
          onChange={(e) => handleInputChange("catSleepiness", Number(e.target.value))}
          className="w-full"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={inputs.catSleepiness}
          aria-label="Cat Sleepiness"
        />
      </div>

      {/* Cat Familiarity */}
      <div>
        <Label htmlFor="catFamiliarity" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Cat’s Familiarity with Your Voice ({inputs.catFamiliarity})
        </Label>
        <input
          type="range"
          id="catFamiliarity"
          min="0"
          max="100"
          value={inputs.catFamiliarity}
          onChange={(e) => handleInputChange("catFamiliarity", Number(e.target.value))}
          className="w-full"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={inputs.catFamiliarity}
          aria-label="Cat Familiarity"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              catMood: "neutral",
              callVolume: 50,
              distance: "",
              catSleepiness: 50,
              catFamiliarity: 50,
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Cat 'Ignore-o-Meter'</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Cat 'Ignore-o-Meter' is a playful yet surprisingly insightful tool designed to estimate the likelihood that your feline friend will actually respond when you call their name. Cats are famously independent creatures, often choosing to ignore human calls as a way to assert their autonomy. This calculator factors in key elements such as your cat’s mood, how loudly you call, the distance between you, and even how sleepy or familiar your cat is with your voice. By combining these variables, it offers a fun, data-driven glimpse into the mysterious world of cat behavior.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Cats actually recognize their own names! A 2019 study by Japanese researchers found that cats respond more to their names than to other words, even if they don’t always come running. This selective hearing is a testament to their independent nature, making the 'Ignore-o-Meter' a fun way to quantify just how much your cat might choose to acknowledge you on any given day.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Cat 'Ignore-o-Meter' is as simple as tuning into your cat’s current vibe and environment. First, select your preferred unit system—metric or imperial—so distance measurements feel natural. Next, choose your cat’s mood from happy, neutral, or grumpy, as this heavily influences their willingness to respond. Adjust the call volume slider to reflect how loudly you plan to call your cat, remembering that too loud can backfire. Enter the distance between you and your cat, then set sliders for how sleepy your cat is and how familiar they are with your voice. Finally, hit calculate to reveal the probability your cat will acknowledge your call. It’s a fun way to blend science, observation, and a dash of humor into your daily cat interactions.
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
            <a href="https://www.nature.com/articles/s41598-019-45323-2" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Cats Recognize Their Names - Scientific Study <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A fascinating 2019 study published in Scientific Reports demonstrating cats’ ability to recognize their own names amidst other words.
            </p>
          </li>
          <li>
            <a href="https://www.catbehaviorassociates.com/why-do-cats-ignore-you/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Why Do Cats Ignore You? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An insightful article exploring the psychology behind cats’ selective hearing and independent behavior.
            </p>
          </li>
          <li>
            <a href="https://www.petmd.com/cat/behavior/why-do-cats-ignore-you" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Understanding Cat Behavior <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive guide on cat communication and why your feline might choose to ignore you sometimes.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat 'Ignore-o-Meter'"
      description="Predict cat acknowledgement. Calculate the extremely low probability that your cat will actually respond when you call its name."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula:
          "Final Chance (%) = 50 + Mood Modifier + Volume Modifier + Distance Modifier + Sleepiness Modifier + Familiarity Modifier",
        variables: [
          { name: "Mood Modifier", description: "Happy +20%, Neutral 0%, Grumpy -20%" },
          { name: "Volume Modifier", description: "(Call Volume - 50) * 0.4%" },
          { name: "Distance Modifier", description: "-2% per meter (max -50%)" },
          { name: "Sleepiness Modifier", description: "-0.3% per sleepiness point (max -30%)" },
          { name: "Familiarity Modifier", description: "+0.4% per familiarity point (max +40%)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You call your grumpy cat from 5 meters away, at a volume of 70, while it’s moderately sleepy and somewhat familiar with your voice.",
        steps: [
          {
            label: "1",
            explanation:
              "Mood Modifier: Grumpy = -20%. Call Volume Modifier: (70 - 50) * 0.4 = +8%. Distance Modifier: -5 * 2 = -10%. Sleepiness Modifier: -50 * 0.3 = -15%. Familiarity Modifier: 50 * 0.4 = +20%.",
          },
          {
            label: "2",
            explanation:
              "Sum modifiers: -20 + 8 - 10 - 15 + 20 = -17%. Base chance 50% - 17% = 33%.",
          },
          {
            label: "3",
            explanation: "Final chance your cat responds is 33%. Expect a mostly ignoring cat.",
          },
        ],
        result: "33%",
      }}
      relatedCalculators={[
        { title: "Love Meter (Name Compatibility)", url: "/funny/love-meter", icon: "❤️" },
        { title: "Keyboard Clicks per Day Estimator", url: "/funny/keyboard-clicks-per-day", icon: "💻" },
        { title: "Coffee Addiction Meter", url: "/funny/coffee-addiction-meter", icon: "☕" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Drake Equation Calculator", url: "/funny/drake-equation-calculator", icon: "🤪" },
        { title: "Social Media Time Alternatives", url: "/funny/social-media-time-alternatives", icon: "🤪" },
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