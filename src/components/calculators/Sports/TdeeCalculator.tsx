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

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (light exercise 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise 6-7 days/week)", value: 1.725 },
  { label: "Extra active (very hard exercise & physical job)", value: 1.9 },
  {
    label: "Athlete (high volume training, multiple sessions/day)",
    value: 2.0,
  },
];

const formulas = {
  miffinStJeor: (weightKg: number, heightCm: number, age: number, sex: string) => {
    // Mifflin-St Jeor Equation for BMR
    if (sex === "male") {
      return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
  },
  // Cunningham Equation for athletes (more accurate for lean mass)
  cunningham: (ffmKg: number) => {
    // ffmKg = fat-free mass in kg
    return 500 + 22 * ffmKg;
  },
};

export default function TdeeCalculator() {
  const [inputs, setInputs] = useState({
    sex: "",
    age: "",
    weight: "",
    height: "",
    bodyFat: "",
    activityLevel: "",
    formula: "miffinStJeor",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parse inputs safely
  const parsedInputs = useMemo(() => {
    const sex = inputs.sex;
    const age = Number(inputs.age);
    const weight = Number(inputs.weight);
    const height = Number(inputs.height);
    const bodyFat = Number(inputs.bodyFat);
    const activityLevel = Number(inputs.activityLevel);
    const formula = inputs.formula;

    return { sex, age, weight, height, bodyFat, activityLevel, formula };
  }, [inputs]);

  const results = useMemo(() => {
    const { sex, age, weight, height, bodyFat, activityLevel, formula } = parsedInputs;

    if (
      !sex ||
      !age ||
      age <= 0 ||
      !weight ||
      weight <= 0 ||
      !height ||
      height <= 0 ||
      !activityLevel ||
      activityLevel <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "Please fill in all required fields with valid values.",
        warning: null,
        formulaUsed: "",
      };
    }

    let bmr = 0;
    let formulaUsed = "";
    let warning = null;

    if (formula === "miffinStJeor") {
      bmr = formulas.miffinStJeor(weight, height, age, sex);
      formulaUsed = "Mifflin-St Jeor Equation (BMR)";
    } else if (formula === "cunningham") {
      if (!bodyFat || bodyFat <= 0 || bodyFat >= 100) {
        return {
          value: "",
          label: "",
          subtext: "Body fat % is required and must be between 1 and 99 for Cunningham formula.",
          warning: "Body fat % missing or invalid for Cunningham formula.",
          formulaUsed: "",
        };
      }
      const ffm = weight * (1 - bodyFat / 100);
      bmr = formulas.cunningham(ffm);
      formulaUsed = "Cunningham Equation (BMR)";
    } else {
      return {
        value: "",
        label: "",
        subtext: "Invalid formula selected.",
        warning: "Invalid formula.",
        formulaUsed: "",
      };
    }

    // Calculate TDEE
    const tdee = bmr * activityLevel;

    // Round results
    const tdeeRounded = Math.round(tdee);
    const bmrRounded = Math.round(bmr);

    return {
      value: `${tdeeRounded} kcal/day`,
      label: "Estimated Total Daily Energy Expenditure (TDEE)",
      subtext: `Based on ${formulaUsed} and activity multiplier of ${activityLevel.toFixed(2)}.`,
      warning,
      formulaUsed,
      bmr: `${bmrRounded} kcal/day (BMR)`,
    };
  }, [parsedInputs]);

  const faqs = [
    {
      question: "What is TDEE and why is it important for athletes?",
      answer:
        "Total Daily Energy Expenditure (TDEE) represents the total number of calories an individual burns in a day, including basal metabolic rate, physical activity, and digestion. For athletes, understanding TDEE is crucial to optimize energy intake for performance, recovery, and body composition goals. Accurately estimating TDEE helps prevent underfueling or overfeeding, which can impact training outcomes and health.",
    },
    {
      question: "Why are there different formulas for calculating BMR?",
      answer:
        "Different formulas estimate Basal Metabolic Rate (BMR) based on varying assumptions and populations. The Mifflin-St Jeor equation is widely used for the general population, while the Cunningham equation is preferred for athletes because it incorporates fat-free mass, providing a more accurate estimate for individuals with higher muscle mass. Selecting the appropriate formula improves the accuracy of TDEE calculations.",
    },
    {
      question: "How do I choose the correct activity level multiplier?",
      answer:
        "Activity level multipliers reflect your average daily physical activity and training volume. Sedentary individuals use lower multipliers, while athletes with multiple intense training sessions per day use higher multipliers. Choosing the correct multiplier ensures your TDEE estimate matches your actual energy expenditure, helping tailor nutrition plans effectively.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sex" className="mb-1 flex items-center gap-1">
                Sex <Info className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.sex}
                onValueChange={(v) => handleInputChange("sex", v)}
                aria-label="Sex"
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
              <Label htmlFor="age" className="mb-1 flex items-center gap-1">
                Age (years) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="age"
                type="number"
                min={1}
                max={120}
                placeholder="e.g. 25"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                Weight (kg) <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="weight"
                type="number"
                min={20}
                max={300}
                step={0.1}
                placeholder="e.g. 70"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="height" className="mb-1 flex items-center gap-1">
                Height (cm) <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="height"
                type="number"
                min={100}
                max={250}
                step={0.1}
                placeholder="e.g. 175"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bodyFat" className="mb-1 flex items-center gap-1">
                Body Fat % (optional) <Dumbbell className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="bodyFat"
                type="number"
                min={1}
                max={99}
                step={0.1}
                placeholder="e.g. 15"
                value={inputs.bodyFat}
                onChange={(e) => handleInputChange("bodyFat", e.target.value)}
                disabled={inputs.formula !== "cunningham"}
              />
            </div>

            <div>
              <Label htmlFor="activityLevel" className="mb-1 flex items-center gap-1">
                Activity Level <Activity className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.activityLevel}
                onValueChange={(v) => handleInputChange("activityLevel", v)}
                aria-label="Activity Level"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map(({ label, value }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formula" className="mb-1 flex items-center gap-1">
                Formula <Calculator className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.formula}
                onValueChange={(v) => handleInputChange("formula", v)}
                aria-label="Formula"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select formula" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="miffinStJeor">Mifflin-St Jeor (General Population)</SelectItem>
                  <SelectItem value="cunningham">Cunningham (Athletes, uses Body Fat %)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update, no extra action needed
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate TDEE"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              sex: "",
              age: "",
              weight: "",
              height: "",
              bodyFat: "",
              activityLevel: "",
              formula: "miffinStJeor",
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{results.subtext}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">BMR: {results.bmr}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
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
          Understanding TDEE Calculator (Sports)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in a day,
          encompassing basal metabolic rate (BMR), physical activity, and the thermic effect of food. For
          athletes and highly active individuals, accurately estimating TDEE is essential to ensure adequate
          energy intake for optimal performance, recovery, and body composition management. This calculator
          integrates scientifically validated formulas tailored for both general populations and athletes,
          allowing you to select the method that best fits your physiology and training demands. By considering
          factors such as body fat percentage and activity level, it provides a comprehensive estimate of your
          daily caloric needs.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate TDEE estimate, input your biological sex, age, weight, and height. If you
          choose the Cunningham formula, also provide your body fat percentage, as it calculates BMR based on
          fat-free mass. Select your typical activity level from the dropdown, which reflects your average
          daily training volume and lifestyle activity. Finally, choose the formula that best suits your
          profile—Mifflin-St Jeor for general use or Cunningham for athletes with known body composition.
          Press Calculate to see your estimated TDEE and BMR values.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your sex (male or female) to account for physiological differences in
            metabolism.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your age in years, as metabolic rate declines slightly with age.
          </li>
          <li>
            <strong>Step 3:</strong> Input your current weight in kilograms and height in centimeters for accurate
            basal metabolic calculations.
          </li>
          <li>
            <strong>Step 4:</strong> If using the Cunningham formula, provide your body fat percentage to estimate
            fat-free mass.
          </li>
          <li>
            <strong>Step 5:</strong> Choose your activity level that best represents your daily physical activity
            and training intensity.
          </li>
          <li>
            <strong>Step 6:</strong> Select the formula appropriate for your profile and click Calculate to view
            results.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your TDEE allows you to tailor your nutrition and training strategies effectively. For
          athletes aiming to build muscle or improve performance, consuming a slight caloric surplus aligned
          with your TDEE can support recovery and adaptation. Conversely, for fat loss, a moderate caloric
          deficit while maintaining training intensity is recommended. Regularly reassess your TDEE as your
          body composition and training volume change to ensure your energy intake remains optimal. Additionally,
          prioritize nutrient timing around training sessions to maximize energy availability and recovery.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References &amp; Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, energy expenditure, and nutrition for athletes, consult the
          following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines
              for athletes.
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
              Provides research and certification for strength and conditioning professionals, focusing on
              athlete performance optimization.
            </p>
          </li>
          <li>
            <a
              href="https://www.fifa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Fédération Internationale de Football Association (FIFA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Offers insights into athlete conditioning and nutrition strategies used at the highest levels of
              sport.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="TDEE Calculator (Sports)"
      description="Calculate Total Daily Energy Expenditure for athletes. Estimate calorie needs based on high activity levels and training volume."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formulas Used",
        formula:
          "BMR (Mifflin-St Jeor) = 10 × weight (kg) + 6.25 × height (cm) - 5 × age (years) + 5 (male) or -161 (female)\n" +
          "BMR (Cunningham) = 500 + 22 × Fat-Free Mass (kg)\n" +
          "TDEE = BMR × Activity Level Multiplier",
        variables: [
          { symbol: "weight", description: "Body weight in kilograms" },
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
          { symbol: "Fat-Free Mass", description: "Lean body mass in kilograms" },
          { symbol: "Activity Level Multiplier", description: "Factor based on daily physical activity" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 28-year-old male athlete weighing 75 kg, 180 cm tall, with 12% body fat, training twice daily with very high activity.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'male' for sex, enter age as 28, weight as 75 kg, height as 180 cm, and body fat as 12%.",
          },
          {
            label: "Step 2",
            explanation:
              "Choose 'Athlete (high volume training, multiple sessions/day)' for activity level (multiplier 2.0).",
          },
          {
            label: "Step 3",
            explanation:
              "Select the Cunningham formula to calculate BMR based on fat-free mass, then click Calculate.",
          },
        ],
        result:
          "The calculator estimates a BMR of approximately 1,940 kcal/day and a TDEE of 3,880 kcal/day, reflecting the athlete's high energy demands.",
      }}
      relatedCalculators={[
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
        { title: "Target Heart Rate / RPE Zones", url: "/sports/target-heart-rate-rpe-zones", icon: "🏆" },
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
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