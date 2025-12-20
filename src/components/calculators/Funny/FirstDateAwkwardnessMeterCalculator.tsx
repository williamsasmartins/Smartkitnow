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

export default function FirstDateAwkwardnessMeterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    talksAboutEx: "no",
    forgotWallet: "no",
    awkwardSilence: "no",
    spillsDrink: "no",
    badJokes: "no",
    phoneCheck: "no",
    weirdTopic: "no",
    petAllergyMention: "no",
  });

  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Scoring weights for each awkwardness factor
  // Each "yes" adds a certain number of points to awkwardness
  const weights = {
    talksAboutEx: 20,
    forgotWallet: 25,
    awkwardSilence: 15,
    spillsDrink: 10,
    badJokes: 10,
    phoneCheck: 10,
    weirdTopic: 10,
    petAllergyMention: 5,
  };

  const results = useMemo(() => {
    // Calculate total awkwardness score
    let score = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      if (inputs[key] === "yes") score += weight;
    });

    // Cap score at 100
    if (score > 100) score = 100;

    // Determine label, color, icon, and witty subtext based on score
    let label = "";
    let color = "";
    let icon = null;
    let subtext = "";

    if (score === 0) {
      label = "Smooth Sailing";
      color = "text-green-600";
      icon = <Smile className="mx-auto text-green-600" size={48} />;
      subtext = "Your date is as smooth as a jazz saxophone solo. Keep it up!";
    } else if (score <= 25) {
      label = "Mildly Awkward";
      color = "text-yellow-600";
      icon = <Meh className="mx-auto text-yellow-600" size={48} />;
      subtext = "A few bumps on the road, but nothing a good laugh can't fix.";
    } else if (score <= 50) {
      label = "Noticeably Awkward";
      color = "text-orange-600";
      icon = <Frown className="mx-auto text-orange-600" size={48} />;
      subtext = "You might want to bring some coffee next time to break the ice.";
    } else if (score <= 75) {
      label = "Cringe Alert";
      color = "text-red-600";
      icon = <Ghost className="mx-auto text-red-600" size={48} />;
      subtext = "Awkwardness levels rising—brace yourself for some facepalms.";
    } else {
      label = "Epic Awkwardness";
      color = "text-purple-700";
      icon = <Skull className="mx-auto text-purple-700" size={48} />;
      subtext = "This date might be one for the history books... or the blooper reel.";
    }

    return { value: score.toString(), label, subtext, color, icon };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do people feel awkward on first dates?",
      answer:
        "First-date awkwardness often stems from the natural human desire to make a good impression combined with uncertainty about the other person's feelings. This cocktail of nervousness can cause stumbles in conversation, awkward silences, or overthinking simple gestures. Interestingly, studies show that our brains release stress hormones like cortisol during these moments, which can make us feel even more self-conscious. So, it's not just in your head—it's biology playing its part!",
    },
    {
      question: "Can awkwardness actually be a good thing?",
      answer:
        "Surprisingly, yes! Awkward moments can break the ice and create memorable shared experiences that build connection. According to social psychologists, laughing together at an awkward mishap can increase bonding and trust. So, while it might feel uncomfortable in the moment, those cringe-worthy seconds could be laying the foundation for a stronger relationship.",
    },
    {
      question: "How did the concept of 'first dates' originate?",
      answer:
        "The idea of a 'first date' as we know it is a relatively modern social construct that evolved with urbanization and changing courtship norms. In the early 20th century, dating became more casual and public, moving away from arranged marriages and family supervision. This shift allowed individuals to meet in neutral places like cafes or cinemas, setting the stage for the classic 'first date' scenario filled with excitement—and yes, awkwardness too!",
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
          <Label htmlFor="talksAboutEx" className="mb-1 block font-semibold">
            Talks About Their Ex?
          </Label>
          <Select
            id="talksAboutEx"
            value={inputs.talksAboutEx}
            onValueChange={(v) => handleInputChange("talksAboutEx", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="forgotWallet" className="mb-1 block font-semibold">
            Forgot Their Wallet?
          </Label>
          <Select
            id="forgotWallet"
            value={inputs.forgotWallet}
            onValueChange={(v) => handleInputChange("forgotWallet", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="awkwardSilence" className="mb-1 block font-semibold">
            Awkward Silences?
          </Label>
          <Select
            id="awkwardSilence"
            value={inputs.awkwardSilence}
            onValueChange={(v) => handleInputChange("awkwardSilence", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="spillsDrink" className="mb-1 block font-semibold">
            Spills Their Drink?
          </Label>
          <Select
            id="spillsDrink"
            value={inputs.spillsDrink}
            onValueChange={(v) => handleInputChange("spillsDrink", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="badJokes" className="mb-1 block font-semibold">
            Tells Bad Jokes?
          </Label>
          <Select
            id="badJokes"
            value={inputs.badJokes}
            onValueChange={(v) => handleInputChange("badJokes", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="phoneCheck" className="mb-1 block font-semibold">
            Checks Phone Frequently?
          </Label>
          <Select
            id="phoneCheck"
            value={inputs.phoneCheck}
            onValueChange={(v) => handleInputChange("phoneCheck", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="weirdTopic" className="mb-1 block font-semibold">
            Brings Up Weird Topics?
          </Label>
          <Select
            id="weirdTopic"
            value={inputs.weirdTopic}
            onValueChange={(v) => handleInputChange("weirdTopic", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="petAllergyMention" className="mb-1 block font-semibold">
            Mentions Pet Allergies?
          </Label>
          <Select
            id="petAllergyMention"
            value={inputs.petAllergyMention}
            onValueChange={(v) => handleInputChange("petAllergyMention", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              talksAboutEx: "no",
              forgotWallet: "no",
              awkwardSilence: "no",
              spillsDrink: "no",
              badJokes: "no",
              phoneCheck: "no",
              weirdTopic: "no",
              petAllergyMention: "no",
            })
          }
          className="flex-1 h-11"
          type="button"
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
          Understanding First-Date Awkwardness Meter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The First-Date Awkwardness Meter is a playful tool designed to quantify the often intangible feeling of discomfort that can arise during initial romantic encounters. Awkwardness on a first date usually stems from nervousness, unfamiliarity, and the pressure to impress, which can lead to stilted conversations or embarrassing moments. By assessing common awkward behaviors—like talking about an ex or forgetting a wallet—this meter helps you predict how smooth or cringe-worthy your date might be. It’s a fun way to reflect on social dynamics while learning why these moments happen.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The concept of dating as a social ritual is relatively young—only emerging prominently in the early 20th century. Before that, courtship was often a family-arranged affair with strict supervision. The awkward silences and fumbling small talk we experience today are a byproduct of newfound personal freedom and the challenge of navigating romantic interest without a script. So next time you feel the cringe, remember: you’re part of a century-old tradition of human connection experimentation!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the First-Date Awkwardness Meter is as simple as answering a few yes-or-no questions about typical awkward moments you or your date might experience. Select “yes” if the behavior applies, or “no” if it doesn’t. Once you’ve made your choices, hit calculate to see your awkwardness score, which ranges from smooth sailing to epic cringe. This tool is designed for fun and reflection, so don’t take it too seriously—awkwardness is part of the charm in dating!
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
              href="https://www.psychologytoday.com/us/blog/close-encounters/201802/why-first-dates-are-so-awkward"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Why First Dates Are So Awkward <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Psychology Today explores the neuroscience behind first-date awkwardness and how to overcome it.
            </p>
          </li>
          <li>
            <a
              href="https://www.history.com/news/how-dating-has-changed-over-the-decades"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              The Evolution of Dating <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              History.com dives into how dating rituals have transformed from arranged meetings to modern-day encounters.
            </p>
          </li>
          <li>
            <a
              href="https://www.nbcnews.com/better/lifestyle/how-awkward-moments-can-help-build-relationships-ncna1010566"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              How Awkward Moments Build Relationships <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              NBC News discusses the surprising benefits of shared awkward experiences in strengthening bonds.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="First-Date Awkwardness Meter"
      description="Rate your date's potential awkwardness. Input variables like 'talks about ex' or 'forgot wallet' to predict the night's outcome."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula:
          "Awkwardness Score = Σ (Each Awkward Behavior × Assigned Weight), capped at 100",
        variables: [
          { name: "talksAboutEx", description: "Mentions their ex-partner during the date", weight: 20 },
          { name: "forgotWallet", description: "Forgets their wallet or payment method", weight: 25 },
          { name: "awkwardSilence", description: "Experiences uncomfortable silences", weight: 15 },
          { name: "spillsDrink", description: "Accidentally spills their drink", weight: 10 },
          { name: "badJokes", description: "Tells jokes that fall flat", weight: 10 },
          { name: "phoneCheck", description: "Frequently checks their phone", weight: 10 },
          { name: "weirdTopic", description: "Brings up strange or inappropriate topics", weight: 10 },
          { name: "petAllergyMention", description: "Mentions allergies to pets", weight: 5 },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Imagine your date talks about their ex, forgets their wallet, and tells bad jokes, but no other awkward behaviors occur.",
        steps: [
          { label: "1", explanation: "Talks about ex = 20 points" },
          { label: "2", explanation: "Forgot wallet = 25 points" },
          { label: "3", explanation: "Bad jokes = 10 points" },
          { label: "4", explanation: "Total = 20 + 25 + 10 = 55 points" },
        ],
        result: "Awkwardness Score: 55 — Noticeably Awkward",
      }}
      relatedCalculators={[
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Cost to Send This Email (Energy/kWh)", url: "/funny/email-cost-estimator-energy", icon: "💻" },
        { title: "Nickels to Crush Calculator", url: "/funny/nickels-to-crush-calculator", icon: "🤪" },
        { title: "Time Travel Energy Requirement", url: "/funny/time-travel-energy-requirement", icon: "✈️" },
        { title: "Loop-the-Loop Speed Calculator", url: "/funny/loop-the-loop-speed-calculator", icon: "✈️" },
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