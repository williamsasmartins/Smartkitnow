import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function roundToInt(num: number) {
  return Math.round(num);
}

export default function HeartRateZonesCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    age?: number;
    restingHR?: number;
  }>({});

  // 2. LOGIC
  // Karvonen formula: Target HR = ((MaxHR − RestingHR) × %Intensity) + RestingHR
  // MaxHR estimated as 220 - age (simple, widely used)
  // Zones defined by %Intensity ranges:
  // Zone 1: 50-60% (Very light)
  // Zone 2: 60-70% (Light)
  // Zone 3: 70-80% (Moderate)
  // Zone 4: 80-90% (Hard)
  // Zone 5: 90-100% (Maximum effort)

  const zones = useMemo(() => {
    if (
      inputs.age === undefined ||
      inputs.restingHR === undefined ||
      inputs.age <= 0 ||
      inputs.restingHR <= 0
    ) {
      return null;
    }
    const maxHR = 220 - inputs.age;
    const restingHR = inputs.restingHR;

    // Calculate HR zones using Karvonen formula for each intensity boundary
    const zoneBounds = [
      { label: "Zone 1 (Very Light)", min: 0.5, max: 0.6 },
      { label: "Zone 2 (Light)", min: 0.6, max: 0.7 },
      { label: "Zone 3 (Moderate)", min: 0.7, max: 0.8 },
      { label: "Zone 4 (Hard)", min: 0.8, max: 0.9 },
      { label: "Zone 5 (Maximum Effort)", min: 0.9, max: 1.0 },
    ];

    const calculatedZones = zoneBounds.map(({ label, min, max }) => {
      const minHR = roundToInt((maxHR - restingHR) * min + restingHR);
      const maxHRzone = roundToInt((maxHR - restingHR) * max + restingHR);
      return {
        label,
        minHR,
        maxHR: maxHRzone,
      };
    });

    return {
      maxHR,
      restingHR,
      zones: calculatedZones,
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Karvonen method and how does it differ from the percentage of maximum heart rate method?",
      answer: "The Karvonen method calculates heart rate zones using your resting heart rate and maximum heart rate, providing a more personalized approach than simple percentage-based calculations. This method accounts for your fitness level by incorporating resting heart rate, making it more accurate for individuals with varying fitness levels. The percentage method uses only maximum heart rate, while Karvonen factors in the reserve between resting and maximum heart rate, resulting in different zone boundaries.",
    },
    {
      question: "How do I accurately measure my resting heart rate for this calculator?",
      answer: "Measure your resting heart rate by taking your pulse for a full minute after sitting quietly for at least 5 minutes, ideally first thing in the morning before getting out of bed. The average resting heart rate for adults ranges from 60–100 bpm, though athletes may have rates as low as 40–60 bpm. Take multiple measurements over several days and use the average for the most accurate calculation.",
    },
    {
      question: "What are the five standard heart rate zones and their intensity levels?",
      answer: "The five zones are: Zone 1 (50–60% intensity) for warm-up and recovery at light effort; Zone 2 (60–70%) for aerobic endurance at moderate effort; Zone 3 (70–80%) for aerobic threshold at hard effort; Zone 4 (80–90%) for anaerobic capacity at very hard effort; and Zone 5 (90–100%) for maximum effort and peak performance. Each zone serves different training purposes and physiological adaptations. Most training should occur in Zones 2 and 3 for sustainable fitness improvements.",
    },
    {
      question: "How does age affect my maximum heart rate calculation?",
      answer: "Maximum heart rate generally decreases with age at approximately 1 beat per year after age 20, calculated using the formula: 220 minus your age. A 30-year-old typically has a max heart rate around 190 bpm, while a 50-year-old averages 170 bpm. However, individual variation exists based on genetics and fitness level, so this formula serves as an estimate rather than a precise measurement.",
    },
    {
      question: "Why should I use heart rate zones for my training program?",
      answer: "Heart rate zones help optimize training by ensuring you're working at the correct intensity for your specific fitness goals, whether building endurance, improving speed, or enhancing recovery. Training without zones often results in spending too much time at moderate intensities rather than alternating between high and low intensity as optimal training protocols recommend. Using zones provides objective feedback and prevents overtraining while maximizing physiological adaptations.",
    },
    {
      question: "What is a normal resting heart rate by age and fitness level?",
      answer: "For sedentary adults, resting heart rate typically ranges from 70–100 bpm across all age groups, while trained athletes often maintain rates between 40–60 bpm. A resting heart rate below 60 bpm generally indicates good cardiovascular fitness, while rates consistently above 80 bpm may suggest the need for increased cardiovascular training. Children ages 6–15 typically have resting rates between 70–100 bpm due to their naturally faster metabolism.",
    },
    {
      question: "Can I use this calculator if I take beta-blockers or other heart rate-affecting medications?",
      answer: "Beta-blockers and certain medications lower resting heart rate and maximum heart rate, making the Karvonen calculation less accurate for determining training zones. If you take such medications, consult your physician or cardiologist to determine appropriate heart rate zones tailored to your specific physiology. You may need to adjust calculated zones downward or use perceived exertion ratings as supplementary guidance.",
    },
    {
      question: "How often should I recalculate my heart rate zones?",
      answer: "Recalculate your heart rate zones every 4–8 weeks if you're actively training, as improved fitness increases your maximum heart rate capacity and may lower your resting heart rate. Significant changes in fitness level, age, or resting heart rate warrant immediate recalculation to ensure training zones remain accurate. Athletes in structured training programs should reassess every 6–12 weeks to track progress.",
    },
    {
      question: "What's the relationship between heart rate zones and VO2 max training?",
      answer: "Zone 4 and Zone 5 training primarily builds VO2 max, which is your maximum oxygen uptake capacity measured in milliliters of oxygen per kilogram of body weight per minute. Training in these higher zones stimulates the cardiovascular and respiratory systems to improve oxygen utilization efficiency. Most effective VO2 max improvement occurs with 1–2 sessions weekly in Zones 4–5, combined with base-building work in Zones 1–3.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min={1}
              max={120}
              placeholder="e.g. 35"
              value={inputs.age ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  age: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              aria-describedby="age-desc"
              className="dark:bg-slate-800"
            />
            <p id="age-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your age in years.
            </p>
          </div>

          <div>
            <Label
              htmlFor="restingHR"
              className="text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              Resting Heart Rate (bpm)
              <Info size={16} className="text-blue-500" title="Measured after waking up, at rest" />
            </Label>
            <Input
              id="restingHR"
              type="number"
              min={30}
              max={120}
              placeholder="e.g. 60"
              value={inputs.restingHR ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  restingHR: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              aria-describedby="restingHR-desc"
              className="dark:bg-slate-800"
            />
            <p id="restingHR-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your heart rate at complete rest, ideally measured in the morning.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger re-render, calculation is memoized
            setInputs((prev) => ({ ...prev }));
          }}
          disabled={
            inputs.age === undefined ||
            inputs.restingHR === undefined ||
            inputs.age <= 0 ||
            inputs.restingHR <= 0
          }
          aria-disabled={
            inputs.age === undefined ||
            inputs.restingHR === undefined ||
            inputs.age <= 0 ||
            inputs.restingHR <= 0
          }
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {zones && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Heart Rate Zones
              </p>
              <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium">
                Max Heart Rate (Estimated):{" "}
                <span className="font-semibold dark:text-white">{zones.maxHR} bpm</span>
                <br />
                Resting Heart Rate:{" "}
                <span className="font-semibold dark:text-white">{zones.restingHR} bpm</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto">
                {zones.zones.map(({ label, minHR, maxHR }) => (
                  <div
                    key={label}
                    className="rounded-md bg-white/70 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 p-4 shadow-sm"
                  >
                    <p className="font-bold text-blue-900 dark:text-white mb-1">{label}</p>
                    <p className="text-blue-800 dark:text-blue-300 font-extrabold text-2xl">
                      {minHR} - {maxHR} bpm
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Heart Rate Zones (Karvonen/percentages) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Heart Rate Zones calculator using the Karvonen method helps you determine personalized training intensities based on your cardiovascular capacity. This calculator is essential for athletes, fitness enthusiasts, and anyone wanting to optimize their training by exercising at the correct intensity for their specific goals. Unlike generic percentage-of-max-heart-rate methods, the Karvonen approach accounts for your resting heart rate, providing more accurate zone boundaries tailored to your fitness level.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need three key inputs: your age (to estimate maximum heart rate using 220 minus age), your resting heart rate (measured after waking and sitting quietly for 5+ minutes), and your fitness or training goal. The calculator uses the formula: Target Heart Rate = (Max HR − Rest HR) × Intensity % + Rest HR. Your resting heart rate is the most critical input, as a lower rest rate (indicating better fitness) will shift your training zones higher, while a higher rest rate will lower them.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you receive your zone results, use them to guide your training intensity during workouts by monitoring your heart rate with a monitor or smartwatch. Zone 1 and 2 work best for building aerobic base and recovery; Zone 3 for threshold and tempo training; Zones 4 and 5 for high-intensity interval and peak performance work. Most effective training programs spend approximately 80% of time in Zones 1–3 and only 20% in Zones 4–5 to balance adaptation with recovery and injury prevention.</p>
        </div>
      </section>

      {/* TABLE: Heart Rate Zones by Intensity (Karvonen Method Example) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Heart Rate Zones by Intensity (Karvonen Method Example)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical heart rate zone boundaries for a 35-year-old with a resting heart rate of 65 bpm and calculated maximum heart rate of 185 bpm.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Intensity %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Zone Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BPM Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Training Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Warm-up & Recovery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125–137</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light activity, active recovery</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60–70%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Aerobic Base</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">137–150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Endurance, fat burning, conversation pace</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70–80%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Aerobic Threshold</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–162</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tempo training, sustainable hard effort</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80–90%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Anaerobic Threshold</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">162–175</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High intensity, VO2 max improvement</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90–100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum Effort</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175–185</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Peak performance, sprint work</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual zones vary based on personal resting heart rate, maximum heart rate, and fitness level; these are examples only.</p>
      </section>

      {/* TABLE: Resting Heart Rate Benchmarks by Age and Fitness Level */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Resting Heart Rate Benchmarks by Age and Fitness Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Expected resting heart rate ranges vary significantly by age and cardiovascular fitness status.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sedentary/Poor Fitness</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Fitness</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Athletic/Excellent Fitness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20–29 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80–100 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70–80 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–60 bpm</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30–39 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80–100 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70–80 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–60 bpm</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40–49 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82–102 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72–82 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52–62 bpm</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50–59 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84–104 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">74–84 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54–64 bpm</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">86–106 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76–86 bpm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56–66 bpm</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Resting heart rate measured after at least 5 minutes of sitting quietly; athletes may have rates 10–20 bpm lower than shown.</p>
      </section>

      {/* TABLE: Training Frequency Recommendations by Heart Rate Zone */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Training Frequency Recommendations by Heart Rate Zone</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Optimal weekly training distribution across heart rate zones for endurance athletes and fitness enthusiasts.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Intensity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Sessions (Recommended)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Session Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Adaptation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low to Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–4 sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–120 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Aerobic base, recovery</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–60 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lactate threshold, tempo</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4–5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High to Maximum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–30 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">VO2 max, anaerobic power</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mixed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varied intensities</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 session weekly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45–90 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long slow distance or fartlek</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Frequency depends on individual fitness level, training goals, and recovery capacity; beginners should emphasize Zones 1–2.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your resting heart rate first thing in the morning before getting out of bed for the most consistent and accurate baseline—take the average of 3–5 consecutive days rather than a single measurement.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Invest in a reliable heart rate monitor or smartwatch to track your actual heart rate during workouts, allowing you to stay within target zones and adjust intensity in real time based on objective data.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Spend approximately 80% of your total training time in Zones 1–3 (low to moderate intensity) and only 20% in Zones 4–5 (high intensity) to maximize fitness gains while minimizing injury risk and overtraining.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Recalculate your heart rate zones every 8–12 weeks as your fitness improves, since better cardiovascular conditioning increases your maximum heart rate and often lowers your resting rate, shifting your optimal training zones upward.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using an inaccurate maximum heart rate estimate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The formula 220 minus age is a population average with substantial individual variation; some people's true max heart rate may be 10–15 bpm higher or lower than the estimate. If possible, determine your true maximum heart rate through a maximal fitness test with a professional rather than relying solely on the age-predicted formula.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring resting heart rate at the wrong time</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Taking your resting heart rate after activity, stress, or caffeine consumption produces artificially high readings that skew your entire zone calculation. Always measure resting heart rate in the morning before getting out of bed, after at least 5 minutes of quiet sitting, or after a full recovery day.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Spending too much time in high-intensity zones</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Training in Zones 4–5 every session leads to overtraining, elevated injury risk, and burnout rather than improved fitness. Most training should occur in Zones 1–3 with only 1–2 high-intensity sessions weekly for optimal adaptations and recovery.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the impact of medications and health conditions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Beta-blockers, certain antiarrhythmic drugs, and conditions like thyroid disorders significantly affect resting and maximum heart rate, making calculated zones unreliable. Consult your physician before using calculated heart rate zones if you take medications that affect heart rate or have cardiovascular conditions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Karvonen method and how does it differ from the percentage of maximum heart rate method?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Karvonen method calculates heart rate zones using your resting heart rate and maximum heart rate, providing a more personalized approach than simple percentage-based calculations. This method accounts for your fitness level by incorporating resting heart rate, making it more accurate for individuals with varying fitness levels. The percentage method uses only maximum heart rate, while Karvonen factors in the reserve between resting and maximum heart rate, resulting in different zone boundaries.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I accurately measure my resting heart rate for this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure your resting heart rate by taking your pulse for a full minute after sitting quietly for at least 5 minutes, ideally first thing in the morning before getting out of bed. The average resting heart rate for adults ranges from 60–100 bpm, though athletes may have rates as low as 40–60 bpm. Take multiple measurements over several days and use the average for the most accurate calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the five standard heart rate zones and their intensity levels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The five zones are: Zone 1 (50–60% intensity) for warm-up and recovery at light effort; Zone 2 (60–70%) for aerobic endurance at moderate effort; Zone 3 (70–80%) for aerobic threshold at hard effort; Zone 4 (80–90%) for anaerobic capacity at very hard effort; and Zone 5 (90–100%) for maximum effort and peak performance. Each zone serves different training purposes and physiological adaptations. Most training should occur in Zones 2 and 3 for sustainable fitness improvements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does age affect my maximum heart rate calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Maximum heart rate generally decreases with age at approximately 1 beat per year after age 20, calculated using the formula: 220 minus your age. A 30-year-old typically has a max heart rate around 190 bpm, while a 50-year-old averages 170 bpm. However, individual variation exists based on genetics and fitness level, so this formula serves as an estimate rather than a precise measurement.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why should I use heart rate zones for my training program?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Heart rate zones help optimize training by ensuring you're working at the correct intensity for your specific fitness goals, whether building endurance, improving speed, or enhancing recovery. Training without zones often results in spending too much time at moderate intensities rather than alternating between high and low intensity as optimal training protocols recommend. Using zones provides objective feedback and prevents overtraining while maximizing physiological adaptations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a normal resting heart rate by age and fitness level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For sedentary adults, resting heart rate typically ranges from 70–100 bpm across all age groups, while trained athletes often maintain rates between 40–60 bpm. A resting heart rate below 60 bpm generally indicates good cardiovascular fitness, while rates consistently above 80 bpm may suggest the need for increased cardiovascular training. Children ages 6–15 typically have resting rates between 70–100 bpm due to their naturally faster metabolism.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator if I take beta-blockers or other heart rate-affecting medications?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Beta-blockers and certain medications lower resting heart rate and maximum heart rate, making the Karvonen calculation less accurate for determining training zones. If you take such medications, consult your physician or cardiologist to determine appropriate heart rate zones tailored to your specific physiology. You may need to adjust calculated zones downward or use perceived exertion ratings as supplementary guidance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my heart rate zones?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate your heart rate zones every 4–8 weeks if you're actively training, as improved fitness increases your maximum heart rate capacity and may lower your resting heart rate. Significant changes in fitness level, age, or resting heart rate warrant immediate recalculation to ensure training zones remain accurate. Athletes in structured training programs should reassess every 6–12 weeks to track progress.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the relationship between heart rate zones and VO2 max training?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Zone 4 and Zone 5 training primarily builds VO2 max, which is your maximum oxygen uptake capacity measured in milliliters of oxygen per kilogram of body weight per minute. Training in these higher zones stimulates the cardiovascular and respiratory systems to improve oxygen utilization efficiency. Most effective VO2 max improvement occurs with 1–2 sessions weekly in Zones 4–5, combined with base-building work in Zones 1–3.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rate" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Heart Association — Target Heart Rate and Estimated Maximum Heart Rate</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines from the American Heart Association on calculating and using target heart rate zones for exercise training and cardiovascular health.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/books/NBK470260/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institutes of Health — Exercise Physiology and Heart Rate Response</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed medical literature explaining the physiological basis for heart rate zones and how the cardiovascular system responds to different exercise intensities.</p>
          </li>
          <li>
            <a href="https://health.clevelandclinic.org/resting-heart-rate/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cleveland Clinic — Resting Heart Rate and Cardiovascular Fitness</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Healthcare provider resource explaining what resting heart rate indicates about fitness level, health status, and how to measure it accurately.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/exercise-intensity/art-20046887" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic — Exercise Intensity and Training Heart Rate Zones</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Medical guidance on determining appropriate exercise intensity levels, using heart rate zones, and structuring training programs for different fitness goals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Heart Rate Zones (Karvonen/percentages)"
      description="Calculate your training heart rate zones. Use the Karvonen method to find the optimal intensity for fat loss or cardio improvement."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "Target HR = ((MaxHR − RestingHR) × %Intensity) + RestingHR",
        variables: [
          { symbol: "Target HR", description: "Target heart rate for training (bpm)" },
          { symbol: "MaxHR", description: "Maximum heart rate estimated as 220 − age (bpm)" },
          { symbol: "RestingHR", description: "Resting heart rate measured at rest (bpm)" },
          { symbol: "%Intensity", description: "Desired exercise intensity as a decimal (e.g., 0.7 for 70%)" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 35-year-old individual with a resting heart rate of 60 bpm wants to find their heart rate zones for training.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate MaxHR: 220 − 35 = 185 bpm.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate Zone 3 (Moderate) lower bound at 70% intensity: ((185 − 60) × 0.7) + 60 = 146.5 bpm.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate Zone 3 upper bound at 80% intensity: ((185 − 60) × 0.8) + 60 = 158 bpm.",
          },
          {
            label: "Step 4",
            explanation:
              "Therefore, Zone 3 heart rate range is approximately 147 to 158 bpm.",
          },
        ],
        result:
          "This individual should aim to keep their heart rate between 147 and 158 bpm during moderate-intensity training.",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "💧",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "🥗",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Heart Rate Zones (Karvonen/percentages)?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}