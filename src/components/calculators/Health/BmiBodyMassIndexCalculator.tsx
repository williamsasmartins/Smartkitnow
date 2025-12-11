import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Activity, ArrowRightLeft, User, Ruler } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const bmiCategories = [
  { max: 18.5, label: "Underweight", color: "text-blue-600 dark:text-blue-400" },
  { max: 24.9, label: "Normal weight", color: "text-green-600 dark:text-green-400" },
  { max: 29.9, label: "Overweight", color: "text-yellow-600 dark:text-yellow-400" },
  { max: 34.9, label: "Obesity Class I", color: "text-orange-600 dark:text-orange-400" },
  { max: 39.9, label: "Obesity Class II", color: "text-red-600 dark:text-red-400" },
  { max: Infinity, label: "Obesity Class III", color: "text-red-800 dark:text-red-600" },
];

// BMI Formula requires only height and weight, gender, age, activity level NOT required for BMI.
// But we include gender and age as optional inputs for user context/info (not used in formula).

export default function BmiBodyMassIndexCalculator() {
  const [unit, setUnit] = useState("metric"); // metric or imperial
  const [inputs, setInputs] = useState({
    weight: "",
    heightCm: "", // metric height in cm
    heightFeet: "", // imperial feet
    heightInches: "", // imperial inches
    gender: "",
    age: "",
    activityLevel: "",
  });
  const [calculated, setCalculated] = useState(false);

  // Parse inputs as numbers safely
  const weightNum = parseFloat(inputs.weight);
  const heightCmNum = parseFloat(inputs.heightCm);
  const heightFeetNum = parseInt(inputs.heightFeet, 10);
  const heightInchesNum = parseFloat(inputs.heightInches);

  // Calculate height in meters for BMI calculation
  const heightMeters = useMemo(() => {
    if (unit === "metric") {
      if (isNaN(heightCmNum) || heightCmNum <= 0) return null;
      return heightCmNum / 100;
    } else {
      // imperial: convert feet+inches to meters
      if (
        (isNaN(heightFeetNum) || heightFeetNum < 0) ||
        (isNaN(heightInchesNum) || heightInchesNum < 0)
      )
        return null;
      const totalInches = heightFeetNum * 12 + heightInchesNum;
      if (totalInches <= 0) return null;
      return totalInches * 0.0254;
    }
  }, [unit, heightCmNum, heightFeetNum, heightInchesNum]);

  // Calculate BMI
  const bmi = useMemo(() => {
    if (!calculated) return null;
    if (isNaN(weightNum) || weightNum <= 0) return null;
    if (!heightMeters || heightMeters <= 0) return null;

    let weightKg = weightNum;
    if (unit === "imperial") {
      // weight is in pounds, convert to kg
      weightKg = weightNum * 0.45359237;
    }
    const bmiValue = weightKg / (heightMeters * heightMeters);
    return Math.round(bmiValue * 10) / 10; // round to 1 decimal place
  }, [weightNum, heightMeters, calculated, unit]);

  // Determine BMI category and color
  const bmiCategory = useMemo(() => {
    if (bmi === null) return null;
    for (const cat of bmiCategories) {
      if (bmi <= cat.max) return cat;
    }
    return null;
  }, [bmi]);

  // FAQ DATA
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "Body Mass Index (BMI) is a simple calculation using height and weight to assess if you are in a healthy weight range. It helps identify potential health risks associated with being underweight or overweight.",
    },
    {
      question: "Can I use this calculator if I am a child or elderly?",
      answer:
        "This BMI calculator is intended for adults. Children's and elderly BMI assessments require different considerations and specialized calculators.",
    },
    {
      question: "Why do I need to select units?",
      answer:
        "Height and weight can be measured using metric (centimeters, kilograms) or imperial (feet, inches, pounds) units. Selecting the correct unit ensures accurate calculation.",
    },
    {
      question: "Does gender, age or activity level affect BMI calculation?",
      answer:
        "BMI calculation is based solely on height and weight. However, gender, age, and activity level can influence overall health and body composition but are not part of the BMI formula.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(field, value) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  function toggleUnit() {
    // When switching units, clear height and weight inputs for user clarity
    setInputs({
      weight: "",
      heightCm: "",
      heightFeet: "",
      heightInches: "",
      gender: inputs.gender,
      age: inputs.age,
      activityLevel: inputs.activityLevel,
    });
    setUnit((u) => (u === "metric" ? "imperial" : "metric"));
    setCalculated(false);
  }

  function onCalculate() {
    setCalculated(true);
  }

  // Formula and example for layout props
  const formula = {
    title: "Formula Used",
    formula:
      "BMI = weight (kg) / [height (m)]²  or  BMI = 703 × weight (lbs) / [height (in)]²",
    variables: [
      { symbol: "weight", description: "Your body weight in kilograms or pounds" },
      { symbol: "height", description: "Your height in meters or inches" },
    ],
  };

  const example = {
    title: "Example Calculation",
    scenario: "A person weighs 70 kg and is 175 cm tall.",
    steps: [
      "Convert height to meters: 175 cm = 1.75 m",
      "Square the height: 1.75 × 1.75 = 3.06",
      "Divide weight by squared height: 70 / 3.06 = 22.9",
    ],
    result: "BMI = 22.9 (Normal weight category)",
  };

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
          {/* Unit toggle */}
          <div className="flex items-center gap-3 mb-4">
            <Label htmlFor="unit-toggle" className="flex items-center gap-2 cursor-pointer select-none">
              <ArrowRightLeft className="h-5 w-5 text-sky-500" />
              <span>Unit</span>
            </Label>
            <Button variant={unit === "metric" ? "default" : "outline"} size="sm" onClick={toggleUnit}>
              Metric
            </Button>
            <Button variant={unit === "imperial" ? "default" : "outline"} size="sm" onClick={toggleUnit}>
              Imperial
            </Button>
          </div>

          {/* Weight input */}
          <div>
            <Label htmlFor="weight" className="flex items-center gap-1 mb-1 font-semibold">
              <Scale className="h-4 w-4" />
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter weight in ${unit === "metric" ? "kilograms" : "pounds"}`}
              value={inputs.weight}
              onChange={(e) => onInputChange("weight", e.target.value)}
            />
          </div>

          {/* Height input */}
          <div>
            <Label className="flex items-center gap-1 mb-1 font-semibold">
              <Ruler className="h-4 w-4" />
              Height ({unit === "metric" ? "cm" : "ft + in"})
            </Label>
            {unit === "metric" ? (
              <Input
                id="heightCm"
                type="number"
                min="0"
                step="any"
                placeholder="Enter height in centimeters"
                value={inputs.heightCm}
                onChange={(e) => onInputChange("heightCm", e.target.value)}
              />
            ) : (
              <div className="flex gap-2">
                <Input
                  id="heightFeet"
                  type="number"
                  min="0"
                  placeholder="Feet"
                  value={inputs.heightFeet}
                  onChange={(e) => onInputChange("heightFeet", e.target.value)}
                />
                <Input
                  id="heightInches"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Inches"
                  value={inputs.heightInches}
                  onChange={(e) => onInputChange("heightInches", e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Gender input - optional */}
          <div>
            <Label htmlFor="gender" className="flex items-center gap-1 mb-1 font-semibold">
              <User className="h-4 w-4" />
              Gender (optional)
            </Label>
            <select
              id="gender"
              value={inputs.gender}
              onChange={(e) => onInputChange("gender", e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Age input - optional */}
          <div>
            <Label htmlFor="age" className="flex items-center gap-1 mb-1 font-semibold">
              <User className="h-4 w-4" />
              Age (optional)
            </Label>
            <Input
              id="age"
              type="number"
              min="0"
              step="1"
              placeholder="Enter age in years"
              value={inputs.age}
              onChange={(e) => onInputChange("age", e.target.value)}
            />
          </div>

          {/* Activity Level - optional but not used in formula */}
          <div>
            <Label htmlFor="activityLevel" className="flex items-center gap-1 mb-1 font-semibold">
              <Activity className="h-4 w-4" />
              Activity Level (optional)
            </Label>
            <select
              id="activityLevel"
              value={inputs.activityLevel}
              onChange={(e) => onInputChange("activityLevel", e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
              <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
              <option value="very">Very active (hard exercise/sports 6-7 days a week)</option>
              <option value="extra">Extra active (very hard exercise & physical job)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={onCalculate}
          disabled={
            unit === "metric"
              ? !weightNum || !heightCmNum
              : !weightNum || (!heightFeetNum && !heightInchesNum)
          }
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({
              weight: "",
              heightCm: "",
              heightFeet: "",
              heightInches: "",
              gender: "",
              age: "",
              activityLevel: "",
            });
            setCalculated(false);
          }}
        >
          Reset
        </Button>
      </div>

      {bmi !== null && (
        <div className="space-y-6 mt-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {bmi}
              </p>
              <p className={`mt-2 text-lg font-medium ${bmiCategory?.color ?? "text-slate-700 dark:text-slate-300"}`}>
                {bmiCategory?.label ?? "Unknown category"}
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
          Enter your weight and height in either metric or imperial units. Optionally, you can provide your gender, age, and activity level for your own tracking, but these do not affect the BMI result. Click "Calculate" to see your BMI score and its health category.
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
      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Resources</h2>
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
              Overview of BMI, how it is calculated, and its significance for health assessment.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              World Health Organization - Obesity and Overweight
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Information on BMI categories and global health concerns related to overweight and obesity.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              NHLBI - Calculate Your BMI
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Detailed explanation of the BMI formula and how to interpret results.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              NHS UK - BMI Calculator and Guide
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              UK National Health Service's BMI calculator with health advice.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.healthline.com/health/body-mass-index"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Healthline - What is BMI?
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive guide explaining BMI, its benefits, and limitations.
            </p>
          </li>
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