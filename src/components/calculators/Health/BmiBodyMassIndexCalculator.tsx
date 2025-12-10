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
    "Divide the weight by the squared height: 70 / 3.0625 = 22.86",
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
  { title: "Loan Payment Calculator", slug: "loan-payment", icon: <DollarSign className="mr-2 h-5 w-5" /> },
  { title: "Investment Growth Calculator", slug: "investment-growth", icon: <TrendingUp className="mr-2 h-5 w-5" /> },
  { title: "Savings Calculator", slug: "savings", icon: <Calculator className="mr-2 h-5 w-5" /> },
  { title: "Credit Card Payoff Calculator", slug: "credit-card-payoff", icon: <CreditCard className="mr-2 h-5 w-5" /> },
  { title: "Budget Planner", slug: "budget-planner", icon: <PiggyBank className="mr-2 h-5 w-5" /> },
  { title: "Retirement Calculator", slug: "retirement", icon: <ChartBar className="mr-2 h-5 w-5" /> },
];

const faqList = [
  {
    question: "What is BMI?",
    answer:
      "BMI (Body Mass Index) is a simple calculation using height and weight to estimate body fat and assess if a person is underweight, normal weight, overweight, or obese.",
  },
  {
    question: "How do I measure my height and weight accurately?",
    answer:
      "Use a reliable scale for weight and a stadiometer or tape measure for height. Measure height without shoes and weight with light clothing for best accuracy.",
  },
  {
    question: "Is BMI a perfect measure of health?",
    answer:
      "No, BMI is a screening tool and does not differentiate between muscle and fat. Athletes and muscular individuals may have a high BMI but low body fat.",
  },
  {
    question: "What are the BMI categories?",
    answer:
      "Underweight: BMI < 18.5, Normal weight: 18.5–24.9, Overweight: 25–29.9, Obesity: BMI ≥ 30.",
  },
  {
    question: "Can children use this BMI calculator?",
    answer:
      "This calculator is designed for adults. Children's BMI is interpreted differently using age and sex-specific percentiles.",
  },
  {
    question: "How often should I check my BMI?",
    answer:
      "Checking BMI periodically can help monitor health, but it’s best to consult healthcare providers for comprehensive assessments.",
  },
  {
    question: "What factors can affect BMI accuracy?",
    answer:
      "Factors include muscle mass, bone density, age, sex, and ethnicity. BMI is a general guide, not a diagnostic tool.",
  },
  {
    question: "Can BMI predict health risks?",
    answer:
      "Higher BMI is associated with increased risk of heart disease, diabetes, and other conditions, but it should be considered alongside other factors.",
  },
  {
    question: "What should I do if my BMI is high?",
    answer:
      "Consult a healthcare professional for personalized advice on diet, exercise, and lifestyle changes.",
  },
  {
    question: "Is BMI used worldwide?",
    answer:
      "Yes, BMI is widely used globally as a quick and easy screening tool for population health monitoring.",
  },
];

