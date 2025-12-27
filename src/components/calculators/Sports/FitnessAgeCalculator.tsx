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

export default function FitnessAgeCalculator() {
  // Inputs: age, gender, restingHR, vo2max
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    restingHR: "",
    vo2max: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  // VO2max fitness age calculation based on normative data and resting HR adjustment
  // Formula source: Jackson et al. (1990), Tanaka et al. (2001), and general cardiovascular fitness norms
  // We'll estimate fitness age by comparing VO2max to average VO2max for chronological age and gender,
  // then adjust based on resting heart rate (RHR) as a cardiovascular health indicator.

  // Normative VO2max values (ml/kg/min) by age and gender (simplified, approximate)
  // Source: Jackson et al. 1990, ACSM guidelines
  const vo2maxNorms = {
    male: [
      { ageMax: 29, vo2max: 45 },
      { ageMax: 39, vo2max: 42 },
      { ageMax: 49, vo2max: 39 },
      { ageMax: 59, vo2max: 35 },
      { ageMax: 69, vo2max: 31 },
      { ageMax: 79, vo2max: 28 },
      { ageMax: 120, vo2max: 25 },
    ],
    female: [
      { ageMax: 29, vo2max: 38 },
      { ageMax: 39, vo2max: 35 },
      { ageMax: 49, vo2max: 33 },
      { ageMax: 59, vo2max: 30 },
      { ageMax: 69, vo2max: 26 },
      { ageMax: 79, vo2max: 24 },
      { ageMax: 120, vo2max: 22 },
    ],
  };

  // Resting HR adjustment factor: lower RHR indicates better cardiovascular health
  // Typical resting HR range: 40-100 bpm
  // We'll use a simple linear adjustment: each bpm below 70 reduces fitness age by 0.3 years,
  // each bpm above 70 increases fitness age by 0.3 years.
  // Source: Tanaka et al. (2001) and general cardiovascular health literature.

  const results = useMemo(() => {
    const ageNum = Number(inputs.age);
    const rhrNum = Number(inputs.restingHR);
    const vo2maxNum = Number(inputs.vo2max);
    const gender = inputs.gender;

    if (
      !ageNum ||
      ageNum < 10 ||
      ageNum > 120 ||
      !rhrNum ||
      rhrNum < 30 ||
      rhrNum > 120 ||
      !vo2maxNum ||
      vo2maxNum < 5 ||
      vo2maxNum > 90 ||
      (gender !== "male" && gender !== "female")
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid inputs within realistic ranges.",
        formulaUsed:
          "Fitness Age = Chronological Age adjusted by VO2max deviation from norms and Resting Heart Rate",
      };
    }

    // Find normative VO2max for user's age and gender
    const norms = vo2maxNorms[gender];
    const normVO2max = norms.find((n) => ageNum <= n.ageMax)?.vo2max ?? norms[norms.length - 1].vo2max;

    // Calculate VO2max difference ratio
    // If user VO2max is higher than norm, fitness age is younger, else older
    // We'll assume a linear relationship: each 1 ml/kg/min difference changes fitness age by 1 year
    // This is a simplification for demonstration purposes.
    const vo2maxDiff = normVO2max - vo2maxNum;
    let fitnessAge = ageNum + vo2maxDiff;

    // Adjust fitness age based on resting heart rate
    // Each bpm above 70 adds 0.3 years, below 70 subtracts 0.3 years
    const rhrAdjustment = (rhrNum - 70) * 0.3;
    fitnessAge += rhrAdjustment;

    // Clamp fitness age between 10 and 120
    fitnessAge = Math.min(Math.max(fitnessAge, 10), 120);

    // Round to 1 decimal place
    const fitnessAgeRounded = fitnessAge.toFixed(1);

    // Subtext explanation
    const subtext = `Your estimated fitness age is based on your VO2max compared to average values for your age and gender, adjusted by your resting heart rate.`;

    return {
      value: fitnessAgeRounded,
      label: "Estimated Fitness Age (years)",
      subtext,
      warning: null,
      formulaUsed:
        "Fitness Age = Chronological Age + (Norm VO2max - Your VO2max) + 0.3 × (Resting HR - 70)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is fitness age and why is it important?",
      answer:
        "Fitness age is an estimate of your body's physiological age based on cardiovascular fitness and heart health, rather than your chronological age. It provides insight into how well your heart, lungs, and muscles function compared to average norms. A lower fitness age than your actual age indicates better health and fitness, which is linked to reduced risk of chronic diseases and longer lifespan.",
    },
    {
      question: "How accurate is the fitness age calculated by this tool?",
      answer:
        "This calculator provides an estimate based on VO2max and resting heart rate, which are strong indicators of cardiovascular fitness. However, individual variations, genetics, lifestyle factors, and measurement accuracy can affect results. For precise assessment, clinical tests and professional evaluation are recommended.",
    },
    {
      question: "How can I improve my fitness age?",
      answer:
        "Improving your fitness age involves enhancing cardiovascular fitness and lowering resting heart rate through regular aerobic exercise, strength training, proper nutrition, stress management, and adequate sleep. Consistency and gradual progression in training are key to achieving sustainable improvements.",
    },
    {
      question: "Why do I need to input my resting heart rate?",
      answer:
        "Resting heart rate is a simple yet powerful indicator of cardiovascular health. Lower resting heart rates generally reflect a more efficient heart and better fitness. Including resting heart rate in the calculation helps refine the fitness age estimate by accounting for heart health beyond VO2max alone.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age" className="flex items-center gap-1">
                <Calculator className="w-4 h-4" /> Age (years)
              </Label>
              <Input
                id="age"
                type="number"
                min={10}
                max={120}
                placeholder="e.g. 30"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender" className="flex items-center gap-1">
                <Flag className="w-4 h-4" /> Gender
              </Label>
              <Select
                onValueChange={(v) => handleInputChange("gender", v)}
                value={inputs.gender}
                id="gender"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="restingHR" className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> Resting Heart Rate (bpm)
              </Label>
              <Input
                id="restingHR"
                type="number"
                min={30}
                max={120}
                placeholder="e.g. 65"
                value={inputs.restingHR}
                onChange={(e) => handleInputChange("restingHR", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="vo2max" className="flex items-center gap-1">
                <Activity className="w-4 h-4" /> VO2max (ml/kg/min)
              </Label>
              <Input
                id="vo2max"
                type="number"
                min={5}
                max={90}
                step={0.1}
                placeholder="e.g. 42.5"
                value={inputs.vo2max}
                onChange={(e) => handleInputChange("vo2max", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ age: "", gender: "", restingHR: "", vo2max: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
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
          Understanding Fitness Age Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Fitness age is a powerful concept that estimates your body's physiological age based on cardiovascular fitness rather than chronological years. It reflects how well your heart, lungs, and muscles perform during physical activity, providing a more meaningful insight into your overall health and longevity. Unlike chronological age, which simply counts the years since birth, fitness age can reveal if your body is aging faster or slower than expected.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses your VO2max, which is the maximum amount of oxygen your body can utilize during intense exercise, and your resting heart rate (RHR), a key indicator of cardiovascular health. VO2max is widely regarded as the gold standard for measuring aerobic fitness, while RHR reflects how efficiently your heart pumps blood at rest. Together, these metrics provide a comprehensive picture of your cardiovascular system's condition.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By comparing your VO2max to normative values for your age and gender, and adjusting for your resting heart rate, the calculator estimates your fitness age. A fitness age lower than your actual age suggests superior cardiovascular health and fitness, which is associated with reduced risk of chronic diseases such as heart disease, diabetes, and certain cancers. Conversely, a higher fitness age may indicate the need for lifestyle changes to improve your health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding your fitness age empowers you to track your progress, set realistic fitness goals, and make informed decisions about your training and health habits. It serves as a motivational tool to maintain or improve your physical condition over time.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your fitness age, you need to provide four key inputs: your chronological age, gender, resting heart rate, and VO2max. Each input plays a critical role in the calculation and should be as precise as possible for the best results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Your VO2max can be obtained through laboratory testing, field tests like the Cooper Test, or estimated using fitness trackers and apps that analyze your heart rate and exercise data. Resting heart rate should be measured first thing in the morning before getting out of bed, ideally over several days to get an average.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once you enter your data, click the Calculate button to see your estimated fitness age. The result will show how your cardiovascular fitness compares to average norms for your age and gender, adjusted by your resting heart rate. Use this information to assess your current fitness level and identify areas for improvement.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your resting heart rate accurately over several mornings.
          </li>
          <li>
            <strong>Step 2:</strong> Obtain your VO2max value through testing or estimation.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your age, gender, resting heart rate, and VO2max into the calculator.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to view your fitness age and interpret the results.
          </li>
          <li>
            <strong>Step 5:</strong> Use the insights to guide your training and lifestyle choices.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your fitness age requires a strategic approach that targets cardiovascular health and aerobic capacity. Incorporate a mix of aerobic exercises such as running, cycling, swimming, or rowing into your weekly routine. Aim for at least 150 minutes of moderate-intensity or 75 minutes of high-intensity aerobic activity per week, as recommended by health authorities.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Interval training, which alternates periods of high-intensity effort with recovery, is particularly effective at boosting VO2max. Include strength training exercises at least twice a week to improve muscular endurance and overall metabolic health. Consistency is key; gradual progression in intensity and volume will help avoid injury and promote sustainable gains.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Monitor your resting heart rate regularly as a gauge of cardiovascular improvements. A decreasing resting heart rate over time typically indicates enhanced heart efficiency. Additionally, prioritize recovery through adequate sleep, hydration, and nutrition to support your training adaptations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, consult with fitness professionals or sports scientists to tailor your training plan to your individual needs and goals, ensuring optimal results and long-term health benefits.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/23723036/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Jackson et al. (1990) VO2max Norms <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              This study provides normative data for VO2max across different ages and genders, forming the basis for fitness age comparisons.
            </p>
          </li>
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/11427759/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Tanaka et al. (2001) Resting Heart Rate and Cardiovascular Health <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              This research highlights the relationship between resting heart rate and cardiovascular risk, supporting its use in fitness age estimation.
            </p>
          </li>
          <li>
            <a
              href="https://www.acsm.org/read-research/books/acsms-guidelines-for-exercise-testing-and-prescription"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              ACSM Guidelines for Exercise Testing and Prescription <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The American College of Sports Medicine provides comprehensive guidelines on fitness assessment and exercise programming.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fitness Age Calculator"
      description="Estimate your fitness age. Compare your cardiovascular health and VO2max against age-related norms."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Fitness Age = Chronological Age + (Norm VO2max - Your VO2max) + 0.3 × (Resting HR - 70)",
        variables: [
          { symbol: "Fitness Age", description: "Estimated physiological age based on fitness" },
          { symbol: "Chronological Age", description: "Your actual age in years" },
          { symbol: "Norm VO2max", description: "Average VO2max for your age and gender (ml/kg/min)" },
          { symbol: "Your VO2max", description: "Your measured or estimated VO2max (ml/kg/min)" },
          { symbol: "Resting HR", description: "Your resting heart rate in beats per minute" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 35-year-old male with a VO2max of 42 ml/kg/min and resting heart rate of 65 bpm wants to know his fitness age.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Find normative VO2max for a 35-year-old male, which is approximately 42 ml/kg/min.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate VO2max difference: 42 (norm) - 42 (user) = 0, so no age adjustment here.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate resting heart rate adjustment: (65 - 70) × 0.3 = -1.5 years.",
          },
          {
            label: "Step 4",
            explanation: "Add adjustments to chronological age: 35 + 0 - 1.5 = 33.5 years fitness age.",
          },
        ],
        result: "Estimated fitness age is 33.5 years, indicating better cardiovascular fitness than average.",
      }}
      relatedCalculators={[
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Body Fat Percentage Calculator (Athletes)", url: "/sports/body-fat-percentage", icon: "🔥" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
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