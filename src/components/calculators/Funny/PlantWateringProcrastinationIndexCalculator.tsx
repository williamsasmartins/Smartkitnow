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

export default function PlantWateringProcrastinationIndexCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    plantType: "succulent",
    potSize: "",
    wateringFrequency: "",
    forgetfulnessLevel: "moderate",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Logic:
   * Plant types have different water needs and tolerance to neglect.
   * Pot size affects soil moisture retention.
   * Watering frequency is how often user intends to water.
   * Forgetfulness level adjusts procrastination tolerance.
   * 
   * We calculate a "Procrastination Index" (PPI) that estimates how many days you can delay watering before your plant starts to suffer.
   */

  const plantWaterTolerance = {
    succulent: 14, // days without water approx
    fern: 3,
    cactus: 21,
    orchid: 5,
    spiderPlant: 7,
    peaceLily: 4,
  };

  const forgetfulnessMultiplier = {
    low: 0.8,
    moderate: 1,
    high: 1.2,
    extreme: 1.5,
  };

  const results = useMemo(() => {
    const { plantType, potSize, wateringFrequency, forgetfulnessLevel, unit } = inputs;

    // Validate inputs
    const potSizeNum = parseFloat(potSize);
    const wateringFreqNum = parseFloat(wateringFrequency);

    if (!plantType || !potSizeNum || !wateringFreqNum || potSizeNum <= 0 || wateringFreqNum <= 0) {
      return {
        value: "",
        label: "",
        subtext: "Please fill in all fields with valid positive numbers.",
        color: "text-red-600",
        icon: <AlertTriangle />,
      };
    }

    // Convert pot size to liters if imperial (assume potSize input is diameter in cm or inches)
    // Approximate soil volume: volume = π * (radius)^2 * height (assume height = diameter for simplicity)
    // volume in liters (1 cm³ = 0.001 liters)
    let potVolumeLiters = 0;
    if (unit === "metric") {
      // potSize is diameter in cm
      const radius = potSizeNum / 2;
      const height = potSizeNum; // assume height = diameter for simplicity
      const volumeCm3 = Math.PI * radius * radius * height;
      potVolumeLiters = volumeCm3 * 0.001;
    } else {
      // imperial: potSize in inches, convert to cm first (1 inch = 2.54 cm)
      const diameterCm = potSizeNum * 2.54;
      const radius = diameterCm / 2;
      const height = diameterCm;
      const volumeCm3 = Math.PI * radius * radius * height;
      potVolumeLiters = volumeCm3 * 0.001;
    }

    // Base tolerance days from plant type
    const baseTolerance = plantWaterTolerance[plantType] || 7;

    // Adjust tolerance by pot volume: bigger pots hold more water, increase tolerance by 10% per 5 liters over 5 liters
    let volumeBonus = 0;
    if (potVolumeLiters > 5) {
      volumeBonus = Math.min((potVolumeLiters - 5) / 5 * 0.1, 0.3); // max 30% bonus
    }

    // Adjust tolerance by watering frequency: if watering frequency is less than base tolerance, reduce tolerance
    // If watering frequency is more frequent than base tolerance, increase tolerance slightly
    let freqAdjustment = 0;
    if (wateringFreqNum < baseTolerance) {
      freqAdjustment = -0.2; // 20% less tolerance if watering less frequently than plant needs
    } else if (wateringFreqNum > baseTolerance) {
      freqAdjustment = 0.1; // 10% more tolerance if watering more frequently
    }

    // Forgetfulness multiplier
    const forgetMult = forgetfulnessMultiplier[forgetfulnessLevel] || 1;

    // Calculate procrastination index
    let procrastinationIndex = baseTolerance * (1 + volumeBonus + freqAdjustment) * forgetMult;

    // Clamp between 1 and 30 days
    procrastinationIndex = Math.min(Math.max(procrastinationIndex, 1), 30);

    // Determine label and icon based on procrastination index
    let label = "";
    let icon = <Meh />;
    let color = "text-yellow-600";
    let subtext = "";

    if (procrastinationIndex >= 20) {
      label = "Plant Watering Procrastinator Extraordinaire";
      icon = <Smile />;
      color = "text-green-600";
      subtext = "Your plant can forgive your forgetfulness for quite a while. Just don’t push it!";
    } else if (procrastinationIndex >= 10) {
      label = "Moderate Plant Watering Procrastinator";
      icon = <Meh />;
      color = "text-yellow-600";
      subtext = "You’re walking a fine line. Your plant appreciates timely watering.";
    } else if (procrastinationIndex >= 5) {
      label = "Serial Plant Watering Delayer";
      icon = <Frown />;
      color = "text-orange-600";
      subtext = "Your plant is starting to get thirsty. Better grab that watering can soon.";
    } else {
      label = "Plant Watering Emergency!";
      icon = <Skull />;
      color = "text-red-700";
      subtext = "Your plant is on the brink of revolt. Water immediately or face the consequences!";
    }

    return {
      value: procrastinationIndex.toFixed(1) + " days",
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do some plants tolerate neglect better than others?",
      answer:
        "Plants have evolved in different environments, which shaped their water storage and usage strategies. Succulents and cacti, for example, store water in their thick leaves or stems, allowing them to survive long dry spells. On the other hand, ferns and orchids usually thrive in humid environments and require frequent watering. Understanding these differences helps you tailor your care routine and avoid plant heartbreak.",
    },
    {
      question: "How does pot size affect watering needs?",
      answer:
        "Pot size influences how much soil and water your plant’s roots can access. Larger pots hold more moisture and buffer against drying out quickly, while smaller pots dry out faster, demanding more frequent watering. However, too large a pot can cause waterlogging, so balance is key. This calculator estimates soil volume to factor in how pot size impacts your plant’s watering tolerance.",
    },
    {
      question: "What’s the science behind watering frequency and procrastination?",
      answer:
        "Watering frequency is your planned schedule, but procrastination adds a twist — it’s the delay beyond that schedule. Plants can tolerate some delay depending on their species and environment. This index combines your watering habits with your forgetfulness level to estimate how long you can safely delay watering before your plant suffers. It’s like a procrastination tolerance meter for your green friends!",
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

      {/* Plant Type */}
      <div>
        <Label htmlFor="plantType" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Select Your Plant Type
        </Label>
        <Select
          id="plantType"
          value={inputs.plantType}
          onValueChange={(v) => handleInputChange("plantType", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="succulent">Succulent</SelectItem>
            <SelectItem value="fern">Fern</SelectItem>
            <SelectItem value="cactus">Cactus</SelectItem>
            <SelectItem value="orchid">Orchid</SelectItem>
            <SelectItem value="spiderPlant">Spider Plant</SelectItem>
            <SelectItem value="peaceLily">Peace Lily</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pot Size */}
      <div>
        <Label htmlFor="potSize" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Pot Diameter ({inputs.unit === "metric" ? "cm" : "inches"})
        </Label>
        <Input
          id="potSize"
          type="number"
          min={1}
          step="any"
          placeholder={inputs.unit === "metric" ? "e.g. 15" : "e.g. 6"}
          value={inputs.potSize}
          onChange={(e) => handleInputChange("potSize", e.target.value)}
        />
      </div>

      {/* Watering Frequency */}
      <div>
        <Label htmlFor="wateringFrequency" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Planned Watering Frequency (days)
        </Label>
        <Input
          id="wateringFrequency"
          type="number"
          min={1}
          step="any"
          placeholder="e.g. 7"
          value={inputs.wateringFrequency}
          onChange={(e) => handleInputChange("wateringFrequency", e.target.value)}
        />
      </div>

      {/* Forgetfulness Level */}
      <div>
        <Label htmlFor="forgetfulnessLevel" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          How Forgetful Are You?
        </Label>
        <Select
          id="forgetfulnessLevel"
          value={inputs.forgetfulnessLevel}
          onValueChange={(v) => handleInputChange("forgetfulnessLevel", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (I never forget!)</SelectItem>
            <SelectItem value="moderate">Moderate (Sometimes distracted)</SelectItem>
            <SelectItem value="high">High (Often forget)</SelectItem>
            <SelectItem value="extreme">Extreme (Plants fear me)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            /* Trigger recalculation by updating state (already reactive) */
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              plantType: "succulent",
              potSize: "",
              wateringFrequency: "",
              forgetfulnessLevel: "moderate",
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Plant Watering Procrastination Index
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Plant Watering Procrastination Index (PPI) is a fun yet insightful way to measure how long you can delay watering your plant before it starts to suffer. It combines your plant’s natural water tolerance, the size of its pot, your planned watering schedule, and your forgetfulness level into a single number. This index helps you understand the delicate balance between plant care and human procrastination, turning plant neglect into a science. After all, even the most resilient plants have their limits, and knowing them can save your green friends from an untimely demise.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The concept of plant watering tolerance dates back to ancient agricultural practices where farmers observed how different crops survived droughts. Succulents, native to arid regions, can survive weeks without water by storing moisture in their leaves, a trait that fascinated botanists since the 18th century. Interestingly, the famous Victorian-era terrariums popularized the idea of self-sustaining plant ecosystems, reducing the need for frequent watering — a perfect example of early plant procrastination management!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by selecting your plant type from the dropdown menu, as different plants have varying water needs and tolerances. Next, enter the diameter of your pot, which helps estimate how much soil and water your plant can hold. Then, input your planned watering frequency in days — how often you intend to water your plant under ideal conditions. Finally, choose your forgetfulness level honestly; this factor adjusts the index to reflect real-life procrastination tendencies. Hit calculate, and voilà — you get your personalized Plant Watering Procrastination Index!
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use this index as a guideline, not a strict rule. Plants are living beings influenced by many factors like humidity, temperature, and light. The PPI helps you understand your plant’s resilience and your habits, encouraging better care without guilt. Remember, even the best procrastinators can learn to nurture their leafy companions with a little effort and this handy tool.
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
            <a href="https://www.rhs.org.uk/advice/profile?pid=482" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Royal Horticultural Society: Succulent Care <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide on succulent watering needs and drought tolerance.
            </p>
          </li>
          <li>
            <a href="https://www.britannica.com/science/plant" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Britannica: Plant Biology and Adaptations <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore how plants adapt to different environments, including water scarcity.
            </p>
          </li>
          <li>
            <a href="https://www.gardeningknowhow.com/houseplants/hpgen/houseplant-watering.htm" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Gardening Know How: Houseplant Watering Tips <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical advice on watering frequency and signs of over- or under-watering.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plant Watering Procrastination Index"
      description="Track plant neglect. Calculate how long you can 'procrastinate' watering your plants before they officially give up on you."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula:
          "PPI = BaseTolerance × (1 + VolumeBonus + FrequencyAdjustment) × ForgetfulnessMultiplier",
        variables: [
          { name: "BaseTolerance", description: "Plant's natural days without water tolerance" },
          { name: "VolumeBonus", description: "Bonus from pot size increasing water retention" },
          { name: "FrequencyAdjustment", description: "Adjustment based on watering frequency vs plant needs" },
          { name: "ForgetfulnessMultiplier", description: "Multiplier based on your forgetfulness level" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have a succulent in a 15 cm diameter pot, plan to water every 7 days, and consider yourself moderately forgetful.",
        steps: [
          {
            label: "1",
            explanation:
              "Succulent base tolerance is about 14 days without water. Pot volume gives a small bonus since 15 cm pot is moderate size.",
          },
          {
            label: "2",
            explanation:
              "Your watering frequency (7 days) is less than base tolerance, so a slight negative adjustment applies.",
          },
          {
            label: "3",
            explanation:
              "Moderate forgetfulness multiplier is 1, so no change there.",
          },
          {
            label: "4",
            explanation:
              "Calculate PPI: 14 × (1 + small bonus - 0.2) × 1 ≈ 11 days. You can procrastinate about 11 days before your succulent protests.",
          },
        ],
        result: "Plant Watering Procrastination Index = 11 days",
      }}
      relatedCalculators={[
        { title: "Coffee Addiction Meter", url: "/funny/coffee-addiction-meter", icon: "☕" },
        { title: "Crinkle Crankle Wall Brick Saver", url: "/funny/crinkle-crankle-wall-brick-saver", icon: "🤪" },
        { title: "Dog Zoomies Energy Release Meter", url: "/funny/dog-zoomies-energy-meter", icon: "🐈" },
        { title: "Time Travel Energy Requirement", url: "/funny/time-travel-energy-requirement", icon: "✈️" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Meme Virality Calculator", url: "/funny/meme-virality-calculator", icon: "🤪" },
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