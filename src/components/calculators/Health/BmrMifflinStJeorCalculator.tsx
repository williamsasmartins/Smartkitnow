import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
  Info,
  HelpCircle,
  BookOpen,
  AlertCircle,
  RotateCcw,
  Calculator,
} from "lucide-react"; // Use standard icons
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Gender = "male" | "female";

export default function BmrMifflinStJeorCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [inputs, setInputs] = useState<{
    age: string;
    gender: Gender;
    weight: string;
    heightMetric: string;
    heightFt: string;
    heightIn: string;
  }>({
    age: "",
    gender: "male",
    weight: "",
    heightMetric: "",
    heightFt: "",
    heightIn: "",
  });

  // Parse inputs safely
  const parseNumber = (value: string) => {
    const n = parseFloat(value);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const results = useMemo(() => {
    const age = parseNumber(inputs.age);
    const weightRaw = parseNumber(inputs.weight);
    let weightKg = 0;
    let heightCm = 0;

    if (unit === "metric") {
      weightKg = weightRaw; // kg
      heightCm = parseNumber(inputs.heightMetric);
    } else {
      // imperial
      // weight: lbs to kg
      weightKg = weightRaw / 2.20462;

      // height: (ft * 12 + in) * 2.54
      const ft = parseNumber(inputs.heightFt);
      const inch = parseNumber(inputs.heightIn);
      const totalInches = ft * 12 + inch;
      heightCm = totalInches * 2.54;
    }

    // Mifflin-St Jeor Equation:
    // Men: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
    // Women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161

    if (age <= 0 || weightKg <= 0 || heightCm <= 0) {
      return null;
    }

    let bmr = 0;
    if (inputs.gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    return {
      bmr: Math.round(bmr),
      age,
      weightKg,
      heightCm,
    };
  }, [inputs, unit]);

  // FAQ JSON-LD for SEO
  useFaqJsonLd([
    {
      question: "What is Basal Metabolic Rate (BMR)?",
      answer:
        "Basal Metabolic Rate (BMR) represents the minimum amount of energy your body requires to perform vital life-sustaining functions—such as breathing, circulation, and cell production—while at complete rest. It accounts for approximately 60-70% of your total daily energy expenditure.",
    },
    {
      question: "How is BMR calculated using the Mifflin-St Jeor equation?",
      answer:
        "The Mifflin-St Jeor equation calculates BMR based on weight, height, age, and gender. For men, it is: 10 × weight (kg) + 6.25 × height (cm) - 5 × age (years) + 5. For women, the formula is the same except you subtract 161 instead of adding 5. This formula is widely regarded as accurate for most adults.",
    },
    {
      question: "Why do I need to input height in feet and inches for imperial units?",
      answer:
        "Users in the US and Canada commonly express height in feet and inches rather than total inches. Splitting height input into feet and inches improves usability and accuracy, ensuring the calculator correctly converts your height to centimeters for precise BMR calculation.",
    },
    {
      question: "Can BMR change over time?",
      answer:
        "Yes, BMR can change due to factors such as aging, changes in body composition, hormonal fluctuations, and health conditions. Generally, BMR decreases with age as muscle mass tends to decline, which reduces the number of calories your body burns at rest.",
    },
    {
      question: "How can I use my BMR to manage my weight?",
      answer:
        "Knowing your BMR helps estimate the minimum calories your body needs daily. To lose weight, you create a calorie deficit by consuming fewer calories than your total daily energy expenditure (which includes BMR plus activity). To gain weight, consume more calories than you burn. BMR is a foundational metric for personalized nutrition and fitness planning.",
    },
    {
      question: "Is the Mifflin-St Jeor equation accurate for everyone?",
      answer:
        "While the Mifflin-St Jeor equation is validated and accurate for most healthy adults, it may be less precise for certain populations such as athletes, elderly individuals, or those with metabolic disorders. For specialized cases, indirect calorimetry or other clinical assessments may be recommended.",
    },
    {
      question: "What units should I use for weight and height?",
      answer:
        "Use kilograms and centimeters if you select the metric system. If you select imperial, enter your weight in pounds and your height in feet and inches. The calculator automatically converts these to metric units internally for accurate BMR calculation.",
    },
    {
      question: "Why is it important to calculate BMR accurately?",
      answer:
        "Accurate BMR calculation is essential for designing effective diet and exercise programs. It ensures you understand your body's baseline energy needs, helping prevent under- or over-estimating calorie intake, which can impact health, weight management, and overall well-being.",
    },
  ]);

  // Handlers
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onUnitChange = (value: "metric" | "imperial") => {
    setUnit(value);
    // Reset height inputs on unit change for clarity
    setInputs((prev) => ({
      ...prev,
      heightMetric: "",
      heightFt: "",
      heightIn: "",
    }));
  };

  const onReset = () => {
    setInputs({
      age: "",
      gender: "male",
      weight: "",
      heightMetric: "",
      heightFt: "",
      heightIn: "",
    });
    setUnit("metric");
  };

  return (
    <CalculatorVerticalLayout
      title="BMR — Basal Metabolic Rate (Mifflin-St Jeor)"
      icon={<Calculator className="text-blue-600 dark:text-blue-400" size={28} />}
      description={
        <>
          <p className="text-slate-700 dark:text-slate-300 mb-2">
            Calculate your Basal Metabolic Rate (BMR) using the clinically validated Mifflin-St Jeor equation.
            This represents the calories your body needs at rest to maintain vital functions.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            Select your preferred units and enter your age, gender, weight, and height to get started.
          </p>
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User size={20} className="text-blue-600 dark:text-blue-400" />
            Your Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Unit selector */}
          <div>
            <Label htmlFor="unit" className="text-slate-900 dark:text-slate-100 font-semibold">
              Units
            </Label>
            <Select
              onValueChange={(v) => onUnitChange(v as "metric" | "imperial")}
              value={unit}
              aria-label="Select units"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div>
            <Label htmlFor="age" className="text-slate-900 dark:text-slate-100 font-semibold">
              Age (years)
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              min={0}
              max={120}
              placeholder="e.g. 30"
              value={inputs.age}
              onChange={onInputChange}
              className="text-slate-700 dark:text-slate-300"
              inputMode="numeric"
            />
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender" className="text-slate-900 dark:text-slate-100 font-semibold">
              Gender
            </Label>
            <Select
              onValueChange={(v) =>
                setInputs((prev) => ({ ...prev, gender: v as Gender }))
              }
              value={inputs.gender}
              aria-label="Select gender"
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

          {/* Weight */}
          <div>
            <Label htmlFor="weight" className="text-slate-900 dark:text-slate-100 font-semibold">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              min={0}
              placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
              value={inputs.weight}
              onChange={onInputChange}
              className="text-slate-700 dark:text-slate-300"
              inputMode="decimal"
            />
          </div>

          {/* Height */}
          <div>
            <Label className="text-slate-900 dark:text-slate-100 font-semibold mb-1">
              Height ({unit === "metric" ? "cm" : "ft / in"})
            </Label>
            {unit === "metric" ? (
              <Input
                id="heightMetric"
                name="heightMetric"
                type="number"
                min={0}
                placeholder="e.g. 175"
                value={inputs.heightMetric}
                onChange={onInputChange}
                className="text-slate-700 dark:text-slate-300"
                inputMode="decimal"
              />
            ) : (
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    id="heightFt"
                    name="heightFt"
                    type="number"
                    min={0}
                    placeholder="Feet"
                    value={inputs.heightFt}
                    onChange={onInputChange}
                    className="text-slate-700 dark:text-slate-300"
                    inputMode="numeric"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    id="heightIn"
                    name="heightIn"
                    type="number"
                    min={0}
                    max={11}
                    placeholder="Inches"
                    value={inputs.heightIn}
                    onChange={onInputChange}
                    className="text-slate-700 dark:text-slate-300"
                    inputMode="numeric"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              onClick={() => {}}
              type="button"
              aria-label="Calculate BMR"
              disabled={!results}
            >
              <Calculator className="mr-2" size={18} />
              Calculate
            </Button>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 flex-1"
              onClick={onReset}
              type="button"
              aria-label="Reset form"
            >
              <RotateCcw className="mr-2" size={18} />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="text-blue-600 dark:text-blue-400" size={20} />
              Your BMR Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold mb-2">
              {results.bmr.toLocaleString()} kcal/day
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              This is the estimated number of calories your body requires daily at rest to maintain vital functions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="text-blue-600 dark:text-blue-400" size={20} />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
              What is Basal Metabolic Rate (BMR)?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Basal Metabolic Rate (BMR) represents the minimum amount of energy your body requires to perform vital life-sustaining functions—such as breathing, circulation, and cell production—while at complete rest. It accounts for approximately 60-70% of your total daily energy expenditure.
            </p>
          </section>

          <section>
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
              How is BMR calculated using the Mifflin-St Jeor equation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              The Mifflin-St Jeor equation calculates BMR based on weight, height, age, and gender. For men, it is: 10 × weight (kg) + 6.25 × height (cm) - 5 × age (years) + 5. For women, the formula is the same except you subtract 161 instead of adding 5. This formula is widely regarded as accurate for most adults.
            </p>
          </section>

          <section>
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
              Why do I need to input height in feet and inches for imperial units?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Users in the US and Canada commonly express height in feet and inches rather than total inches. Splitting height input into feet and inches improves usability and accuracy, ensuring the calculator correctly converts your height to centimeters for precise BMR calculation.
            </p>
          </section>

          <section>
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
              Can BMR change over time?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Yes, BMR can change due to factors such as aging, changes in body composition, hormonal fluctuations, and health conditions. Generally, BMR decreases with age as muscle mass tends to decline, which reduces the number of calories your body burns at rest.
            </p>
          </section>

          <section>
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
              How can I use my BMR to manage my weight?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Knowing your BMR helps estimate the minimum calories your body needs daily. To lose weight, you create a calorie deficit by consuming fewer calories than your total daily energy expenditure (which includes BMR plus activity). To gain weight, consume more calories than you burn. BMR is a foundational metric for personalized nutrition and fitness planning.
            </p>
          </section>

          <section>
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
              Is the Mifflin-St Jeor equation accurate for everyone?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              While the Mifflin-St Jeor equation is validated and accurate for most healthy adults, it may be less precise for certain populations such as athletes, elderly individuals, or those with metabolic disorders. For specialized cases, indirect calorimetry or other clinical assessments may be recommended.
            </p>
          </section>

          <section>
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
              What units should I use for weight and height?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Use kilograms and centimeters if you select the metric system. If you select imperial, enter your weight in pounds and your height in feet and inches. The calculator automatically converts these to metric units internally for accurate BMR calculation.
            </p>
          </section>

          <section>
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
              Why is it important to calculate BMR accurately?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Accurate BMR calculation is essential for designing effective diet and exercise programs. It ensures you understand your body's baseline energy needs, helping prevent under- or over-estimating calorie intake, which can impact health, weight management, and overall well-being.
            </p>
          </section>
        </CardContent>
      </Card>

      {/* References */}
      <Card className="mt-8 mb-12">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="text-blue-600 dark:text-blue-400" size={20} />
            References
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li className="mb-4">
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/7477937/"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg block mb-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals.
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                American Journal of Clinical Nutrition, 1990. This study introduced the Mifflin-St Jeor equation, now widely used for BMR estimation.
              </p>
            </li>
            <li className="mb-4">
              <a
                href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg block mb-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Frankenfield D, Roth-Yousey L, Compher C. Comparison of predictive equations for resting metabolic rate in healthy nonobese and obese adults: a systematic review.
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Journal of the American Dietetic Association, 2005. Comprehensive review comparing BMR predictive equations including Mifflin-St Jeor.
              </p>
            </li>
            <li className="mb-4">
              <a
                href="https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg block mb-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK) - Body Weight Planner
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Provides tools and information on energy expenditure and weight management based on metabolic rate calculations.
              </p>
            </li>
            <li className="mb-4">
              <a
                href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg block mb-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Centers for Disease Control and Prevention (CDC) - About Adult BMI
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Authoritative resource on body composition and metabolic health metrics relevant to BMR and weight management.
              </p>
            </li>
            <li className="mb-4">
              <a
                href="https://www.ncbi.nlm.nih.gov/books/NBK279396/"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg block mb-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Heymsfield SB, et al. Energy metabolism in humans: measurement and clinical applications.
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Comprehensive overview of human energy metabolism, including BMR measurement techniques and clinical relevance.
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </CalculatorVerticalLayout>
  );
}