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

export default function ZombieSurvivalCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    cardio: "", // minutes of cardio per day
    skillLevel: "", // 1-10 scale
    weapon: "none", // weapon choice
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Weapon multipliers for survival odds
  const weaponMultipliers = {
    none: 0.7,
    melee: 1.2,
    pistol: 1.5,
    rifle: 1.8,
    explosives: 2.0,
  };

  // Convert cardio input to minutes (if imperial, assume input is minutes, no conversion needed)
  // Actually, cardio is time, so unit doesn't affect it, but we keep unit selector for distance or weight if needed later.

  const results = useMemo(() => {
    const cardio = parseFloat(inputs.cardio);
    const skill = parseFloat(inputs.skillLevel);
    const weapon = inputs.weapon;

    if (isNaN(cardio) || cardio < 0 || isNaN(skill) || skill < 1 || skill > 10) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Base survival time in days (arbitrary baseline)
    // Cardio improves stamina and escape chances, skill improves tactics, weapon improves defense.
    // Formula: base * (1 + cardioFactor + skillFactor) * weaponMultiplier
    // cardioFactor capped at 2 (max 120 min cardio)
    const cardioFactor = Math.min(cardio / 60, 2); // max 2x for cardio
    const skillFactor = skill / 10; // 0.1 to 1.0
    const weaponMultiplier = weaponMultipliers[weapon] || 1;

    // Base survival days = 3 (starting baseline)
    const baseDays = 3;

    const survivalDays = baseDays * (1 + cardioFactor + skillFactor) * weaponMultiplier;

    // Determine color and icon based on survivalDays
    let color = "text-green-600";
    let icon = <Smile />;
    let label = "";
    let subtext = "";

    if (survivalDays < 5) {
      color = "text-red-600";
      icon = <Frown />;
      label = "Poor Survival Odds";
      subtext = "Better hit the gym and find a weapon fast!";
    } else if (survivalDays < 12) {
      color = "text-yellow-600";
      icon = <Meh />;
      label = "Moderate Survival Odds";
      subtext = "You might last a while, but zombies don't nap.";
    } else if (survivalDays < 25) {
      color = "text-blue-600";
      icon = <Ghost />;
      label = "Good Survival Odds";
      subtext = "You're a tough cookie in the apocalypse.";
    } else {
      color = "text-purple-600";
      icon = <Skull />;
      label = "Zombie Slayer Status";
      subtext = "You might just outlive the undead hordes!";
    }

    return {
      value: survivalDays.toFixed(1),
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does cardio affect my zombie survival chances?",
      answer:
        "Cardiovascular fitness is crucial in a zombie apocalypse because it directly impacts your stamina and ability to outrun danger. The more cardio you do, the longer you can sustain high-intensity efforts like sprinting away from zombies or trekking long distances. Historically, endurance has been a key survival trait in many real-world scenarios, from ancient hunters to modern-day soldiers, making cardio a vital factor in your survival odds.",
    },
    {
      question: "Why does weapon choice matter so much?",
      answer:
        "Weapons can mean the difference between life and death when facing zombies. Melee weapons are silent and conserve ammo but require close contact, while firearms offer range but can attract more undead due to noise. Explosives are powerful but risky and limited. This calculator reflects these trade-offs by assigning multipliers to each weapon type, simulating their impact on your survival chances. Fun fact: The iconic zombie-killing weapon, the machete, was originally a farming tool used worldwide for centuries.",
    },
    {
      question: "What does skill level represent in this calculator?",
      answer:
        "Skill level encompasses your knowledge, tactics, and experience in survival scenarios, including first aid, stealth, and resource management. A higher skill level means you can make smarter decisions, avoid unnecessary risks, and use your environment to your advantage. This is why skill is weighted heavily in the calculation, reflecting how brains often beat brawn in survival situations. Historically, skilled survivalists have outlasted stronger but less savvy individuals in harsh conditions.",
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

      {/* Cardio Input */}
      <div>
        <Label htmlFor="cardio" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Daily Cardio (minutes)
        </Label>
        <Input
          id="cardio"
          type="number"
          min={0}
          max={180}
          placeholder="e.g. 30"
          value={inputs.cardio}
          onChange={(e) => handleInputChange("cardio", e.target.value)}
        />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          How many minutes of cardio exercise do you do daily? Zombies hate slowpokes!
        </p>
      </div>

      {/* Skill Level Input */}
      <div>
        <Label htmlFor="skillLevel" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Survival Skill Level (1-10)
        </Label>
        <Input
          id="skillLevel"
          type="number"
          min={1}
          max={10}
          placeholder="e.g. 7"
          value={inputs.skillLevel}
          onChange={(e) => handleInputChange("skillLevel", e.target.value)}
        />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rate your survival skills from 1 (novice) to 10 (expert). Think of this as your zombie apocalypse IQ.
        </p>
      </div>

      {/* Weapon Selector */}
      <div>
        <Label htmlFor="weapon" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Weapon Choice
        </Label>
        <Select
          id="weapon"
          value={inputs.weapon}
          onValueChange={(v) => handleInputChange("weapon", v)}
        >
          <SelectTrigger className="w-full">
            <Calculator className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Weapon</SelectItem>
            <SelectItem value="melee">Melee Weapon (e.g. Machete)</SelectItem>
            <SelectItem value="pistol">Pistol</SelectItem>
            <SelectItem value="rifle">Rifle</SelectItem>
            <SelectItem value="explosives">Explosives</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Choose your preferred weapon. Each has pros and cons in the undead world.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ unit: "metric", cardio: "", skillLevel: "", weapon: "none" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Zombie Survival Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates how long you might survive in a zombie apocalypse based on three key factors: your cardiovascular fitness, survival skill level, and weapon choice. Cardio reflects your ability to outrun or outlast zombies, while skill level represents your knowledge and tactics in hostile environments. Weapon choice influences your offensive and defensive capabilities, balancing power, noise, and risk. Together, these inputs simulate the complex interplay of physical and mental preparedness needed to outlive the undead hordes.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The concept of zombies originates from Haitian folklore, where they were believed to be reanimated corpses controlled by sorcerers. Modern pop culture, however, popularized the fast-moving, flesh-eating zombies we know today, largely thanks to George A. Romero's 1968 film <em>Night of the Living Dead</em>. Interestingly, survival tactics against zombies often mirror real-world disaster preparedness strategies, emphasizing fitness, skills, and resourcefulness.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by selecting your preferred unit system, either Metric or Imperial, to ensure the inputs feel familiar. Enter the average minutes you spend on cardio exercises daily; this reflects your endurance and ability to escape danger. Next, rate your survival skills on a scale from 1 to 10, considering your knowledge of first aid, stealth, and resource management. Finally, choose your weapon of choice, weighing the pros and cons of each option. Hit calculate to see your estimated survival days and a witty remark to keep your spirits up.
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
            <a href="https://en.wikipedia.org/wiki/Zombie" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Wikipedia: Zombie <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive overview of zombie folklore, history, and cultural impact.
            </p>
          </li>
          <li>
            <a href="https://www.cdc.gov/cpr/zombie/index.htm" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              CDC Zombie Preparedness <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Believe it or not, the CDC used zombies as a fun way to promote emergency preparedness.
            </p>
          </li>
          <li>
            <a href="https://www.history.com/news/where-did-zombies-come-from" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              History Channel: Origins of Zombies <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Dive into the fascinating origins of zombies in Haitian culture and their evolution in media.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Zombie Survival Calculator"
      description="Estimate your survival odds. Calculate how long you would last in a zombie apocalypse based on cardio, skills, and weapon choice."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Survival Days = Base × (1 + Cardio Factor + Skill Factor) × Weapon Multiplier",
        variables: [
          { symbol: "Base", description: "Baseline survival days (3 days)" },
          { symbol: "Cardio Factor", description: "Cardio minutes per day divided by 60, capped at 2" },
          { symbol: "Skill Factor", description: "Survival skill level divided by 10" },
          { symbol: "Weapon Multiplier", description: "Multiplier based on weapon choice (0.7 to 2.0)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You do 45 minutes of cardio daily, rate your survival skills as 7, and choose a pistol as your weapon.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate Cardio Factor: 45 / 60 = 0.75 (less than max 2)",
          },
          {
            label: "2",
            explanation:
              "Calculate Skill Factor: 7 / 10 = 0.7",
          },
          {
            label: "3",
            explanation:
              "Weapon Multiplier for pistol = 1.5",
          },
          {
            label: "4",
            explanation:
              "Calculate Survival Days: 3 × (1 + 0.75 + 0.7) × 1.5 = 3 × 2.45 × 1.5 = 11.03 days",
          },
        ],
        result: "You would survive approximately 11 days in the zombie apocalypse with these stats.",
      }}
      relatedCalculators={[
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "Crinkle Crankle Wall Brick Saver", url: "/funny/crinkle-crankle-wall-brick-saver", icon: "🤪" },
        { title: "Death by Caffeine (Max Safe Intake)", url: "/funny/death-by-caffeine", icon: "☕" },
        { title: "Nickels to Crush Calculator", url: "/funny/nickels-to-crush-calculator", icon: "🤪" },
        { title: "Meetings Wasted-Time Counter", url: "/funny/meetings-wasted-time-counter", icon: "💻" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
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