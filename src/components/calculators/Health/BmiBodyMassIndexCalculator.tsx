import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, Info, HelpCircle, BookOpen } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const formula = {
  title: "BMI Formula",
  formula: "BMI = weight (kg) / (height (m))²",
  variables: [
    { symbol: "weight", description: "Your weight in kilograms (kg)" },
    { symbol: "height", description: "Your height in meters (m)" },
  ],
};

const example = {
  title: "Example Calculation",
  scenario: "Calculate BMI for a person weighing 70 kg and 1.75 m tall.",
  steps: [
    "Square the height in meters: 1.75 × 1.75 = 3.0625",
    "Divide the weight by the squared height: 70 ÷ 3.0625 = 22.86",
  ],
  result: "BMI = 22.86",
};

const onThisPage = [
  { id: "calculator", title: "BMI Calculator" },
  { id: "formula", title: "BMI Formula" },
  { id: "example", title: "Example Calculation" },
  { id: "bmi-categories", title: "BMI Categories" },
  { id: "faq", title: "Frequently Asked Questions" },
  { id: "references", title: "References" },
];

const relatedCalculators = [
  { title: "Loan Payment Calculator", slug: "loan-payment", icon: <DollarSign className="w-5 h-5" /> },
  { title: "Investment Growth Calculator", slug: "investment-growth", icon: <TrendingUp className="w-5 h-5" /> },
  { title: "Savings Calculator", slug: "savings", icon: <DollarSign className="w-5 h-5" /> },
  { title: "Credit Card Payoff Calculator", slug: "credit-card-payoff", icon: <CreditCard className="w-5 h-5" /> },
  { title: "Retirement Calculator", slug: "retirement", icon: <Calculator className="w-5 h-5" /> },
  { title: "Budget Planner", slug: "budget-planner", icon: <TrendingUp className="w-5 h-5" /> },
];

const bmiCategories = [
  { category: "Underweight", range: "< 18.5", description: "Possible nutritional deficiency and osteoporosis risk." },
  { category: "Normal weight", range: "18.5 - 24.9", description: "Healthy weight range." },
  { category: "Overweight", range: "25 - 29.9", description: "Increased risk of cardiovascular diseases." },
  { category: "Obesity Class I", range: "30 - 34.9", description: "Moderate risk of health problems." },
  { category: "Obesity Class II", range: "35 - 39.9", description: "Severe risk of health problems." },
  { category: "Obesity Class III", range: "≥ 40", description: "Very severe risk; requires medical attention." },
];

const faqList = [
  {
    question: "What is BMI?",
    answer:
      "BMI (Body Mass Index) is a numerical value of a person's weight in relation to their height, used to assess if they are underweight, normal weight, overweight, or obese.",
  },
  {
    question: "Is BMI a perfect measurement of health?",
    answer:
      "No, BMI is a screening tool and does not directly measure body fat or distribution. It should be used alongside other assessments.",
  },
  {
    question: "Can athletes have a high BMI but be healthy?",
    answer:
      "Yes, athletes may have higher BMI due to increased muscle mass, which weighs more than fat, so BMI might overestimate their fatness.",
  },
  {
    question: "How do I convert height from cm to meters?",
    answer: "Divide your height in centimeters by 100 to convert it to meters. For example, 175 cm = 1.75 m.",
  },
  {
    question: "Can BMI be used for children?",
    answer:
      "BMI interpretation for children differs from adults and uses percentiles based on age and sex. Consult pediatric growth charts for accurate assessment.",
  },
  {
    question: "What are the limitations of BMI?",
    answer:
      "BMI does not account for muscle mass, bone density, overall body composition, and racial and sex differences.",
  },
  {
    question: "How often should I check my BMI?",
    answer: "Checking BMI periodically can help monitor weight changes, but frequency depends on individual health goals and conditions.",
  },
  {
    question: "What should I do if my BMI is high?",
    answer:
      "Consult a healthcare provider for a comprehensive evaluation and personalized advice on diet, exercise, and lifestyle changes.",
  },
  {
    question: "Does BMI differ by gender?",
    answer:
      "BMI calculation is the same for all genders, but interpretation may vary due to differences in body composition.",
  },
  {
    question: "Can BMI predict risk of diseases?",
    answer:
      "Higher BMI is associated with increased risk of diseases like diabetes, hypertension, and heart disease, but it is not a definitive predictor.",
  },
];

