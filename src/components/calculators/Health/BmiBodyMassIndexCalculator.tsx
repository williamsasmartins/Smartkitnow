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
  { title: "Savings Calculator", slug: "savings", icon: <Calculator className="w-5 h-5" /> },
  { title: "Credit Card Payoff Calculator", slug: "credit-card-payoff", icon: <CreditCard className="w-5 h-5" /> },
  { title: "Budget Planner", slug: "budget-planner", icon: <PiggyBank className="w-5 h-5" /> },
  { title: "Retirement Calculator", slug: "retirement", icon: <ChartBar className="w-5 h-5" /> },
];

const faqItems = [
  {
    question: "What is BMI?",
    answer:
      "BMI (Body Mass Index) is a simple calculation using a person's height and weight to assess whether they are underweight, normal weight, overweight, or obese.",
  },
  {
    question: "Is BMI an accurate measure of health?",
    answer:
      "BMI is a useful screening tool but does not directly measure body fat or health. Factors like muscle mass, bone density, and overall body composition are not accounted for.",
  },
  {
    question: "How do I convert height from feet/inches to meters?",
    answer:
      "To convert height from feet and inches to meters, first convert the entire height to inches (feet × 12 + inches), then multiply by 0.0254.",
  },
  {
    question: "Can BMI be used for children and teens?",
    answer:
      "BMI for children and teens is interpreted differently using age- and sex-specific percentiles. Consult pediatric growth charts for accurate assessment.",
  },
  {
    question: "What BMI range is considered healthy?",
    answer:
      "A BMI between 18.5 and 24.9 is generally considered healthy for most adults.",
  },
  {
    question: "What are the BMI categories?",
    answer:
      "BMI categories are: Underweight (<18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obesity (≥30).",
  },
  {
    question: "Can athletes have a high BMI?",
    answer:
      "Yes, athletes may have a high BMI due to increased muscle mass, which weighs more than fat, so BMI may not accurately reflect their body fat percentage.",
  },
  {
    question: "How often should I check my BMI?",
    answer:
      "Checking BMI periodically can help monitor weight changes, but it should be combined with other health assessments for a comprehensive view.",
  },
  {
    question: "Does BMI differ by gender?",
    answer:
      "BMI calculation is the same for all adults, but interpretation may vary slightly due to differences in body composition between genders.",
  },
  {
    question: "Can BMI predict health risks?",
    answer:
      "Higher BMI values are associated with increased risk of certain health conditions, but BMI alone cannot diagnose health problems.",
  },
];

function BmiBodyMassIndexCalculator(
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setBmi(null);
      setCategory("");
      return;
    }
    const bmiValue = w / (h * h);
    setBmi(Number(bmiValue.toFixed(2)));
    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue < 25) setCategory("Normal weight");
    else if (bmiValue < 30) setCategory("Overweight");
    else setCategory("Obesity");

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const reset = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory("");
  };

  const bmiCategories = useMemo(
    () => [
      { range: "< 18.5", category: "Underweight" },
      { range: "18.5 - 24.9", category: "Normal weight" },
      { range: "25 - 29.9", category: "Overweight" },
      { range: "≥ 30", category: "Obesity" },
    ],
    []
  );

  useFaqJsonLd(faqItems);

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) to assess your weight category based on your height and weight."
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
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Calculator className="w-6 h-6 text-blue-600" />
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
              min={0}
              step="any"
              placeholder="e.g. 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              aria-describedby="weight-help"
              className="mt-1"
            />
            <p id="weight-help" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
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
              min={0}
              step="any"
              placeholder="e.g. 1.75"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              aria-describedby="height-help"
              className="mt-1"
            />
            <p id="height-help" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your height in meters.
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={calculateBmi} className="bg-blue-600 hover:bg-blue-700" aria-label="Calculate BMI">
              Calculate
            </Button>
            <Button variant="outline" onClick={reset} aria-label="Reset inputs">
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
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-800 dark:text-indigo-300">
              <Info className="w-6 h-6" />
              Your BMI Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              BMI: <span className="text-blue-700 dark:text-indigo-400">{bmi}</span>
            </p>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              Category:{" "}
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
        aria-label="BMI Formula"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-700 dark:text-indigo-300">
            <HelpCircle className="w-6 h-6" />
            BMI Formula
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-800 dark:text-slate-300">
          <p className="text-lg font-semibold">{formula.title}</p>
          <p className="text-xl font-mono bg-indigo-50 dark:bg-indigo-900/50 p-3 rounded-md select-all">{formula.formula}</p>
          <ul className="list-disc list-inside space-y-1">
            {formula.variables.map(({ symbol, description }) => (
              <li key={symbol}>
                <span className="font-semibold">{symbol}</span>: {description}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card
        className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 mb-8"
        id="example"
        aria-label="Example BMI Calculation"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-700 dark:text-indigo-300">
            <TrendingUp className="w-6 h-6" />
            Example Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-800 dark:text-slate-300">
          <p className="text-lg font-semibold">{example.title}</p>
          <p>{example.scenario}</p>
          <ol className="list-decimal list-inside space-y-1">
            {example.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <p className="font-semibold text-indigo-700 dark:text-indigo-400">{example.result}</p>
        </CardContent>
      </Card>

      <Card
        className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800 mb-8"
        id="bmi-categories"
        aria-label="BMI Categories"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-700 dark:text-indigo-300">
            <Info className="w-6 h-6" />
            BMI Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">BMI Range (kg/m²)</TableHead>
                <TableHead>BMI Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bmiCategories.map(({ range, category }) => (
                <TableRow key={range}>
                  <TableCell className="font-mono">{range}</TableCell>
                  <TableCell>{category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <section id="faq" className="mb-12" aria-label="Frequently Asked Questions">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <HelpCircle className="w-7 h-7" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-8 text-slate-800 dark:text-slate-300">
          {faqItems.map(({ question, answer }, i) => (
            <article key={i} className="prose dark:prose-invert max-w-none">
              <h3 className="font-semibold text-lg">{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="references"
        className="mb-16"
        aria-label="References and Further Reading"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <BookOpen className="w-7 h-7" />
          References
        </h2>
        <ul className="list-disc list-inside space-y-2 text-slate-800 dark:text-slate-300 prose dark:prose-invert max-w-none">
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
              NHS - BMI Calculator and Healthy Weight
            </a>
          </li>
          <li>
            <a
              href="https://www.healthline.com/health/what-is-bmi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Healthline - What Is BMI and Why Is It Important?
            </a>
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}

export default BmiBodyMassIndexCalculator;
