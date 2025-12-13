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
      question: "What is the Karvonen method for calculating heart rate zones?",
      answer:
        "The Karvonen method calculates training heart rate zones by factoring in your resting heart rate, which provides a more personalized and accurate target heart rate range compared to methods that only use maximum heart rate. It uses the formula: Target HR = ((MaxHR − RestingHR) × %Intensity) + RestingHR, where MaxHR is typically estimated as 220 minus your age. This method helps optimize training intensity for cardiovascular benefits and fat burning.",
    },
    {
      question: "How do I interpret the different heart rate zones?",
      answer:
        "Heart rate zones represent different exercise intensities. Zone 1 (50-60%) is very light activity, ideal for warm-ups and recovery. Zone 2 (60-70%) improves basic endurance and fat metabolism. Zone 3 (70-80%) enhances aerobic fitness and cardiovascular strength. Zone 4 (80-90%) is high-intensity training that improves speed and performance. Zone 5 (90-100%) is maximum effort, used for short bursts and peak performance training. Training in the right zone helps you meet specific fitness goals effectively.",
    },
    {
      question: "Are there limitations to using the Karvonen method?",
      answer:
        "Yes, the Karvonen method relies on an estimated maximum heart rate (220 - age), which can vary significantly between individuals. Factors like genetics, fitness level, medications, and health conditions can affect your actual max heart rate. Additionally, resting heart rate should be measured accurately, ideally in the morning before getting out of bed. For clinical or elite athlete use, more precise testing methods like a VO2 max test or lactate threshold test are recommended.",
    },
    {
      question: "Can I use this calculator if I have a heart condition or take medications?",
      answer:
        "If you have a heart condition or take medications that affect heart rate (e.g., beta blockers), the Karvonen method and this calculator may not provide accurate or safe target zones. Always consult with a healthcare professional before starting or modifying an exercise program. Personalized assessment and monitoring are essential for safe cardiovascular training in these cases.",
    },
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
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Heart Rate Zones (Karvonen/percentages)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Heart rate zones are specific ranges of heartbeats per minute that correspond to
          different exercise intensities. The Karvonen method is a widely used formula that
          personalizes these zones by incorporating your resting heart rate, making it more
          accurate than methods relying solely on maximum heart rate. This approach helps
          individuals train more effectively by targeting specific cardiovascular benefits,
          such as fat burning, endurance, or peak performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Karvonen formula calculates your target heart rate for exercise intensity as:
          Target HR = ((MaxHR − RestingHR) × %Intensity) + RestingHR. Here, MaxHR is typically
          estimated as 220 minus your age, and %Intensity represents the desired effort level.
          By factoring in resting heart rate, the method accounts for individual fitness levels,
          providing a tailored training zone that can improve workout efficiency and safety.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Training within these zones allows you to optimize your cardiovascular health and
          fitness goals. Lower zones focus on fat metabolism and recovery, while higher zones
          improve aerobic capacity, speed, and power. Understanding and using heart rate zones
          can prevent overtraining and reduce injury risk by ensuring workouts are performed at
          appropriate intensities.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator uses the Karvonen method to provide you with five heart rate zones,
          each representing a range of intensities from very light to maximum effort. It is
          designed for general fitness purposes and should be used alongside professional advice
          if you have specific health conditions or athletic goals.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires just two inputs: your age and
          resting heart rate. These inputs allow the calculator to estimate your maximum heart
          rate and personalize your heart rate zones using the Karvonen formula. Follow these
          steps to get your training zones:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Age:</strong> Enter your current age in years. This is used to estimate your
            maximum heart rate using the formula 220 minus age.
          </li>
          <li>
            <strong>Resting Heart Rate:</strong> Input your resting heart rate in beats per minute
            (bpm). This should ideally be measured first thing in the morning before getting out
            of bed for accuracy.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these values, click the "Calculate" button to see your personalized heart
          rate zones. Each zone will display a range of heartbeats per minute corresponding to
          different exercise intensities, helping you tailor your workouts to your fitness goals.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Trusted References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Heart Association - Target Heart Rates
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guide on heart rate zones and their importance in fitness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/physicalactivity/basics/measuring/heartrate.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Centers for Disease Control and Prevention (CDC) - Measuring Heart Rate
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official resource on how to measure heart rate and use it for physical activity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5968887/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. NCBI - Validity of the Karvonen Formula for Heart Rate Training
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Peer-reviewed study evaluating the accuracy of the Karvonen method.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.mayoclinic.org/healthy-lifestyle/fitness/expert-answers/heart-rate/faq-20057979"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Mayo Clinic - Heart Rate: What’s Normal?
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Trusted medical information on heart rate norms and factors affecting heart rate.
            </p>
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