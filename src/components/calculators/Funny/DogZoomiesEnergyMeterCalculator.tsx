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

export default function DogZoomiesEnergyMeterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    weight: "",
    speed: "",
    destruction: "1",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * We estimate the kinetic energy of the dog's zoomies using the formula:
   * KE = 0.5 * mass * velocity^2
   * 
   * Inputs:
   * - Weight (mass) in kg or lbs (converted to kg)
   * - Speed in km/h or mph (converted to m/s)
   * - Destruction level (1-5) acts as a multiplier for energy release intensity
   * 
   * Output:
   * - Energy in Joules (metric) or foot-pounds (imperial)
   * - Fun label and witty remark based on energy level
   */

  const results = useMemo(() => {
    const w = parseFloat(inputs.weight);
    const s = parseFloat(inputs.speed);
    const d = parseInt(inputs.destruction);

    if (!w || !s || !d || d < 1 || d > 5) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-slate-500",
        icon: <Meh />,
      };
    }

    // Convert weight to kg if imperial
    const massKg = inputs.unit === "imperial" ? w * 0.453592 : w;
    // Convert speed to m/s
    const speedMs = inputs.unit === "imperial" ? s * 0.44704 : s / 3.6;

    // Kinetic energy in Joules
    const kineticEnergy = 0.5 * massKg * speedMs * speedMs;

    // Adjust energy by destruction level multiplier (1 to 5)
    const adjustedEnergy = kineticEnergy * d;

    // Convert energy to imperial foot-pounds if needed
    const energyImperial = adjustedEnergy * 0.737562;

    // Determine output values and labels
    const energyValue = inputs.unit === "imperial"
      ? energyImperial.toFixed(0) + " ft-lb"
      : adjustedEnergy.toFixed(0) + " J";

    // Fun labels based on energy thresholds (Joules)
    let label = "";
    let subtext = "";
    let color = "text-blue-600";
    let icon = <Zap className="mx-auto" size={48} />;

    const energyJ = adjustedEnergy;

    if (energyJ < 50) {
      label = "Mild Zoomies";
      subtext = "Your pup's energy burst is like a gentle breeze — adorable but harmless.";
      color = "text-green-600";
      icon = <Smile size={48} />;
    } else if (energyJ < 200) {
      label = "Playful Zoomies";
      subtext = "Classic zoomies! Expect some happy chaos and wagging tails.";
      color = "text-yellow-600";
      icon = <Dog size={48} />;
    } else if (energyJ < 600) {
      label = "Turbo Zoomies";
      subtext = "Hold onto your shoes! Your dog’s zoomies pack a punch of pure joy and speed.";
      color = "text-orange-600";
      icon = <Zap size={48} />;
    } else if (energyJ < 1500) {
      label = "Zoomies Overdrive";
      subtext = "Warning: zoomies approaching warp speed. Expect some furniture casualties.";
      color = "text-red-600";
      icon = <Flame size={48} />;
    } else {
      label = "Zoomies Apocalypse";
      subtext = "The zoomies have reached legendary status. Brace for impact and possible destruction!";
      color = "text-purple-700";
      icon = <Skull size={48} />;
    }

    return {
      value: energyValue,
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do dogs get the zoomies, and what causes these energy bursts?",
      answer:
        "Zoomies, scientifically known as Frenetic Random Activity Periods (FRAPs), are sudden bursts of energy that dogs release through rapid running and playful antics. This behavior is often triggered by excitement, relief from stress, or simply an overflow of pent-up energy. Understanding zoomies helps owners appreciate that these bursts are a healthy outlet for dogs to regulate their mood and physical well-being.",
    },
    {
      question: "How does the destruction level affect the energy calculation?",
      answer:
        "The destruction level acts as a multiplier to represent how intense and chaotic your dog's zoomies are. While kinetic energy measures the physical energy based on weight and speed, the destruction level accounts for behavioral factors like knocking over objects or zooming indoors. This multiplier helps translate raw energy into a more relatable scale of zoomie impact, making the calculation both scientific and fun.",
    },
    {
      question: "Can the zoomies be dangerous for dogs or their owners?",
      answer:
        "Generally, zoomies are a normal and healthy behavior that allows dogs to release excess energy. However, if a dog zooms in unsafe environments or with underlying health issues, it could lead to injury. Owners should ensure a safe space for zoomies and monitor their dog’s health to prevent accidents. Remember, zoomies are nature’s way of saying, 'I’m happy and full of life!'",
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

      {/* Weight Input */}
      <div>
        <Label htmlFor="weight" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Dog Weight ({inputs.unit === "metric" ? "kg" : "lbs"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={inputs.unit === "metric" ? "e.g. 15" : "e.g. 33"}
          value={inputs.weight}
          onChange={(e) => handleInputChange("weight", e.target.value)}
        />
      </div>

      {/* Speed Input */}
      <div>
        <Label htmlFor="speed" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Zoomies Speed ({inputs.unit === "metric" ? "km/h" : "mph"})
        </Label>
        <Input
          id="speed"
          type="number"
          min="0"
          step="any"
          placeholder={inputs.unit === "metric" ? "e.g. 30" : "e.g. 18"}
          value={inputs.speed}
          onChange={(e) => handleInputChange("speed", e.target.value)}
        />
      </div>

      {/* Destruction Level */}
      <div>
        <Label htmlFor="destruction" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Destruction Level (1 - Calm to 5 - Mayhem)
        </Label>
        <Select
          id="destruction"
          value={inputs.destruction}
          onValueChange={(v) => handleInputChange("destruction", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Calm</SelectItem>
            <SelectItem value="2">2 - Playful</SelectItem>
            <SelectItem value="3">3 - Energetic</SelectItem>
            <SelectItem value="4">4 - Wild</SelectItem>
            <SelectItem value="5">5 - Mayhem</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state with same values
            setInputs((p) => ({ ...p }));
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ unit: "metric", weight: "", speed: "", destruction: "1" })}
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
          Understanding Dog Zoomies Energy Release Meter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The infamous "zoomies" are a fascinating canine phenomenon where dogs suddenly burst into frenetic, high-speed activity. This behavior, scientifically called Frenetic Random Activity Periods (FRAPs), serves as a natural energy release mechanism. By calculating the kinetic energy behind these zoomies, we can better appreciate the sheer physical power and joy your dog unleashes during these moments. This meter combines your dog's weight, speed, and the chaos level to estimate just how much zoomie energy is being released.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Zoomies have been observed not only in domestic dogs but also in wild canids like wolves and foxes, suggesting an evolutionary purpose. Historically, these bursts may have helped young canines practice hunting skills or escape predators. Interestingly, the term "zoomies" gained popularity in the 1990s among dog owners and trainers, capturing the playful spirit of these energetic episodes.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get your dog's zoomies energy estimate, start by selecting your preferred unit system: Metric or Imperial. Enter your dog's weight — this is crucial as bigger dogs pack more kinetic punch. Next, input the estimated speed your dog reaches during zoomies; if unsure, think of a sprint or chase pace. Finally, choose the destruction level to reflect how wild your dog's zoomies get, from calm to full mayhem. Hit calculate and enjoy a witty summary of your dog's zoomie power!
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
              href="https://www.akc.org/expert-advice/training/why-do-dogs-get-the-zoomies/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American Kennel Club: Why Do Dogs Get the Zoomies? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A detailed explanation of the science behind zoomies and tips for managing your dog's energetic bursts.
            </p>
          </li>
          <li>
            <a
              href="https://www.psychologytoday.com/us/blog/canine-corner/201803/why-do-dogs-get-the-zoomies"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Psychology Today: The Zoomies Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Insights into the behavioral and emotional reasons dogs engage in zoomies, with expert commentary.
            </p>
          </li>
          <li>
            <a
              href="https://www.nationalgeographic.com/animals/article/why-do-dogs-get-the-zoomies"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Geographic: Zoomies and Animal Behavior <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A scientific perspective on zoomies in dogs and other animals, exploring evolutionary roots.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Zoomies Energy Release Meter"
      description="Measure dog energy bursts. Calculate the kinetic energy of your dog's 3 AM zoomies based on speed and destruction level."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "KE = 0.5 × mass × velocity² × destruction level multiplier",
        variables: [
          { symbol: "mass", description: "Dog's weight in kilograms (kg) or pounds (lbs)" },
          { symbol: "velocity", description: "Speed during zoomies in meters per second (m/s) or miles per hour (mph)" },
          { symbol: "destruction level multiplier", description: "A factor from 1 (calm) to 5 (mayhem) representing zoomie intensity" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculating zoomies energy for a 20 kg dog running at 30 km/h with a destruction level of 3.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert speed to meters per second: 30 km/h ÷ 3.6 = 8.33 m/s.",
          },
          {
            label: "2",
            explanation:
              "Calculate kinetic energy: 0.5 × 20 kg × (8.33 m/s)² = 694.4 Joules.",
          },
          {
            label: "3",
            explanation:
              "Multiply by destruction level: 694.4 × 3 = 2083.2 Joules of zoomie energy released.",
          },
        ],
        result: "Your dog releases approximately 2083 Joules of zoomie energy — that's some serious zoom!",
      }}
      relatedCalculators={[
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Penguin Slap Power Calculator", url: "/funny/penguin-slap-power", icon: "🐈" },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "Keyboard Clicks per Day Estimator", url: "/funny/keyboard-clicks-per-day", icon: "💻" },
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
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