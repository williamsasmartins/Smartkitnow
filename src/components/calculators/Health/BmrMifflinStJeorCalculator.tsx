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

export default function BmrMifflinStJeorCalculator() {
  // 1. STATE (Imperial Default)
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));
  const [inputs, setInputs] = useState<{
    weight?: number;
    heightFeet?: number;
    heightInches?: number;
    heightCm?: number;
    age?: number;
    sex?: "male" | "female";
  }>({
    weight: undefined,
    heightFeet: undefined,
    heightInches: undefined,
    heightCm: undefined,
    age: undefined,
    sex: undefined,
  });

  // 2. LOGIC
  const results = useMemo(() => {
    const { weight, heightFeet, heightInches, heightCm, age, sex } = inputs;

    if (
      !weight ||
      !age ||
      !sex ||
      (unit === "imperial" &&
        (heightFeet === undefined || heightFeet < 0 || heightInches === undefined || heightInches < 0)) ||
      (unit === "metric" && (!heightCm || heightCm <= 0))
    ) {
      return { value: 0, label: "", category: "" };
    }

    // Convert inputs to metric for formula:
    // Weight in kg, height in cm
    let weightKg: number;
    let heightCmFinal: number;

    if (unit === "imperial") {
      weightKg = weight * 0.45359237;
      heightCmFinal = (heightFeet * 12 + heightInches) * 2.54;
    } else {
      weightKg = weight;
      heightCmFinal = heightCm!;
    }

    // Mifflin-St Jeor Equation:
    // For men: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
    // For women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
    let bmr = 10 * weightKg + 6.25 * heightCmFinal - 5 * age;
    if (sex === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // Round to nearest whole number
    const roundedBmr = Math.round(bmr);

    return {
      value: roundedBmr,
      label: "Calories/day",
      category: "Basal Metabolic Rate",
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Mifflin-St Jeor equation and why is it used for BMR?",
      answer:
        "The Mifflin-St Jeor equation is a widely accepted formula developed in 1990 to estimate Basal Metabolic Rate (BMR), which represents the number of calories your body needs at rest to maintain vital functions. It is considered more accurate than older formulas like Harris-Benedict, especially for modern populations, because it was derived from a more diverse and contemporary sample. This equation accounts for weight, height, age, and sex to provide a personalized estimate of resting energy expenditure.",
    },
    {
      question: "How should I interpret my BMR result?",
      answer:
        "Your BMR value indicates the approximate number of calories your body burns daily while at complete rest, such as when you are sleeping or sitting quietly. It does not include calories burned through physical activity or digestion. Understanding your BMR helps in planning calorie intake for weight maintenance, loss, or gain. For example, consuming fewer calories than your BMR plus activity needs will result in weight loss, while consuming more will lead to weight gain.",
    },
    {
      question: "What are the limitations of the Mifflin-St Jeor BMR calculation?",
      answer:
        "While the Mifflin-St Jeor equation is accurate for many individuals, it is still an estimate and does not account for factors like body composition (muscle vs. fat), hormonal imbalances, or metabolic disorders. It assumes average metabolic rates for age and sex groups, so athletes, elderly individuals, or those with certain medical conditions may have BMRs that differ significantly from the estimate. For precise measurement, indirect calorimetry is the gold standard but is less accessible.",
    },
    {
      question: "Why does the calculator default to imperial units and how do I switch to metric?",
      answer:
        "This calculator defaults to imperial units (lbs, ft, in) because it targets users in the US and Canada, where these units are most commonly used. However, you can easily switch to metric units (kg, cm) using the unit selector at the top of the input section. When switching units, the input fields will adjust accordingly to ensure accurate data entry and calculation.",
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
            onValueChange={(val) => {
              if (val !== "imperial" && val !== "metric") return;
              setInputs((prev) => {
                if (val === unit) return prev;
                if (val === "metric") {
                  const weightKg = prev.weight !== undefined ? prev.weight * 0.45359237 : undefined;
                  const heightIn =
                    prev.heightFeet !== undefined && prev.heightInches !== undefined
                      ? prev.heightFeet * 12 + prev.heightInches
                      : undefined;
                  const heightCm = heightIn !== undefined ? heightIn * 2.54 : prev.heightCm;
                  return {
                    ...prev,
                    weight: weightKg,
                    heightCm,
                    heightFeet: undefined,
                    heightInches: undefined,
                  };
                }

                const weightLb = prev.weight !== undefined ? prev.weight / 0.45359237 : undefined;
                const inchesTotal = prev.heightCm !== undefined ? prev.heightCm / 2.54 : undefined;
                if (inchesTotal === undefined) {
                  return {
                    ...prev,
                    weight: weightLb,
                    heightCm: undefined,
                  };
                }
                let feet = Math.floor(inchesTotal / 12);
                let inches = Math.round(inchesTotal - feet * 12);
                if (inches === 12) {
                  feet += 1;
                  inches = 0;
                }
                return {
                  ...prev,
                  weight: weightLb,
                  heightFeet: feet,
                  heightInches: inches,
                  heightCm: undefined,
                };
              });
              setUnit(val);
              setPreferredWeightUnit(val === "imperial" ? "lb" : "kg");
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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                weight: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your body weight in {unit === "imperial" ? "pounds (lbs)" : "kilograms (kg)"}
          </p>
        </div>

        {/* Height Inputs */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 5"
                value={inputs.heightFeet ?? ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    heightFeet: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
                aria-describedby="height-desc"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                step={1}
                placeholder="e.g. 8"
                value={inputs.heightInches ?? ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    heightInches: e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
                aria-describedby="height-desc"
              />
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 173"
              value={inputs.heightCm ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  heightCm: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              aria-describedby="height-desc"
            />
          </div>
        )}
        <p id="height-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your height in {unit === "imperial" ? "feet and inches" : "centimeters"}
        </p>

        {/* Age Input */}
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 30"
            value={inputs.age ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                age: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            aria-describedby="age-desc"
          />
          <p id="age-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your age in years
          </p>
        </div>

        {/* Sex Input */}
        <div>
          <Label htmlFor="sex" className="text-slate-700 dark:text-slate-300">
            Biological Sex
          </Label>
          <Select
            value={inputs.sex ?? ""}
            onValueChange={(val) =>
              setInputs((prev) => ({
                ...prev,
                sex: val === "" ? undefined : (val as "male" | "female"),
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select your biological sex for accurate calculation
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate BMR"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: undefined,
              heightFeet: undefined,
              heightInches: undefined,
              heightCm: undefined,
              age: undefined,
              sex: undefined,
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-label="BMR result">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
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
          What is the BMR — Basal Metabolic Rate (Mifflin-St Jeor)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Basal Metabolic Rate (BMR) is the amount of energy, measured in calories, that your body requires to maintain basic physiological functions while at complete rest. These functions include breathing, circulation, cell production, nutrient processing, and temperature regulation. The Mifflin-St Jeor equation is a scientifically validated formula used to estimate BMR based on an individual's weight, height, age, and biological sex. It is widely regarded as one of the most accurate predictive equations for resting energy expenditure in healthy adults.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Developed in 1990 by Mifflin and St Jeor, this equation was designed to improve upon older formulas like the Harris-Benedict equation, which tended to overestimate BMR in modern populations. The Mifflin-St Jeor formula incorporates updated metabolic data and reflects contemporary body compositions more accurately. It is commonly used by dietitians, fitness professionals, and healthcare providers in North America to tailor nutrition and weight management plans.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your BMR is essential because it forms the foundation for calculating your Total Daily Energy Expenditure (TDEE), which includes calories burned through physical activity and digestion. Knowing your BMR helps you make informed decisions about calorie intake for weight maintenance, loss, or gain. Since BMR accounts for the largest portion of your daily calorie needs (typically 60-75%), accurate estimation is crucial for effective health and fitness planning.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to note that while the Mifflin-St Jeor equation provides a reliable estimate, individual metabolic rates can vary due to factors such as muscle mass, hormonal status, and genetics. For precise measurement, clinical methods like indirect calorimetry are preferred but are less accessible. This calculator offers a practical and accessible way to estimate your BMR using the Mifflin-St Jeor formula.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide you with an accurate estimate of your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Follow these steps to ensure you input the correct information and interpret your results effectively:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select Unit System:</strong> Choose between Imperial (pounds, feet, inches) or Metric (kilograms, centimeters) units depending on your preference or regional standard. The calculator defaults to Imperial units for US and Canadian users.
          </li>
          <li>
            <strong>Enter Your Weight:</strong> Input your current body weight in the selected unit system. Ensure the value is accurate for the best results.
          </li>
          <li>
            <strong>Enter Your Height:</strong> For Imperial units, provide your height in feet and inches separately. For Metric units, enter your height in centimeters.
          </li>
          <li>
            <strong>Enter Your Age:</strong> Provide your age in years. Age affects metabolic rate, so accuracy is important.
          </li>
          <li>
            <strong>Select Biological Sex:</strong> Choose male or female as the equation uses different constants for each sex to reflect metabolic differences.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to see your estimated BMR displayed in calories per day.
          </li>
          <li>
            <strong>Reset:</strong> Use the reset button to clear all inputs and start a new calculation.
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
              href="https://pubmed.ncbi.nlm.nih.gov/22215863/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-247.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Original research article introducing the Mifflin-St Jeor equation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/books/NBK279396/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Institutes of Health (NIH) - Body Weight Planner and Energy Expenditure.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Overview of energy expenditure and BMR in clinical context.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.healthline.com/nutrition/how-many-calories-per-day"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Healthline - How Many Calories Per Day?
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Practical guide explaining BMR and calorie needs for weight management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Centers for Disease Control and Prevention (CDC) - Assessing Your Weight.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative resource on body weight, metabolism, and health.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMR — Basal Metabolic Rate (Mifflin-St Jeor)"
      description="Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Find out exactly how many calories your body burns at rest."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) + s",
        variables: [
          {
            symbol: "weight (kg)",
            description: "Your body weight in kilograms",
          },
          {
            symbol: "height (cm)",
            description: "Your height in centimeters",
          },
          {
            symbol: "age (years)",
            description: "Your age in years",
          },
          {
            symbol: "s",
            description:
              "Sex constant: +5 for males, −161 for females",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "Calculate the BMR for a 30-year-old female who weighs 150 lbs and is 5 feet 5 inches tall.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms: 150 lbs × 0.453592 = 68.04 kg",
          },
          {
            label: "Step 2",
            explanation:
              "Convert height to centimeters: (5 × 12 + 5) inches = 65 inches × 2.54 = 165.1 cm",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the formula: 10 × 68.04 + 6.25 × 165.1 − 5 × 30 − 161",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate: 680.4 + 1031.9 − 150 − 161 = 1401.3 calories/day",
          },
        ],
        result:
          "The estimated BMR is approximately 1401 calories per day, meaning this is the energy required to maintain basic bodily functions at rest.",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "❤️",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "💧",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "🥗",
        },
        {
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is BMR — Basal Metabolic Rate (Mifflin-St Jeor)?" },
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
