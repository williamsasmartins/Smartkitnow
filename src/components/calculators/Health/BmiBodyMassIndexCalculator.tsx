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
  result: "The BMI is 22.86, which is within the normal weight range.",
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
  { title: "Loan Payment Calculator", slug: "loan-payment", icon: DollarSign },
  { title: "Investment Growth Calculator", slug: "investment-growth", icon: TrendingUp },
  { title: "Savings Calculator", slug: "savings", icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> }, // PiggyBank icon substitute
  { title: "Credit Card Payoff Calculator", slug: "credit-card-payoff", icon: CreditCard },
  { title: "Mortgage Calculator", slug: "mortgage", icon: Calculator },
  { title: "Budget Planner", slug: "budget-planner", icon: TrendingUp },
];

const faqList = [
  {
    question: "What is BMI?",
    answer:
      "BMI (Body Mass Index) is a simple calculation using height and weight to assess if a person has a healthy body weight for their height.",
  },
  {
    question: "How do I calculate BMI?",
    answer:
      "BMI is calculated by dividing your weight in kilograms by the square of your height in meters: BMI = weight (kg) / (height (m))².",
  },
  {
    question: "What are the BMI categories?",
    answer:
      "BMI categories are: Underweight (<18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obesity (30 or greater).",
  },
  {
    question: "Is BMI accurate for all body types?",
    answer:
      "BMI is a general guideline and may not be accurate for athletes, pregnant women, or elderly people with muscle loss.",
  },
  {
    question: "Can I use pounds and inches instead of kilograms and meters?",
    answer:
      "Yes, but you need to convert pounds to kilograms and inches to meters before using the formula.",
  },
  {
    question: "Why is BMI important?",
    answer:
      "BMI helps identify potential weight problems that may lead to health issues such as heart disease, diabetes, and hypertension.",
  },
  {
    question: "How often should I check my BMI?",
    answer:
      "It is recommended to check your BMI periodically, especially if you are making lifestyle changes or concerned about your weight.",
  },
  {
    question: "What should I do if my BMI is too high or too low?",
    answer:
      "Consult a healthcare professional for advice on diet, exercise, and lifestyle changes to reach a healthy BMI.",
  },
  {
    question: "Does BMI measure body fat directly?",
    answer:
      "No, BMI is an indirect measure and does not distinguish between muscle and fat mass.",
  },
  {
    question: "Can children use this BMI calculator?",
    answer:
      "This calculator is designed for adults. Children and teens require age- and sex-specific BMI charts.",
  },
];

function scrollToRef(ref: React.RefObject<HTMLDivElement>) {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
}

