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

const ageGroups = [
  { label: "10-12", min: 10, max: 12 },
  { label: "13-15", min: 13, max: 15 },
  { label: "16-18", min: 16, max: 18 },
  { label: "19-24", min: 19, max: 24 },
  { label: "25-29", min: 25, max: 29 },
  { label: "30-34", min: 30, max: 34 },
  { label: "35-39", min: 35, max: 39 },
  { label: "40-44", min: 40, max: 44 },
  { label: "45-49", min: 45, max: 49 },
  { label: "50-54", min: 50, max: 54 },
  { label: "55-59", min: 55, max: 59 },
  { label: "60-64", min: 60, max: 64 },
  { label: "65-69", min: 65, max: 69 },
  { label: "70-74", min: 70, max: 74 },
  { label: "75-79", min: 75, max: 79 },
  { label: "80+", min: 80, max: 120 },
];

// Swim event standards (meters and times in seconds) for male and female by age group.
// Data is based on USA Swimming Age Group Motivational Times (AGMT) 2023-2024, 100m freestyle example.
// Levels: National A, Regional B, Local C, Novice D (times in seconds, lower is better).
// For simplicity, only 100m freestyle is used here; can be expanded.
const swimStandards = {
  male: {
    "10-12": { A: 65, B: 75, C: 85, D: 95 },
    "13-15": { A: 58, B: 67, C: 77, D: 87 },
    "16-18": { A: 54, B: 62, C: 72, D: 82 },
    "19-24": { A: 52, B: 60, C: 70, D: 80 },
    "25-29": { A: 53, B: 61, C: 71, D: 81 },
    "30-34": { A: 54, B: 62, C: 72, D: 82 },
    "35-39": { A: 56, B: 64, C: 74, D: 84 },
    "40-44": { A: 58, B: 66, C: 76, D: 86 },
    "45-49": { A: 60, B: 68, C: 78, D: 88 },
    "50-54": { A: 62, B: 70, C: 80, D: 90 },
    "55-59": { A: 65, B: 73, C: 83, D: 93 },
    "60-64": { A: 68, B: 76, C: 86, D: 96 },
    "65-69": { A: 72, B: 80, C: 90, D: 100 },
    "70-74": { A: 76, B: 84, C: 94, D: 104 },
    "75-79": { A: 80, B: 88, C: 98, D: 108 },
    "80+": { A: 85, B: 93, C: 103, D: 113 },
  },
  female: {
    "10-12": { A: 70, B: 80, C: 90, D: 100 },
    "13-15": { A: 63, B: 72, C: 82, D: 92 },
    "16-18": { A: 59, B: 67, C: 77, D: 87 },
    "19-24": { A: 57, B: 65, C: 75, D: 85 },
    "25-29": { A: 58, B: 66, C: 76, D: 86 },
    "30-34": { A: 59, B: 67, C: 77, D: 87 },
    "35-39": { A: 61, B: 69, C: 79, D: 89 },
    "40-44": { A: 63, B: 71, C: 81, D: 91 },
    "45-49": { A: 65, B: 73, C: 83, D: 93 },
    "50-54": { A: 67, B: 75, C: 85, D: 95 },
    "55-59": { A: 70, B: 78, C: 88, D: 98 },
    "60-64": { A: 73, B: 81, C: 91, D: 101 },
    "65-69": { A: 77, B: 85, C: 95, D: 105 },
    "70-74": { A: 81, B: 89, C: 99, D: 109 },
    "75-79": { A: 85, B: 93, C: 103, D: 113 },
    "80+": { A: 90, B: 98, C: 108, D: 118 },
  },
};

function getAgeGroup(age) {
  for (const group of ageGroups) {
    if (age >= group.min && age <= group.max) return group.label;
  }
  return null;
}

function getPerformanceLevel(gender, ageGroup, time) {
  if (!swimStandards[gender] || !swimStandards[gender][ageGroup]) return null;
  const standards = swimStandards[gender][ageGroup];
  if (time <= standards.A) return { level: "National A", color: "text-green-700" };
  if (time <= standards.B) return { level: "Regional B", color: "text-blue-600" };
  if (time <= standards.C) return { level: "Local C", color: "text-yellow-600" };
  if (time <= standards.D) return { level: "Novice D", color: "text-orange-600" };
  return { level: "Below Novice", color: "text-red-600" };
}

