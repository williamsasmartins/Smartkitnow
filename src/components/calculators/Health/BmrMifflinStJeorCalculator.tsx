import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Activity, ArrowRightLeft, User, Ruler } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const BMI_CATEGORIES = [
  { max: 18.5, label: "Underweight", color: "text-blue-600 dark:text-blue-400" },
  { max: 24.9, label: "Normal weight", color: "text-green-600 dark:text-green-400" },
  { max: 29.9, label: "Overweight", color: "text-yellow-600 dark:text-yellow-400" },
  { max: Infinity, label: "Obese", color: "text-red-600 dark:text-red-400" },
];

function BmrMifflinStJeorCalculator(bmi) {
  for (const cat of BMI_CATEGORIES) {
    if (bmi <= cat.max) return cat;
  }
  return BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

function BmiBodyMassIndexCalculator() {
  // Inputs: height, weight, age, gender, activity not required by BMI formula
  // Units toggle: metric / imperial
  const [unit, setUnit] = useState("metric"); // metric or imperial
  const [inputs, setInputs] = useState({
    heightCm: "",
    weightKg: "",
    heightFt: "",
    heightIn: "",
    weightLbs: "",
    age: "",
    gender: "",
  });
  const [touched, setTouched] = useState(false);

  // Handle input change
  function onChange(e) {
    const { name, value } = e.target;
    if (value.match(/^\d*\.?\d*$/)) {
      setInputs((old) => ({ ...old, [name]: value }));
    }
  }

  // Toggle unit and reset inputs related to units
  function toggleUnit() {
    setUnit((old) => (old === "metric" ? "imperial" : "metric"));
    setInputs({
      heightCm: "",
      weightKg: "",
      heightFt: "",
      heightIn: "",
      weightLbs: "",
      age: "",
      gender: "",
    });
    setTouched(false);
  }

  // Calculate BMI
  // Metric: BMI = weightKg / (heightM)^2
  // Imperial: BMI = 703 * weightLbs / (heightInches)^2
  const results = useMemo(() => {
    if (!touched) return null;

    let heightMeters = 0;
    let weightKg = 0;

    if (unit === "metric") {
      const h = parseFloat(inputs.heightCm);
      const w = parseFloat(inputs.weightKg);
      if (!h || !w || h <= 0 || w <= 0) return null;
      heightMeters = h / 100;
      weightKg = w;
    } else {
      // imperial
      const ft = parseFloat(inputs.heightFt);
      const inch = parseFloat(inputs.heightIn);
      const w = parseFloat(inputs.weightLbs);
      if (
        ft == null ||
        inch == null ||
        w == null ||
        ft < 0 ||
        inch < 0 ||
        w <= 0 ||
        (ft === 0 && inch === 0)
      )
        return null;
      heightMeters = (ft * 12 + inch) * 0.0254;
      weightKg = w * 0.45359237;
    }

    if (heightMeters <= 0) return null;

    const bmi = weightKg / (heightMeters * heightMeters);
    if (isNaN(bmi) || !isFinite(bmi)) return null;

    const bmiRounded = Math.round(bmi * 10) / 10;
    const category = getBmiCategory(bmiRounded);

    return { bmi: bmiRounded, category };
  }, [inputs, unit, touched]);

  // FAQ Data
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a numerical value of a person's weight in relation to their height. It's used to categorize individuals into weight categories that may indicate health risks.",
    },
    {
      question: "Does the BMI formula require age or gender?",
      answer:
        "No, the standard BMI formula does not require age or gender. It only uses height and weight. However, age and gender can be important for other health assessments.",
    },
    {
      question: "What are the units used in this calculator?",
      answer:
        "You can toggle between Metric units (centimeters and kilograms) and Imperial units (feet, inches, and pounds) for inputting your height and weight.",
    },
    {
      question: "How accurate is BMI as a health indicator?",
      answer:
        "BMI is a useful screening tool but does not directly measure body fat. Athletes or muscular individuals may have a high BMI but low body fat. For detailed health insights, consult a healthcare professional.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Formula & Example for layout
  const formula = {
    title: "Formula Used",
    formula:
      "BMI = weight (kg) / [height (m)]² (Metric units) OR BMI = 703 × weight (lbs) / [height (in)]² (Imperial units)",
    variables: [
      { symbol: "weight", description: "Your body weight" },
      { symbol: "height", description: "Your height" },
      { symbol: "kg", description: "Kilograms" },
      { symbol: "m", description: "Meters" },
      { symbol: "lbs", description: "Pounds" },
      { symbol: "in", description: "Inches" },
    ],
  };

  const example = {
    title: "Example Calculation",
    scenario:
      "Calculate BMI for a person who is 170 cm tall and weighs 70 kg using metric units.",
    steps: [
      "Convert height from centimeters to meters: 170 cm = 1.7 m",
      "Square the height: 1.7 × 1.7 = 2.89",
      "Divide weight by squared height: 70 / 2.89 = 24.22",
      "BMI = 24.2 (rounded to one decimal place)",
    ],
    result: "The BMI is 24.2, which is considered Normal weight.",
  };

  // References
  const references = [
    {
      href: "https://www.cdc.gov/healthyweight/assessing/bmi/index.html",
      title: "CDC - About Adult BMI",
      desc: "Official Centers for Disease Control and Prevention page explaining BMI and its categories.",
    },
    {
      href: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
      title: "WHO - Obesity and Overweight",
      desc: "World Health Organization information on obesity, overweight, and BMI implications.",
    },
    {
      href: "https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm",
      title: "National Heart, Lung, and Blood Institute - BMI Calculator",
      desc: "Detailed explanation of BMI, including how to calculate and interpret results.",
    },
    {
      href: "https://www.nhs.uk/common-health-questions/lifestyle/what-is-body-mass-index-bmi/",
      title: "NHS - What is BMI?",
      desc: "UK National Health Service guide on BMI, healthy weight ranges, and associated risks.",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Calculator className="h-5 w-5 text-sky-500" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="unitToggle" className="font-semibold cursor-pointer">
              Units
            </Label>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleUnit}
              aria-label="Toggle units between metric and imperial"
              className="flex items-center gap-2"
            >
              {unit === "metric" ? "Metric (cm/kg)" : "Imperial (ft/in/lbs)"}
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Height Input */}
          {unit === "metric" ? (
            <div>
              <Label htmlFor="heightCm" className="font-semibold mb-1 flex items-center gap-1">
                <Ruler className="h-4 w-4 text-slate-400" />
                Height (cm)
              </Label>
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                id="heightCm"
                name="heightCm"
                placeholder="e.g. 170"
                value={inputs.heightCm}
                onChange={onChange}
                aria-describedby="heightCm-desc"
                autoComplete="off"
              />
              <p id="heightCm-desc" className="text-xs text-slate-500 mt-0.5">
                Enter your height in centimeters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heightFt" className="font-semibold mb-1 flex items-center gap-1">
                  <Ruler className="h-4 w-4 text-slate-400" />
                  Height (ft)
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="heightFt"
                  name="heightFt"
                  placeholder="e.g. 5"
                  value={inputs.heightFt}
                  onChange={onChange}
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="heightIn" className="font-semibold mb-1 flex items-center gap-1">
                  <Ruler className="h-4 w-4 text-slate-400" />
                  Height (in)
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="heightIn"
                  name="heightIn"
                  placeholder="e.g. 8"
                  value={inputs.heightIn}
                  onChange={onChange}
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {/* Weight Input */}
          {unit === "metric" ? (
            <div>
              <Label htmlFor="weightKg" className="font-semibold mb-1 flex items-center gap-1">
                <Scale className="h-4 w-4 text-slate-400" />
                Weight (kg)
              </Label>
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                id="weightKg"
                name="weightKg"
                placeholder="e.g. 70"
                value={inputs.weightKg}
                onChange={onChange}
                autoComplete="off"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="weightLbs" className="font-semibold mb-1 flex items-center gap-1">
                <Scale className="h-4 w-4 text-slate-400" />
                Weight (lbs)
              </Label>
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                id="weightLbs"
                name="weightLbs"
                placeholder="e.g. 154"
                value={inputs.weightLbs}
                onChange={onChange}
                autoComplete="off"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={() => {
            setTouched(true);
          }}
          disabled={
            unit === "metric"
              ? !inputs.heightCm || !inputs.weightKg
              : !inputs.heightFt || !inputs.heightIn || !inputs.weightLbs
          }
          aria-disabled={
            unit === "metric"
              ? !inputs.heightCm || !inputs.weightKg
              : !inputs.heightFt || !inputs.heightIn || !inputs.weightLbs
          }
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({
              heightCm: "",
              weightKg: "",
              heightFt: "",
              heightIn: "",
              weightLbs: "",
              age: "",
              gender: "",
            });
            setTouched(false);
          }}
        >
          Reset
        </Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          {/* RESULT CARD - USE THIS EXACT GRADIENT */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50" aria-live="polite">
                {results.bmi}
              </p>
              {/* Status Text for Health Apps */}
              <p
                className={`mt-2 text-lg font-medium dark:text-slate-300 ${results.category.color}`}
                aria-label={`BMI category: ${results.category.label}`}
              >
                {results.category.label}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Choose your preferred units system (Metric or Imperial) by toggling the button. Enter your height and weight in the respective units. For metric, input height in centimeters and weight in kilograms. For imperial, input height as feet and inches, and weight in pounds. Click the "Calculate" button to see your Body Mass Index (BMI) along with your weight category. Use the "Reset" button to clear all inputs.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">{formula.title}</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">{formula.formula}</p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
          {formula.variables.map((v, i) => (
            <li key={i}>
              <strong>{v.symbol}</strong>: {v.description}
            </li>
          ))}
        </ul>
      </section>

      <section id="example" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">{example.title}</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">{example.scenario}</p>
        <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-4">
          {example.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <p className="font-semibold text-slate-900 dark:text-slate-100">{example.result}</p>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {/* Render visible FAQs here */}
        {faqs.map((f, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <ul className="space-y-4">
          {references.map((ref, i) => (
            <li key={i} className="leading-relaxed">
              <a
                href={ref.href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {ref.title}
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.desc}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula", label: "Formula Used" },
        { id: "example", label: "Example Calculation" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "❤️" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🧮" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "🧍" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "⚖️" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "🧍" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "🧍" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default BmrMifflinStJeorCalculator;