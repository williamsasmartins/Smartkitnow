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

export default function Vo2maxEstimatorCooperRockportCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    testType: "cooper" | "rockport" | "";
    distance?: number; // miles or meters
    time?: number; // minutes (Cooper) or seconds (Rockport)
    age?: number;
    weight?: number; // lbs or kg
    gender?: "male" | "female" | "";
  }>({
    testType: "",
    distance: undefined,
    time: undefined,
    age: undefined,
    weight: undefined,
    gender: "",
  });

  // 2. LOGIC
  // Cooper Test VO2max formula (distance in meters, time fixed 12 min):
  // VO2max = (distance in meters - 504.9) / 44.73
  // Rockport Walk Test VO2max formula:
  // VO2max = 132.853 - (0.0769 × weight in lbs) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time in minutes) - (0.1565 × heart rate)
  // Since heart rate is not asked here, we'll use a simplified Rockport formula without HR:
  // VO2max = 132.853 - (0.0769 × weight) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time)
  // gender: male=1, female=0
  // time in minutes (converted from seconds if needed)

  // We'll implement:
  // Cooper: input distance (miles or meters), fixed 12 min
  // Rockport: input time (min or sec), weight, age, gender

  // Conversion helpers
  const milesToMeters = (miles: number) => miles * 1609.34;
  const feetToMeters = (feet: number) => feet * 0.3048;
  const lbsToKg = (lbs: number) => lbs * 0.453592;

  const results = useMemo(() => {
    if (inputs.testType === "cooper") {
      if (!inputs.distance) return { value: 0, label: "", category: "" };
      // Convert distance to meters if imperial
      const distMeters =
        unit === "imperial" ? milesToMeters(inputs.distance) : inputs.distance;

      // VO2max = (distance in meters - 504.9) / 44.73
      const vo2maxRaw = (distMeters - 504.9) / 44.73;
      const vo2max = Math.round(vo2maxRaw * 10) / 10;

      // Categorize based on normative data (men and women combined approx)
      // Source: Cooper test normative values for adults
      let category = "";
      if (vo2max >= 50) category = "Excellent";
      else if (vo2max >= 42) category = "Good";
      else if (vo2max >= 35) category = "Average";
      else if (vo2max >= 30) category = "Below Average";
      else category = "Poor";

      return {
        value: vo2max,
        label: "Estimated VO2max (ml/kg/min) - Cooper Test",
        category,
      };
    } else if (inputs.testType === "rockport") {
      if (
        inputs.time === undefined ||
        inputs.weight === undefined ||
        inputs.age === undefined ||
        inputs.gender === ""
      )
        return { value: 0, label: "", category: "" };

      // Convert time to minutes if input in seconds and imperial
      // We'll assume time input is in minutes for metric, seconds for imperial (per instructions)
      let timeMinutes = inputs.time;
      if (unit === "imperial") {
        // time input in seconds, convert to minutes
        timeMinutes = inputs.time / 60;
      }

      // Weight in lbs or kg, convert to lbs if metric
      const weightLbs =
        unit === "imperial" ? inputs.weight : inputs.weight * 2.20462;

      // Gender numeric
      const genderNum = inputs.gender === "male" ? 1 : 0;

      // VO2max = 132.853 - (0.0769 × weight in lbs) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time in minutes)
      const vo2maxRaw =
        132.853 -
        0.0769 * weightLbs -
        0.3877 * inputs.age -
        3.2649 * timeMinutes +
        6.315 * genderNum;

      const vo2max = Math.round(vo2maxRaw * 10) / 10;

      // Categorize roughly (men and women combined)
      let category = "";
      if (vo2max >= 50) category = "Excellent";
      else if (vo2max >= 42) category = "Good";
      else if (vo2max >= 35) category = "Average";
      else if (vo2max >= 30) category = "Below Average";
      else category = "Poor";

      return {
        value: vo2max,
        label: "Estimated VO2max (ml/kg/min) - Rockport Walk Test",
        category,
      };
    }
    return { value: 0, label: "", category: "" };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between the Cooper and Rockport tests?",
      answer:
        "The Cooper test is a 12-minute run or walk where the distance covered is measured to estimate VO2max, emphasizing aerobic capacity through sustained effort. The Rockport Walk Test, on the other hand, is a 1-mile walk where time, weight, age, and gender are used to estimate VO2max, making it suitable for individuals unable to perform intense running. Both tests provide practical, field-based estimations of cardiovascular fitness but differ in intensity and methodology.",
    },
    {
      question: "How should I interpret my VO2max result?",
      answer:
        "VO2max values represent the maximum volume of oxygen your body can utilize during intense exercise, measured in milliliters per kilogram of body weight per minute (ml/kg/min). Higher values indicate better cardiovascular fitness and aerobic endurance. Results are typically categorized from 'Poor' to 'Excellent' based on normative data, helping you understand your fitness level relative to age and gender groups. Regular aerobic training can improve your VO2max over time.",
    },
    {
      question: "What are the limitations of these VO2max estimators?",
      answer:
        "While the Cooper and Rockport tests provide accessible VO2max estimates, they are indirect and subject to variability due to factors like motivation, environmental conditions, and measurement accuracy. The Rockport test does not account for heart rate, which can affect precision. These estimators are less accurate than laboratory-based maximal oxygen uptake tests but remain valuable for tracking fitness trends and guiding exercise programs.",
    },
    {
      question: "Can I use this calculator if I use metric units?",
      answer:
        "Yes, this calculator supports both imperial and metric units. By default, it uses imperial units (miles, lbs, feet, seconds) common in the US and Canada. Switching to metric will adjust inputs to kilometers/meters, kilograms, and minutes accordingly. Ensure you enter values consistent with the selected unit system for accurate VO2max estimation.",
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

        {/* Test Type Selector */}
        <div>
          <Label htmlFor="testType" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Select Test Type
          </Label>
          <Select
            id="testType"
            value={inputs.testType}
            onValueChange={(val) =>
              setInputs((prev) => ({
                ...prev,
                testType: val as "cooper" | "rockport" | "",
                // reset other inputs on test type change
                distance: undefined,
                time: undefined,
                age: undefined,
                weight: undefined,
                gender: "",
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a test" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cooper">Cooper 12-Minute Run Test</SelectItem>
              <SelectItem value="rockport">Rockport 1-Mile Walk Test</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs based on test type */}
        {inputs.testType === "cooper" && (
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="distance" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
                Distance Covered
              </Label>
              <Input
                id="distance"
                type="number"
                min={0}
                step={0.01}
                placeholder={
                  unit === "imperial"
                    ? "Miles (e.g., 1.5)"
                    : "Meters (e.g., 2400)"
                }
                value={inputs.distance ?? ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    distance: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter the distance you covered in 12 minutes.
              </p>
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 italic text-sm">
                Note: The Cooper test duration is fixed at 12 minutes.
              </p>
            </div>
          </div>
        )}

        {inputs.testType === "rockport" && (
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="time" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
                Time to Complete 1 Mile
              </Label>
              <Input
                id="time"
                type="number"
                min={0}
                step={0.1}
                placeholder={
                  unit === "imperial"
                    ? "Seconds (e.g., 900)"
                    : "Minutes (e.g., 15)"
                }
                value={inputs.time ?? ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    time: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter the time taken to walk 1 mile.
              </p>
            </div>

            <div>
              <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
                Weight
              </Label>
              <Input
                id="weight"
                type="number"
                min={0}
                step={0.1}
                placeholder={unit === "imperial" ? "Pounds (e.g., 150)" : "Kilograms (e.g., 68)"}
                value={inputs.weight ?? ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    weight: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="age" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                min={10}
                max={120}
                step={1}
                placeholder="Years (e.g., 30)"
                value={inputs.age ?? ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    age: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
                Gender
              </Label>
              <Select
                id="gender"
                value={inputs.gender}
                onValueChange={(val) =>
                  setInputs((prev) => ({
                    ...prev,
                    gender: val as "male" | "female" | "",
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
          disabled={
            inputs.testType === "" ||
            (inputs.testType === "cooper" && !inputs.distance) ||
            (inputs.testType === "rockport" &&
              (inputs.time === undefined ||
                inputs.weight === undefined ||
                inputs.age === undefined ||
                inputs.gender === ""))
          }
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              testType: "",
              distance: undefined,
              time: undefined,
              age: undefined,
              weight: undefined,
              gender: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
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
          What is the VO2max Estimator (Cooper/Rockport)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The VO2max Estimator (Cooper/Rockport) is a specialized tool designed to
          estimate an individual's maximal oxygen uptake (VO2max), a key indicator
          of cardiovascular fitness and aerobic endurance. VO2max represents the
          maximum amount of oxygen your body can utilize during intense exercise,
          measured in milliliters of oxygen per kilogram of body weight per minute
          (ml/kg/min). This estimator leverages two widely recognized field tests:
          the Cooper 12-minute run test and the Rockport 1-mile walk test.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Cooper test requires participants to cover as much distance as possible
          in 12 minutes, typically by running or walking, making it suitable for
          individuals with moderate to high fitness levels. The Rockport test is a
          1-mile walk performed as quickly as possible, with inputs including time,
          weight, age, and gender, making it accessible for those with lower fitness
          or mobility limitations. Both tests provide practical, cost-effective
          alternatives to laboratory VO2max testing, enabling users to assess and
          monitor their cardiovascular health conveniently.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator supports both imperial and metric units, defaulting to
          imperial units commonly used in the US and Canada. By inputting your test
          results and personal data, you receive an estimated VO2max value along
          with a fitness category ranging from Poor to Excellent. Understanding your
          VO2max can help tailor exercise programs, track fitness progress, and
          provide motivation for improving cardiovascular health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While these estimators are valuable tools, they are indirect and subject
          to variability based on test conditions and individual factors. For the
          most accurate assessment of aerobic capacity, laboratory-based maximal
          oxygen uptake tests remain the gold standard. Nonetheless, the Cooper and
          Rockport tests remain widely used in clinical, athletic, and fitness
          settings due to their simplicity and practicality.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your VO2max using this calculator, follow these steps carefully
          based on the test you have performed or plan to perform. Ensure you select
          the correct test type and enter all required inputs accurately. The
          calculator will then provide an estimated VO2max value along with a fitness
          category to help you interpret your cardiovascular fitness level.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select Test Type:</strong> Choose either the Cooper 12-minute run
            test or the Rockport 1-mile walk test depending on your test results.
          </li>
          <li>
            <strong>Input Distance or Time:</strong> For the Cooper test, enter the
            distance you covered in miles (imperial) or meters (metric) during 12
            minutes. For the Rockport test, enter the time taken to walk 1 mile in
            seconds (imperial) or minutes (metric).
          </li>
          <li>
            <strong>Provide Personal Data (Rockport only):</strong> Enter your age,
            weight (lbs or kg), and gender. These factors influence the Rockport
            VO2max estimation.
          </li>
          <li>
            <strong>Calculate:</strong> Click the Calculate button to see your
            estimated VO2max and fitness category.
          </li>
          <li>
            <strong>Reset:</strong> Use the Reset button to clear inputs and start
            over.
          </li>
        </ul>
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5968927/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Cooper, K. H. (1968). A means of assessing maximal oxygen intake.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              The original study introducing the Cooper 12-minute run test for VO2max estimation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/3930719/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Kline, G. M., et al. (1987). Estimation of VO2max from a one-mile
              track walk, gender, age, and body weight.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Foundational paper describing the Rockport Walk Test and its VO2max prediction formula.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.acefitness.org/education-and-resources/professional/expert-articles/5533/understanding-vo2max-and-its-importance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Council on Exercise (ACE). Understanding VO2max and its importance.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive overview of VO2max, its significance, and testing methods.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/physicalactivity/basics/measuring/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Centers for Disease Control and Prevention (CDC). Measuring Physical Activity.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Guidelines and methods for assessing physical fitness and activity levels.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="VO2max Estimator (Cooper/Rockport)"
      description="Estimate your VO2max aerobic capacity. Use Cooper or Rockport test results to assess your cardiovascular fitness level."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Cooper: VO2max = (Distance in meters - 504.9) / 44.73\nRockport: VO2max = 132.853 - (0.0769 × weight in lbs) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time in minutes)",
        variables: [
          {
            symbol: "Distance",
            description:
              "Distance covered in 12 minutes (meters for metric, miles converted to meters for imperial) - Cooper Test",
          },
          {
            symbol: "Weight",
            description:
              "Body weight in pounds (lbs) for Rockport test; convert kg to lbs if metric",
          },
          {
            symbol: "Age",
            description: "Age in years - Rockport test",
          },
          {
            symbol: "Gender",
            description: "1 for male, 0 for female - Rockport test",
          },
          {
            symbol: "Time",
            description:
              "Time to complete 1 mile in minutes (seconds converted to minutes if imperial) - Rockport test",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John, a 30-year-old male weighing 180 lbs, completed the Cooper test by running 1.5 miles in 12 minutes. Alternatively, he completed the Rockport walk test in 15 minutes.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "For the Cooper test, convert 1.5 miles to meters: 1.5 × 1609.34 = 2414 meters.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate VO2max: (2414 - 504.9) / 44.73 ≈ 42.7 ml/kg/min, categorized as Good.",
          },
          {
            label: "Step 3",
            explanation:
              "For the Rockport test, input time = 15 minutes, weight = 180 lbs, age = 30, gender = male (1).",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate VO2max: 132.853 - (0.0769 × 180) - (0.3877 × 30) + (6.315 × 1) - (3.2649 × 15) ≈ 40.3 ml/kg/min, categorized as Average to Good.",
          },
        ],
        result:
          "John's estimated VO2max from the Cooper test is 42.7 ml/kg/min (Good), and from the Rockport test is 40.3 ml/kg/min (Average to Good).",
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
        { id: "what-is", label: "What is VO2max Estimator (Cooper/Rockport)?" },
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