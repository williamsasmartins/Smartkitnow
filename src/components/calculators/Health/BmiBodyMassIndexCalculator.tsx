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
  result: "BMI = 22.86 kg/m²",
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
  { title: "Loan Payment Calculator", icon: DollarSign, slug: "loan-payment" },
  { title: "Investment Growth Calculator", icon: TrendingUp, slug: "investment-growth" },
  { title: "Savings Goal Calculator", icon: "PiggyBank", slug: "savings-goal" },
  { title: "Credit Card Payoff Calculator", icon: "CreditCard", slug: "credit-card-payoff" },
  { title: "Compound Interest Calculator", icon: Calculator, slug: "compound-interest" },
  { title: "Budget Planner", icon: "ChartBar", slug: "budget-planner" },
];

const faqItems = [
  {
    question: "What is BMI?",
    answer:
      "BMI (Body Mass Index) is a measure that uses your height and weight to estimate if you are underweight, normal weight, overweight, or obese.",
  },
  {
    question: "Is BMI a perfect measure of health?",
    answer:
      "No, BMI is a general guideline and does not directly measure body fat or muscle mass. Other factors should be considered for a full health assessment.",
  },
  {
    question: "How do I convert height from feet/inches to meters?",
    answer:
      "Multiply feet by 0.3048 and inches by 0.0254, then add them together to get height in meters.",
  },
  {
    question: "Can BMI be used for children and teens?",
    answer:
      "BMI calculations differ for children and teens and are interpreted using percentile charts specific to age and sex.",
  },
  {
    question: "What are the BMI categories?",
    answer:
      "Underweight: BMI < 18.5, Normal weight: 18.5–24.9, Overweight: 25–29.9, Obesity: BMI ≥ 30.",
  },
  {
    question: "Does muscle mass affect BMI?",
    answer:
      "Yes, individuals with high muscle mass may have a high BMI but low body fat percentage.",
  },
  {
    question: "How often should I calculate my BMI?",
    answer:
      "It depends on your health goals, but generally once every few months or during health checkups is sufficient.",
  },
  {
    question: "Can BMI predict health risks?",
    answer:
      "BMI is correlated with health risks but should be used alongside other assessments for accurate health evaluation.",
  },
  {
    question: "Is BMI calculation different for different ethnic groups?",
    answer:
      "Some ethnic groups may have different body composition, so BMI thresholds might vary slightly in interpretation.",
  },
  {
    question: "What should I do if my BMI is outside the normal range?",
    answer:
      "Consult a healthcare professional for personalized advice on diet, exercise, and lifestyle changes.",
  },
];

function ) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  useFaqJsonLd(faqItems);

  const bmiValue = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      return w / (h * h);
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

  const handleCalculate = () => {
    if (bmiValue !== null) {
      setBmi(parseFloat(bmiValue.toFixed(2)));
      setCategory(bmiCategory);
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleReset = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory("");
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) to assess your body weight relative to your height."
      slug="bmi-body-mass-index"
      category="health"
      subcategory="Body Metrics & Weight Management"
      formula={formula}
      example={example}
      onThisPage={onThisPage}
      relatedCalculators={relatedCalculators}
    >
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg mb-8" id="calculator">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Calculator size={24} />
            BMI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="weight" className="mb-1 font-semibold">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              aria-describedby="weight-helper"
            />
            <p id="weight-helper" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your weight in kilograms.
            </p>
          </div>
          <div>
            <Label htmlFor="height" className="mb-1 font-semibold">
              Height (m)
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 1.75"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              aria-describedby="height-helper"
            />
            <p id="height-helper" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your height in meters.
            </p>
          </div>
          <div className="flex gap-4 mt-4">
            <Button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-700" aria-label="Calculate BMI">
              Calculate
            </Button>
            <Button variant="outline" onClick={handleReset} className="border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Reset inputs">
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
              <Info size={24} />
              Your BMI Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              Your BMI is <span className="text-blue-700 dark:text-blue-400">{bmi}</span> kg/m²
            </p>
            <p className="mt-2 text-md">
              This places you in the category:{" "}
              <span
                className={`font-semibold ${
                  category === "Underweight"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : category === "Normal weight"
                    ? "text-green-600 dark:text-green-400"
                    : category === "Overweight"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {category}
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      <Card
        className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 mb-8"
        id="formula"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <TrendingUp size={24} />
            BMI Formula
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg font-semibold">{formula.title}</p>
          <pre className="bg-indigo-50 dark:bg-indigo-900/40 p-4 rounded text-indigo-800 dark:text-indigo-300 font-mono text-xl select-all">
            {formula.formula}
          </pre>
          <ul className="mt-4 list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
            {formula.variables.map(({ symbol, description }) => (
              <li key={symbol}>
                <strong>{symbol}</strong>: {description}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg mb-8" id="example">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <HelpCircle size={24} />
            Example Calculation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg font-semibold">{example.title}</p>
          <p className="mb-4">{example.scenario}</p>
          <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-700 dark:text-slate-300">
            {example.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
          <p className="font-semibold text-indigo-700 dark:text-indigo-300">{example.result}</p>
        </CardContent>
      </Card>

      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg mb-8" id="bmi-categories">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <DollarSign size={24} />
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
              <TableRow>
                <TableCell>Underweight</TableCell>
                <TableCell>&lt; 18.5</TableCell>
                <TableCell>Possible nutritional deficiency or health risk</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Normal weight</TableCell>
                <TableCell>18.5 – 24.9</TableCell>
                <TableCell>Healthy weight range</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Overweight</TableCell>
                <TableCell>25 – 29.9</TableCell>
                <TableCell>Increased risk of cardiovascular diseases</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Obesity</TableCell>
                <TableCell>≥ 30</TableCell>
                <TableCell>High risk of chronic diseases</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section id="faq" className="mb-12" aria-label="Frequently Asked Questions">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <HelpCircle size={28} />
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqItems.map(({ question, answer }, idx) => (
            <article key={idx} className="prose dark:prose-invert max-w-none">
              <h3 className="font-semibold text-lg">{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="references" className="mb-12" aria-label="References">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <BookOpen size={28} />
          References
        </h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              CDC - About Adult BMI
            </a>
          </li>
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              World Health Organization - Obesity and Overweight
            </a>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              National Heart, Lung, and Blood Institute - BMI Calculator
            </a>
          </li>
          <li>
            <a
              href="https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              NHS - BMI Calculator and Healthy Weight
            </a>
          </li>
          <li>
            <a
              href="https://www.healthline.com/health/body-mass-index"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Healthline - What Is BMI?
            </a>
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}

export default BmiBodyMassIndexCalculator;