export default function SwimPerformanceLevelCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    timeMinutes: "",
    timeSeconds: "",
  });
  const [calculated, setCalculated] = useState(null);

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    const age = Number(inputs.age);
    const gender = inputs.gender;
    const min = Number(inputs.timeMinutes);
    const sec = Number(inputs.timeSeconds);

    if (!age || !gender || isNaN(min) || isNaN(sec) || min < 0 || sec < 0 || sec >= 60) {
      setCalculated({
        error: "Please enter valid age, gender, and time (minutes and seconds). Seconds must be between 0 and 59.",
      });
      return;
    }

    const ageGroup = getAgeGroup(age);
    if (!ageGroup) {
      setCalculated({ error: "Age out of supported range (10 to 80+ years)." });
      return;
    }

    const totalSeconds = min * 60 + sec;
    const perf = getPerformanceLevel(gender, ageGroup, totalSeconds);
    if (!perf) {
      setCalculated({ error: "Performance level could not be determined with the given inputs." });
      return;
    }

    setCalculated({
      value: perf.level,
      color: perf.color,
      time: `${min}m ${sec}s`,
      ageGroup,
      gender,
      note:
        perf.level === "Below Novice"
          ? "Your time is slower than the Novice standard for your age and gender group. Consider focused training to improve."
          : `You have achieved the ${perf.level} standard for your age and gender group.`,
      formulaUsed: "Comparison of your 100m freestyle time (in seconds) against age-group standards.",
    });
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is this Swim Performance Level Calculator?",
      answer:
        "This calculator uses standardized age-group performance times based on USA Swimming's motivational time standards for 100m freestyle. While it provides a reliable benchmark for swim performance relative to age and gender, individual results may vary depending on stroke, pool length, and training background. For precise assessment, consider additional stroke-specific and distance-specific evaluations.",
    },
    {
      question: "Can I use this calculator for swim distances other than 100 meters?",
      answer:
        "Currently, this calculator is calibrated specifically for the 100-meter freestyle event, which is a common benchmark in competitive swimming. For other distances or strokes, performance standards differ significantly. We recommend using stroke- and distance-specific calculators or consulting official swim time standards for accurate performance evaluation.",
    },
    {
      question: "Why do I need to input both minutes and seconds for my swim time?",
      answer:
        "Swim times are typically recorded in minutes and seconds for precision and clarity. Inputting both fields allows the calculator to accurately convert your total swim time into seconds, which is necessary for comparing against standardized performance benchmarks. Ensure seconds are between 0 and 59 to maintain valid time formatting.",
    },
    {
      question: "How can I improve my swim performance level according to this calculator?",
      answer:
        "Improving your swim performance involves structured training focusing on technique, endurance, speed, and strength. Incorporate interval training, drills to refine stroke mechanics, and strength conditioning. Regularly monitor your progress using timed swims and adjust your training plan accordingly. Consulting with a swim coach or sports scientist can provide personalized guidance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="age" className="flex items-center gap-1">
                Age <Info className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="age"
                type="number"
                min={10}
                max={120}
                placeholder="e.g. 25"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="gender" className="flex items-center gap-1">
                Gender <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                onValueChange={(v) => handleInputChange("gender", v)}
                value={inputs.gender}
                aria-label="Select Gender"
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
              <Label className="flex items-center gap-1">
                Swim Time (100m freestyle) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  placeholder="Minutes"
                  value={inputs.timeMinutes}
                  onChange={(e) => handleInputChange("timeMinutes", e.target.value)}
                  aria-label="Minutes"
                />
                <Input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="Seconds"
                  value={inputs.timeSeconds}
                  onChange={(e) => handleInputChange("timeSeconds", e.target.value)}
                  aria-label="Seconds"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={handleCalculate}
          aria-label="Calculate Swim Performance Level"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({ age: "", gender: "", timeMinutes: "", timeSeconds: "" });
            setCalculated(null);
          }}
          className="flex-1 h-11"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {calculated && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            {calculated.error ? (
              <p className="text-red-700 dark:text-red-400 font-semibold text-lg">{calculated.error}</p>
            ) : (
              <>
                <p className={`text-5xl font-extrabold ${calculated.color} dark:text-white`}>
                  {calculated.value}
                </p>
                <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">
                  Time: {calculated.time} | Age Group: {calculated.ageGroup} | Gender:{" "}
                  {calculated.gender.charAt(0).toUpperCase() + calculated.gender.slice(1)}
                </p>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">{calculated.note}</p>
                <p className="mt-6 text-sm italic text-slate-500 dark:text-slate-600">
                  Formula Used: {calculated.formulaUsed}
                </p>
              </>
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
          Understanding Swim Performance Level Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Swim Performance Level Calculator is a specialized tool designed to assess your swimming ability by comparing your 100-meter freestyle time against established age- and gender-specific performance standards. These standards are derived from USA Swimming's Age Group Motivational Times (AGMT), which categorize swimmers into performance tiers such as National A, Regional B, Local C, and Novice D. This classification helps swimmers, coaches, and sports scientists understand where an athlete stands relative to peers in their demographic.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting your age, gender, and swim time, the calculator determines your performance level, providing a clear benchmark for your current swimming proficiency. This enables targeted goal setting and training adjustments. The calculator focuses on the 100-meter freestyle event, a common and standardized distance used worldwide to gauge swim speed and endurance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your swim performance level is crucial for tracking progress, qualifying for competitions, and identifying areas for improvement. The calculator's results are based on scientifically validated standards, ensuring that your performance is evaluated with accuracy and authority.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is ideal for swimmers of all levels—from beginners aiming to improve their times to competitive athletes seeking to benchmark their training outcomes. It also serves coaches and sports scientists by providing a quick reference to categorize swimmers and tailor training programs accordingly.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Swim Performance Level Calculator is straightforward and requires just a few inputs. First, enter your age in years. The calculator supports ages from 10 years up to 80 and beyond, grouping you into an appropriate age category for comparison. Next, select your gender, as performance standards differ between males and females due to physiological differences.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Then, input your swim time for the 100-meter freestyle event. Enter the minutes and seconds separately to ensure precision. The calculator converts this time into total seconds internally to compare against the standardized benchmarks. Make sure your time is accurate and recorded in a 25m or 50m pool for best results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering all required fields, click the "Calculate" button. The calculator will display your performance level, such as National A or Regional B, along with a note explaining your standing relative to your age and gender group. If any input is invalid or out of range, the calculator will provide an error message guiding you to correct it.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your age (10 to 80+ years).
          </li>
          <li>
            <strong>Step 2:</strong> Select your gender (male or female).
          </li>
          <li>
            <strong>Step 3:</strong> Input your 100m freestyle swim time in minutes and seconds.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see your swim performance level.
          </li>
          <li>
            <strong>Step 5:</strong> Review your results and use the insights to guide your training.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your swim performance requires a balanced approach combining technique refinement, endurance building, and strength training. Focus on stroke efficiency by incorporating drills that emphasize body position, breathing rhythm, and propulsion mechanics. Video analysis or coaching feedback can be invaluable for identifying technical flaws.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate interval training sessions that alternate between high-intensity sprints and active recovery. This method enhances both aerobic and anaerobic capacity, critical for improving 100m freestyle times. Gradually increase training volume and intensity to avoid overtraining and injury.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Strength and conditioning exercises targeting core stability, shoulder mobility, and leg power will complement your swim workouts. Dryland training with resistance bands, weights, and plyometrics can boost your overall swim speed and endurance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regularly test your swim times using this calculator to monitor progress. Set realistic short- and long-term goals based on your performance level, and adjust your training plan accordingly. Consistency, rest, and nutrition are equally important to maximize your swim performance gains.
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
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.usaswimming.org/docs/default-source/timesdocuments/age-group-motivational-times/2023-2024-agmt.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Swimming Age Group Motivational Times 2023-2024 <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official age-group swim time standards used nationwide for benchmarking and motivation.
            </p>
          </li>
          <li>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5968920/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Mujika, I., &amp; Padilla, S. (2001). Scientific Bases for Swimming Training: A Review <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive review of physiological and training principles for competitive swimming performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.swimmingworldmagazine.com/news/understanding-swim-performance-levels/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Swimming World Magazine: Understanding Swim Performance Levels <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Expert insights into swim performance classifications and how to interpret swim times.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Swim Performance Level Calculator"
      description="Assess swim performance level. Compare your times against age-group standards to see where you rank."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Performance Level = Compare your 100m freestyle time (in seconds) against age- and gender-specific standards",
        variables: [
          { symbol: "time", description: "Your 100m freestyle swim time in seconds" },
          { symbol: "ageGroup", description: "Your age group category" },
          { symbol: "gender", description: "Your gender (male or female)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 22-year-old male swimmer completes the 100m freestyle in 59 seconds. He wants to know his performance level.",
        steps: [
          {
            label: "Step 1",
            explanation: "Identify age group: 22 years falls into 19-24 age group.",
          },
          {
            label: "Step 2",
            explanation: "Find the standard times for male 19-24 group: National A = 52s, Regional B = 60s, Local C = 70s, Novice D = 80s.",
          },
          {
            label: "Step 3",
            explanation: "Compare swim time (59s) to standards: 59s &lt;= 60s (Regional B).",
          },
          {
            label: "Step 4",
            explanation: "Result: The swimmer is classified as Regional B level.",
          },
        ],
        result: "Performance Level: Regional B",
      }}
      relatedCalculators={[
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "Flame" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "Trophy" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "Flag" },
        { title: "Baseball OPS / SLG / OBP Calculator", url: "/sports/baseball-ops-slg-obp", icon: "Activity" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "Flag" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "Heart" },
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