function BmiBodyMassIndexCalculator() {{
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const parsedWeight = useMemo(() => parseFloat(weight), [weight]);
  const parsedHeight = useMemo(() => parseFloat(height), [height]);

  const calculateBmi = () => {
    if (!parsedWeight || !parsedHeight || parsedHeight <= 0) {
      setBmi(null);
      setCategory(null);
      return;
    }
    const bmiValue = parsedWeight / (parsedHeight * parsedHeight);
    setBmi(Number(bmiValue.toFixed(2)));

    const cat =
      bmiValue < 18.5
        ? "Underweight"
        : bmiValue < 25
        ? "Normal weight"
        : bmiValue < 30
        ? "Overweight"
        : bmiValue < 35
        ? "Obesity Class I"
        : bmiValue < 40
        ? "Obesity Class II"
        : "Obesity Class III";
    setCategory(cat);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory(null);
  };

  useFaqJsonLd(faqList);

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) to assess your weight category and health risk."
      slug="bmi-body-mass-index"
      category="health"
      subcategory="Body Metrics & Weight Management"
      onThisPage={onThisPage}
      relatedCalculators={relatedCalculators}
      icon={<Calculator className="w-6 h-6 text-blue-600" />}
    >
      <section id="calculator" className="mb-12">
        <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Calculator />
              BMI Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="weight" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                Weight (kg)
                <Info className="w-4 h-4 text-slate-400" />
              </Label>
              <Input
                id="weight"
                type="number"
                min={0}
                step="any"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
                aria-describedby="weight-desc"
                className="mt-1"
              />
              <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your weight in kilograms.
              </p>
            </div>
            <div>
              <Label htmlFor="height" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                Height (meters)
                <HelpCircle className="w-4 h-4 text-slate-400" />
              </Label>
              <Input
                id="height"
                type="number"
                min={0}
                step="any"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 1.75"
                aria-describedby="height-desc"
                className="mt-1"
              />
              <p id="height-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your height in meters (e.g., 1.75).
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={calculateBmi} className="bg-blue-600 hover:bg-blue-700" aria-label="Calculate BMI">
                Calculate
              </Button>
              <Button variant="outline" onClick={resetForm} aria-label="Reset form">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {bmi !== null && (
        <section
          id="results"
          ref={resultsRef}
          className="mb-12"
          aria-live="polite"
          aria-atomic="true"
          aria-relevant="additions"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-indigo-300">
                <TrendingUp />
                Your BMI Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Your BMI is <span className="text-blue-600 dark:text-indigo-400">{bmi}</span>.
              </p>
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                This places you in the category:{" "}
                <span className="font-semibold text-blue-700 dark:text-indigo-300">{category}</span>.
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      <section id="formula" className="mb-12">
        <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Calculator />
              {formula.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-800 dark:text-slate-200 font-semibold">{formula.formula}</p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
              {formula.variables.map(({ symbol, description }) => (
                <li key={symbol}>
                  <span className="font-semibold">{symbol}</span>: {description}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="example" className="mb-12">
        <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Info />
              {example.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-800 dark:text-slate-200 font-semibold">{example.scenario}</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              {example.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{example.result}</p>
          </CardContent>
        </Card>
      </section>

      <section id="bmi-categories" className="mb-12">
        <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <TrendingUp />
              BMI Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>BMI Range (kg/m²)</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bmiCategories.map(({ category, range, description }) => (
                  <TableRow key={category}>
                    <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{category}</TableCell>
                    <TableCell className="text-center text-slate-700 dark:text-slate-300">{range}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section id="faq" className="mb-12">
        <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <HelpCircle />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {faqList.map(({ question, answer }, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{question}</h3>
                <p className="text-slate-700 dark:text-slate-300">{answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="references" className="mb-12">
        <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <BookOpen />
              References
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <a
                  href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-indigo-400 hover:underline"
                >
                  Centers for Disease Control and Prevention (CDC) - About Adult BMI
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-indigo-400 hover:underline"
                >
                  World Health Organization (WHO) - Obesity and Overweight Factsheet
                </a>
              </li>
              <li>
                <a
                  href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-indigo-400 hover:underline"
                >
                  National Heart, Lung, and Blood Institute - Calculate Your BMI
                </a>
              </li>
              <li>
                <a
                  href="https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-indigo-400 hover:underline"
                >
                  NHS - BMI Calculator and Healthy Weight Guide
                </a>
              </li>
              <li>
                <a
                  href="https://www.healthline.com/health/body-mass-index"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-indigo-400 hover:underline"
                >
                  Healthline - What Is BMI and How to Calculate It
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </CalculatorVerticalLayout>
  );
}

export default BmiBodyMassIndexCalculator;
