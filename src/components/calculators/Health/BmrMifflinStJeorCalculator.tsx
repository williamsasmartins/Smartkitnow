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
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmrMifflinStJeorCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [inputs, setInputs] = useState({
    age: "",
    gender: "male",
    weight: "",
    heightMetric: "",
    heightFt: "",
    heightIn: "",
  });

  // Parse inputs safely to numbers or NaN
  const ageNum = Number(inputs.age);
  const weightNum = Number(inputs.weight);
  const heightMetricNum = Number(inputs.heightMetric);
  const heightFtNum = Number(inputs.heightFt);
  const heightInNum = Number(inputs.heightIn);

  const results = useMemo(() => {
    // Validate inputs
    if (
      isNaN(ageNum) ||
      ageNum <= 0 ||
      isNaN(weightNum) ||
      weightNum <= 0 ||
      (unit === "metric" && (isNaN(heightMetricNum) || heightMetricNum <= 0)) ||
      (unit === "imperial" &&
        (isNaN(heightFtNum) || heightFtNum < 0 || isNaN(heightInNum) || heightInNum < 0))
    ) {
      return { bmr: null, bmrRounded: null };
    }

    // Convert weight to kg
    let weightKg = 0;
    if (unit === "metric") {
      weightKg = weightNum;
    } else {
      weightKg = weightNum / 2.20462;
    }

    // Convert height to cm
    let heightCm = 0;
    if (unit === "metric") {
      heightCm = heightMetricNum;
    } else {
      const totalInches = heightFtNum * 12 + heightInNum;
      heightCm = totalInches * 2.54;
    }

    // Mifflin-St Jeor Equation:
    // Men: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
    // Women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
    let bmr = 0;
    if (inputs.gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    return { bmr, bmrRounded: Math.round(bmr) };
  }, [
    ageNum,
    weightNum,
    heightMetricNum,
    heightFtNum,
    heightInNum,
    inputs.gender,
    unit,
  ]);

  // Reset handler
  function onReset() {
    setInputs({
      age: "",
      gender: "male",
      weight: "",
      heightMetric: "",
      heightFt: "",
      heightIn: "",
    });
    setUnit("metric");
  }

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
        "The Mifflin-St Jeor equation estimates BMR based on your weight, height, age, and gender. It is considered one of the most accurate formulas for calculating resting energy expenditure in healthy adults.",
    },
    {
      question: "Why do I need to enter height in feet and inches for imperial units?",
      answer:
        "In the US and Canada, people commonly express height in feet and inches rather than total inches. Splitting height into feet and inches improves usability and accuracy when entering your height for BMR calculation.",
    },
    {
      question: "Can BMR change over time?",
      answer:
        "Yes, BMR can change due to factors like aging, changes in body composition, hormonal fluctuations, and health status. Regularly updating your BMR calculation helps tailor your nutrition and fitness plans effectively.",
    },
    {
      question: "How does gender affect BMR?",
      answer:
        "Gender influences BMR because men typically have a higher proportion of lean muscle mass compared to women, which increases resting energy expenditure. The Mifflin-St Jeor equation accounts for this difference by using distinct constants for males and females.",
    },
    {
      question: "Is BMR the same as total daily calorie needs?",
      answer:
        "No, BMR only accounts for calories burned at rest. Total daily calorie needs include BMR plus calories burned through physical activity, digestion, and other bodily functions. To estimate total needs, BMR is multiplied by an activity factor.",
    },
    {
      question: "How accurate is the Mifflin-St Jeor BMR calculator?",
      answer:
        "The Mifflin-St Jeor equation is widely validated and considered accurate for most healthy adults. However, individual variations exist, and factors like illness or extreme body compositions may affect precision.",
    },
    {
      question: "Why is tracking BMR important for weight management?",
      answer:
        "Knowing your BMR helps you understand your baseline calorie needs, which is essential for creating effective weight loss, maintenance, or gain plans. It ensures you consume an appropriate amount of calories relative to your body's resting energy expenditure.",
    },
  ]);

  return (
    <CalculatorVerticalLayout
      title="BMR — Basal Metabolic Rate (Mifflin-St Jeor)"
      icon={<Calculator className="text-blue-600 dark:text-blue-400" size={28} />}
      description={
        <>
          <p className="text-slate-700 dark:text-slate-300 mb-2">
            Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation,
            which estimates the calories your body burns at rest to maintain vital functions.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            Enter your age, gender, weight, and height below. Select your preferred units.
          </p>
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity size={24} className="text-blue-600 dark:text-blue-400" />
            BMR Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Unit selector */}
          <div>
            <Label htmlFor="unit" className="text-slate-900 dark:text-slate-100 font-semibold mb-1 flex items-center gap-1">
              <User size={18} className="text-blue-600 dark:text-blue-400" />
              Units
            </Label>
            <Select
              value={unit}
              onValueChange={(value) => {
                setUnit(value as "metric" | "imperial");
                // Clear height inputs on unit change
                setInputs((prev) => ({
                  ...prev,
                  heightMetric: "",
                  heightFt: "",
                  heightIn: "",
                }));
              }}
              id="unit"
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs, ft + in)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div>
            <Label htmlFor="age" className="text-slate-900 dark:text-slate-100 font-semibold mb-1 flex items-center gap-1">
              <Info size={18} className="text-blue-600 dark:text-blue-400" />
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min={1}
              max={120}
              placeholder="e.g. 30"
              value={inputs.age}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, age: e.target.value }))
              }
              className="max-w-xs"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender" className="text-slate-900 dark:text-slate-100 font-semibold mb-1 flex items-center gap-1">
              <User size={18} className="text-blue-600 dark:text-blue-400" />
              Gender
            </Label>
            <Select
              value={inputs.gender}
              onValueChange={(value) =>
                setInputs((prev) => ({ ...prev, gender: value }))
              }
              id="gender"
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weight */}
          <div>
            <Label htmlFor="weight" className="text-slate-900 dark:text-slate-100 font-semibold mb-1 flex items-center gap-1">
              <Activity size={18} className="text-blue-600 dark:text-blue-400" />
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={1}
              placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
              value={inputs.weight}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, weight: e.target.value }))
              }
              className="max-w-xs"
              inputMode="decimal"
              step="any"
            />
          </div>

          {/* Height */}
          <div>
            <Label className="text-slate-900 dark:text-slate-100 font-semibold mb-1 flex items-center gap-1">
              <Activity size={18} className="text-blue-600 dark:text-blue-400" />
              Height ({unit === "metric" ? "cm" : "ft + in"})
            </Label>
            {unit === "metric" ? (
              <Input
                id="heightMetric"
                type="number"
                min={30}
                max={300}
                placeholder="e.g. 175"
                value={inputs.heightMetric}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, heightMetric: e.target.value }))
                }
                className="max-w-xs"
                inputMode="decimal"
                step="any"
              />
            ) : (
              <div className="flex gap-3 max-w-xs">
                <div className="flex-1">
                  <Input
                    id="heightFt"
                    type="number"
                    min={0}
                    max={9}
                    placeholder="ft"
                    value={inputs.heightFt}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, heightFt: e.target.value }))
                    }
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    id="heightIn"
                    type="number"
                    min={0}
                    max={11}
                    placeholder="in"
                    value={inputs.heightIn}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, heightIn: e.target.value }))
                    }
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {}}
              disabled={results.bmr === null}
              aria-label="Calculate BMR"
            >
              Calculate
            </Button>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={onReset}
              aria-label="Reset form"
            >
              <RotateCcw className="mr-2" size={18} />
              Reset
            </Button>
          </div>

          {/* Results */}
          {results.bmr !== null && (
            <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-400 border">
              <CardContent>
                <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-1">
                  Your Basal Metabolic Rate (BMR)
                </h3>
                <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
                  {results.bmrRounded} kcal/day
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-1 text-sm max-w-xl">
                  This is the estimated number of calories your body needs daily at rest to maintain
                  vital functions such as breathing, circulation, and cell production.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <section className="mt-10 max-w-3xl">
        <h2 className="text-blue-600 dark:text-blue-400 text-2xl font-semibold mb-6 flex items-center gap-2">
          <HelpCircle size={28} /> Frequently Asked Questions
        </h2>
        <ul className="space-y-6 text-slate-700 dark:text-slate-300">
          <li>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-lg">
              What is Basal Metabolic Rate (BMR)?
            </h3>
            <p>
              Basal Metabolic Rate (BMR) represents the minimum amount of energy your body requires
              to perform vital life-sustaining functions—such as breathing, circulation, and cell
              production—while at complete rest. It accounts for approximately 60-70% of your total
              daily energy expenditure.
            </p>
          </li>
          <li>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-lg">
              How is BMR calculated using the Mifflin-St Jeor equation?
            </h3>
            <p>
              The Mifflin-St Jeor equation estimates BMR based on your weight, height, age, and
              gender. It is considered one of the most accurate formulas for calculating resting
              energy expenditure in healthy adults.
            </p>
          </li>
          <li>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-lg">
              Why do I need to enter height in feet and inches for imperial units?
            </h3>
            <p>
              In the US and Canada, people commonly express height in feet and inches rather than
              total inches. Splitting height into feet and inches improves usability and accuracy
              when entering your height for BMR calculation.
            </p>
          </li>
          <li>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-lg">
              Can BMR change over time?
            </h3>
            <p>
              Yes, BMR can change due to factors like aging, changes in body composition, hormonal
              fluctuations, and health status. Regularly updating your BMR calculation helps tailor
              your nutrition and fitness plans effectively.
            </p>
          </li>
          <li>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-lg">
              How does gender affect BMR?
            </h3>
            <p>
              Gender influences BMR because men typically have a higher proportion of lean muscle
              mass compared to women, which increases resting energy expenditure. The Mifflin-St
              Jeor equation accounts for this difference by using distinct constants for males and
              females.
            </p>
          </li>
          <li>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-lg">
              Is BMR the same as total daily calorie needs?
            </h3>
            <p>
              No, BMR only accounts for calories burned at rest. Total daily calorie needs include
              BMR plus calories burned through physical activity, digestion, and other bodily
              functions. To estimate total needs, BMR is multiplied by an activity factor.
            </p>
          </li>
          <li>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-lg">
              How accurate is the Mifflin-St Jeor BMR calculator?
            </h3>
            <p>
              The Mifflin-St Jeor equation is widely validated and considered accurate for most
              healthy adults. However, individual variations exist, and factors like illness or
              extreme body compositions may affect precision.
            </p>
          </li>
          <li>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-lg">
              Why is tracking BMR important for weight management?
            </h3>
            <p>
              Knowing your BMR helps you understand your baseline calorie needs, which is essential
              for creating effective weight loss, maintenance, or gain plans. It ensures you
              consume an appropriate amount of calories relative to your body's resting energy
              expenditure.
            </p>
          </li>
        </ul>
      </section>

      {/* References Section */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-blue-600 dark:text-blue-400 text-2xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen size={28} /> References
        </h2>
        <ul>
          <li className="mb-4">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/8423390/"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg block mb-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals.
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The American Journal of Clinical Nutrition, 1990. This seminal paper introduced the Mifflin-St Jeor equation, now widely used for BMR estimation.
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
              Journal of the American Dietetic Association, 2005. This review validates the accuracy of Mifflin-St Jeor among other BMR equations.
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
              Provides evidence-based tools and explanations on energy expenditure and weight management.
            </p>
          </li>
          <li className="mb-4">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg block mb-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Centers for Disease Control and Prevention (CDC) - Assessing Your Weight
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Authoritative resource on body weight, BMI, and metabolic health for adults in the US.
            </p>
          </li>
          <li className="mb-4">
            <a
              href="https://www.ncbi.nlm.nih.gov/books/NBK279396/"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-lg block mb-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              National Center for Biotechnology Information (NCBI) - Energy Metabolism
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Comprehensive overview of energy metabolism, including basal metabolic rate and its physiological basis.
            </p>
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}