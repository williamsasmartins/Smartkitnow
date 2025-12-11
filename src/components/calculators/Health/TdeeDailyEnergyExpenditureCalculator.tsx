import { useState, useMemo } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calculator,
  Info,
  Activity,
  Scale,
  User,
  Ruler,
  Flame,
  Check,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (light exercise 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise 6-7 days/week)", value: 1.725 },
  { label: "Extra active (very hard exercise & physical job)", value: 1.9 },
];

export default function TdeeDailyEnergyExpenditureCalculator() {
  // 1. STATE & LOGIC (Implement based on Logic Recipe)
  const [inputs, setInputs] = useState({
    gender: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
  });

  const [calculated, setCalculated] = useState(false);

  // Parse inputs safely
  const gender = inputs.gender;
  const age = Number(inputs.age);
  const height = Number(inputs.height);
  const weight = Number(inputs.weight);
  const activityFactor = Number(inputs.activityLevel);

  // Mifflin-St Jeor Formula:
  // For men: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
  // For women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
  // TDEE = BMR * Activity Factor

  const results = useMemo(() => {
    if (
      !gender ||
      !age ||
      !height ||
      !weight ||
      !activityFactor ||
      age <= 0 ||
      height <= 0 ||
      weight <= 0
    )
      return null;

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      return null;
    }

    const tdee = bmr * activityFactor;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
    };
  }, [gender, age, height, weight, activityFactor]);

  // 2. FAQ DATA (WRITE REAL CONTENT HERE - NO PLACEHOLDERS)
  const faqs = [
    {
      question: "What is the difference between BMR and TDEE?",
      answer:
        "Basal Metabolic Rate (BMR) represents the number of calories your body needs at rest to maintain vital functions such as breathing and circulation. Total Daily Energy Expenditure (TDEE) includes your BMR plus the calories burned through physical activities and digestion, providing a more comprehensive estimate of your daily calorie needs.",
    },
    {
      question: "How can I use my TDEE for weight loss or weight gain?",
      answer:
        "To lose weight, you should consume fewer calories than your TDEE, creating a calorie deficit that forces your body to use stored fat for energy. Conversely, to gain weight, consume more calories than your TDEE, creating a calorie surplus that supports muscle growth and fat accumulation. Adjusting your calorie intake relative to your TDEE helps you manage your weight effectively.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "This calculator provides an estimation based on the widely accepted Mifflin-St Jeor formula combined with an activity multiplier. Individual calorie needs can vary due to factors like metabolism, muscle mass, and lifestyle, so actual results may differ. Use this as a guideline and adjust based on your personal progress and feedback.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 3. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Build the UI based on Logic Recipe inputs */}
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <User className="h-5 w-5 text-sky-500" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gender */}
          <div>
            <Label htmlFor="gender" className="mb-1 block font-medium">
              Gender
            </Label>
            <Select
              value={inputs.gender}
              onValueChange={(value) =>
                setInputs((prev) => ({ ...prev, gender: value }))
              }
              id="gender"
              aria-label="Select Gender"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div>
            <Label htmlFor="age" className="mb-1 block font-medium">
              Age (years)
            </Label>
            <Input
              type="number"
              id="age"
              min={1}
              max={120}
              placeholder="e.g. 30"
              value={inputs.age}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, age: e.target.value }))
              }
            />
          </div>

          {/* Height */}
          <div>
            <Label htmlFor="height" className="mb-1 block font-medium">
              Height (cm)
            </Label>
            <Input
              type="number"
              id="height"
              min={50}
              max={300}
              placeholder="e.g. 175"
              value={inputs.height}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, height: e.target.value }))
              }
            />
          </div>

          {/* Weight */}
          <div>
            <Label htmlFor="weight" className="mb-1 block font-medium">
              Weight (kg)
            </Label>
            <Input
              type="number"
              id="weight"
              min={20}
              max={500}
              placeholder="e.g. 70"
              value={inputs.weight}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, weight: e.target.value }))
              }
            />
          </div>

          {/* Activity Level */}
          <div>
            <Label htmlFor="activityLevel" className="mb-1 block font-medium">
              Activity Level
            </Label>
            <Select
              value={inputs.activityLevel}
              onValueChange={(value) =>
                setInputs((prev) => ({ ...prev, activityLevel: value }))
              }
              id="activityLevel"
              aria-label="Select Activity Level"
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
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={() => setCalculated(true)}
          disabled={
            !gender ||
            !age ||
            !height ||
            !weight ||
            !activityFactor ||
            age <= 0 ||
            height <= 0 ||
            weight <= 0
          }
          aria-label="Calculate TDEE"
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 text-base font-medium"
          onClick={() => {
            setInputs({
              gender: "",
              age: "",
              height: "",
              weight: "",
              activityLevel: "",
            });
            setCalculated(false);
          }}
          aria-label="Reset inputs"
        >
          Reset
        </Button>
      </div>

      {calculated && results && (
        <div className="space-y-6 mt-6">
          {/* Result Card with Gradients */}
          <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {results.tdee.toLocaleString()} Calories / Day
              </p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                This is your estimated Total Daily Energy Expenditure (TDEE),
                the total calories you burn daily including all activities.
              </p>
              <Table className="mt-4 max-w-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Calories</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>BMR (Basal Metabolic Rate)</TableCell>
                    <TableCell>{results.bmr.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Activity Factor</TableCell>
                    <TableCell>{activityFactor}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // 4. EDITORIAL (WRITE REAL SEO CONTENT HERE)
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
          <p>
            Total Daily Energy Expenditure (TDEE) represents the total number
            of calories your body burns in a day, accounting for all activities
            including exercise, daily movement, and basic bodily functions. It
            is a crucial metric for understanding your energy needs and
            managing your weight effectively. Knowing your TDEE helps you
            tailor your calorie intake to maintain, lose, or gain weight based
            on your goals.
          </p>
          <p>
            To use this calculator, enter your gender, age, height in
            centimeters, weight in kilograms, and select your typical activity
            level from sedentary to very active. The calculator uses the
            scientifically validated Mifflin-St Jeor formula to estimate your
            Basal Metabolic Rate (BMR), then multiplies it by an activity factor
            to estimate your TDEE. Once calculated, you will see the estimated
            calories you burn daily, which you can use to adjust your diet and
            exercise plans accordingly.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-500" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {f.question}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="references"
        className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12"
      >
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-500" />
          References & Resources
        </h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.
              A new predictive equation for resting energy expenditure in
              healthy individuals. Am J Clin Nutr. 1990.
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              This foundational study introduced the Mifflin-St Jeor equation,
              widely used for estimating basal metabolic rate in adults.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.acefitness.org/education-and-resources/lifestyle/blog/6641/how-to-calculate-total-daily-energy-expenditure-tdee/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              American Council on Exercise (ACE) - How to Calculate Total Daily
              Energy Expenditure (TDEE)
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              A practical guide explaining TDEE calculation and its application
              for fitness and nutrition planning.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="TDEE — Total Daily Energy Expenditure Calculator"
      description="Estimate your Total Daily Energy Expenditure (TDEE). Learn how many calories you need daily to maintain, lose, or gain weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      formula={{
        title: "Formula Used",
        formula:
          "TDEE = BMR × Activity Factor, where BMR (men) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5; BMR (women) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161",
        variables: [
          { symbol: "weight", description: "Body weight in kilograms" },
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
          {
            symbol: "Activity Factor",
            description:
              "Multiplier based on physical activity level (ranges from 1.2 to 1.9)",
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "A 30-year-old female, 165 cm tall, weighing 60 kg, who is moderately active (activity factor 1.55).",
        steps: [
          {
            step: 1,
            description:
              "Calculate BMR using Mifflin-St Jeor formula for women.",
            calculation: "10 × 60 + 6.25 × 165 - 5 × 30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25",
          },
          {
            step: 2,
            description: "Multiply BMR by activity factor to get TDEE.",
            calculation: "1320.25 × 1.55 = 2046.39",
          },
        ],
        result:
          "The estimated TDEE is approximately 2046 calories per day, meaning she needs this amount to maintain her current weight.",
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
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "⚖️",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "⚖️",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "🧮",
        },
        {
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "🧮",
        },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}