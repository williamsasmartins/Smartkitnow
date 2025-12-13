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

export default function MealCaloriesSplitCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    totalCalories: "",
    breakfastPercent: "25",
    lunchPercent: "35",
    dinnerPercent: "30",
    snacksPercent: "10",
  });

  // Helper to parse and clamp percentages
  const parsePercent = (val: string) => {
    const n = Number(val);
    if (isNaN(n) || n < 0) return 0;
    if (n > 100) return 100;
    return n;
  };

  // 2. LOGIC
  const results = useMemo(() => {
    const totalCalories = Number(inputs.totalCalories);
    if (!totalCalories || totalCalories <= 0) {
      return { value: 0, label: "", category: "" };
    }

    // Parse and clamp percentages
    const breakfastPercent = parsePercent(inputs.breakfastPercent);
    const lunchPercent = parsePercent(inputs.lunchPercent);
    const dinnerPercent = parsePercent(inputs.dinnerPercent);
    const snacksPercent = parsePercent(inputs.snacksPercent);

    // Sum of percentages
    const totalPercent =
      breakfastPercent + lunchPercent + dinnerPercent + snacksPercent;

    // Normalize if totalPercent != 100
    const normalizeFactor = totalPercent === 0 ? 0 : 100 / totalPercent;

    const bCal = Math.round(breakfastPercent * normalizeFactor * totalCalories / 100);
    const lCal = Math.round(lunchPercent * normalizeFactor * totalCalories / 100);
    const dCal = Math.round(dinnerPercent * normalizeFactor * totalCalories / 100);
    const sCal = Math.round(snacksPercent * normalizeFactor * totalCalories / 100);

    return {
      value: totalCalories,
      label: (
        <>
          <div className="mb-2 font-semibold text-lg">Calories Distribution</div>
          <ul className="text-left text-blue-900 dark:text-white space-y-1 text-xl font-semibold">
            <li>
              Breakfast: <span className="font-extrabold">{bCal} kcal</span> (
              {Math.round(breakfastPercent * normalizeFactor)}%)
            </li>
            <li>
              Lunch: <span className="font-extrabold">{lCal} kcal</span> (
              {Math.round(lunchPercent * normalizeFactor)}%)
            </li>
            <li>
              Dinner: <span className="font-extrabold">{dCal} kcal</span> (
              {Math.round(dinnerPercent * normalizeFactor)}%)
            </li>
            <li>
              Snacks: <span className="font-extrabold">{sCal} kcal</span> (
              {Math.round(snacksPercent * normalizeFactor)}%)
            </li>
          </ul>
        </>
      ),
      category: "",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the ideal way to split calories across meals?",
      answer:
        "The ideal calorie split varies based on individual lifestyle, metabolism, and health goals. A common approach is to allocate approximately 25-30% of daily calories to breakfast, 30-35% to lunch, 25-30% to dinner, and 10-15% to snacks. This helps maintain energy levels and manage hunger throughout the day. Adjustments can be made based on activity patterns and personal preferences.",
    },
    {
      question: "How should I interpret the calorie split results?",
      answer:
        "The results show how your total daily calorie intake is distributed across your meals and snacks based on the percentages you input. If the total percentages do not add up to 100%, the calculator normalizes them proportionally. Use these values to plan meal portions and food choices to meet your energy needs effectively.",
    },
    {
      question: "Are there limitations to using a fixed calorie split?",
      answer:
        "Yes, fixed calorie splits may not suit everyone. Factors like intermittent fasting, shift work, medical conditions, or specific diet plans (e.g., ketogenic, low-carb) can require different meal timing and calorie distributions. Always consider personal health conditions and consult a healthcare professional or dietitian for tailored advice.",
    },
    {
      question: "Can I customize the calorie percentages for each meal?",
      answer:
        "Absolutely. This calculator allows you to input your preferred calorie percentages for breakfast, lunch, dinner, and snacks. The tool will normalize these if they don't sum to 100%, ensuring the total calories are properly allocated. This flexibility supports personalized meal planning.",
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

        {/* Total Calories Input */}
        <div>
          <Label htmlFor="totalCalories" className="text-slate-700 dark:text-slate-300">
            Total Daily Calories Intake (kcal)
          </Label>
          <Input
            id="totalCalories"
            type="number"
            min={0}
            placeholder="e.g., 2000"
            value={inputs.totalCalories}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, totalCalories: e.target.value }))
            }
            className="mt-1"
          />
        </div>

        {/* Percentage Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="breakfastPercent" className="text-slate-700 dark:text-slate-300">
              Breakfast (%)
            </Label>
            <Input
              id="breakfastPercent"
              type="number"
              min={0}
              max={100}
              value={inputs.breakfastPercent}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, breakfastPercent: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lunchPercent" className="text-slate-700 dark:text-slate-300">
              Lunch (%)
            </Label>
            <Input
              id="lunchPercent"
              type="number"
              min={0}
              max={100}
              value={inputs.lunchPercent}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, lunchPercent: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dinnerPercent" className="text-slate-700 dark:text-slate-300">
              Dinner (%)
            </Label>
            <Input
              id="dinnerPercent"
              type="number"
              min={0}
              max={100}
              value={inputs.dinnerPercent}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, dinnerPercent: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="snacksPercent" className="text-slate-700 dark:text-slate-300">
              Snacks (%)
            </Label>
            <Input
              id="snacksPercent"
              type="number"
              min={0}
              max={100}
              value={inputs.snacksPercent}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, snacksPercent: e.target.value }))
              }
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              totalCalories: "",
              breakfastPercent: "25",
              lunchPercent: "35",
              dinnerPercent: "30",
              snacksPercent: "10",
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
                {results.value} kcal/day
              </p>
              <div className="mt-6">{results.label}</div>
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
          What is the Meal Calories Split (breakfast/lunch/dinner/snacks)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Meal Calories Split refers to the distribution of your total daily
          calorie intake across the main meals of the day—breakfast, lunch,
          dinner—and snacks. This split is a fundamental aspect of nutritional
          planning that helps regulate energy levels, hunger, and metabolism
          throughout the day. By allocating calories strategically, individuals
          can optimize satiety, maintain steady blood sugar levels, and support
          overall health and wellness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In North American contexts, particularly in the US and Canada, meal
          timing and calorie distribution often follow traditional patterns,
          with breakfast providing about a quarter of daily calories, lunch and
          dinner comprising the bulk, and snacks filling in gaps. However, these
          proportions can vary widely depending on lifestyle, activity levels,
          and personal health goals such as weight loss, muscle gain, or
          metabolic health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding and customizing your calorie split can empower you to
          better manage hunger cues, avoid overeating, and improve nutrient
          timing. For example, athletes might prefer a larger lunch and dinner
          to fuel workouts, while those practicing intermittent fasting may
          consume calories in fewer meals. This calculator provides a flexible
          tool to tailor your calorie distribution to your unique needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Proper calorie distribution also supports metabolic health by
          preventing large spikes and drops in blood glucose and insulin,
          which can contribute to chronic conditions such as type 2 diabetes.
          By balancing calories across meals and snacks, you can maintain
          consistent energy and support long-term health outcomes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you split your total daily calorie intake across
          breakfast, lunch, dinner, and snacks according to your preferred
          percentages. Follow these steps to use it effectively:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Enter Total Daily Calories:</strong> Input the total number
            of calories you plan to consume in a day. This can be based on your
            calculated energy needs or dietary goals.
          </li>
          <li>
            <strong>Set Meal Percentages:</strong> Adjust the percentage of
            calories you want to allocate to each meal and snacks. The default
            values reflect common splits but can be customized.
          </li>
          <li>
            <strong>Calculate:</strong> Click the Calculate button to see the
            calorie amounts for each meal based on your inputs. The calculator
            normalizes percentages if they do not sum to 100%.
          </li>
          <li>
            <strong>Plan Your Meals:</strong> Use the results to guide portion
            sizes and food choices, ensuring balanced energy distribution
            throughout the day.
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
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/eat/calories.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. National Heart, Lung, and Blood Institute - Calorie Intake
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative guidance on calorie needs and distribution for
              healthy weight management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.eatright.org/fitness/sports-and-performance/fueling-your-workout/how-to-split-your-calories-for-optimal-energy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Academy of Nutrition and Dietetics - How to Split Your Calories
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Expert advice on meal timing and calorie distribution for energy
              optimization.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.healthline.com/nutrition/how-to-split-calories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Healthline - How to Split Calories Throughout the Day
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Detailed explanation of calorie splitting strategies and their
              impact on metabolism.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/nutrition/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Centers for Disease Control and Prevention (CDC) - Nutrition
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive resources on nutrition and healthy eating patterns
              in the US context.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Meal Calories Split (breakfast/lunch/dinner/snacks)"
      description="Split your daily calories across meals efficiently. Plan balanced portions for breakfast, lunch, dinner, and snacks to control hunger."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Meal Calories = (Meal Percentage / Total Percentage) × Total Daily Calories",
        variables: [
          {
            symbol: "Meal Calories",
            description:
              "Calories allocated to a specific meal (breakfast, lunch, dinner, or snacks)",
          },
          {
            symbol: "Meal Percentage",
            description:
              "User-defined percentage of total calories for the meal",
          },
          {
            symbol: "Total Percentage",
            description:
              "Sum of all meal percentages input by the user (normalized to 100%)",
          },
          {
            symbol: "Total Daily Calories",
            description: "Total calories consumed in a day",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A person consumes 2,000 kcal daily and wants to split calories as 25% breakfast, 35% lunch, 30% dinner, and 10% snacks.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input total daily calories as 2000 kcal and set meal percentages accordingly.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculator normalizes percentages (they sum to 100%) and calculates calories per meal.",
          },
        ],
        result:
          "Breakfast: 500 kcal, Lunch: 700 kcal, Dinner: 600 kcal, Snacks: 200 kcal.",
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
        {
          id: "what-is",
          label: "What is Meal Calories Split (breakfast/lunch/dinner/snacks)?",
        },
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