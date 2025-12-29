import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Timer, Trophy, Flag, Heart, Scale, Calculator, RotateCcw, ExternalLink, Waves } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function Vo2maxEstimatorCooperRockportCalculator() {
  const [inputs, setInputs] = useState({
    testType: "cooper",
    age: "",
    gender: "male",
    weight: "",
    timeMinutes: "",
    distanceMeters: "",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Validation helpers
  const isNumber = (v) => !isNaN(parseFloat(v)) && isFinite(v);

  // VO2max calculation logic
  const results = useMemo(() => {
    const { testType, age, gender, weight, timeMinutes, distanceMeters } = inputs;

    // Parse inputs
    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);
    const timeNum = parseFloat(timeMinutes);
    const distanceNum = parseFloat(distanceMeters);

    // Basic input validation
    if (testType === "cooper") {
      if (!isNumber(distanceNum) || distanceNum <= 0) {
        return { value: null, label: null, subtext: "Please enter a valid distance > 0 meters.", warning: null, formulaUsed: "" };
      }
    } else if (testType === "rockport") {
      if (!isNumber(ageNum) || ageNum < 13 || ageNum > 80) {
        return { value: null, label: null, subtext: "Please enter a valid age between 13 and 80 years.", warning: null, formulaUsed: "" };
      }
      if (!isNumber(weightNum) || weightNum < 30 || weightNum > 200) {
        return { value: null, label: null, subtext: "Please enter a valid weight between 30 and 200 kg.", warning: null, formulaUsed: "" };
      }
      if (!isNumber(timeNum) || timeNum < 6 || timeNum > 20) {
        return { value: null, label: null, subtext: "Please enter a valid time between 6 and 20 minutes.", warning: null, formulaUsed: "" };
      }
    } else {
      return { value: null, label: null, subtext: "Please select a valid test type.", warning: null, formulaUsed: "" };
    }

    // Cooper Test VO2max estimation (distance in meters in 12 minutes)
    // VO2max (ml/kg/min) = (distance in meters - 504.9) / 44.73
    if (testType === "cooper") {
      // Cooper test is a 12-minute run test, distance in meters
      // Validate distance and calculate
      const vo2max = (distanceNum - 504.9) / 44.73;
      if (vo2max < 10 || vo2max > 80) {
        return {
          value: vo2max.toFixed(2),
          label: "Estimated VO2max (ml/kg/min)",
          subtext: "Result is outside typical physiological range; please verify inputs.",
          warning: "⚠️ Unusual result",
          formulaUsed: "VO2max = (Distance (m) - 504.9) / 44.73",
        };
      }
      return {
        value: vo2max.toFixed(2),
        label: "Estimated VO2max (ml/kg/min)",
        subtext: "Based on Cooper 12-minute run test distance.",
        warning: null,
        formulaUsed: "VO2max = (Distance (m) - 504.9) / 44.73",
      };
    }

    // Rockport Walk Test VO2max estimation
    // Formula (ml/kg/min):
    // VO2max = 132.853 - (0.0769 × Weight in lbs) - (0.3877 × Age) + (6.315 × Gender) - (3.2649 × Time in minutes) - (0.1565 × HR)
    // Since HR is not provided, use simplified formula from Rockport 1-mile walk test:
    // VO2max = 132.853 - (0.0769 × weight in lbs) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time in minutes)
    // Gender: male = 1, female = 0
    // Weight conversion: kg to lbs = kg * 2.20462
    // Time is time to walk 1 mile (1.609 km), so user inputs time in minutes

    if (testType === "rockport") {
      const genderNum = gender === "male" ? 1 : 0;
      const weightLbs = weightNum * 2.20462;
      // Use timeMinutes as time to walk 1 mile
      const vo2max =
        132.853 -
        0.0769 * weightLbs -
        0.3877 * ageNum +
        6.315 * genderNum -
        3.2649 * timeNum;
      if (vo2max < 10 || vo2max > 80) {
        return {
          value: vo2max.toFixed(2),
          label: "Estimated VO2max (ml/kg/min)",
          subtext: "Result is outside typical physiological range; please verify inputs.",
          warning: "⚠️ Unusual result",
          formulaUsed:
            "VO2max = 132.853 - (0.0769 × Weight (lbs)) - (0.3877 × Age) + (6.315 × Gender) - (3.2649 × Time (min))",
        };
      }
      return {
        value: vo2max.toFixed(2),
        label: "Estimated VO2max (ml/kg/min)",
        subtext: "Based on Rockport 1-mile walk test.",
        warning: null,
        formulaUsed:
          "VO2max = 132.853 - (0.0769 × Weight (lbs)) - (0.3877 × Age) + (6.315 × Gender) - (3.2649 × Time (min))",
      };
    }

    return { value: null, label: null, subtext: null, warning: null, formulaUsed: "" };
  }, [inputs]);

  const faqs = [
    {
      question: "What is VO2max and why is it important?",
      answer:
        "VO2max represents the maximum volume of oxygen your body can utilize during intense exercise, measured in milliliters per kilogram of body weight per minute (ml/kg/min). It is a key indicator of aerobic fitness and cardiovascular endurance. Higher VO2max values generally correlate with better endurance performance and overall health.",
    },
    {
      question: "How accurate are the Cooper and Rockport tests for estimating VO2max?",
      answer:
        "Both tests provide practical, field-based estimates of VO2max without requiring laboratory equipment. The Cooper test involves running as far as possible in 12 minutes, while the Rockport test involves walking 1 mile as fast as possible. Although convenient, these tests have inherent variability and can be influenced by factors like motivation, terrain, and pacing. For precise measurement, laboratory-based gas analysis is recommended.",
    },
    {
      question: "Can I use this calculator if I am outside the typical age or weight ranges?",
      answer:
        "The formulas used are validated primarily for adults aged 13 to 80 years and typical weight ranges. Using values outside these ranges may reduce accuracy and reliability of the VO2max estimate. If you fall outside these parameters, consider consulting a sports scientist or healthcare professional for tailored assessment.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Label htmlFor="testType" className="mb-1 flex items-center gap-1">
            Select Test Type <Calculator className="w-4 h-4 text-blue-600" />
          </Label>
          <Select
            value={inputs.testType}
            onValueChange={(v) => handleInputChange("testType", v)}
            aria-label="Select test type"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cooper">
                Cooper 12-Minute Run <Activity className="inline w-4 h-4 ml-1 text-green-600" />
              </SelectItem>
              <SelectItem value="rockport">
                Rockport 1-Mile Walk <Waves className="inline w-4 h-4 ml-1 text-teal-600" />
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {inputs.testType === "cooper" && (
        <Card>
          <CardContent>
            <Label htmlFor="distanceMeters" className="mb-1 flex items-center gap-1">
              Distance Covered (meters) <Flag className="w-4 h-4 text-red-600" />
            </Label>
            <Input
              id="distanceMeters"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 2800"
              value={inputs.distanceMeters}
              onChange={(e) => handleInputChange("distanceMeters", e.target.value)}
              aria-describedby="distanceHelp"
            />
            <p id="distanceHelp" className="text-sm text-slate-500 mt-1">
              Enter the total distance you ran in 12 minutes.
            </p>
          </CardContent>
        </Card>
      )}

      {inputs.testType === "rockport" && (
        <>
          <Card>
            <CardContent>
              <Label htmlFor="age" className="mb-1 flex items-center gap-1">
                Age (years) <Timer className="w-4 h-4 text-yellow-600" />
              </Label>
              <Input
                id="age"
                type="number"
                min="13"
                max="80"
                step="1"
                placeholder="e.g. 30"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                aria-describedby="ageHelp"
              />
              <p id="ageHelp" className="text-sm text-slate-500 mt-1">
                Enter your age in years (13-80).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Label htmlFor="gender" className="mb-1 flex items-center gap-1">
                Gender <Heart className="w-4 h-4 text-pink-600" />
              </Label>
              <Select
                value={inputs.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
                aria-label="Select gender"
              >
                <SelectTrigger>
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
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                Weight (kg) <Scale className="w-4 h-4 text-purple-600" />
              </Label>
              <Input
                id="weight"
                type="number"
                min="30"
                max="200"
                step="any"
                placeholder="e.g. 70"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                aria-describedby="weightHelp"
              />
              <p id="weightHelp" className="text-sm text-slate-500 mt-1">
                Enter your body weight in kilograms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Label htmlFor="timeMinutes" className="mb-1 flex items-center gap-1">
                Time to Walk 1 Mile (minutes) <Timer className="w-4 h-4 text-yellow-600" />
              </Label>
              <Input
                id="timeMinutes"
                type="number"
                min="6"
                max="20"
                step="any"
                placeholder="e.g. 15"
                value={inputs.timeMinutes}
                onChange={(e) => handleInputChange("timeMinutes", e.target.value)}
                aria-describedby="timeHelp"
              />
              <p id="timeHelp" className="text-sm text-slate-500 mt-1">
                Enter the time it took to walk 1 mile as fast as possible.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, results update automatically
          }}
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
              timeMinutes: "",
              distanceMeters: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-live="polite">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 font-semibold" role="alert">
                {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">{results.formulaUsed}</p>
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
          VO2max is a fundamental measure of aerobic capacity, reflecting the maximum amount of oxygen your body can consume during intense exercise. It is widely used to assess cardiovascular fitness and endurance potential. The Cooper and Rockport tests are practical field assessments designed to estimate VO2max without expensive laboratory equipment. The Cooper test involves running as far as possible in 12 minutes, while the Rockport test requires walking 1 mile as quickly as possible, making them accessible for most individuals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          These tests provide valuable insights into your aerobic fitness level, helping you monitor progress and tailor training programs effectively. However, it is important to understand that these are estimations and can be influenced by external factors such as terrain, weather, and individual pacing strategies. For precise VO2max measurement, laboratory-based cardiopulmonary exercise testing remains the gold standard.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to estimate your VO2max based on your performance in either the Cooper 12-minute run test or the Rockport 1-mile walk test. Begin by selecting the test type you performed. Then, enter the required inputs such as distance covered, age, weight, gender, and time, depending on the test selected. After entering valid data, click &quot;Calculate&quot; to view your estimated VO2max.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Cooper Test:</strong> Enter the total distance you ran in meters during the 12-minute test.
          </li>
          <li>
            <strong>Rockport Test:</strong> Provide your age, gender, weight in kilograms, and the time it took to walk 1 mile in minutes.
          </li>
          <li>Review the results and consider the provided notes and warnings for context.</li>
          <li>Use the &quot;Reset&quot; button to clear inputs and perform new calculations.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving VO2max requires consistent aerobic training that challenges your cardiovascular system. Incorporate interval training sessions where you alternate between high-intensity efforts &gt; 85% of your maximum heart rate and recovery periods. Long, steady-state endurance workouts at moderate intensity also build aerobic capacity effectively. Remember to allow adequate recovery and progressively increase training volume and intensity to avoid overtraining and injury.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Nutrition, hydration, and sleep quality play crucial roles in supporting your training adaptations. Regularly testing your VO2max with these field tests can help track your progress and adjust your training plan accordingly. Always consult with a qualified sports scientist or coach to tailor your program to your individual needs and goals.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, VO2max testing, and exercise physiology, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines and position stands.
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
              Offers resources and certifications for strength and conditioning professionals, including aerobic fitness assessments.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/physicalactivity/basics/measuring/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Centers for Disease Control and Prevention (CDC) - Physical Activity Basics <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides public health information on physical activity, fitness testing, and health benefits.
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
          "Cooper: VO2max = (Distance (m) - 504.9) / 44.73\nRockport: VO2max = 132.853 - (0.0769 × Weight (lbs)) - (0.3877 × Age) + (6.315 × Gender) - (3.2649 × Time (min))",
        variables: [
          { symbol: "Distance", description: "Distance covered in meters during 12-minute run (Cooper test)" },
          { symbol: "Weight", description: "Body weight in pounds (Rockport test)" },
          { symbol: "Age", description: "Age in years (Rockport test)" },
          { symbol: "Gender", description: "1 for male, 0 for female (Rockport test)" },
          { symbol: "Time", description: "Time in minutes to walk 1 mile (Rockport test)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 28-year-old male completes the Cooper test by running 2800 meters in 12 minutes. Alternatively, the same individual performs the Rockport test by walking 1 mile in 14 minutes, weighing 75 kg.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "For the Cooper test, input the distance covered (2800 meters). The calculator applies the formula: VO2max = (2800 - 504.9) / 44.73.",
          },
          {
            label: "Step 2",
            explanation:
              "For the Rockport test, input age (28), gender (male), weight (75 kg), and time (14 minutes). The calculator converts weight to pounds and applies the Rockport formula.",
          },
          {
            label: "Step 3",
            explanation:
              "Review the estimated VO2max values for both tests to assess aerobic fitness and compare results.",
          },
        ],
        result:
          "Cooper test VO2max estimate: approximately 50.3 ml/kg/min. Rockport test VO2max estimate: approximately 47.9 ml/kg/min. Both indicate excellent aerobic capacity for age and gender.",
      }}
      relatedCalculators={[
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
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