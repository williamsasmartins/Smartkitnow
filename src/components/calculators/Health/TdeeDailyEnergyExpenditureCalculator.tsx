import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { Calculator, Activity, Scale, User, Ruler, Heart, Flame, BookOpen, HelpCircle, AlertCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function roundToNearest(value: number, nearest: number) {
  return Math.round(value / nearest) * nearest;
}

export default function TdeeDailyEnergyExpenditureCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    age?: number;
    sex?: "male" | "female";
    height?: number;
    weight?: number;
    activityLevel?: string;
  }>({
    age: undefined,
    sex: undefined,
    height: undefined,
    weight: undefined,
    activityLevel: undefined,
  });

  // Activity factor mapping based on common clinical categories
  const activityFactors: Record<string, number> = {
    sedentary: 1.2, // little or no exercise
    lightly_active: 1.375, // light exercise 1-3 days/week
    moderately_active: 1.55, // moderate exercise 3-5 days/week
    very_active: 1.725, // hard exercise 6-7 days/week
    extra_active: 1.9, // very hard exercise or physical job
  };

  // Mifflin-St Jeor Equation for BMR (Basal Metabolic Rate)
  // BMR (kcal/day) = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + s
  // where s = +5 for males, −161 for females
  // TDEE = BMR × Activity Factor

  const results = useMemo(() => {
    const { age, sex, height, weight, activityLevel } = inputs;
    if (
      age === undefined ||
      sex === undefined ||
      height === undefined ||
      weight === undefined ||
      activityLevel === undefined
    ) {
      return null;
    }

    // Convert inputs to metric if needed
    let weightKg = weight;
    let heightCm = height;
    if (unit === "imperial") {
      // weight in pounds to kg
      weightKg = weight / 2.20462;
      // height in inches to cm
      heightCm = height * 2.54;
    }

    // Calculate BMR using Mifflin-St Jeor
    const s = sex === "male" ? 5 : -161;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;

    // Get activity factor
    const factor = activityFactors[activityLevel] ?? 1.2;

    // Calculate TDEE
    const tdee = bmr * factor;

    return {
      bmr: roundToNearest(bmr, 1),
      tdee: roundToNearest(tdee, 1),
      weightKg,
      heightCm,
      activityFactor: factor,
    };
  }, [inputs, unit]);

  // FAQ content array with 7 questions
  const faqs = [
    {
      question: "Which validated formula is used in this TDEE calculator and how accurate is it?",
      answer:
        "This calculator uses the Mifflin-St Jeor equation, a widely validated formula for estimating basal metabolic rate (BMR), which is then multiplied by an activity factor to estimate Total Daily Energy Expenditure (TDEE). It was developed in 1990 and tested primarily in healthy adults aged 18-65 years. The expected margin of error is approximately ±10% for about 80% of the general population. Accuracy may decrease in athletes, elderly individuals over 65, children, or those with extreme body compositions. Always consider this an estimate and consult a healthcare provider for personalized assessment.",
    },
    {
      question: "How do medical conditions and medications affect TDEE calculations?",
      answer:
        "Medical conditions such as hypothyroidism can lower your basal metabolic rate, while hyperthyroidism can increase it, altering your energy needs. Metabolic disorders like polycystic ovary syndrome (PCOS), diabetes, and metabolic syndrome may also affect metabolism and energy expenditure. Certain medications, including thyroid hormone replacements, corticosteroids, and some antidepressants, can influence metabolic rate. These factors are not directly accounted for in this calculator, so results may be less accurate if you have such conditions or take these medications. Consult your healthcare provider for tailored advice.",
    },
    {
      question: "When should I seek medical consultation based on my TDEE results?",
      answer:
        "If your calculated TDEE is unexpectedly low or high, or if you experience unexplained weight changes, fatigue, or other symptoms, you should seek medical evaluation. Individuals with chronic illnesses, significant weight changes, or those planning major lifestyle changes should consult a physician before relying solely on calculator results. This tool is not intended to replace clinical assessment or diagnosis. Immediate medical attention is warranted if you have symptoms like severe weight loss, palpitations, or unexplained fatigue.",
    },
    {
      question: "How do healthcare providers use TDEE calculations in clinical practice?",
      answer:
        "Healthcare providers use TDEE calculations as a screening tool to estimate daily caloric needs, which helps guide nutrition and exercise recommendations. These estimates complement clinical assessments, including physical exams and laboratory tests such as thyroid function panels and glucose levels. TDEE is not a diagnostic test but part of a comprehensive evaluation to support weight management and metabolic health. Providers adjust recommendations based on individual factors beyond the calculator’s scope.",
    },
    {
      question: "What lifestyle modifications are recommended based on TDEE results?",
      answer:
        "Safe weight loss is generally 0.5 to 1 kg (1 to 2 pounds) per week, achieved by creating a daily calorie deficit of 500 to 1000 kcal below your TDEE. Tracking progress with regular weight measurements and adjusting calorie intake or physical activity accordingly is important. Sustainable lifestyle changes, including balanced nutrition and regular exercise, are preferred over rapid weight loss to reduce health risks and improve long-term success. Consult a registered dietitian or exercise specialist for personalized plans.",
    },
    {
      question: "Are there special considerations for pregnancy, older adults, or athletes when using this calculator?",
      answer:
        "Yes. Pregnant and postpartum individuals have increased energy needs not fully captured by standard TDEE formulas. Older adults (65+) often have reduced muscle mass and metabolic rate, which may lower energy requirements. Athletes or highly active individuals may have higher energy expenditures due to increased muscle mass and activity intensity. This calculator provides estimates but may require adjustment by healthcare professionals familiar with these populations for accurate guidance.",
    },
    {
      question: "Can children or adolescents use this TDEE calculator?",
      answer:
        "This calculator is designed for adults aged 18 to 65 and is not validated for children or adolescents, whose metabolic rates and energy needs differ significantly due to growth and development. Pediatric energy expenditure assessments require specialized formulas and clinical evaluation. If you are a parent or guardian concerned about a child’s energy needs, consult a pediatrician or pediatric dietitian for appropriate assessment and guidance.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // On this page navigation
  const onThisPage = [
    { id: "how-to-use", title: "How to Use This Calculator" },
    { id: "formula", title: "Understanding the Science" },
    { id: "example", title: "Worked Clinical Example" },
    { id: "faq", title: "Frequently Asked Questions" },
    { id: "references", title: "Medical References & Resources" },
  ];

  // Formula display for editorial
  const formula = {
    name: "Mifflin-St Jeor Equation for BMR",
    description:
      "BMR (kcal/day) = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + s, where s = +5 for males, −161 for females. TDEE = BMR × Activity Factor.",
    variables: [
      { symbol: "weight", description: "Body weight in kilograms (kg)" },
      { symbol: "height", description: "Height in centimeters (cm)" },
      { symbol: "age", description: "Age in years" },
      { symbol: "s", description: "Sex constant (+5 for males, −161 for females)" },
      { symbol: "Activity Factor", description: "Multiplier based on physical activity level" },
    ],
  };

  // Example patient profile for editorial
  const example = {
    age: 45,
    sex: "female",
    heightCm: 165,
    weightKg: 85,
    activityLevel: "lightly_active",
    explanation:
      "A 45-year-old woman, 165 cm (5'5\") tall, weighing 85 kg (187 lbs), with light activity (exercise 1-2 days/week). Using Mifflin-St Jeor: BMR = (10 × 85) + (6.25 × 165) − (5 × 45) − 161 = 850 + 1031.25 − 225 − 161 = 1495.25 kcal/day. TDEE = 1495.25 × 1.375 = 2055 kcal/day. This estimate guides her daily calorie needs to maintain weight. Adjustments may be needed for medical conditions or lifestyle changes.",
  };

  // Widget UI for user inputs and results
  const widget = (
    <Card className="space-y-6 p-6 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Calculator className="h-6 w-6 text-blue-600" />
          TDEE Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="unit" className="mb-1 font-medium">
            Measurement Units
          </Label>
          <Select
            value={unit}
            onValueChange={(value) => setUnit(value as "imperial" | "metric")}
          >
            <SelectTrigger aria-label="Select units">
              <SelectValue placeholder="Select units" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="age" className="mb-1 font-medium">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={18}
            max={65}
            placeholder="e.g., 30"
            value={inputs.age ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                age: e.target.value ? Math.min(65, Math.max(18, Number(e.target.value))) : undefined,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="sex" className="mb-1 font-medium">
            Sex
          </Label>
          <Select
            value={inputs.sex ?? ""}
            onValueChange={(value) =>
              setInputs((prev) => ({
                ...prev,
                sex: value === "male" || value === "female" ? value : undefined,
              }))
            }
          >
            <SelectTrigger aria-label="Select sex">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="height" className="mb-1 font-medium">
            Height ({unit === "imperial" ? "inches (in)" : "centimeters (cm)"})
          </Label>
          <Input
            id="height"
            type="number"
            min={unit === "imperial" ? 59 : 150} // ~5'0" or 150 cm
            max={unit === "imperial" ? 79 : 200} // ~6'7" or 200 cm
            placeholder={unit === "imperial" ? "e.g., 65" : "e.g., 165"}
            value={inputs.height ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                height: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="weight" className="mb-1 font-medium">
            Weight ({unit === "imperial" ? "pounds (lbs)" : "kilograms (kg)"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={unit === "imperial" ? 88 : 40} // ~40 kg or 88 lbs
            max={unit === "imperial" ? 440 : 200} // ~200 kg or 440 lbs
            placeholder={unit === "imperial" ? "e.g., 180" : "e.g., 82"}
            value={inputs.weight ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                weight: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="activityLevel" className="mb-1 font-medium">
            Activity Level
          </Label>
          <Select
            value={inputs.activityLevel ?? ""}
            onValueChange={(value) =>
              setInputs((prev) => ({
                ...prev,
                activityLevel: value,
              }))
            }
          >
            <SelectTrigger aria-label="Select activity level">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="lightly_active">Lightly active (1-3 days/week)</SelectItem>
              <SelectItem value="moderately_active">Moderately active (3-5 days/week)</SelectItem>
              <SelectItem value="very_active">Very active (6-7 days/week)</SelectItem>
              <SelectItem value="extra_active">Extra active (physical job or intense training)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {
            // No action needed, results update automatically
          }}
          className="w-full mt-4"
          disabled={
            !inputs.age ||
            !inputs.sex ||
            !inputs.height ||
            !inputs.weight ||
            !inputs.activityLevel
          }
        >
          Calculate TDEE
        </Button>
        {results && (
          <Card className="mt-6 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 text-lg">
                  Results
                </h3>
              </div>
              <p>
                <strong>Basal Metabolic Rate (BMR):</strong> {results.bmr} kcal/day
              </p>
              <p>
                <strong>Total Daily Energy Expenditure (TDEE):</strong> {results.tdee} kcal/day
              </p>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                This estimate reflects the calories you need daily to maintain your current weight,
                considering your activity level. Use this as a guide for nutrition and exercise planning.
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );

  // Editorial content sections
  const editorial = (
    <div className="space-y-12 max-w-3xl mx-auto px-4">
      {/* 1. How to Use This Calculator */}
      <section id="how-to-use" className="prose dark:prose-invert">
        <h2>How to Use This Calculator</h2>
        <p>
          Understanding your Total Daily Energy Expenditure (TDEE) is essential for managing your weight and overall health. TDEE represents the total number of calories your body burns in a day, including basal metabolic rate (BMR) and physical activity. This calculator estimates your TDEE based on your age, sex, height, weight, and activity level using a validated formula.
        </p>
        <p>
          To use the calculator, first select your preferred measurement units: imperial (pounds and inches) or metric (kilograms and centimeters). Enter your age between 18 and 65 years, select your sex, and input your height and weight. Choose your typical activity level, ranging from sedentary (little or no exercise) to extra active (intense training or physical job).
        </p>
        <p>
          After entering all fields, click "Calculate TDEE" to see your estimated basal metabolic rate and total daily energy expenditure. These results provide an estimate of the calories you need daily to maintain your current weight. Use this information to guide nutrition and exercise decisions.
        </p>
        <p>
          Remember, this calculator provides estimates for educational purposes and does not replace professional medical advice. If your results seem unusual or if you have medical conditions affecting metabolism, consult your healthcare provider for personalized evaluation and recommendations.
        </p>
        <p>
          Limitations include less accuracy in athletes, older adults, children, and those with certain medical conditions or medications. This tool is best used as a starting point to understand your energy needs and support healthy lifestyle changes.
        </p>
      </section>

      {/* 2. Understanding the Science */}
      <section id="formula" className="prose dark:prose-invert">
        <h2>Understanding the Science</h2>
        <p>
          This calculator uses the Mifflin-St Jeor equation, developed in 1990, to estimate basal metabolic rate (BMR), which is the energy your body requires at rest to maintain vital functions such as breathing, circulation, and cell production. The formula incorporates your weight, height, age, and sex to provide an individualized estimate.
        </p>
        <p>
          The equation is: <em>BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + s</em>, where <em>s</em> is +5 for males and −161 for females. This BMR is then multiplied by an activity factor that reflects your typical physical activity level, ranging from sedentary (1.2) to extra active (1.9), to estimate your Total Daily Energy Expenditure (TDEE).
        </p>
        <p>
          The Mifflin-St Jeor formula is considered more accurate than older equations like Harris-Benedict, especially in overweight and obese adults. Validation studies show an approximate ±10% margin of error for most adults aged 18-65. However, it does not directly account for variations in muscle mass, metabolic disorders, or medications, which can affect energy expenditure.
        </p>
        <p>
          This formula provides a practical, evidence-based method to estimate daily calorie needs and supports clinical decisions in nutrition and weight management.
        </p>
        <Card className="mt-6 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-300 dark:border-gray-600 p-4">
          <CardContent>
            <h3 className="font-semibold mb-2">Mifflin-St Jeor Equation</h3>
            <p>
              <strong>BMR (kcal/day) = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + s</strong>
            </p>
            <p>
              where <em>s</em> = +5 for males, −161 for females
            </p>
            <p>
              <strong>TDEE = BMR × Activity Factor</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Activity Factors:
              <ul className="list-disc list-inside">
                <li>Sedentary: 1.2</li>
                <li>Lightly active: 1.375</li>
                <li>Moderately active: 1.55</li>
                <li>Very active: 1.725</li>
                <li>Extra active: 1.9</li>
              </ul>
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. Worked Clinical Example */}
      <section id="example" className="prose dark:prose-invert">
        <h2>Worked Clinical Example</h2>
        <p>
          Consider a 45-year-old woman who is 165 cm (5 feet 5 inches) tall and weighs 85 kg (187 pounds). She reports light physical activity, exercising 1-2 days per week. Using the Mifflin-St Jeor equation, her basal metabolic rate (BMR) is calculated as:
        </p>
        <p>
          BMR = (10 × 85) + (6.25 × 165) − (5 × 45) − 161 = 850 + 1031.25 − 225 − 161 = 1495.25 kcal/day.
        </p>
        <p>
          Multiplying by the activity factor for lightly active (1.375), her Total Daily Energy Expenditure (TDEE) is:
        </p>
        <p>
          TDEE = 1495.25 × 1.375 = 2055 kcal/day.
        </p>
        <p>
          This means she requires approximately 2055 calories daily to maintain her current weight. If she aims to lose weight safely, a daily calorie deficit of 500 kcal (targeting ~1555 kcal/day) could result in a weight loss of about 0.5 kg (1 pound) per week. Regular monitoring and adjustments based on progress and health status are essential.
        </p>
        <p>
          This example illustrates how TDEE estimates support personalized nutrition and exercise planning. Always consult your healthcare provider before making significant changes.
        </p>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section id="faq" className="prose dark:prose-invert">
        <h2>Frequently Asked Questions</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>

      {/* 5. Medical References & Resources */}
      <section id="references" className="prose dark:prose-invert">
        <h2>Medical References &amp; Resources</h2>
        <ul className="list-disc list-inside space-y-4">
          <li className="leading-relaxed">
            <a
              href="https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
            >
              National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK) - Body Weight Planner Calculator
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              This resource provides evidence-based tools for estimating calorie needs and weight management planning. It is authoritative as part of the NIH and supports clinical and public health guidance on energy balance and obesity.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.acsm.org/read-research/books/acsms-guidelines-for-exercise-testing-and-prescription"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
            >
              American College of Sports Medicine (ACSM) - Guidelines for Exercise Testing and Prescription
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              ACSM guidelines provide clinical standards for assessing physical activity levels and prescribing exercise, which are essential for interpreting TDEE and activity factors in health management.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.eatright.org/health/weight-loss/fad-diets/mifflin-st-jeor-equation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
            >
              Academy of Nutrition and Dietetics (AND) - Mifflin-St Jeor Equation Overview
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              The AND provides detailed explanations of the Mifflin-St Jeor formula and its clinical applications in nutrition assessment and weight management.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
            >
              Centers for Disease Control and Prevention (CDC) - Healthy Weight Assessment
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              The CDC offers comprehensive resources on assessing weight status and energy balance, supporting the clinical context for TDEE calculations and lifestyle interventions.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
            >
              World Health Organization (WHO) - Obesity and Overweight Fact Sheet
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              WHO provides global guidelines and evidence on obesity, energy expenditure, and related health risks, framing the importance of accurate energy needs assessment.
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
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "📊" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "🎯" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "🧮" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "🧮" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}