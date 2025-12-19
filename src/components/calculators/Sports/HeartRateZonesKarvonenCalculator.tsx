import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Activity, Timer, TrendingUp, Dumbbell, Trophy, Medal, Flag, Flame, Zap, Heart, Scale, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Waves, Gauge } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HeartRateZonesKarvonenCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    restingHR: "",
    intensity: "50",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Validate inputs
  const ageNum = Number(inputs.age);
  const restingHRNum = Number(inputs.restingHR);
  const intensityNum = Number(inputs.intensity);

  // Karvonen formula:
  // Target HR = ((Max HR − Resting HR) × Intensity) + Resting HR
  // Max HR estimated as 220 - age

  const results = useMemo(() => {
    if (
      !ageNum || ageNum < 10 || ageNum > 100 ||
      !restingHRNum || restingHRNum < 30 || restingHRNum > 120 ||
      !intensityNum || intensityNum < 40 || intensityNum > 95
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid inputs: Age (10-100), Resting HR (30-120), Intensity (40-95%).",
        formulaUsed: null,
      };
    }

    const maxHR = 220 - ageNum;
    const targetHR = Math.round(((maxHR - restingHRNum) * (intensityNum / 100)) + restingHRNum);

    return {
      value: `${targetHR} bpm`,
      label: `Target Heart Rate at ${intensityNum}% Intensity`,
      subtext: `Calculated using Karvonen method with Max HR = 220 - Age (${maxHR} bpm)`,
      warning: null,
      formulaUsed: `Target HR = ((220 - Age - Resting HR) × Intensity) + Resting HR`,
    };
  }, [ageNum, restingHRNum, intensityNum]);

  const faqs = [
    {
      question: "What is the Karvonen method for calculating heart rate zones?",
      answer:
        "The Karvonen method calculates target heart rate zones by incorporating resting heart rate, which personalizes training intensity more accurately than simple max heart rate percentages. It uses the formula: Target HR = ((Max HR − Resting HR) × Intensity) + Resting HR, where Max HR is typically estimated as 220 minus age.",
    },
    {
      question: "Why is resting heart rate important in heart rate zone calculations?",
      answer:
        "Resting heart rate reflects your cardiovascular fitness and recovery status. Including it in calculations accounts for individual differences in heart rate reserve, making training zones more precise and tailored to your physiological condition, improving training effectiveness and safety.",
    },
    {
      question: "How do I determine the right intensity percentage for my training?",
      answer:
        "Training intensity depends on your fitness goals: lower intensities (50-60%) are for recovery and fat burning, moderate (60-75%) for aerobic endurance, and higher intensities (75-90%) for anaerobic and performance improvements. Consult with a coach or sports scientist to tailor zones to your needs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="age" className="flex items-center gap-1">
              Age (years) <Info className="w-4 h-4 text-blue-500" />
            </Label>
            <Input
              id="age"
              type="number"
              min={10}
              max={100}
              placeholder="e.g. 30"
              value={inputs.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              aria-describedby="age-desc"
            />
            <p id="age-desc" className="text-sm text-slate-500 mt-1">
              Enter your age to estimate maximum heart rate.
            </p>
          </div>

          <div>
            <Label htmlFor="restingHR" className="flex items-center gap-1">
              Resting Heart Rate (bpm) <Heart className="w-4 h-4 text-red-500" />
            </Label>
            <Input
              id="restingHR"
              type="number"
              min={30}
              max={120}
              placeholder="e.g. 60"
              value={inputs.restingHR}
              onChange={(e) => handleInputChange("restingHR", e.target.value)}
              aria-describedby="restingHR-desc"
            />
            <p id="restingHR-desc" className="text-sm text-slate-500 mt-1">
              Measure your resting heart rate first thing in the morning for accuracy.
            </p>
          </div>

          <div>
            <Label htmlFor="intensity" className="flex items-center gap-1">
              Training Intensity (%) <Flame className="w-4 h-4 text-orange-500" />
            </Label>
            <Select
              value={inputs.intensity}
              onValueChange={(v) => handleInputChange("intensity", v)}
              aria-describedby="intensity-desc"
            >
              <SelectTrigger id="intensity" className="w-full">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                {[50, 60, 70, 75, 80, 85, 90, 95].map((val) => (
                  <SelectItem key={val} value={val.toString()}>
                    {val}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p id="intensity-desc" className="text-sm text-slate-500 mt-1">
              Choose your desired training intensity to calculate target heart rate.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation since inputs are controlled
          }}
          aria-label="Calculate target heart rate"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ age: "", restingHR: "", intensity: "50" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700">
          <CardContent className="text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 italic">{results.subtext}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Formula used: {results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Heart-Rate Zones Calculator (Karvonen Method)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Karvonen method is a scientifically validated approach to calculating heart rate training zones that accounts for individual differences in resting heart rate. Unlike simple percentage-based methods that use only maximum heart rate, the Karvonen formula incorporates heart rate reserve (the difference between maximum and resting heart rate), providing a more personalized and accurate target heart rate. This method helps athletes and fitness enthusiasts optimize cardiovascular training by tailoring intensity levels to their unique physiology, improving training effectiveness and reducing injury risk.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula estimates maximum heart rate as 220 minus age, then calculates target heart rate by adding a percentage of the heart rate reserve to the resting heart rate. This approach reflects the body's true capacity to increase heart rate during exercise and is widely used in sports science and clinical exercise testing.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate your target heart rate zones using the Karvonen method, you need to input three key values: your age, your resting heart rate, and your desired training intensity percentage. The calculator will then compute your target heart rate, which you can use to guide your cardiovascular workouts.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your resting heart rate first thing in the morning before getting out of bed for the most accurate reading.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your age to estimate your maximum heart rate using the standard formula (220 - age).
          </li>
          <li>
            <strong>Step 3:</strong> Select your desired training intensity percentage based on your fitness goals and current conditioning.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see your personalized target heart rate for the chosen intensity.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using heart rate zones effectively can significantly enhance your cardiovascular training outcomes. Begin by training at lower intensities (50-60% of heart rate reserve) to build aerobic base and promote fat metabolism. As your fitness improves, gradually increase intensity to moderate (60-75%) and high zones (75-90%) to improve endurance, speed, and anaerobic capacity. Always allow adequate recovery and listen to your body to avoid overtraining.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Incorporate interval training by alternating between high-intensity bursts and low-intensity recovery periods within your target heart rate zones. This approach improves cardiovascular efficiency and performance. Regularly reassess your resting heart rate and adjust zones accordingly, as improvements in fitness often lower resting heart rate over time.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science and heart rate zone methodologies, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The ACSM provides comprehensive guidelines and research on exercise testing and prescription, including heart rate zone training.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              NSCA offers evidence-based resources on strength and conditioning, including cardiovascular training principles and heart rate monitoring.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/health/a20803104/heart-rate-training-zones/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - Heart Rate Training Zones Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical guide to understanding and applying heart rate zones for endurance training and performance improvement.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Heart-Rate Zones Calculator (Karvonen Method)"
      description="Calculate accurate heart rate training zones. Use the Karvonen method to account for resting heart rate and optimize your cardio."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Karvonen Formula",
        formula: "Target HR = ((220 - Age - Resting HR) × Intensity) + Resting HR",
        variables: [
          { symbol: "Age", description: "Your age in years" },
          { symbol: "Resting HR", description: "Your resting heart rate in beats per minute" },
          { symbol: "Intensity", description: "Desired training intensity as a decimal (e.g., 0.7 for 70%)" },
          { symbol: "Target HR", description: "Calculated target heart rate in beats per minute" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 30-year-old athlete with a resting heart rate of 60 bpm wants to train at 75% intensity using the Karvonen method.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate maximum heart rate: 220 - 30 = 190 bpm.",
          },
          {
            label: "Step 2",
            explanation: "Calculate heart rate reserve: 190 - 60 = 130 bpm.",
          },
          {
            label: "Step 3",
            explanation: "Calculate target heart rate: (130 × 0.75) + 60 = 157.5 bpm.",
          },
          {
            label: "Step 4",
            explanation: "Round to nearest whole number: 158 bpm target heart rate.",
          },
        ],
        result: "The athlete should aim to maintain a heart rate of approximately 158 bpm during training at 75% intensity.",
      }}
      relatedCalculators={[
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}