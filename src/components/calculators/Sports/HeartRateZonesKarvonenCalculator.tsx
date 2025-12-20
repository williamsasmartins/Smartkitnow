import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Activity,
  Timer,
  TrendingUp,
  Dumbbell,
  Trophy,
  Medal,
  Flag,
  Flame,
  Zap,
  Heart,
  Scale,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Waves,
  Gauge,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HeartRateZonesKarvonenCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    restingHR: "",
    intensity: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Karvonen formula:
  // Target HR = ((Max HR − Resting HR) × Intensity) + Resting HR
  // Max HR = 220 − age (general formula)

  const results = useMemo(() => {
    const age = Number(inputs.age);
    const restingHR = Number(inputs.restingHR);
    const intensityPercent = Number(inputs.intensity);

    if (
      !age ||
      age < 10 ||
      age > 120 ||
      !restingHR ||
      restingHR < 30 ||
      restingHR > 120 ||
      !intensityPercent ||
      intensityPercent < 50 ||
      intensityPercent > 95
    ) {
      return {
        value: "",
        label: "",
        subtext: null,
        warning:
          age && (age < 10 || age > 120)
            ? "Age should be between 10 and 120 years."
            : restingHR && (restingHR < 30 || restingHR > 120)
            ? "Resting heart rate should be between 30 and 120 bpm."
            : intensityPercent && (intensityPercent < 50 || intensityPercent > 95)
            ? "Intensity should be between 50% and 95%."
            : null,
        formulaUsed: "",
      };
    }

    const maxHR = 220 - age;
    const intensity = intensityPercent / 100;
    const targetHR = Math.round((maxHR - restingHR) * intensity + restingHR);

    return {
      value: `${targetHR} bpm`,
      label: `Target Heart Rate at ${intensityPercent}&percnt; Intensity`,
      subtext: `Calculated using Karvonen method with Max HR = 220 − age (${maxHR} bpm)`,
      warning: null,
      formulaUsed: `Target HR = ((220 − age − Resting HR) × Intensity) + Resting HR`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Karvonen method for heart rate zones?",
      answer:
        "The Karvonen method calculates target heart rate zones by factoring in your resting heart rate, which provides a more personalized and accurate training intensity compared to simple percentage methods. It helps optimize cardiovascular training by adjusting for individual fitness levels.",
    },
    {
      question: "Why is resting heart rate important in this calculation?",
      answer:
        "Resting heart rate reflects your baseline cardiovascular fitness and recovery state. Including it in the calculation allows the Karvonen method to tailor heart rate zones to your unique physiology, improving training effectiveness and safety.",
    },
    {
      question: "Can I use this calculator if I have a medical condition?",
      answer:
        "If you have any cardiovascular or other medical conditions, consult your healthcare provider before using heart rate zone calculators or starting new exercise programs. Personalized advice ensures your training is safe and appropriate.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="age" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min={10}
              max={120}
              placeholder="e.g., 30"
              value={inputs.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              aria-describedby="age-desc"
            />
            <p id="age-desc" className="text-xs text-slate-500 mt-1">
              Enter your age between 10 and 120 years.
            </p>
          </div>

          <div>
            <Label htmlFor="restingHR" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Resting Heart Rate (bpm)
            </Label>
            <Input
              id="restingHR"
              type="number"
              min={30}
              max={120}
              placeholder="e.g., 60"
              value={inputs.restingHR}
              onChange={(e) => handleInputChange("restingHR", e.target.value)}
              aria-describedby="restingHR-desc"
            />
            <p id="restingHR-desc" className="text-xs text-slate-500 mt-1">
              Your heart rate at rest, typically measured in the morning.
            </p>
          </div>

          <div>
            <Label htmlFor="intensity" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Target Intensity (%)
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
                {[50, 55, 60, 65, 70, 75, 80, 85, 90, 95].map((val) => (
                  <SelectItem key={val} value={val.toString()}>
                    {val}&percnt;
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p id="intensity-desc" className="text-xs text-slate-500 mt-1">
              Choose your desired training intensity between 50&percnt; and 95&percnt;.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed; results update automatically
          }}
          aria-label="Calculate target heart rate"
        >
          <Trophy className="mr-2 h-4 w-4" aria-hidden="true" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ age: "", restingHR: "", intensity: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            {results.subtext && (
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 italic">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                {results.warning}
              </p>
            )}
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
          The Karvonen method is a scientifically validated approach to calculating heart rate training zones that accounts for your resting heart rate, making it more personalized than simple percentage-based methods. By incorporating resting heart rate, it reflects your cardiovascular fitness and recovery status, allowing for more precise training intensities. This method helps athletes and fitness enthusiasts optimize their cardiovascular workouts by targeting heart rate zones that improve endurance, fat burning, and aerobic capacity. Understanding and applying these zones can lead to safer and more effective training outcomes.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, you need to input your age, resting heart rate, and desired training intensity percentage. The calculator then applies the Karvonen formula to estimate your target heart rate for the selected intensity. This target heart rate helps you train within specific zones that correspond to different fitness goals, such as fat burning or cardiovascular endurance. Make sure to measure your resting heart rate accurately, ideally first thing in the morning before getting out of bed.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Enter your age in years (between 10 and 120).</li>
          <li>Step 2: Enter your resting heart rate in beats per minute (bpm), typically measured at rest.</li>
          <li>Step 3: Select your desired training intensity percentage (50&percnt; to 95&percnt;).</li>
          <li>Step 4: Click &quot;Calculate&quot; to see your target heart rate for the selected intensity.</li>
          <li>Step 5: Use this target heart rate to guide your cardio training sessions.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When training with heart rate zones calculated by the Karvonen method, it is important to warm up properly and gradually increase intensity to avoid injury or overexertion. Training at intensities &gt; 85&percnt; of your heart rate reserve is typically reserved for high-intensity interval training (HIIT) or competitive athletes. For general endurance and fat burning, aim for moderate zones between 60&percnt; and 75&percnt;. Always listen to your body and adjust your training intensity if you experience unusual fatigue or discomfort. Consistency and gradual progression are key to improving cardiovascular fitness safely.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
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
              American College of Sports Medicine <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines on cardiovascular training.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NSCA offers comprehensive resources on strength and conditioning, including heart rate training and performance optimization.
            </p>
          </li>
          <li>
            <a
              href="https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American Heart Association - Target Heart Rates <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The AHA provides practical guidance on heart rate zones and cardiovascular health for safe and effective exercise.
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
        title: "Formula",
        formula: "Target HR = ((220 − age − Resting HR) × Intensity) + Resting HR",
        variables: [
          { symbol: "age", description: "Your age in years" },
          { symbol: "Resting HR", description: "Your resting heart rate in beats per minute" },
          { symbol: "Intensity", description: "Desired training intensity as a decimal (e.g., 0.7 for 70&percnt;)" },
          { symbol: "Target HR", description: "Target heart rate in beats per minute" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 30-year-old athlete with a resting heart rate of 60 bpm wants to train at 75&percnt; intensity using the Karvonen method.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate Max HR: 220 − 30 = 190 bpm.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate Heart Rate Reserve (HRR): 190 − 60 = 130 bpm.",
          },
          {
            label: "Step 3",
            explanation:
              "Multiply HRR by intensity: 130 × 0.75 = 97.5 bpm.",
          },
          {
            label: "Step 4",
            explanation:
              "Add resting HR back: 97.5 + 60 = 157.5 bpm.",
          },
          {
            label: "Step 5",
            explanation:
              "Target Heart Rate is approximately 158 bpm at 75&percnt; intensity.",
          },
        ],
        result: "The athlete should aim to maintain a heart rate around 158 bpm during training to optimize cardiovascular benefits at 75&percnt; intensity.",
      }}
      relatedCalculators={[
        { title: "Plate Loading Calculator", url: "/sports/plate-loading", icon: "🏋️" },
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
        { title: "Tournament Bracket Seeding Helper", url: "/sports/tournament-bracket-seeding-helper", icon: "🏆" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏊" },
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