function BmiBodyMassIndexCalculator() {{
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  useFaqJsonLd(faqList);

  const bmiValue = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    return w / (h * h);
  }, [weight, height]);

  const bmiCategory = useMemo(() => {
    if (bmiValue === null) return "";
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal weight";
    if (bmiValue < 30) return "Overweight";
    return "Obesity";
  }, [bmiValue]);

  function handleCalculate() {
    setError("");
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || w <= 0) {
      setError("Please enter a valid weight greater than 0.");
      return;
    }
    if (isNaN(h) || h <= 0) {
      setError("Please enter a valid height greater than 0.");
      return;
    }
    const calculatedBmi = w / (h * h);
    setBmi(calculatedBmi);
    setCategory(bmiCategory);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleReset() {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory("");
    setError("");
  }

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) to assess your body weight relative to your height. This calculator helps you understand if you are underweight, normal weight, overweight, or obese."
      slug="bmi-body-mass-index"
      category="health"
      subcategory="Body Metrics & Weight Management"
      onThisPage={onThisPage}
      relatedCalculators={relatedCalculators}
      icon={<Calculator className="h-6 w-6 text-blue-600" />}
    >
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg mb-8" id="calculator">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Calculator />
            BMI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="weight" className="font-semibold">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g. 70"
              min={0}
              step="any"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              aria-describedby="weight-desc"
            />
            <p id="weight-desc" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter your weight in kilograms.
            </p>
          </div>
          <div>
            <Label htmlFor="height" className="font-semibold">
              Height (m)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="e.g. 1.75"
              min={0}
              step="any"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              aria-describedby="height-desc"
            />
            <p id="height-desc" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Enter your height in meters.
            </p>
          </div>
          {error && (
            <p className="text-red-600 dark:text-red-400 font-semibold" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCalculate} aria-label="Calculate BMI">
              Calculate
            </Button>
            <Button variant="outline" className="border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" onClick={handleReset} aria-label="Reset form">
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
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Info />
              Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold">
              Your BMI is:{" "}
              <span className="text-indigo-900 dark:text-indigo-200">{bmi.toFixed(2)}</span>
            </p>
            <p className="text-md font-medium">
              Category:{" "}
              <span
                className={`font-semibold ${
                  category === "Underweight"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : category === "Normal weight"
                    ? "text-green-600 dark:text-green-400"
                    : category === "Overweight"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-red-700 dark:text-red-500"
                }`}
              >
                {category}
              </span>
            </p>
            <Table className="w-full border border-indigo-200 dark:border-indigo-800 rounded-md">
              <TableHeader>
                <TableRow className="bg-indigo-100 dark:bg-indigo-900/50">
                  <TableHead>BMI Range</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{"< 18.5"}</TableCell>
                  <TableCell>Underweight</TableCell>
                  <TableCell>Below normal weight, may need to gain weight</TableCell>
                </TableRow>
                <TableRow className="bg-indigo-50 dark:bg-indigo-900/20">
                  <TableCell>18.5 – 24.9</TableCell>
                  <TableCell>Normal weight</TableCell>
                  <TableCell>Healthy weight range</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>25 – 29.9</TableCell>
                  <TableCell>Overweight</TableCell>
                  <TableCell>Above normal weight, consider lifestyle changes</TableCell>
                </TableRow>
                <TableRow className="bg-indigo-50 dark:bg-indigo-900/20">
                  <TableCell>{"≥ 30"}</TableCell>
                  <TableCell>Obesity</TableCell>
                  <TableCell>High risk of health problems, seek medical advice</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 mb-8" id="formula">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <TrendingUp />
            {formula.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-semibold">{formula.formula}</p>
          <ul className="list-disc list-inside space-y-1">
            {formula.variables.map(({ symbol, description }) => (
              <li key={symbol}>
                <span className="font-semibold">{symbol}</span>: {description}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 mb-8" id="example">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <HelpCircle />
            {example.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{example.scenario}</p>
          <ol className="list-decimal list-inside space-y-1">
            {example.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
          <p className="font-semibold">{example.result}</p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 mb-8" id="bmi-categories">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <TrendingUp />
            BMI Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            BMI categories help classify body weight status based on your BMI value:
          </p>
          <Table className="w-full border border-indigo-200 dark:border-indigo-800 rounded-md">
            <TableHeader>
              <TableRow className="bg-indigo-100 dark:bg-indigo-900/50">
                <TableHead>BMI Range</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Health Implications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{"< 18.5"}</TableCell>
                <TableCell>Underweight</TableCell>
                <TableCell>Possible nutritional deficiency and osteoporosis risk</TableCell>
              </TableRow>
              <TableRow className="bg-indigo-50 dark:bg-indigo-900/20">
                <TableCell>18.5 – 24.9</TableCell>
                <TableCell>Normal weight</TableCell>
                <TableCell>Lowest risk of chronic diseases</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>25 – 29.9</TableCell>
                <TableCell>Overweight</TableCell>
                <TableCell>Increased risk of cardiovascular diseases</TableCell>
              </TableRow>
              <TableRow className="bg-indigo-50 dark:bg-indigo-900/20">
                <TableCell>{"≥ 30"}</TableCell>
                <TableCell>Obesity</TableCell>
                <TableCell>High risk of diabetes, hypertension, and other diseases</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section id="faq" className="space-y-8 mb-8" aria-label="Frequently Asked Questions">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          <HelpCircle />
          Frequently Asked Questions
        </h2>
        {faqList.map(({ question, answer }, idx) => (
          <article key={idx} className="prose dark:prose-invert max-w-none">
            <h3 className="font-semibold text-lg">{question}</h3>
            <p>{answer}</p>
          </article>
        ))}
      </section>

      <section id="references" className="mb-16" aria-label="References">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 mb-4">
          <BookOpen />
          References
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-slate-400">
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Centers for Disease Control and Prevention (CDC) - About Adult BMI
            </a>
          </li>
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              World Health Organization (WHO) - Obesity and Overweight Factsheet
            </a>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              National Heart, Lung, and Blood Institute - BMI Calculator and Information
            </a>
          </li>
          <li>
            <a
              href="https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              NHS - BMI Calculator and Guidance
            </a>
          </li>
          <li>
            <a
              href="https://www.medicalnewstoday.com/articles/what-is-body-mass-index-bmi"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Medical News Today - What is Body Mass Index (BMI)?
            </a>
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}

export default BmiBodyMassIndexCalculator;
