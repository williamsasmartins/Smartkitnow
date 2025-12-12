import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Activity,
  Scale,
  User,
  Heart,
  Flame,
  Info,
  AlertCircle,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Unit = "metric" | "imperial";
type Gender = "male" | "female";

export default function BmrMifflinStJeorCalculator() {
  // 1. STATE (Always include Unit Toggle if relevant)
  const [unit, setUnit] = useState<Unit>("metric");
  const [inputs, setInputs] = useState<{
    age?: string;
    gender?: Gender;
    weight?: string;
    height?: string;
  }>({ gender: "male" });

  // Input validation helpers
  const parsePositiveNumber = (value?: string) => {
    if (!value) return null;
    const n = Number(value);
    if (isNaN(n) || n <= 0) return null;
    return n;
  };

  // 2. MEDICAL CALCULATIONS (Validated formulas)
  // Mifflin-St Jeor Equation:
  // For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5
  // For women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161
  // Weight and height units depend on unit system.
  const results = useMemo(() => {
    const age = parsePositiveNumber(inputs.age);
    const weight = parsePositiveNumber(inputs.weight);
    const height = parsePositiveNumber(inputs.height);
    const gender = inputs.gender;

    if (
      age === null ||
      weight === null ||
      height === null ||
      !gender ||
      age < 10 ||
      age > 120
    ) {
      return null;
    }

    // Convert imperial to metric if needed
    // weight: lbs to kg (1 lb = 0.453592 kg)
    // height: inches to cm (1 in = 2.54 cm)
    const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
    const heightCm = unit === "imperial" ? height * 2.54 : height;

    // Mifflin-St Jeor calculation
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // BMR cannot be negative or zero, clamp minimum to 500 kcal/day for sanity
    if (bmr < 500) bmr = 500;

    return {
      bmr: Math.round(bmr),
      weightKg: weightKg.toFixed(1),
      heightCm: heightCm.toFixed(1),
      age,
      gender,
    };
  }, [inputs, unit]);

  // 3. FAQ DATA (Medical focus)
  const faqs = [
    {
      question: "How accurate is the Mifflin-St Jeor equation for estimating BMR?",
      answer:
        "The Mifflin-St Jeor equation is considered one of the most accurate predictive equations for Basal Metabolic Rate (BMR) in healthy adults. It has been validated against indirect calorimetry, the gold standard, with an average error margin of about 5-10%. However, individual variations due to genetics, body composition, and metabolic health can affect accuracy.",
    },
    {
      question: "Can medical conditions affect my BMR results?",
      answer:
        "Yes. Conditions such as hypothyroidism, hyperthyroidism, diabetes, and certain hormonal imbalances can significantly alter your basal metabolic rate. Medications and acute illnesses may also impact metabolism. Always consult your healthcare provider if you suspect your metabolism is abnormal.",
    },
    {
      question: "Why do I need to enter my gender for this calculation?",
      answer:
        "Biological sex influences basal metabolic rate due to differences in body composition, such as muscle mass and fat distribution. The Mifflin-St Jeor equation uses gender-specific constants to improve accuracy.",
    },
    {
      question: "What if I don’t know my exact height or weight?",
      answer:
        "Accurate measurements are crucial for reliable BMR estimation. Use a calibrated scale and a stadiometer or measuring tape. If you cannot measure precisely, try to provide your best estimate, but understand that this may reduce accuracy.",
    },
    {
      question: "Is BMR the same as Total Daily Energy Expenditure (TDEE)?",
      answer:
        "No. BMR represents the calories your body burns at complete rest to maintain vital functions. TDEE includes BMR plus calories burned through physical activity, digestion, and other daily activities. TDEE is typically higher than BMR.",
    },
    {
      question: "When should I see a doctor regarding my metabolism?",
      answer:
        "If you experience unexplained weight changes, fatigue, temperature intolerance, or other metabolic symptoms, consult a healthcare professional. They can perform diagnostic tests to evaluate your metabolic health.",
    },
    {
      question: "Can this calculator be used for children or elderly?",
      answer:
        "The Mifflin-St Jeor equation is validated primarily for adults aged 18-65. For children, adolescents, and elderly individuals, other specialized equations or clinical assessments are recommended.",
    },
    {
      question: "How often should I recalculate my BMR?",
      answer:
        "Recalculate your BMR when you have significant changes in weight, age (yearly), or health status. Regular updates help maintain accurate energy needs estimations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-700">
            <Scale className="w-5 h-5" />
            Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={unit}
            onValueChange={(value) => {
              setUnit(value as Unit);
              // Reset inputs on unit change to avoid confusion
              setInputs((prev) => ({
                age: prev.age,
                gender: prev.gender,
                weight: "",
                height: "",
              }));
            }}
          >
            <SelectTrigger aria-label="Select units">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-700">
            <User className="w-5 h-5" />
            Your Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Age */}
          <div>
            <Label htmlFor="age" className="flex items-center gap-1">
              Age (years) <HelpCircle className="w-4 h-4 text-teal-500" />
            </Label>
            <Input
              id="age"
              type="number"
              min={10}
              max={120}
              placeholder="e.g. 30"
              value={inputs.age ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, age: e.target.value }))
              }
              aria-describedby="age-desc"
            />
            <p
              id="age-desc"
              className="text-xs text-teal-600 mt-0.5 select-none"
            >
              Enter your age between 10 and 120 years.
            </p>
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender" className="flex items-center gap-1">
              Gender <User className="w-4 h-4 text-teal-500" />
            </Label>
            <Select
              id="gender"
              value={inputs.gender ?? ""}
              onValueChange={(value) =>
                setInputs((prev) => ({ ...prev, gender: value as Gender }))
              }
              aria-label="Select gender"
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

          {/* Weight */}
          <div>
            <Label htmlFor="weight" className="flex items-center gap-1">
              Weight ({unit === "metric" ? "kg" : "lbs"}){" "}
              <Scale className="w-4 h-4 text-teal-500" />
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
              value={inputs.weight ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, weight: e.target.value }))
              }
              aria-describedby="weight-desc"
            />
            <p
              id="weight-desc"
              className="text-xs text-teal-600 mt-0.5 select-none"
            >
              Enter your weight in {unit === "metric" ? "kilograms" : "pounds"}.
            </p>
          </div>

          {/* Height */}
          <div>
            <Label htmlFor="height" className="flex items-center gap-1">
              Height ({unit === "metric" ? "cm" : "inches"}){" "}
              <Scale className="w-4 h-4 text-teal-500" />
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
              value={inputs.height ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, height: e.target.value }))
              }
              aria-describedby="height-desc"
            />
            <p
              id="height-desc"
              className="text-xs text-teal-600 mt-0.5 select-none"
            >
              Enter your height in {unit === "metric" ? "centimeters" : "inches"}.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card className="bg-gradient-to-r from-teal-100 to-blue-100 border-teal-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Flame className="w-6 h-6" />
              Basal Metabolic Rate (BMR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-teal-900 tabular-nums">
              {results.bmr.toLocaleString()} kcal/day
            </p>
            <p className="mt-2 text-teal-700">
              This is the estimated number of calories your body burns at rest to
              maintain vital functions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-2 items-start">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Results are for informational purposes only and do not constitute medical
          advice. Consult a healthcare professional for diagnosis.
        </p>
      </div>
    </div>
  );

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12 text-teal-900 max-w-prose">
      {/* How to Use */}
      <section id="how-to-use" className="prose prose-teal">
        <h2>How to Use</h2>
        <p>
          This calculator estimates your Basal Metabolic Rate (BMR) using the
          Mifflin-St Jeor equation. To get the most accurate results, please enter
          your age, biological sex, weight, and height as precisely as possible.
        </p>
        <ul>
          <li>
            <strong>Age:</strong> Enter your age in years. The calculator is
            validated for ages 10 to 120.
          </li>
          <li>
            <strong>Gender:</strong> Select your biological sex (male or female),
            as it affects the calculation constants.
          </li>
          <li>
            <strong>Weight:</strong> Enter your weight in kilograms (metric) or
            pounds (imperial). Use a calibrated scale for accuracy.
          </li>
          <li>
            <strong>Height:</strong> Enter your height in centimeters (metric) or
            inches (imperial). Use a stadiometer or measuring tape.
          </li>
        </ul>
        <p>
          Use the unit toggle to switch between metric and imperial units. Changing
          units will reset weight and height inputs to avoid confusion.
        </p>
        <p>
          Accurate measurements are essential because small errors in weight or
          height can significantly affect your BMR estimation.
        </p>
      </section>

      {/* The Science Behind It */}
      <section id="formula" className="prose prose-teal">
        <h2>The Science Behind It (Formula)</h2>
        <p>
          Basal Metabolic Rate (BMR) is the number of calories your body requires
          to maintain vital physiological functions such as breathing, circulation,
          and cellular metabolism while at complete rest.
        </p>
        <p>
          The <strong>Mifflin-St Jeor equation</strong> is a widely accepted and
          validated formula to estimate BMR in adults. It was developed in 1990 and
          has been shown to be more accurate than older formulas like Harris-Benedict.
        </p>
        <p>
          The equation is gender-specific and uses weight, height, and age as
          variables:
        </p>
        <pre className="bg-teal-50 p-4 rounded border border-teal-200 font-mono text-sm">
          {`For men:
BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5

For women:
BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161`}
        </pre>
        <p>
          <strong>Variables:</strong>
        </p>
        <ul>
          <li>
            <code>weight</code>: Your body mass in kilograms (kg). If using pounds,
            it is converted to kg (1 lb = 0.453592 kg).
          </li>
          <li>
            <code>height</code>: Your stature in centimeters (cm). If using inches,
            it is converted to cm (1 in = 2.54 cm).
          </li>
          <li>
            <code>age</code>: Your age in years.
          </li>
          <li>
            <code>gender</code>: Biological sex, which affects the constant added or
            subtracted.
          </li>
        </ul>
        <p>
          This formula estimates the calories burned at rest, excluding physical
          activity or digestion.
        </p>
      </section>

      {/* Clinical Example */}
      <section id="example" className="prose prose-teal">
        <h2>Clinical Example</h2>
        <p>
          Consider a 35-year-old female who weighs 70 kg and is 165 cm tall. Let's
          calculate her BMR step-by-step:
        </p>
        <ol>
          <li>
            <strong>Identify variables:</strong> weight = 70 kg, height = 165 cm,
            age = 35 years, gender = female.
          </li>
          <li>
            <strong>Apply the Mifflin-St Jeor formula for females:</strong>
            <br />
            BMR = (10 × 70) + (6.25 × 165) − (5 × 35) − 161
          </li>
          <li>
            <strong>Calculate each term:</strong>
            <br />
            10 × 70 = 700
            <br />
            6.25 × 165 = 1031.25
            <br />
            5 × 35 = 175
          </li>
          <li>
            <strong>Sum the terms:</strong>
            <br />
            BMR = 700 + 1031.25 − 175 − 161 = 1395.25 kcal/day
          </li>
          <li>
            <strong>Interpretation:</strong> This woman’s body burns approximately
            1395 calories per day at rest to maintain vital functions.
          </li>
        </ol>
        <p>
          This value can be used as a baseline for nutritional planning and weight
          management.
        </p>
      </section>

      {/* Health FAQ */}
      <section id="faq" className="prose prose-teal">
        <h2>Health FAQ</h2>
        {faqs.map(({ question, answer }, i) => (
          <article key={i}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </article>
        ))}
      </section>

      {/* Medical References */}
      <section id="references" className="prose prose-teal">
        <h2>Medical References</h2>
        <ol>
          <li>
            Frankenfield, D. C., Roth-Yousey, L., & Compher, C. (2005). Comparison of
            predictive equations for resting metabolic rate in healthy nonobese and
            obese adults: a systematic review. <em>Journal of the American Dietetic Association</em>, 105(5), 775-789.
            https://doi.org/10.1016/j.jada.2005.02.005
          </li>
          <li>
            Mifflin, M. D., St Jeor, S. T., Hill, L. A., Scott, B. J., Daugherty, S. A.,
            & Koh, Y. O. (1990). A new predictive equation for resting energy
            expenditure in healthy individuals. <em>American Journal of Clinical Nutrition</em>, 51(2), 241-247.
            https://doi.org/10.1093/ajcn/51.2.241
          </li>
          <li>
            National Institutes of Health (NIH). (2023). Resting Metabolic Rate and
            Energy Expenditure. Retrieved from{" "}
            <a
              href="https://www.niddk.nih.gov/health-information/weight-management/resting-metabolic-rate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 underline"
            >
              https://www.niddk.nih.gov/health-information/weight-management/resting-metabolic-rate
            </a>
          </li>
          <li>
            Centers for Disease Control and Prevention (CDC). (2022). Adult BMI
            Calculator. Retrieved from{" "}
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 underline"
            >
              https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html
            </a>
          </li>
          <li>
            Mayo Clinic. (2023). Metabolism and weight loss: How you burn calories.
            Retrieved from{" "}
            <a
              href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/metabolism/art-20046508"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 underline"
            >
              https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/metabolism/art-20046508
            </a>
          </li>
          <li>
            World Health Organization (WHO). (2021). Obesity and overweight fact
            sheet. Retrieved from{" "}
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 underline"
            >
              https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight
            </a>
          </li>
        </ol>
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
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "The Science (Formula)" },
        { id: "example", label: "Clinical Example" },
        { id: "faq", label: "Medical FAQ" },
        { id: "references", label: "References" },
      ]}
      formula={{
        title: "Medical Equation Used",
        formula:
          "For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5\nFor women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161",
        variables: [
          { symbol: "weight", description: "Body weight in kilograms (kg)" },
          { symbol: "height", description: "Height in centimeters (cm)" },
          { symbol: "age", description: "Age in years" },
          {
            symbol: "gender",
            description:
              "Biological sex (male or female), affects constants in formula",
          },
        ],
      }}
      example={{
        title: "Patient Scenario",
        scenario:
          "A 35-year-old female weighing 70 kg and 165 cm tall wants to know her BMR.",
        steps: [
          "Identify variables: weight = 70 kg, height = 165 cm, age = 35, gender = female.",
          "Apply formula: BMR = (10 × 70) + (6.25 × 165) − (5 × 35) − 161",
          "Calculate terms: 700 + 1031.25 − 175 − 161",
          "Sum terms: 1395.25 kcal/day",
          "Interpretation: She burns approximately 1395 calories per day at rest.",
        ],
        result:
          "This BMR value helps guide nutritional and energy needs for weight management.",
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
          icon: "🧮",
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