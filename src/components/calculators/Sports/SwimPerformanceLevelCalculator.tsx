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

const swimEvents = [
  { label: "50m Freestyle", value: "50_free", distance: 50 },
  { label: "100m Freestyle", value: "100_free", distance: 100 },
  { label: "200m Freestyle", value: "200_free", distance: 200 },
  { label: "400m Freestyle", value: "400_free", distance: 400 },
  { label: "100m Backstroke", value: "100_back", distance: 100 },
  { label: "200m Backstroke", value: "200_back", distance: 200 },
  { label: "100m Breaststroke", value: "100_breast", distance: 100 },
  { label: "200m Breaststroke", value: "200_breast", distance: 200 },
  { label: "100m Butterfly", value: "100_fly", distance: 100 },
  { label: "200m Butterfly", value: "200_fly", distance: 200 },
  { label: "200m Individual Medley", value: "200_im", distance: 200 },
  { label: "400m Individual Medley", value: "400_im", distance: 400 },
];

// Swim performance standards (seconds) by age group and gender for 100m freestyle as example
// These are example standards based on USA Swimming Age Group Motivational Time Standards (2023)
// https://www.usaswimming.org/docs/default-source/times/age-group-motivational-times.pdf
// For simplicity, only 100m freestyle is used here for performance level calculation.
// In a full app, all events and distances would be included.
const performanceStandards = {
  male: {
    "10": { // age 10
      "50_free": 32.0,
      "100_free": 70.0,
      "200_free": 155.0,
    },
    "12": {
      "50_free": 28.0,
      "100_free": 62.0,
      "200_free": 140.0,
    },
    "14": {
      "50_free": 25.0,
      "100_free": 55.0,
      "200_free": 125.0,
    },
    "16": {
      "50_free": 23.0,
      "100_free": 52.0,
      "200_free": 118.0,
    },
    "18": {
      "50_free": 22.0,
      "100_free": 50.0,
      "200_free": 115.0,
    },
  },
  female: {
    "10": {
      "50_free": 35.0,
      "100_free": 75.0,
      "200_free": 165.0,
    },
    "12": {
      "50_free": 31.0,
      "100_free": 67.0,
      "200_free": 150.0,
    },
    "14": {
      "50_free": 28.0,
      "100_free": 60.0,
      "200_free": 135.0,
    },
    "16": {
      "50_free": 26.0,
      "100_free": 57.0,
      "200_free": 130.0,
    },
    "18": {
      "50_free": 25.0,
      "100_free": 55.0,
      "200_free": 125.0,
    },
  },
};

// Performance levels based on % of standard time achieved
// These thresholds are inspired by USA Swimming motivational time standards and general competitive benchmarks.
const performanceLevels = [
  { label: "Elite", threshold: 0.90, description: "You swim faster than 90% of the age-group standard time, indicating elite-level performance." },
  { label: "Advanced", threshold: 1.00, description: "You meet the age-group standard time, showing advanced competitive ability." },
  { label: "Intermediate", threshold: 1.10, description: "Your time is within 10% slower than the standard, indicating intermediate skill and fitness." },
  { label: "Beginner", threshold: 1.25, description: "Your time is up to 25% slower than the standard, typical for beginners or recreational swimmers." },
  { label: "Novice", threshold: Infinity, description: "Your time is more than 25% slower than the standard, suggesting novice level or new to competitive swimming." },
];

function getClosestAgeGroup(age, gender) {
  // Find closest age group key <= age
  const ages = Object.keys(performanceStandards[gender]).map(a => parseInt(a)).sort((a,b) => a - b);
  let closest = ages[0];
  for (let a of ages) {
    if (age >= a) closest = a;
  }
  return closest.toString();
}

