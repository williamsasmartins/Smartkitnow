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
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput } from "@/lib/utils";

export default function DailyCalorieNeedsGoalCalculator() {
  // 1. STATE (Imperial Default)
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));
  const [inputs, setInputs] = useState({
    age: "",
    sex: "male",
    weight: "",
    heightFeet: "",
    heightInches: "",
    heightCm: "",
    activityLevel: "sedentary",
    goal: "maintain",
  });

  // Helper: Convert height to cm
  const heightCm = useMemo(() => {
    if (unit === "imperial") {
      const feet = parseFloat(inputs.heightFeet) || 0;
      const inches = parseFloat(inputs.heightInches) || 0;
      return feet * 30.48 + inches * 2.54;
    } else {
      return parseFloat(inputs.heightCm) || 0;
    }
  }, [inputs.heightFeet, inputs.heightInches, inputs.heightCm, unit]);

  // Helper: Convert weight to kg
  const weightKg = useMemo(() => {
    if (unit === "imperial") {
      return (parseFloat(inputs.weight) || 0) * 0.45359237;
    } else {
      return parseFloat(inputs.weight) || 0;
    }
  }, [inputs.weight, unit]);

  // 2. LOGIC
  // Calculate BMR using Mifflin-St Jeor Equation (most accurate for US/Canada)
  // BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + s
  // s = +5 for males, -161 for females
  // Then multiply by activity factor
  // Adjust calories based on goal:
  // - Weight loss: subtract 15-20% calories
  // - Maintenance: no change
  // - Muscle gain: add 10-15% calories

  const activityFactors: Record<string, number> = {
    sedentary: 1.2, // little or no exercise
    light: 1.375, // light exercise/sports 1-3 days/week
    moderate: 1.55, // moderate exercise/sports 3-5 days/week
    active: 1.725, // hard exercise/sports 6-7 days a week
    veryActive: 1.9, // very hard exercise/sports & physical job or 2x training
  };

  const results = useMemo(() => {
    const age = parseInt(inputs.age);
    if (
      !age ||
      age < 10 ||
      age > 120 ||
      !weightKg ||
      weightKg < 20 ||
      !heightCm ||
      heightCm < 50
    ) {
      return { value: 0, label: "", category: "" };
    }

    const s = inputs.sex === "male" ? 5 : -161;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;

    const activityFactor = activityFactors[inputs.activityLevel] || 1.2;
    const tdee = bmr * activityFactor;

    let calorieGoal = tdee;
    let category = "";

    switch (inputs.goal) {
      case "lose":
        calorieGoal = tdee * 0.8; // 20% deficit
        category = "Weight Loss";
        break;
      case "mildLose":
        calorieGoal = tdee * 0.85; // 15% deficit
        category = "Mild Weight Loss";
        break;
      case "maintain":
        calorieGoal = tdee;
        category = "Maintenance";
        break;
      case "mildGain":
        calorieGoal = tdee * 1.10; // 10% surplus
        category = "Mild Muscle Gain";
        break;
      case "gain":
        calorieGoal = tdee * 1.15; // 15% surplus
        category = "Muscle Gain";
        break;
      default:
        calorieGoal = tdee;
        category = "Maintenance";
    }

    return {
      value: Math.round(calorieGoal),
      label: "Calories per day",
      category,
    };
  }, [inputs, weightKg, heightCm]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Daily Calorie Needs (Goal-based) calculator?",
      answer:
        "This calculator estimates the number of calories you need to consume daily to achieve your specific health goal, whether it is weight loss, maintenance, or muscle gain. It uses your personal details such as age, sex, weight, height, and activity level to calculate your Basal Metabolic Rate (BMR) and adjusts it based on your goal and lifestyle.",
    },
    {
      question: "How should I interpret my daily calorie needs result?",
      answer:
        "The result represents the estimated number of calories you should consume each day to meet your goal. For weight loss, it suggests a calorie deficit; for maintenance, it matches your energy expenditure; and for muscle gain, it recommends a calorie surplus. Remember, these are estimates and individual needs may vary.",
    },
    {
      question: "What are the limitations of this calculator?",
      answer:
        "While this calculator uses validated formulas like the Mifflin-St Jeor equation and activity multipliers, it cannot account for all individual differences such as metabolic adaptations, hormonal imbalances, or medical conditions. Always consult a healthcare professional or registered dietitian for personalized advice.",
    },
    {
      question: "Why do I need to select an activity level?",
      answer:
        "Your activity level significantly impacts your total daily energy expenditure (TDEE). Sedentary individuals burn fewer calories than those who exercise regularly or have physically demanding jobs. Selecting the correct activity level ensures a more accurate calorie estimate tailored to your lifestyle.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "imperial" && next !== "metric") return;
              setInputs((prev) => {
                if (next === unit) return prev;

                const weightNum = parseFloat(prev.weight);
                const nextWeight =
                  prev.weight !== "" && !Number.isNaN(weightNum) && weightNum > 0
                    ? formatNumberForInput(
                        convertWeight(weightNum, unit === "imperial" ? "lb" : "kg", next === "imperial" ? "lb" : "kg"),
                        2,
                      )
                    : prev.weight;

                if (next === "metric") {
                  const feetNum = parseFloat(prev.heightFeet);
                  const inchesNum = parseFloat(prev.heightInches);
                  const canConvertHeight = prev.heightFeet !== "" && prev.heightInches !== "" && !Number.isNaN(feetNum) && !Number.isNaN(inchesNum);
                  const heightCm = canConvertHeight ? (feetNum * 12 + inchesNum) * 2.54 : prev.heightCm;
                  return {
                    ...prev,
                    weight: nextWeight,
                    heightCm: canConvertHeight ? formatNumberForInput(heightCm, 1) : prev.heightCm,
                    heightFeet: "",
                    heightInches: "",
                  };
                }

                const cmNum = parseFloat(prev.heightCm);
                const canConvertHeight = prev.heightCm !== "" && !Number.isNaN(cmNum) && cmNum > 0;
                if (!canConvertHeight) {
                  return {
                    ...prev,
                    weight: nextWeight,
                    heightCm: "",
                  };
                }
                const totalInches = cmNum / 2.54;
                let feet = Math.floor(totalInches / 12);
                let inches = Math.round(totalInches - feet * 12);
                if (inches === 12) {
                  feet += 1;
                  inches = 0;
                }
                return {
                  ...prev,
                  weight: nextWeight,
                  heightFeet: String(feet),
                  heightInches: String(inches),
                  heightCm: "",
                };
              });
              setUnit(next);
              setPreferredWeightUnit(next === "imperial" ? "lb" : "kg");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age */}
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={10}
            max={120}
            placeholder="e.g. 30"
            value={inputs.age}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, age: e.target.value }))
            }
          />
        </div>

        {/* Sex */}
        <div>
          <Label htmlFor="sex" className="text-slate-700 dark:text-slate-300">
            Sex
          </Label>
          <Select
            id="sex"
            value={inputs.sex}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, sex: value }))
            }
          >
            <SelectTrigger className="w-full">
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
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={20}
            max={1000}
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>

        {/* Height */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label
                htmlFor="heightFeet"
                className="text-slate-700 dark:text-slate-300"
              >
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={1}
                max={8}
                placeholder="e.g. 5"
                value={inputs.heightFeet}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, heightFeet: e.target.value }))
                }
              />
            </div>
            <div className="flex-1">
              <Label
                htmlFor="heightInches"
                className="text-slate-700 dark:text-slate-300"
              >
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                placeholder="e.g. 10"
                value={inputs.heightInches}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    heightInches: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        ) : (
          <div>
            <Label
              htmlFor="heightCm"
              className="text-slate-700 dark:text-slate-300"
            >
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={50}
              max={250}
              placeholder="e.g. 178"
              value={inputs.heightCm}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, heightCm: e.target.value }))
              }
            />
          </div>
        )}

        {/* Activity Level */}
        <div>
          <Label
            htmlFor="activityLevel"
            className="text-slate-700 dark:text-slate-300"
          >
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            value={inputs.activityLevel}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, activityLevel: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">
                Sedentary (little or no exercise)
              </SelectItem>
              <SelectItem value="light">
                Light (1-3 days/week exercise)
              </SelectItem>
              <SelectItem value="moderate">
                Moderate (3-5 days/week exercise)
              </SelectItem>
              <SelectItem value="active">
                Active (6-7 days/week exercise)
              </SelectItem>
              <SelectItem value="veryActive">
                Very Active (hard exercise or physical job)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Goal */}
        <div>
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Goal
          </Label>
          <Select
            id="goal"
            value={inputs.goal}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, goal: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">Weight Loss (20% deficit)</SelectItem>
              <SelectItem value="mildLose">Mild Weight Loss (15% deficit)</SelectItem>
              <SelectItem value="maintain">Maintenance</SelectItem>
              <SelectItem value="mildGain">Mild Muscle Gain (10% surplus)</SelectItem>
              <SelectItem value="gain">Muscle Gain (15% surplus)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              sex: "male",
              weight: "",
              heightFeet: "",
              heightInches: "",
              heightCm: "",
              activityLevel: "sedentary",
              goal: "maintain",
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
          What is the Daily Calorie Needs (Goal-based)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Daily calorie needs represent the total number of calories your body
          requires each day to maintain, lose, or gain weight based on your
          individual characteristics and lifestyle. This calculator estimates
          those needs by combining your Basal Metabolic Rate (BMR)—the energy
          your body uses at rest—with your physical activity level and your
          specific health goal. Understanding your daily calorie needs is
          fundamental to creating an effective nutrition plan tailored to your
          objectives.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation begins with the Mifflin-St Jeor equation, a widely
          validated formula used in clinical and research settings across
          Canada and the US. It estimates your BMR based on your age, sex,
          weight, and height. This BMR is then multiplied by an activity factor
          that reflects your typical daily physical activity, ranging from
          sedentary to very active. Finally, the result is adjusted according to
          your goal—whether you want to lose weight, maintain your current
          weight, or gain muscle mass.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This goal-based approach is essential because calorie needs vary
          significantly depending on your desired outcome. For example, a
          calorie deficit is necessary for weight loss, while a surplus is
          required for muscle gain. By providing a personalized calorie target,
          this calculator empowers you to make informed dietary choices that
          align with your health and fitness ambitions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to remember that while this tool offers a scientifically
          grounded estimate, individual variations such as metabolic rate,
          hormonal balance, and medical conditions can influence actual calorie
          needs. Therefore, it is recommended to use this calculator as a guide
          alongside professional advice from healthcare providers or registered
          dietitians.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate estimate of your daily calorie needs, follow
          these steps carefully. Begin by selecting your preferred unit system:
          Imperial (pounds, feet, inches) or Metric (kilograms, centimeters).
          Then, enter your age and sex, as these factors significantly influence
          your basal metabolic rate. Next, input your weight and height in the
          appropriate units.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Age and Sex:</strong> Provide your current age in years and
            select your biological sex. These inputs affect the BMR calculation.
          </li>
          <li>
            <strong>Weight and Height:</strong> Enter your weight and height
            accurately. For Imperial units, height is split into feet and inches
            for precision.
          </li>
          <li>
            <strong>Activity Level:</strong> Choose the description that best
            matches your typical daily physical activity, from sedentary to very
            active.
          </li>
          <li>
            <strong>Goal:</strong> Select your health goal: weight loss,
            maintenance, or muscle gain. This determines the calorie adjustment
            applied to your total daily energy expenditure.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering all required information, click the "Calculate" button
          to see your personalized daily calorie needs. Use this information to
          guide your dietary planning, ensuring your calorie intake aligns with
          your goals.
        </p>
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.
              A new predictive equation for resting energy expenditure in healthy
              individuals. Am J Clin Nutr. 1990.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Foundational study introducing the Mifflin-St Jeor equation for BMR
              estimation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Heart, Lung, and Blood Institute (NHLBI) - Body Weight
              Planner
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Provides tools and guidance on calorie needs and weight management
              for US populations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.healthlinkbc.ca/healthy-eating/energy-needs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. HealthLink BC - Energy Needs and Weight Management
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Canadian health resource explaining energy requirements and factors
              influencing calorie needs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.eatright.org/fitness/sports-and-performance/fueling-your-workout/how-many-calories-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Academy of Nutrition and Dietetics - How Many Calories Do I Need?
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Expert guidance on calculating calorie needs based on activity and
              goals.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Calorie Needs (Goal-based)"
      description="Determine daily calorie needs for your specific goal. Create a personalized nutrition plan for weight loss, maintenance, or muscle gain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "TDEE = BMR × Activity Factor; BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + s; s = +5 (male), −161 (female); Adjusted Calories = TDEE × Goal Factor",
        variables: [
          {
            symbol: "weight_kg",
            description: "Your weight in kilograms",
          },
          {
            symbol: "height_cm",
            description: "Your height in centimeters",
          },
          {
            symbol: "age",
            description: "Your age in years",
          },
          {
            symbol: "s",
            description: "+5 for males, −161 for females",
          },
          {
            symbol: "Activity Factor",
            description:
              "Multiplier based on your physical activity level (1.2 to 1.9)",
          },
          {
            symbol: "Goal Factor",
            description:
              "Calorie adjustment based on goal (e.g., 0.8 for weight loss, 1.15 for muscle gain)",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 30-year-old female, 5 feet 6 inches tall, weighing 150 lbs, moderately active, wants to lose weight.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg: 150 lbs × 0.4536 = 68.04 kg; Convert height to cm: 5 ft × 30.48 + 6 in × 2.54 = 167.64 cm.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate BMR: (10 × 68.04) + (6.25 × 167.64) − (5 × 30) − 161 = 1423 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Multiply by activity factor (moderate = 1.55): 1423 × 1.55 = 2206 kcal/day (TDEE).",
          },
          {
            label: "Step 4",
            explanation:
              "Apply goal factor for weight loss (20% deficit): 2206 × 0.8 = 1765 kcal/day.",
          },
        ],
        result:
          "The recommended daily calorie intake for this individual to lose weight is approximately 1765 calories.",
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
        { id: "what-is", label: "What is Daily Calorie Needs (Goal-based)?" },
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
