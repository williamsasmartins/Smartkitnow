import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  HeartPulse,
  Dog,
  Cat,
  Apple,
  Flame,
  Droplet,
  BookOpen,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function BmiBodyMassIndexCalculator() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [advice, setAdvice] = useState<string>("");

  const weightRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setBmi(null);
      setCategory("");
      setAdvice("");
      return;
    }

    let bmiValue = 0;
    if (unit === "metric") {
      // height in cm to meters
      const heightMeters = h / 100;
      bmiValue = w / (heightMeters * heightMeters);
    } else {
      // imperial: weight in lbs, height in inches
      bmiValue = (703 * w) / (h * h);
    }

    const roundedBmi = Math.round(bmiValue * 10) / 10;
    setBmi(roundedBmi);

    // BMI categories and advice
    if (roundedBmi < 18.5) {
      setCategory("Underweight");
      setAdvice(
        "You are under the normal weight range. Consider a balanced diet to gain weight healthily."
      );
    } else if (roundedBmi >= 18.5 && roundedBmi < 25) {
      setCategory("Normal weight");
      setAdvice(
        "You are within the normal weight range. Maintain your current lifestyle to stay healthy."
      );
    } else if (roundedBmi >= 25 && roundedBmi < 30) {
      setCategory("Overweight");
      setAdvice(
        "You are above the normal weight range. Consider regular exercise and a healthy diet."
      );
    } else {
      setCategory("Obesity");
      setAdvice(
        "You are significantly above the normal weight range. Consult a healthcare provider for personalized advice."
      );
    }
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory("");
    setAdvice("");
    setUnit("metric");
    weightRef.current?.focus();
  };

  const bmiTableRows = useMemo(() => {
    return [
      {
        range: "< 18.5",
        category: "Underweight",
        healthRisk: "Possible nutritional deficiency and osteoporosis",
      },
      {
        range: "18.5 - 24.9",
        category: "Normal weight",
        healthRisk: "Low risk (healthy range)",
      },
      {
        range: "25 - 29.9",
        category: "Overweight",
        healthRisk: "Moderate risk of cardiovascular diseases",
      },
      {
        range: "≥ 30",
        category: "Obesity",
        healthRisk: "High risk of cardiovascular diseases, diabetes",
      },
    ];
  }, []);

  const relatedCalculators = [
    {
      emoji: "🐕",
      title: "Dog Calorie Needs Calculator",
      slug: "dog-calorie-needs-rer-mer",
    },
    {
      emoji: "💰",
      title: "Loan Payment Calculator",
      slug: "loan-payment",
    },
    {
      emoji: "❤️",
      title: "Heart Rate Zone Calculator",
      slug: "heart-rate-zone",
    },
    {
      emoji: "💊",
      title: "Medication Dosage Calculator",
      slug: "medication-dosage",
    },
    {
      emoji: "🐾",
      title: "Pet Age to Human Years Calculator",
      slug: "pet-age-human-years",
    },
    {
      emoji: "📈",
      title: "Investment Growth Calculator",
      slug: "investment-growth",
    },
  ];

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      slug="bmi-body-mass-index"
      category="health"
      subcategory="Body Metrics & Weight Management"
      icon={Scale}
    >
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-sky-500" />
            BMI Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="unit" className="mb-2 block font-semibold">
              Unit System
            </Label>
            <div className="flex gap-4">
              <Button
                variant={unit === "metric" ? "default" : "outline"}
                onClick={() => setUnit("metric")}
                aria-pressed={unit === "metric"}
                type="button"
              >
                Metric (kg, cm)
              </Button>
              <Button
                variant={unit === "imperial" ? "default" : "outline"}
                onClick={() => setUnit("imperial")}
                aria-pressed={unit === "imperial"}
                type="button"
              >
                Imperial (lbs, inches)
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="weight" className="mb-2 block font-semibold">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              ref={weightRef}
            />
          </div>
          <div>
            <Label htmlFor="height" className="mb-2 block font-semibold">
              Height ({unit === "metric" ? "cm" : "inches"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              ref={heightRef}
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={calculateBmi} type="button">
              Calculate
            </Button>
            <Button variant="outline" onClick={resetForm} type="button">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {bmi !== null && (
        <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
              <Activity className="w-6 h-6" />
              Your BMI Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-sky-900 dark:text-sky-300 mb-4">
              {bmi}
            </div>
            <div className="text-lg font-semibold text-sky-800 dark:text-sky-300 mb-2">
              Category: {category}
            </div>
            <p className="mb-6 text-sky-700 dark:text-sky-200">{advice}</p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BMI Range</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Health Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bmiTableRows.map(({ range, category, healthRisk }) => (
                  <TableRow key={range}>
                    <TableCell>{range}</TableCell>
                    <TableCell>{category}</TableCell>
                    <TableCell>{healthRisk}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <section id="how-to-use" className="mt-16 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-sky-700 dark:text-sky-400">
          <Info className="w-7 h-7" />
          How to Use This Calculator
        </h2>
        <p>
          The BMI (Body Mass Index) calculator helps you estimate your body fat
          based on your weight and height. It is a simple screening tool to
          categorize your weight status and assess potential health risks.
        </p>
        <p>
          To use the calculator, select your preferred unit system: Metric (kg,
          cm) or Imperial (lbs, inches). Enter your weight and height in the
          respective units, then click the "Calculate" button. The calculator
          will display your BMI value along with the corresponding weight
          category and health advice.
        </p>
        <p>
          If you want to clear the inputs and results, click the "Reset"
          button. This tool is intended for adults and does not replace
          professional medical advice.
        </p>
      </section>

      <section id="formula" className="mt-16 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-sky-700 dark:text-sky-400">
          <Calculator className="w-7 h-7" />
          BMI Formula Explained
        </h2>
        <p>
          BMI is calculated by dividing your weight by the square of your height.
          The formula differs slightly depending on the unit system used.
        </p>
        <h3 className="text-xl font-semibold">Metric Units</h3>
        <p>
          <strong>Formula:</strong> BMI = weight (kg) / [height (m)]²
        </p>
        <p>
          Since height is often measured in centimeters, convert it to meters by
          dividing by 100 before squaring.
        </p>
        <h3 className="text-xl font-semibold">Imperial Units</h3>
        <p>
          <strong>Formula:</strong> BMI = 703 × weight (lbs) / [height (in)]²
        </p>
        <p>
          The factor 703 is used to convert the imperial units to the metric
          equivalent.
        </p>
        <h3 className="text-xl font-semibold">Interpretation</h3>
        <p>
          The resulting BMI value is then categorized into ranges that indicate
          underweight, normal weight, overweight, or obesity.
        </p>
      </section>

      <section id="example" className="mt-16 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-sky-700 dark:text-sky-400">
          <Scale className="w-7 h-7" />
          Example Calculation
        </h2>
        <p>
          Let's calculate the BMI of a person who weighs 70 kg and is 175 cm tall
          using the metric system.
        </p>
        <p>
          Step 1: Convert height to meters: 175 cm ÷ 100 = 1.75 m
        </p>
        <p>
          Step 2: Square the height: 1.75 × 1.75 = 3.0625 m²
        </p>
        <p>
          Step 3: Divide weight by squared height: 70 ÷ 3.0625 = 22.86
        </p>
        <p>
          Step 4: Round to one decimal place: BMI = 22.9
        </p>
        <p>
          According to the BMI categories, this person falls within the "Normal
          weight" range.
        </p>
      </section>

      <section id="mistakes" className="mt-16 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-sky-700 dark:text-sky-400">
          <Flame className="w-7 h-7" />
          Common Mistakes to Avoid
        </h2>
        <ul className="list-disc list-inside space-y-3">
          <li>
            <strong>Incorrect units:</strong> Make sure to select the correct unit
            system and enter weight and height accordingly.
          </li>
          <li>
            <strong>Using BMI for children:</strong> BMI interpretation differs
            for children and adolescents; this calculator is for adults only.
          </li>
          <li>
            <strong>Ignoring muscle mass:</strong> BMI does not distinguish between
            muscle and fat, so very muscular individuals may have a high BMI but
            low body fat.
          </li>
          <li>
            <strong>Not consulting professionals:</strong> BMI is a screening tool,
            not a diagnostic. Always seek advice from healthcare providers for
            personalized assessments.
          </li>
          <li>
            <strong>Rounding errors:</strong> Use precise measurements for more
            accurate results.
          </li>
        </ul>
      </section>

      <section id="faq" className="mt-16 max-w-3xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-sky-700 dark:text-sky-400">
          <Info className="w-7 h-7" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">What is BMI?</h3>
            <p>
              BMI stands for Body Mass Index, a number calculated from your weight
              and height to estimate body fat and categorize weight status.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Is BMI accurate for everyone?</h3>
            <p>
              BMI is a useful screening tool but does not account for muscle mass,
              bone density, or fat distribution. It may not be accurate for athletes,
              pregnant women, or elderly individuals.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Can children use this calculator?</h3>
            <p>
              No, BMI interpretation for children and teens requires age- and
              sex-specific percentiles. Consult pediatric growth charts or a
              healthcare provider.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">What should I do if my BMI is high?</h3>
            <p>
              A high BMI indicates overweight or obesity, which can increase health
              risks. Consider lifestyle changes and consult a healthcare professional
              for personalized advice.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Why are there different units?</h3>
            <p>
              Different countries use metric or imperial units. This calculator
              supports both to accommodate user preferences.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">How often should I check my BMI?</h3>
            <p>
              Checking BMI periodically can help monitor health trends, but it is
              not necessary to do it daily. Consult your healthcare provider for
              personalized recommendations.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Can BMI predict health problems?</h3>
            <p>
              BMI is correlated with risk for certain diseases but is not a direct
              measure of health. Other factors like diet, activity, and genetics
              also play important roles.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">What is a healthy BMI range?</h3>
            <p>
              A BMI between 18.5 and 24.9 is considered normal or healthy for most
              adults.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Can I use BMI to set weight goals?</h3>
            <p>
              BMI can provide a general target range, but weight goals should be
              individualized based on overall health and body composition.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Does BMI consider body fat percentage?</h3>
            <p>
              No, BMI is an indirect measure and does not directly measure body fat
              percentage.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="mt-16 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-sky-700 dark:text-sky-400">
          <BookOpen className="w-7 h-7" />
          References
        </h2>
        <ul className="list-disc list-inside space-y-3 text-sky-800 dark:text-sky-300">
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sky-600 dark:hover:text-sky-400"
            >
              Centers for Disease Control and Prevention (CDC) - About Adult BMI
            </a>
          </li>
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sky-600 dark:hover:text-sky-400"
            >
              World Health Organization (WHO) - Obesity and Overweight Fact Sheet
            </a>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sky-600 dark:hover:text-sky-400"
            >
              National Heart, Lung, and Blood Institute - Calculate Your BMI
            </a>
          </li>
          <li>
            <a
              href="https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sky-600 dark:hover:text-sky-400"
            >
              NHS UK - BMI Calculator and Information
            </a>
          </li>
          <li>
            <a
              href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/bmi-calculator/itt-20084938"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sky-600 dark:hover:text-sky-400"
            >
              Mayo Clinic - BMI Calculator and Health Information
            </a>
          </li>
          <li>
            <a
              href="https://www.healthline.com/health/body-mass-index"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sky-600 dark:hover:text-sky-400"
            >
              Healthline - Body Mass Index (BMI): What It Is and How to Calculate It
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-sky-700 dark:text-sky-400">
          Related Calculators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedCalculators.map(({ emoji, title, slug }) => (
            <Card
              key={slug}
              className="border border-slate-200/70 dark:border-slate-700/80 shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                window.location.href = `/${slug}`;
              }}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.location.href = `/${slug}`;
                }
              }}
            >
              <CardContent className="flex items-center gap-4">
                <div className="text-3xl">{emoji}</div>
                <div className="font-semibold text-sky-800 dark:text-sky-300">
                  {title}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </CalculatorVerticalLayout>
  );
}