export default function BmiBodyMassIndexCalculator() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);

  useFaqJsonLd(faqList);

  const bmiValue = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      const val = w / (h * h);
      return parseFloat(val.toFixed(2));
    }
    return null;
  }, [weight, height]);

  const bmiCategory = useMemo(() => {
    if (bmiValue === null) return "";
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal weight";
    if (bmiValue < 30) return "Overweight";
    return "Obesity";
  }, [bmiValue]);

  function handleCalculate() {
    if (bmiValue !== null) {
      setBmi(bmiValue);
      setCategory(bmiCategory);
      scrollToRef(resultsRef);
    }
  }

  function handleReset() {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory("");
  }

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) to assess your body weight relative to your height and understand your health category."
      slug="bmi-body-mass-index"
      category="health"
      subcategory="Body Metrics & Weight Management"
      onThisPage={onThisPage}
      relatedCalculators={relatedCalculators}
    >
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg mb-8" id="calculator">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-lg">
            <Calculator className="w-5 h-5" />
            BMI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="weight" className="font-medium text-slate-700 dark:text-slate-300">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1"
              aria-describedby="weight-desc"
            />
            <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your weight in kilograms.
            </p>
          </div>
          <div>
            <Label htmlFor="height" className="font-medium text-slate-700 dark:text-slate-300">
              Height (m)
            </Label>
            <Input
              id="height"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 1.75"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1"
              aria-describedby="height-desc"
            />
            <p id="height-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your height in meters.
            </p>
          </div>
          <div className="flex gap-4 pt-2">
            <Button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" aria-label="Calculate BMI">
              Calculate
            </Button>
            <Button variant="outline" onClick={handleReset} className="border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600" aria-label="Reset inputs">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {bmi !== null && (
        <Card
          ref={resultsRef}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 mb-8"
          id="results"
          aria-live="polite"
          aria-atomic="true"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-lg">
              <Info className="w-5 h-5" />
              Your BMI Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl font-bold text-indigo-900 dark:text-indigo-200">
              BMI: <span aria-label="Body Mass Index value">{bmi}</span>
            </p>
            <p className="text-lg font-semibold text-indigo-800 dark:text-indigo-300">
              Category: <span aria-label="BMI category">{category}</span>
            </p>
            <div className="overflow-x-auto">
              <Table className="w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>BMI Range (kg/m²)</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className={category === "Underweight" ? "bg-indigo-200 dark:bg-indigo-700" : undefined}>
                    <TableCell>Underweight</TableCell>
                    <TableCell>&lt; 18.5</TableCell>
                    <TableCell>Below normal weight</TableCell>
                  </TableRow>
                  <TableRow className={category === "Normal weight" ? "bg-indigo-200 dark:bg-indigo-700" : undefined}>
                    <TableCell>Normal weight</TableCell>
                    <TableCell>18.5 – 24.9</TableCell>
                    <TableCell>Healthy weight range</TableCell>
                  </TableRow>
                  <TableRow className={category === "Overweight" ? "bg-indigo-200 dark:bg-indigo-700" : undefined}>
                    <TableCell>Overweight</TableCell>
                    <TableCell>25 – 29.9</TableCell>
                    <TableCell>Above normal weight</TableCell>
                  </TableRow>
                  <TableRow className={category === "Obesity" ? "bg-indigo-200 dark:bg-indigo-700" : undefined}>
                    <TableCell>Obesity</TableCell>
                    <TableCell>30 or greater</TableCell>
                    <TableCell>High risk weight</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 mb-8" id="formula">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-lg">
            <Calculator className="w-5 h-5" />
            {formula.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">{formula.formula}</p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
            {formula.variables.map(({ symbol, description }) => (
              <li key={symbol}>
                <strong>{symbol}</strong>: {description}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 mb-8" id="example">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-lg">
            <HelpCircle className="w-5 h-5" />
            {example.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-800 dark:text-slate-300">{example.scenario}</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-400">
            {example.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <p className="font-semibold text-indigo-900 dark:text-indigo-200">{example.result}</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 mb-8" id="bmi-categories">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-lg">
            <TrendingUp className="w-5 h-5" />
            BMI Categories Explained
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            The Body Mass Index (BMI) is categorized into four main groups to help assess health risks related to body weight:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Underweight:</strong> BMI less than 18.5. May indicate malnutrition or other health issues.
            </li>
            <li>
              <strong>Normal weight:</strong> BMI between 18.5 and 24.9. Considered healthy for most adults.
            </li>
            <li>
              <strong>Overweight:</strong> BMI between 25 and 29.9. Increased risk of health problems.
            </li>
            <li>
              <strong>Obesity:</strong> BMI 30 or greater. High risk for chronic diseases like diabetes and heart disease.
            </li>
          </ul>
          <p>
            Remember, BMI is a screening tool and not a diagnostic measure. Consult a healthcare provider for a comprehensive health assessment.
          </p>
        </CardContent>
      </Card>

      <section id="faq" className="mb-12">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-8 text-slate-700 dark:text-slate-300">
          {faqList.map(({ question, answer }, i) => (
            <article key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm bg-white dark:bg-slate-900/80">
              <h3 className="font-semibold text-lg mb-2">{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="references" className="mb-12">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          References
        </h2>
        <ul className="list-disc list-inside space-y-3 text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Centers for Disease Control and Prevention (CDC) - About Adult BMI
            </a>
          </li>
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              World Health Organization (WHO) - Obesity and Overweight Fact Sheet
            </a>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              National Heart, Lung, and Blood Institute - Calculate Your BMI
            </a>
          </li>
          <li>
            <a
              href="https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              NHS UK - BMI Calculator and Healthy Weight
            </a>
          </li>
          <li>
            <a
              href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/bmi-calculator/itt-20084938"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Mayo Clinic - BMI Calculator and Interpretation
            </a>
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}

export default BmiBodyMassIndexCalculator;