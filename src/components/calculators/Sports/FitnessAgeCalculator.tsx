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

export default function FitnessAgeCalculator() {
  /**
   * Fitness Age concept:
   * Fitness Age is an estimation of your "biological" or "physiological" age based on your cardiovascular fitness,
   * typically derived from VO2max values. VO2max is the maximum oxygen uptake during intense exercise and is a
   * gold standard measure of aerobic fitness. This calculator estimates your VO2max from inputs, then compares it
   * to normative VO2max values by age and sex to estimate your fitness age.
   */

  // Input state
  const [inputs, setInputs] = useState({
    age: "",
    sex: "",
    restingHeartRate: "",
    exerciseHeartRate: "",
    exerciseDuration: "",
    distanceCovered: "",
    weight: "",
    height: "",
  });

  // Handle input changes
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * VO2max Estimation Methods:
   * We will use the Rockport Walk Test formula for VO2max estimation, which is validated and widely used.
   * Formula (Rockport Walk Test):
   * VO2max = 132.853 - (0.0769 × Weight in lbs) - (0.3877 × Age) + (6.315 × Gender) - (3.2649 × Time in minutes) - (0.1565 × Heart Rate)
   * Gender: 1 for males, 0 for females
   * Weight in lbs = weight in kg * 2.20462
   * Time in minutes = exerciseDuration
   * Heart Rate = exerciseHeartRate (bpm)
   *
   * Fitness Age Estimation:
   * Based on normative VO2max values by age and sex from ACSM tables, we find the age group where the VO2max matches or exceeds the user's VO2max.
   */

  // Normative VO2max values (ml/kg/min) by age and sex (simplified, approximate)
  // Source: ACSM Guidelines for Exercise Testing and Prescription (11th Edition)
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

  // Calculate VO2max using Rockport Walk Test formula
  const results = useMemo(() => {
    const age = Number(inputs.age);
    const sex = inputs.sex;
    const restingHR = Number(inputs.restingHeartRate);
    const exerciseHR = Number(inputs.exerciseHeartRate);
    const exerciseDuration = Number(inputs.exerciseDuration);
    const distance = Number(inputs.distanceCovered);
    const weightKg = Number(inputs.weight);

    // Validate inputs
    if (
      !age ||
      !sex ||
      !exerciseHR ||
      !exerciseDuration ||
      !distance ||
      !weightKg ||
      age < 15 ||
      age > 90 ||
      (sex !== "male" && sex !== "female") ||
      exerciseHR < 50 ||
      exerciseHR > 200 ||
      exerciseDuration < 5 ||
      exerciseDuration > 30 ||
      distance < 0.5 ||
      distance > 3 ||
      weightKg < 30 ||
      weightKg > 200
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid inputs within realistic ranges.",
        warning: <AlertTriangle className="inline-block w-5 h-5 mr-1 text-yellow-600" />,
        formulaUsed: "Rockport Walk Test VO2max Estimation",
      };
    }

    // Convert weight to lbs
    const weightLbs = weightKg * 2.20462;

    // Gender factor: 1 for male, 0 for female
    const genderFactor = sex === "male" ? 1 : 0;

    // Rockport Walk Test VO2max formula
    // Time is in minutes, exerciseHR is bpm
    const vo2max =
      132.853 -
      0.0769 * weightLbs -
      0.3877 * age +
      6.315 * genderFactor -
      3.2649 * exerciseDuration -
      0.1565 * exerciseHR;

    // Find fitness age by comparing VO2max to normative values
    const norms = vo2maxNorms[sex];
    let fitnessAge = null;
    for (const norm of norms) {
      if (vo2max >= norm.vo2max) {
        fitnessAge = norm.ageMax;
        break;
      }
    }
    if (fitnessAge === null) {
      // If VO2max is below all norms, assign max age
      fitnessAge = norms[norms.length - 1].ageMax;
    }

    // Interpretation
    let interpretation = "";
    if (fitnessAge < age) {
      interpretation = `Your fitness age is younger than your chronological age, indicating excellent cardiovascular fitness.`;
    } else if (fitnessAge === age) {
      interpretation = `Your fitness age matches your chronological age, indicating average cardiovascular fitness.`;
    } else {
      interpretation = `Your fitness age is older than your chronological age, suggesting room for improvement in cardiovascular fitness.`;
    }

    return {
      value: `${fitnessAge} years`,
      label: "Estimated Fitness Age",
      subtext: (
        <>
          <p>VO2max Estimate: {vo2max.toFixed(1)} ml/kg/min</p>
          <p>{interpretation}</p>
        </>
      ),
      warning: null,
      formulaUsed: "Rockport Walk Test VO2max Estimation",
    };
  }, [inputs]);

  // FAQ data
  const faqs = [
    {
      question: "What is Fitness Age and why is it important?",
      answer:
        "Fitness Age estimates your biological age based on cardiovascular fitness rather than chronological age. It reflects how well your heart, lungs, and muscles perform during exercise, providing a meaningful indicator of overall health and longevity.",
    },
    {
      question: "How accurate is the Rockport Walk Test for estimating VO2max?",
      answer:
        "The Rockport Walk Test is a validated submaximal test suitable for most adults, especially those who are less active or older. While not as precise as laboratory VO2max tests, it provides a reliable estimate of aerobic fitness using simple field measurements.",
    },
    {
      question: "Can I improve my Fitness Age?",
      answer:
        "Yes, regular aerobic exercise, strength training, and lifestyle improvements such as quitting smoking and maintaining a healthy diet can improve your VO2max and reduce your Fitness Age over time.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="age" className="flex items-center gap-1">
              Age (years) <Info className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="age"
              type="number"
              min={15}
              max={90}
              value={inputs.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <Label htmlFor="sex" className="flex items-center gap-1">
              Sex <Info className="w-4 h-4 text-blue-600" />
            </Label>
            <Select
              value={inputs.sex}
              onValueChange={(v) => handleInputChange("sex", v)}
              id="sex"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="weight" className="flex items-center gap-1">
              Weight (kg) <Scale className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="weight"
              type="number"
              min={30}
              max={200}
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              placeholder="e.g., 70"
            />
          </div>

          <div>
            <Label htmlFor="exerciseDuration" className="flex items-center gap-1">
              Exercise Duration (minutes) <Timer className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="exerciseDuration"
              type="number"
              min={5}
              max={30}
              value={inputs.exerciseDuration}
              onChange={(e) => handleInputChange("exerciseDuration", e.target.value)}
              placeholder="e.g., 12"
            />
          </div>

          <div>
            <Label htmlFor="distanceCovered" className="flex items-center gap-1">
              Distance Covered (km) <Activity className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="distanceCovered"
              type="number"
              min={0.5}
              max={3}
              step={0.01}
              value={inputs.distanceCovered}
              onChange={(e) => handleInputChange("distanceCovered", e.target.value)}
              placeholder="e.g., 1.5"
            />
          </div>

          <div>
            <Label htmlFor="exerciseHeartRate" className="flex items-center gap-1">
              Heart Rate at Exercise End (bpm) <Heart className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="exerciseHeartRate"
              type="number"
              min={50}
              max={200}
              value={inputs.exerciseHeartRate}
              onChange={(e) => handleInputChange("exerciseHeartRate", e.target.value)}
              placeholder="e.g., 140"
            />
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, results update automatically
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              sex: "",
              restingHeartRate: "",
              exerciseHeartRate: "",
              exerciseDuration: "",
              distanceCovered: "",
              weight: "",
              height: "",
            })
          }
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
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.label}</p>
            <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">{results.subtext}</div>
            {results.warning && <div className="mt-3">{results.warning}</div>}
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Fitness Age Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Fitness Age Calculator estimates your physiological age based on your cardiovascular fitness level, which is a more accurate reflection of your health status than chronological age alone. This is primarily done by estimating your VO2max — the maximum amount of oxygen your body can utilize during intense exercise — using the Rockport Walk Test formula. VO2max is widely recognized as the gold standard for measuring aerobic fitness and is strongly correlated with longevity and reduced risk of chronic diseases.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By comparing your estimated VO2max to normative values stratified by age and sex, the calculator determines the age group whose average VO2max matches your fitness level. This "fitness age" can be younger, equal to, or older than your actual age, providing actionable insights into your cardiovascular health and overall fitness.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate fitness age estimate, you need to perform a submaximal walking test (Rockport Walk Test) and input the relevant data into the calculator. This involves walking a known distance as fast as possible without running, then recording your heart rate immediately at the end of the walk. The calculator uses this data along with your age, sex, and weight to estimate your VO2max and fitness age.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your weight in kilograms and enter it.
          </li>
          <li>
            <strong>Step 2:</strong> Select your biological sex.
          </li>
          <li>
            <strong>Step 3:</strong> Walk 1.5 kilometers (or input the distance you covered) as fast as possible without running.
          </li>
          <li>
            <strong>Step 4:</strong> Record the time taken to complete the walk in minutes.
          </li>
          <li>
            <strong>Step 5:</strong> Immediately after finishing, measure your heart rate in beats per minute.
          </li>
          <li>
            <strong>Step 6:</strong> Enter the exercise duration, distance covered, and heart rate into the calculator.
          </li>
          <li>
            <strong>Step 7:</strong> Click "Calculate" to see your estimated fitness age and VO2max.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your fitness age requires consistent aerobic training to enhance your cardiovascular system's efficiency. Incorporate moderate to high-intensity aerobic exercises such as brisk walking, jogging, cycling, or swimming at least 3-5 times per week. Interval training and hill workouts can further boost VO2max by challenging your heart and lungs to adapt to higher workloads.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, strength training supports overall fitness and metabolic health, which indirectly benefits cardiovascular performance. Ensure adequate recovery, hydration, and nutrition to maximize training adaptations. Regularly retesting your fitness age every 3-6 months can help track progress and motivate continued improvement.
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
          For more information on training science, VO2max testing, and fitness age concepts, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for fitness testing and prescription.
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
              The NSCA offers comprehensive resources on strength and conditioning, including aerobic fitness assessment protocols and training strategies.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/health-injuries/a20803105/vo2max-explained/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - VO2max Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An accessible guide explaining VO2max, its importance for endurance athletes, and how to improve it through training.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Formula and example for documentation
  const formula = {
    title: "Rockport Walk Test VO2max Estimation Formula",
    formula:
      "VO2max = 132.853 - (0.0769 × Weight in lbs) - (0.3877 × Age) + (6.315 × Gender) - (3.2649 × Time in minutes) - (0.1565 × Heart Rate)",
    variables: [
      { symbol: "Weight", description: "Body weight in pounds (lbs)" },
      { symbol: "Age", description: "Chronological age in years" },
      { symbol: "Gender", description: "1 for male, 0 for female" },
      { symbol: "Time", description: "Time to complete walk in minutes" },
      { symbol: "Heart Rate", description: "Heart rate at end of exercise in bpm" },
    ],
  };

  const example = {
    title: "Real Life Example",
    scenario:
      "John is a 35-year-old male weighing 75 kg. He walks 1.5 km in 12 minutes and records a heart rate of 140 bpm immediately after finishing.",
    steps: [
      {
        label: "Step 1",
        explanation: "Convert weight to pounds: 75 kg × 2.20462 = 165.35 lbs",
      },
      {
        label: "Step 2",
        explanation: "Apply the formula: VO2max = 132.853 - (0.0769 × 165.35) - (0.3877 × 35) + (6.315 × 1) - (3.2649 × 12) - (0.1565 × 140)",
      },
      {
        label: "Step 3",
        explanation: "Calculate: VO2max ≈ 132.853 - 12.71 - 13.57 + 6.315 - 39.18 - 21.91 = 52.8 ml/kg/min",
      },
      {
        label: "Step 4",
        explanation: "Compare to norms: 52.8 ml/kg/min is above average for his age group (35-39 years male average ~42 ml/kg/min), so his fitness age is estimated to be younger than 29 years.",
      },
    ],
    result: "John's estimated fitness age is approximately 29 years, indicating excellent cardiovascular fitness.",
  };

  return (
    <CalculatorVerticalLayout
      title="Fitness Age Calculator"
      description="Estimate your fitness age. Compare your cardiovascular health and VO2max against age-related norms."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
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