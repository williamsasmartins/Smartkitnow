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

export default function Vo2maxEstimatorCooperRockportCalculator() {
  const [inputs, setInputs] = useState({
    testType: "cooper",
    age: "",
    gender: "male",
    weight: "",
    distanceMeters: "",
    timeMinutes: "",
    timeSeconds: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper to convert time inputs (min + sec) to total minutes as decimal
  const totalTimeMinutes = useMemo(() => {
    const min = parseFloat(inputs.timeMinutes);
    const sec = parseFloat(inputs.timeSeconds);
    if (isNaN(min) && isNaN(sec)) return null;
    return (isNaN(min) ? 0 : min) + (isNaN(sec) ? 0 : sec / 60);
  }, [inputs.timeMinutes, inputs.timeSeconds]);

  // Validation helpers
  const isValidNumber = (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0;

  // VO2max calculation logic
  const results = useMemo(() => {
    const testType = inputs.testType;
    const age = parseInt(inputs.age);
    const gender = inputs.gender;
    const weight = parseFloat(inputs.weight);
    const distanceMeters = parseFloat(inputs.distanceMeters);
    const timeMin = totalTimeMinutes;

    // Validation
    if (testType === "cooper") {
      if (!isValidNumber(distanceMeters)) {
        return {
          value: null,
          label: null,
          subtext: "Please enter a valid distance (meters) for the Cooper Test.",
          warning: "Distance must be a positive number.",
          formulaUsed: null,
        };
      }
    } else if (testType === "rockport") {
      if (!isValidNumber(weight) || !isValidNumber(age) || !isValidNumber(timeMin)) {
        return {
          value: null,
          label: null,
          subtext: "Please enter valid age, weight, and time for the Rockport Test.",
          warning: "Age, weight, and time must be positive numbers.",
          formulaUsed: null,
        };
      }
    } else {
      return {
        value: null,
        label: null,
        subtext: "Select a valid test type.",
        warning: "Invalid test type selected.",
        formulaUsed: null,
      };
    }

    // Cooper Test VO2max formula (ml/kg/min)
    // VO2max = (distance in meters - 504.9) / 44.73
    // Source: Cooper Institute
    if (testType === "cooper") {
      const vo2max = (distanceMeters - 504.9) / 44.73;
      if (vo2max < 10 || vo2max > 90) {
        return {
          value: vo2max.toFixed(2),
          label: "Estimated VO2max (ml/kg/min)",
          subtext: "Result is outside typical physiological range; please verify inputs.",
          warning: "Unusual VO2max value detected.",
          formulaUsed: "VO2max = (Distance(m) - 504.9) / 44.73",
        };
      }
      return {
        value: vo2max.toFixed(2),
        label: "Estimated VO2max (ml/kg/min)",
        subtext: "Based on Cooper 12-minute run test distance.",
        warning: null,
        formulaUsed: "VO2max = (Distance(m) - 504.9) / 44.73",
      };
    }

    // Rockport Walk Test VO2max formula (ml/kg/min)
    // VO2max = 132.853 - (0.0769 × weight in lbs) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time in minutes) - (0.1565 × heart rate)
    // Since heart rate is not provided here, we use a simplified version without HR:
    // VO2max = 132.853 - (0.0769 × weight in lbs) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time in minutes)
    // Gender: male=1, female=0
    // Weight conversion: kg to lbs (1 kg = 2.20462 lbs)
    if (testType === "rockport") {
      const weightLbs = weight * 2.20462;
      const genderVal = gender === "male" ? 1 : 0;
      const vo2max =
        132.853 -
        0.0769 * weightLbs -
        0.3877 * age +
        6.315 * genderVal -
        3.2649 * timeMin;
      if (vo2max < 10 || vo2max > 90) {
        return {
          value: vo2max.toFixed(2),
          label: "Estimated VO2max (ml/kg/min)",
          subtext: "Result is outside typical physiological range; please verify inputs.",
          warning: "Unusual VO2max value detected.",
          formulaUsed:
            "VO2max = 132.853 - (0.0769 × weight lbs) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time min)",
        };
      }
      return {
        value: vo2max.toFixed(2),
        label: "Estimated VO2max (ml/kg/min)",
        subtext: "Based on Rockport 1-mile walk test parameters.",
        warning: null,
        formulaUsed:
          "VO2max = 132.853 - (0.0769 × weight lbs) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time min)",
      };
    }

    return {
      value: null,
      label: null,
      subtext: "Invalid inputs.",
      warning: "Please check your inputs.",
      formulaUsed: null,
    };
  }, [inputs, totalTimeMinutes]);

  const faqs = [
    {
      question: "What is VO2max and why is it important?",
      answer:
        "VO2max represents the maximum volume of oxygen an individual can utilize during intense exercise, expressed in milliliters per kilogram of body weight per minute (ml/kg/min). It is a key indicator of aerobic fitness and cardiovascular health, reflecting the efficiency of the respiratory and circulatory systems. Higher VO2max values generally correlate with better endurance performance and overall health status.",
    },
    {
      question: "How accurate are the Cooper and Rockport tests for estimating VO2max?",
      answer:
        "Both tests provide practical field-based estimates of VO2max but have inherent limitations compared to laboratory measurements. The Cooper Test, involving a 12-minute run, is more suitable for fitter individuals, while the Rockport Walk Test is designed for less fit or older populations. Accuracy depends on proper test execution and consistent conditions; typical error margins range from 5-10%.",
    },
    {
      question: "Can I use this calculator if I am a beginner or have health issues?",
      answer:
        "While the Rockport Walk Test is generally safer for beginners or those with health concerns, it is essential to consult a healthcare professional before undertaking any fitness test. This calculator provides estimates and should not replace clinical assessments. Always prioritize safety and listen to your body during testing.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Label htmlFor="testType" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Calculator className="w-5 h-5" /> Select Test Type
          </Label>
          <Select
            value={inputs.testType}
            onValueChange={(v) => handleInputChange("testType", v)}
          >
            <SelectTrigger aria-label="Select VO2max Test Type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cooper">Cooper 12-Minute Run Test</SelectItem>
              <SelectItem value="rockport">Rockport 1-Mile Walk Test</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {inputs.testType === "cooper" && (
        <Card>
          <CardContent>
            <Label htmlFor="distanceMeters" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Flag className="w-5 h-5" /> Distance Covered (meters)
            </Label>
            <Input
              id="distanceMeters"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 2800"
              value={inputs.distanceMeters}
              onChange={(e) => handleInputChange("distanceMeters", e.target.value)}
            />
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter the total distance you ran in 12 minutes.
            </p>
          </CardContent>
        </Card>
      )}

      {inputs.testType === "rockport" && (
        <>
          <Card>
            <CardContent>
              <Label htmlFor="age" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Medal className="w-5 h-5" /> Age (years)
              </Label>
              <Input
                id="age"
                type="number"
                min="10"
                max="120"
                step="1"
                placeholder="e.g., 35"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Label htmlFor="gender" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Flag className="w-5 h-5" /> Gender
              </Label>
              <Select
                value={inputs.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
              >
                <SelectTrigger aria-label="Select Gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Scale className="w-5 h-5" /> Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                min="20"
                max="300"
                step="0.1"
                placeholder="e.g., 70.5"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Label className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Timer className="w-5 h-5" /> Time to complete 1 mile (min:sec)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="timeMinutes"
                  type="number"
                  min="0"
                  max="59"
                  step="1"
                  placeholder="Minutes"
                  value={inputs.timeMinutes}
                  onChange={(e) => handleInputChange("timeMinutes", e.target.value)}
                />
                <Input
                  id="timeSeconds"
                  type="number"
                  min="0"
                  max="59"
                  step="1"
                  placeholder="Seconds"
                  value={inputs.timeSeconds}
                  onChange={(e) => handleInputChange("timeSeconds", e.target.value)}
                />
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enter the time taken to walk 1 mile (1609 meters).
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          aria-label="Calculate VO2max"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              testType: "cooper",
              age: "",
              gender: "male",
              weight: "",
              distanceMeters: "",
              timeMinutes: "",
              timeSeconds: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-700 dark:text-slate-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-500">
                <Calculator className="inline w-4 h-4 mr-1" />
                <span>Formula used: {results.formulaUsed}</span>
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
          Understanding VO2max Estimator (Cooper/Rockport Test)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          VO2max, or maximal oxygen uptake, is the gold standard measure of aerobic fitness, indicating the maximum amount of oxygen the body can consume during intense exercise. It reflects the efficiency of the cardiovascular and respiratory systems and is a strong predictor of endurance performance and overall health. The Cooper and Rockport tests are practical field assessments designed to estimate VO2max without the need for expensive laboratory equipment. The Cooper Test involves running as far as possible in 12 minutes, suitable for individuals with moderate to high fitness levels, while the Rockport Walk Test estimates VO2max based on a timed 1-mile walk, ideal for beginners or those with lower fitness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator integrates both tests, allowing users to input their performance data and receive an estimated VO2max value. These estimates help athletes, coaches, and fitness enthusiasts monitor cardiovascular improvements over time and tailor training programs accordingly. Understanding the underlying formulas and assumptions is crucial to interpreting results accurately and safely.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Begin by selecting the test you performed: the Cooper 12-minute run or the Rockport 1-mile walk. Depending on your choice, enter the required inputs such as distance covered, age, weight, gender, and time taken. Ensure all values are accurate and reflect your actual test performance for the best estimate. After entering your data, click "Calculate" to see your estimated VO2max value expressed in ml/kg/min.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the test type you completed.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the relevant performance data (distance for Cooper; age, weight, gender, and time for Rockport).
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to generate your VO2max estimate.
          </li>
          <li>
            <strong>Step 4:</strong> Review the results and consider the training tips to improve your aerobic capacity.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving VO2max requires consistent aerobic training that challenges the cardiovascular system. Incorporate interval training sessions, such as high-intensity intervals or tempo runs, to stimulate adaptations that increase oxygen uptake efficiency. Additionally, steady-state endurance workouts at moderate intensity help build a strong aerobic base. Adequate recovery, nutrition, and sleep are essential to support these physiological improvements. Regularly retesting with the Cooper or Rockport test can help track progress and adjust training plans accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember that VO2max is influenced by genetics, age, and training history, so improvements may vary between individuals. Combining aerobic training with strength and flexibility exercises can enhance overall performance and reduce injury risk. Always consult with a qualified coach or sports scientist to tailor your program to your specific needs and goals.
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
          For more information on training science and rules, consult the following sources:
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
              Global leader in sports medicine and exercise science research, providing guidelines on fitness testing and VO2max assessment.
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
              Authoritative source on strength and conditioning practices, including aerobic fitness testing protocols.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/health/a20803187/vo2max-explained/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - VO2max Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical insights and explanations on VO2max testing and its relevance for runners and endurance athletes.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="VO2max Estimator (Cooper/Rockport Test)"
      description="Estimate your VO2max aerobic capacity. Analyze results from the Cooper Run or Rockport Walk test to track cardiovascular fitness."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formulas Used",
        formula:
          "Cooper Test: VO2max = (Distance(m) - 504.9) / 44.73\nRockport Test: VO2max = 132.853 - (0.0769 × weight lbs) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time min)",
        variables: [
          { symbol: "Distance(m)", description: "Distance covered in meters during Cooper Test" },
          { symbol: "weight lbs", description: "Body weight in pounds (Rockport Test)" },
          { symbol: "age", description: "Age in years (Rockport Test)" },
          { symbol: "gender", description: "1 for male, 0 for female (Rockport Test)" },
          { symbol: "time min", description: "Time in minutes to complete 1 mile (Rockport Test)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 30-year-old male weighing 75 kg completes the Cooper Test by running 2800 meters in 12 minutes. Alternatively, he performs the Rockport Walk Test, walking 1 mile in 15 minutes and 30 seconds.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "For the Cooper Test, input the distance covered (2800 meters). The calculator applies the formula: VO2max = (2800 - 504.9) / 44.73 = 50.3 ml/kg/min.",
          },
          {
            label: "Step 2",
            explanation:
              "For the Rockport Test, input age (30), weight (75 kg), gender (male), and time (15 minutes 30 seconds). The calculator converts weight to pounds and time to decimal minutes, then applies the formula to estimate VO2max ≈ 44.7 ml/kg/min.",
          },
          {
            label: "Step 3",
            explanation:
              "Review the results to understand aerobic fitness levels and use them to guide training intensity and progression.",
          },
        ],
        result: "Estimated VO2max: Cooper Test = 50.3 ml/kg/min; Rockport Test = 44.7 ml/kg/min.",
      }}
      relatedCalculators={[
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🚴" },
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
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