import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Activity, ArrowRightLeft, User, Ruler, Scale } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  // STATE
  // units: imperial or metric
  const [unit, setUnit] = useState("metric");
  // inputs: height, weight, age, gender, activityLevel (activityLevel not needed for BMI formula)
  // height (imperial: feet + inches, metric: cm), weight (imperial: lbs, metric: kg)
  const [inputs, setInputs] = useState({
    heightFeet: "",
    heightInches: "",
    heightCm: "",
    weight: "",
    age: "",
    gender: "",
  });

  // BMI Formula: BMI = weight(kg) / (height(m))^2
  // If imperial: BMI = (weight(lbs) / (height(in))^2) * 703

  // BMI Categories & Colors
  const bmiCategories = [
    { max: 16, label: "Severe Thinness", color: "text-red-700" },
    { max: 17, label: "Moderate Thinness", color: "text-red-600" },
    { max: 18.5, label: "Mild Thinness", color: "text-orange-600" },
    { max: 25, label: "Normal", color: "text-green-600" },
    { max: 30, label: "Overweight", color: "text-yellow-600" },
    { max: 35, label: "Obese Class I", color: "text-orange-700" },
    { max: 40, label: "Obese Class II", color: "text-red-700" },
    { max: Infinity, label: "Obese Class III", color: "text-red-800" },
  ];

  // Handle input changes
  function onChangeInput(e) {
    const { name, value } = e.target;
    if (
      name === "heightFeet" ||
      name === "heightInches" ||
      name === "heightCm" ||
      name === "weight" ||
      name === "age"
    ) {
      // Allow only numbers and decimals for weight and age
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setInputs((old) => ({ ...old, [name]: value }));
      }
    } else if (name === "gender") {
      setInputs((old) => ({ ...old, gender: value }));
    }
  }

  // Toggle unit and reset relevant inputs
  function toggleUnit() {
    if (unit === "metric") {
      setUnit("imperial");
      setInputs((old) => ({
        ...old,
        heightCm: "",
        heightFeet: "",
        heightInches: "",
        weight: "",
      }));
    } else {
      setUnit("metric");
      setInputs((old) => ({
        ...old,
        heightCm: "",
        heightFeet: "",
        heightInches: "",
        weight: "",
      }));
    }
  }

  // Calculate BMI result
  const results = useMemo(() => {
    let heightM = 0;
    let weightKg = 0;
    // Validate inputs presence
    if (unit === "metric") {
      if (!inputs.heightCm || !inputs.weight) return null;
      const h = parseFloat(inputs.heightCm);
      const w = parseFloat(inputs.weight);
      if (isNaN(h) || h <= 0 || isNaN(w) || w <= 0) return null;
      heightM = h / 100;
      weightKg = w;
    } else {
      // imperial
      if (!inputs.heightFeet && inputs.heightFeet !== "0") return null;
      if (inputs.heightFeet === "") return null;
      if (inputs.heightInches === "") return null;
      if (!inputs.weight) return null;
      const feet = parseFloat(inputs.heightFeet);
      const inches = parseFloat(inputs.heightInches);
      const w = parseFloat(inputs.weight);
      if (
        isNaN(feet) ||
        feet < 0 ||
        isNaN(inches) ||
        inches < 0 ||
        inches >= 12 ||
        isNaN(w) ||
        w <= 0
      )
        return null;
      const heightInInches = feet * 12 + inches;
      if (heightInInches === 0) return null;
      heightM = heightInInches * 0.0254;
      weightKg = w * 0.45359237;
    }

    const bmi = weightKg / (heightM * heightM);
    if (isNaN(bmi) || !isFinite(bmi)) return null;

    // Determine category
    const category = bmiCategories.find((c) => bmi < c.max);

    return {
      bmi: bmi.toFixed(1),
      category: category?.label || "Unknown",
      colorClass: category?.color || "text-slate-800",
    };
  }, [inputs, unit]);

  // FAQ DATA
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "Body Mass Index (BMI) is a number calculated from a person's weight and height. It is used as a screening tool to identify weight categories that may lead to health problems.",
    },
    {
      question: "Can I use this calculator if I am under 18?",
      answer:
        "BMI calculations for children and teenagers require age and gender-specific percentiles. This calculator is primarily designed for adults aged 18 and over.",
    },
    {
      question: "Should I use metric or imperial units?",
      answer:
        "Use the unit system you are most comfortable with. This calculator supports both metric (centimeters and kilograms) and imperial (feet, inches, and pounds) units.",
    },
    {
      question: "Does physical activity affect BMI calculation?",
      answer:
        "No, physical activity is not part of the BMI formula. However, activity level is important for overall health and weight management.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX for inputs and results
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
          <div className="flex items-center gap-3">
            <Label htmlFor="unit-toggle" className="flex items-center cursor-pointer select-none">
              <ArrowRightLeft className="mr-2 h-5 w-5 text-sky-500" />
              Units:
            </Label>
            <Button size="sm" variant="outline" onClick={toggleUnit}>
              {unit === "metric" ? "Switch to Imperial" : "Switch to Metric"}
            </Button>
          </div>

          {unit === "metric" ? (
            <>
              <div>
                <Label htmlFor="heightCm" className="flex items-center gap-1">
                  <Ruler className="h-4 w-4 text-sky-500" />
                  Height (cm) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="heightCm"
                  name="heightCm"
                  type="text"
                  placeholder="e.g. 170"
                  value={inputs.heightCm}
                  onChange={onChangeInput}
                  inputMode="decimal"
                />
              </div>
              <div>
                <Label htmlFor="weight" className="flex items-center gap-1">
                  <Scale className="h-4 w-4 text-sky-500" />
                  Weight (kg) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="text"
                  placeholder="e.g. 65"
                  value={inputs.weight}
                  onChange={onChangeInput}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="heightFeet" className="flex items-center gap-1">
                    <Ruler className="h-4 w-4 text-sky-500" />
                    Height (feet) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="heightFeet"
                    name="heightFeet"
                    type="text"
                    placeholder="e.g. 5"
                    value={inputs.heightFeet}
                    onChange={onChangeInput}
                    inputMode="numeric"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="heightInches" className="flex items-center gap-1">
                    <Ruler className="h-4 w-4 text-sky-500" />
                    Height (inches) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="heightInches"
                    name="heightInches"
                    type="text"
                    placeholder="e.g. 7"
                    value={inputs.heightInches}
                    onChange={onChangeInput}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="weight" className="flex items-center gap-1">
                  <Scale className="h-4 w-4 text-sky-500" />
                  Weight (lbs) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="text"
                  placeholder="e.g. 150"
                  value={inputs.weight}
                  onChange={onChangeInput}
                  inputMode="decimal"
                />
              </div>
            </>
          )}

          {/* Gender Input */}
          <div>
            <Label htmlFor="gender" className="flex items-center gap-1">
              <User className="h-4 w-4 text-sky-500" />
              Gender <span className="text-red-500">*</span>
            </Label>
            <select
              id="gender"
              name="gender"
              value={inputs.gender}
              onChange={onChangeInput}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </div>

          {/* Age Input */}
          <div>
            <Label htmlFor="age" className="flex items-center gap-1">
              <User className="h-4 w-4 text-sky-500" />
              Age (years) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="age"
              name="age"
              type="text"
              placeholder="e.g. 30"
              value={inputs.age}
              onChange={onChangeInput}
              inputMode="numeric"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={() => {
            // Validate required inputs before calculating
            if (
              unit === "metric" &&
              (!inputs.heightCm || !inputs.weight || !inputs.age || !inputs.gender)
            ) {
              alert("Please fill all required fields.");
              return;
            }
            if (
              unit === "imperial" &&
              (inputs.heightFeet === "" ||
                inputs.heightInches === "" ||
                !inputs.weight ||
                !inputs.age ||
                !inputs.gender)
            ) {
              alert("Please fill all required fields.");
              return;
            }
            // Do nothing here, calculation is memoized
          }}
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              heightFeet: "",
              heightInches: "",
              heightCm: "",
              weight: "",
              age: "",
              gender: "",
            })
          }
        >
          Reset
        </Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          {/* RESULT CARD - Gradient Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 ${results.colorClass}`}
                aria-label="Calculated BMI value"
              >
                {results.bmi}
              </p>
              <p
                className={`mt-2 text-lg font-medium text-slate-700 dark:text-slate-300 ${results.colorClass}`}
                aria-label="BMI category"
              >
                {results.category}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Enter your height and weight using either metric or imperial units. Select your gender and enter your age to complete the inputs.
          Click "Calculate" to determine your Body Mass Index (BMI). The result will show a numerical BMI value along with a health status category.
          Use the "Reset" button to clear all inputs and start over.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </section>

      <section
        id="references"
        className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12"
      >
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References &amp; Resources
        </h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              CDC - About Adult BMI
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Official guidelines on BMI calculation and interpretation from the Centers for Disease Control and Prevention.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              WHO - Obesity and Overweight
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              World Health Organization information on BMI as a measure of overweight and obesity.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              NIH - BMI Calculator and Interpretation
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              National Institutes of Health resource for BMI calculation and understanding weight status categories.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              NHS UK - BMI Calculator
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              UK's National Health Service guidance on BMI and healthy weight ranges.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Formula and example for layout
  const formula = {
    title: "Formula Used",
    formula:
      "BMI = weight (kg) / [height (m)]²  OR  BMI = (weight (lbs) / [height (in)]²) × 703",
    variables: [
      { name: "weight", description: "Your body mass, in kilograms (kg) or pounds (lbs)" },
      { name: "height", description: "Your height, in meters (m) or inches (in)" },
    ],
  };

  const example = {
    title: "Example Calculation",
    scenario:
      "A person is 170 cm tall and weighs 65 kg. What is their BMI?",
    steps: [
      "Convert height from centimeters to meters: 170 cm = 1.7 m",
      "Square the height in meters: 1.7 × 1.7 = 2.89",
      "Divide weight by squared height: 65 / 2.89 ≈ 22.5",
      "BMI is approximately 22.5, which is in the 'Normal' category.",
    ],
    result: "BMI ≈ 22.5 (Normal weight)",
  };

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