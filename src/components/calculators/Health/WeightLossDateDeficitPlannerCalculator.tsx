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

export default function WeightLossDateDeficitPlannerCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    currentWeight?: number;
    targetWeight?: number;
    dailyCalorieDeficit?: number;
    startDate?: string;
  }>({
    currentWeight: undefined,
    targetWeight: undefined,
    dailyCalorieDeficit: undefined,
    startDate: new Date().toISOString().slice(0, 10),
  });

  // Helper: Convert lbs to kg and vice versa
  const toKg = (lbs: number) => lbs * 0.45359237;
  const toLbs = (kg: number) => kg / 0.45359237;

  // 2. LOGIC
  const results = useMemo(() => {
    const {
      currentWeight,
      targetWeight,
      dailyCalorieDeficit,
      startDate,
    } = inputs;

    if (
      currentWeight === undefined ||
      targetWeight === undefined ||
      dailyCalorieDeficit === undefined ||
      dailyCalorieDeficit <= 0 ||
      currentWeight <= targetWeight
    ) {
      return { value: 0, label: "", category: "" };
    }

    // Constants
    // 1 lb fat ≈ 3500 kcal deficit
    const CALORIES_PER_POUND = 3500;

    // Calculate total pounds to lose
    const poundsToLose = currentWeight - targetWeight;

    // Calculate total calories to burn
    const totalCalorieDeficit = poundsToLose * CALORIES_PER_POUND;

    // Calculate days needed to reach target weight
    const daysNeeded = Math.ceil(totalCalorieDeficit / dailyCalorieDeficit);

    // Calculate target date
    const start = startDate ? new Date(startDate) : new Date();
    const targetDate = new Date(start);
    targetDate.setDate(start.getDate() + daysNeeded);

    // Format date string (MM/DD/YYYY)
    const formattedDate = targetDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      value: formattedDate,
      label: `Estimated Date to Reach ${targetWeight} ${
        unit === "imperial" ? "lbs" : "kg"
      }`,
      category: `${daysNeeded} day${daysNeeded > 1 ? "s" : ""} needed`,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Weight Loss Date & Deficit Planner?",
      answer:
        "The Weight Loss Date & Deficit Planner is a specialized tool designed to help individuals estimate the date they will reach their target weight based on their current weight, desired weight, and daily calorie deficit. By understanding the relationship between calorie deficit and fat loss, users can plan realistic timelines for their weight loss journey. This planner uses the scientifically accepted conversion that approximately 3,500 calories equate to one pound of fat loss, allowing for an evidence-based estimate of weight loss duration.",
    },
    {
      question: "How should I interpret the results from this planner?",
      answer:
        "The result provides an estimated calendar date when you can expect to reach your target weight if you maintain the specified daily calorie deficit consistently. It is important to understand that this is an estimate based on average metabolic assumptions and does not account for individual variations such as metabolic adaptation, changes in physical activity, or water retention. The planner assumes a steady calorie deficit and weight loss rate, which may fluctuate in real life. Always consult with healthcare professionals before making significant changes to your diet or exercise routine.",
    },
    {
      question: "What are the limitations of this calculator?",
      answer:
        "This planner uses a simplified model based on the 3,500 calorie per pound rule, which is a general guideline and may not perfectly reflect individual metabolic responses. Factors such as age, sex, hormonal balance, muscle mass, and metabolic adaptations can influence actual weight loss rates. Additionally, the calculator assumes a linear weight loss trajectory, which is often not the case in real-world scenarios where plateaus and fluctuations occur. It also does not account for changes in lean body mass or water weight. Therefore, results should be used as a planning tool rather than an exact prediction.",
    },
    {
      question: "Can I use this planner if I want to gain weight or maintain weight?",
      answer:
        "This planner is specifically designed for weight loss scenarios where a calorie deficit is maintained. It is not suitable for weight gain or maintenance calculations, as those require different energy balance considerations. For weight gain, a calorie surplus is necessary, and for maintenance, calorie intake should match expenditure. Users interested in these goals should use calculators tailored to basal metabolic rate (BMR), total daily energy expenditure (TDEE), or weight gain planning for more accurate guidance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Input change handler
  function handleInputChange(
    field: keyof typeof inputs,
    value: string | number | undefined
  ) {
    if (value === "") value = undefined;
    setInputs((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" && (field === "startDate" || field === "unit")
          ? value
          : typeof value === "string"
          ? Number(value)
          : value,
    }));
  }

  // Unit conversion helper for inputs
  const displayWeight = (weight?: number) => {
    if (weight === undefined) return "";
    return unit === "imperial" ? weight.toString() : (weight * 0.45359237).toFixed(1);
  };
  const parseWeightInput = (val: string) => {
    const n = Number(val);
    if (isNaN(n)) return undefined;
    return unit === "imperial" ? n : n / 0.45359237;
  };

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

        {/* Current Weight */}
        <div>
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            type="number"
            min={1}
            step={0.1}
            placeholder={`e.g. ${unit === "imperial" ? "180" : "82"}`}
            value={
              inputs.currentWeight !== undefined
                ? unit === "imperial"
                  ? inputs.currentWeight
                  : (inputs.currentWeight * 0.45359237).toFixed(1)
                : ""
            }
            onChange={(e) =>
              handleInputChange(
                "currentWeight",
                parseWeightInput(e.target.value)
              )
            }
          />
        </div>

        {/* Target Weight */}
        <div>
          <Label htmlFor="targetWeight" className="text-slate-700 dark:text-slate-300">
            Target Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="targetWeight"
            type="number"
            min={1}
            step={0.1}
            placeholder={`e.g. ${unit === "imperial" ? "150" : "68"}`}
            value={
              inputs.targetWeight !== undefined
                ? unit === "imperial"
                  ? inputs.targetWeight
                  : (inputs.targetWeight * 0.45359237).toFixed(1)
                : ""
            }
            onChange={(e) =>
              handleInputChange(
                "targetWeight",
                parseWeightInput(e.target.value)
              )
            }
          />
        </div>

        {/* Daily Calorie Deficit */}
        <div>
          <Label
            htmlFor="dailyCalorieDeficit"
            className="text-slate-700 dark:text-slate-300"
          >
            Daily Calorie Deficit (kcal)
          </Label>
          <Input
            id="dailyCalorieDeficit"
            type="number"
            min={1}
            step={10}
            placeholder="e.g. 500"
            value={inputs.dailyCalorieDeficit ?? ""}
            onChange={(e) =>
              handleInputChange("dailyCalorieDeficit", e.target.value)
            }
          />
        </div>

        {/* Start Date */}
        <div>
          <Label htmlFor="startDate" className="text-slate-700 dark:text-slate-300">
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={inputs.startDate ?? new Date().toISOString().slice(0, 10)}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              currentWeight: undefined,
              targetWeight: undefined,
              dailyCalorieDeficit: undefined,
              startDate: new Date().toISOString().slice(0, 10),
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && results.value !== "" && (
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
          What is the Weight Loss Date & Deficit Planner?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Weight Loss Date & Deficit Planner is a scientifically grounded tool
          designed to help individuals estimate the timeline for reaching their
          target weight based on their current weight, desired weight, and daily
          calorie deficit. Weight loss fundamentally depends on creating a calorie
          deficit, where the body burns more calories than it consumes. This planner
          leverages the widely accepted principle that approximately 3,500 calories
          equate to one pound of fat loss, providing users with an evidence-based
          estimate of how long it will take to achieve their goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting your current weight, target weight, and daily calorie deficit,
          the planner calculates the total calorie deficit required and estimates
          the number of days needed to reach your goal. It then projects the exact
          calendar date when you can expect to hit your target weight if you maintain
          the specified deficit consistently. This empowers users to set realistic
          expectations and plan their weight loss journey with clarity and confidence.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          It is important to note that this planner provides an estimate based on
          average metabolic assumptions and does not account for individual
          variations such as metabolic adaptation, changes in physical activity,
          or water retention. Weight loss is often non-linear and influenced by many
          factors, but this tool offers a strong foundational framework for planning
          and motivation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are embarking on a new weight loss journey or adjusting your
          current plan, the Weight Loss Date & Deficit Planner serves as a trusted
          companion to help you understand the timeline ahead and stay committed to
          your health goals.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Weight Loss Date & Deficit Planner is straightforward and requires
          just a few key inputs. Follow these steps to get an accurate estimate of
          your weight loss timeline:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Enter your current body weight. The
            default unit is pounds (lbs) for Imperial or kilograms (kg) for Metric.
          </li>
          <li>
            <strong>Target Weight:</strong> Input the weight you aim to achieve. Make
            sure this is less than your current weight for the calculator to work
            properly.
          </li>
          <li>
            <strong>Daily Calorie Deficit:</strong> Specify the average number of
            calories you plan to reduce from your daily intake or burn through
            exercise. A safe and sustainable deficit is typically between 300-750
            kcal/day.
          </li>
          <li>
            <strong>Start Date:</strong> Choose the date you plan to begin your
            calorie deficit. This helps the planner project the exact calendar date
            you will reach your target weight.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these values, click the "Calculate" button to see your
          estimated weight loss completion date along with the total days required.
          Use the "Reset" button to clear inputs and start a new calculation.
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
              href="https://www.niddk.nih.gov/health-information/weight-management/calories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative resource on calories, weight management, and obesity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/healthyweight/losing_weight/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Centers for Disease Control and Prevention (CDC) - Losing Weight
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guidelines on safe and effective weight loss strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.healthline.com/nutrition/how-many-calories-should-you-eat-per-day"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Healthline - How Many Calories Should You Eat Per Day?
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Detailed explanation of calorie needs and deficits for weight loss.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. National Center for Biotechnology Information (NCBI) - Weight Loss and Calorie Deficit Research
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Peer-reviewed research on the relationship between calorie deficit and fat loss.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Weight Loss Date & Deficit Planner"
      description="Plan your weight loss journey timeline. Calculate the exact date you will reach your target weight based on your daily calorie deficit."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Days Needed = (Current Weight - Target Weight) × 3500 ÷ Daily Calorie Deficit",
        variables: [
          {
            symbol: "Current Weight",
            description: "Your current body weight in pounds (lbs) or kilograms (kg)",
          },
          {
            symbol: "Target Weight",
            description: "Your desired body weight in pounds (lbs) or kilograms (kg)",
          },
          {
            symbol: "3500",
            description:
              "Calories equivalent to approximately one pound of fat",
          },
          {
            symbol: "Daily Calorie Deficit",
            description:
              "The number of calories you plan to reduce or burn daily",
          },
          {
            symbol: "Days Needed",
            description:
              "Estimated number of days to reach your target weight",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John weighs 200 lbs and wants to reach 170 lbs. He plans to maintain a daily calorie deficit of 500 kcal starting today.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate total pounds to lose: 200 lbs - 170 lbs = 30 lbs",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total calories to burn: 30 lbs × 3500 kcal = 105,000 kcal",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate days needed: 105,000 kcal ÷ 500 kcal/day = 210 days",
          },
          {
            label: "Step 4",
            explanation:
              "Add 210 days to today's date to find the estimated target date",
          },
        ],
        result:
          "If John maintains a 500 kcal daily deficit, he will reach 170 lbs in approximately 210 days from his start date.",
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
        { id: "what-is", label: "What is Weight Loss Date & Deficit Planner?" },
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