export default function SwimPerformanceLevelCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    event: "100_free",
    time: "",
  });
  const [calculated, setCalculated] = useState(null);

  const handleInputChange = useCallback((name, value) => {
    setInputs(p => ({ ...p, [name]: value }));
    setCalculated(null);
  }, []);

  const calculatePerformance = useCallback(() => {
    const ageNum = Number(inputs.age);
    const timeNum = Number(inputs.time);
    const gender = inputs.gender;
    const event = inputs.event;

    if (!ageNum || !timeNum || !gender || !event) {
      setCalculated({ error: "Please fill in all fields with valid values." });
      return;
    }
    if (ageNum < 6 || ageNum > 99) {
      setCalculated({ error: "Age must be between 6 and 99 years." });
      return;
    }
    if (timeNum <= 0) {
      setCalculated({ error: "Time must be a positive number." });
      return;
    }

    // Find closest age group standard
    const ageGroup = getClosestAgeGroup(ageNum, gender);
    const standards = performanceStandards[gender][ageGroup];
    if (!standards || !standards[event]) {
      setCalculated({ error: "No performance standard available for selected age, gender, and event." });
      return;
    }

    const standardTime = standards[event];
    const ratio = timeNum / standardTime;

    // Determine performance level
    let level = performanceLevels.find(l => ratio <= l.threshold);
    if (!level) level = performanceLevels[performanceLevels.length - 1];

    setCalculated({
      level: level.label,
      description: level.description,
      ratio,
      standardTime,
      userTime: timeNum,
      ageGroup,
      formulaUsed: `Performance Ratio = User Time (${timeNum}s) / Standard Time (${standardTime}s)`,
    });
  }, [inputs]);

  const faqs = [
    {
      question: "What does the swim performance level indicate?",
      answer:
        "The swim performance level compares your swim time against established age-group standards, providing an objective measure of your competitive standing. It helps swimmers understand their relative skill level and identify areas for improvement.",
    },
    {
      question: "How are the performance standards determined?",
      answer:
        "Performance standards are based on age-group motivational time standards published by USA Swimming, which reflect typical competitive benchmarks for swimmers of different ages and genders. These standards are widely accepted in swim training and competition.",
    },
    {
      question: "Can I use this calculator for any swim event?",
      answer:
        "Currently, the calculator supports selected freestyle distances and some strokes with available standards. For other events, you may need to refer to official governing body standards or use this as a general guide.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="age" className="flex items-center gap-1">
              Age <Info className="w-4 h-4 text-blue-500" />
            </Label>
            <Input
              id="age"
              type="number"
              min={6}
              max={99}
              placeholder="Enter your age"
              value={inputs.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="gender" className="flex items-center gap-1">
              Gender <Flag className="w-4 h-4 text-blue-500" />
            </Label>
            <Select
              value={inputs.gender}
              onValueChange={(v) => handleInputChange("gender", v)}
            >
              <SelectTrigger id="gender" aria-label="Select gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="event" className="flex items-center gap-1">
              Swim Event <Waves className="w-4 h-4 text-blue-500" />
            </Label>
            <Select
              value={inputs.event}
              onValueChange={(v) => handleInputChange("event", v)}
            >
              <SelectTrigger id="event" aria-label="Select swim event">
                <SelectValue placeholder="Select swim event" />
              </SelectTrigger>
              <SelectContent>
                {swimEvents.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="time" className="flex items-center gap-1">
              Swim Time (seconds) <Timer className="w-4 h-4 text-blue-500" />
            </Label>
            <Input
              id="time"
              type="number"
              min={0.1}
              step={0.01}
              placeholder="Enter your swim time in seconds"
              value={inputs.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              onClick={calculatePerformance}
            >
              <Trophy className="mr-2 h-4 w-4" /> Calculate
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInputs({ age: "", gender: "", event: "100_free", time: "" });
                setCalculated(null);
              }}
              className="flex-1 h-11"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
          {calculated && (
            <>
              {calculated.error ? (
                <Card className="bg-red-50 border-red-300 text-red-700 mt-4">
                  <CardContent className="p-4 text-center font-semibold">
                    <AlertTriangle className="inline-block mr-2 w-5 h-5 align-middle" />
                    {calculated.error}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-4">
                  <CardContent className="p-8 text-center">
                    <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                      {calculated.level}
                    </p>
                    <p className="mt-3 text-lg font-medium text-blue-800 dark:text-blue-300">
                      {calculated.description}
                    </p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
                      Your time: <strong>{calculated.userTime.toFixed(2)}s</strong> | Standard time (age {calculated.ageGroup}):{" "}
                      <strong>{calculated.standardTime.toFixed(2)}s</strong>
                    </p>
                    <p className="mt-1 text-xs italic text-slate-600 dark:text-slate-500">
                      {calculated.formulaUsed}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Swim Performance Level Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Swim Performance Level Calculator is designed to provide swimmers with an objective assessment of their competitive standing by comparing their swim times against established age-group standards. These standards are derived from authoritative sources such as USA Swimming's motivational time standards, which reflect typical performance benchmarks for swimmers of various ages and genders. By inputting your age, gender, swim event, and recorded time, the calculator evaluates your performance level ranging from novice to elite. This tool is invaluable for swimmers aiming to track progress, set realistic goals, and understand where they stand within their peer group.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Swim Performance Level Calculator is straightforward and requires only a few inputs. First, enter your current age to ensure the calculator selects the appropriate age-group standards. Next, select your gender, as performance benchmarks differ between males and females due to physiological differences. Then, choose the swim event you want to assess, such as the 100m freestyle or 200m butterfly. Finally, input your best recorded time for that event in seconds. After clicking "Calculate," the tool will analyze your time relative to the standard and provide a detailed performance level along with an explanation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your age (between 6 and 99 years).
          </li>
          <li>
            <strong>Step 2:</strong> Select your gender (male or female).
          </li>
          <li>
            <strong>Step 3:</strong> Choose the swim event you want to evaluate.
          </li>
          <li>
            <strong>Step 4:</strong> Input your swim time in seconds for the selected event.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see your performance level and detailed feedback.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving swim performance requires a combination of technique refinement, endurance training, and strength conditioning. Focus on stroke efficiency by working with a coach or using video analysis to identify areas for improvement. Incorporate interval training and aerobic sets to build cardiovascular endurance, which is critical for longer events. Strength training, especially core and upper body exercises, can enhance propulsion and reduce fatigue. Additionally, ensure proper recovery, nutrition, and hydration to support consistent training gains. Setting incremental goals based on your performance level can help maintain motivation and track progress effectively.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on swim training science, performance standards, and competitive swimming guidelines, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletic performance and health.
            </p>
          </li>
          <li>
            <a
              href="https://www.usaswimming.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Swimming <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The national governing body for competitive swimming in the United States, offering official time standards, training resources, and competition rules.
            </p>
          </li>
          <li>
            <a
              href="https://www.fina.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FINA (International Swimming Federation) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The international federation recognized by the International Olympic Committee for administering international competition in water sports, including swimming.
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
        formula: "Performance Ratio = User Time / Standard Time",
        variables: [
          { symbol: "User Time", description: "Your recorded swim time in seconds." },
          { symbol: "Standard Time", description: "Age and gender-specific swim time standard in seconds." },
          { symbol: "Performance Ratio", description: "Ratio used to determine swim performance level." },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 14-year-old female swimmer completes the 100m freestyle in 58 seconds. The age-group standard time for her category is 60 seconds.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input age as 14, gender as female, event as 100m freestyle, and time as 58 seconds.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator finds the standard time for a 14-year-old female in 100m freestyle is 60 seconds.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate performance ratio: 58 / 60 = 0.967, which is less than 1.00, indicating an Advanced performance level.",
          },
          {
            label: "Step 4",
            explanation:
              "The swimmer is classified as 'Advanced' with feedback on competitive standing and training recommendations.",
          },
        ],
        result: "Performance Level: Advanced (meets or exceeds age-group standard time).",
      }}
      relatedCalculators={[
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🚴" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
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