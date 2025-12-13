import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, Button } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, AlertCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TdeeDailyEnergyExpenditureCalculator() {
  const [unit, setUnit] = useState("metric");
  const [inputs, setInputs] = useState({ 
    age: "", 
    gender: "male", 
    weight: "", 
    heightMetric: "", 
    heightFt: "", 
    heightIn: "",
    activity: "1.2" 
  });

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const height = unit === "metric" ? parseFloat(inputs.heightMetric) : parseFloat(inputs.heightFt) * 30.48 + parseFloat(inputs.heightIn) * 2.54;
    const age = parseInt(inputs.age);
    if (!weight || !height || !age) return { value: 0, label: "Please enter valid inputs." };
    const bmr = inputs.gender === "male" 
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    const tdee = bmr * parseFloat(inputs.activity);
    return { value: Math.round(tdee), label: "Calories per day" };
  }, [inputs, unit]);

  const widget = (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Button onClick={() => setUnit("metric")} className={`flex-1 ${unit === "metric" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}>Metric</Button>
        <Button onClick={() => setUnit("imperial")} className={`flex-1 ${unit === "imperial" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}>Imperial</Button>
      </div>
      <Select onValueChange={(value) => setInputs({ ...inputs, gender: value })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>
      <Input placeholder="Age" value={inputs.age} onChange={(e) => setInputs({ ...inputs, age: e.target.value })} />
      {unit === "metric" ? (
        <Input placeholder="Height (cm)" value={inputs.heightMetric} onChange={(e) => setInputs({ ...inputs, heightMetric: e.target.value })} />
      ) : (
        <div className="flex gap-3">
          <Input placeholder="Height (ft)" value={inputs.heightFt} onChange={(e) => setInputs({ ...inputs, heightFt: e.target.value })} />
          <Input placeholder="Height (in)" value={inputs.heightIn} onChange={(e) => setInputs({ ...inputs, heightIn: e.target.value })} />
        </div>
      )}
      <Input placeholder="Weight" value={inputs.weight} onChange={(e) => setInputs({ ...inputs, weight: e.target.value })} />
      <Select onValueChange={(value) => setInputs({ ...inputs, activity: value })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select activity level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1.2">Sedentary</SelectItem>
          <SelectItem value="1.375">Lightly active</SelectItem>
          <SelectItem value="1.55">Moderately active</SelectItem>
          <SelectItem value="1.725">Very active</SelectItem>
          <SelectItem value="1.9">Extra active</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={() => setInputs({ age: "", gender: "male", weight: "", heightMetric: "", heightFt: "", heightIn: "", activity: "1.2" })} className="flex-1 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-100">
          Reset
        </Button>
      </div>
      {results.value ? (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-blue-100">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Result</p>
              <p className="text-4xl font-extrabold text-blue-900 dark:text-blue-50">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2">{results.label}</p>
            </CardContent>
          </Card>
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>Disclaimer: Informational only. Consult a doctor.</p>
          </div>
        </div>
      ) : null}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          To use the TDEE calculator, select your preferred unit system (metric or imperial), then input your age, gender, weight, and height. Choose your activity level from the options provided. The calculator will estimate your Total Daily Energy Expenditure, which is the number of calories you need to maintain your current weight. Adjust the inputs to explore different scenarios.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The Science</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The TDEE calculation is based on the Mifflin-St Jeor equation, which is considered more accurate than the older Harris-Benedict formula. The Mifflin-St Jeor equation accounts for modern lifestyle changes and provides a more precise estimate of Basal Metabolic Rate (BMR). BMR is then multiplied by an activity factor to determine TDEE. This method is widely used in clinical settings and fitness planning.
        </p>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Factors Affecting Results</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Age:</strong> Metabolic rate declines by approximately 2% per decade after age 20, largely due to muscle mass loss.</li>
          <li><strong>Gender:</strong> Men typically have more muscle mass than women, leading to higher BMR and TDEE.</li>
          <li><strong>Hormones:</strong> Thyroid hormones and insulin can significantly impact metabolic rate.</li>
          <li><strong>Muscle Mass:</strong> More muscle increases BMR, as muscle tissue requires more energy to maintain.</li>
          <li><strong>Pregnancy:</strong> Increases energy needs due to fetal development and maternal physiological changes.</li>
          <li><strong>Drugs:</strong> Certain medications can alter metabolism, affecting TDEE.</li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
        <ul className="space-y-4">
          <li>
            <strong>What is TDEE?</strong>
            <p>TDEE stands for Total Daily Energy Expenditure, which is the total number of calories you burn in a day, including all activities and bodily functions.</p>
          </li>
          <li>
            <strong>How accurate is the TDEE calculator?</strong>
            <p>The TDEE calculator provides an estimate based on standard equations. Individual variations such as metabolism and lifestyle can affect accuracy.</p>
          </li>
          <li>
            <strong>Can TDEE help with weight loss?</strong>
            <p>Yes, understanding your TDEE can help you create a calorie deficit for weight loss by consuming fewer calories than you expend.</p>
          </li>
          <li>
            <strong>Why does activity level matter?</strong>
            <p>Activity level affects TDEE because physical activities increase calorie expenditure, influencing the total energy required daily.</p>
          </li>
          <li>
            <strong>Is TDEE the same for everyone?</strong>
            <p>No, TDEE varies based on factors like age, gender, weight, height, and activity level, making it unique to each individual.</p>
          </li>
          <li>
            <strong>How often should I recalculate my TDEE?</strong>
            <p>Recalculate your TDEE whenever there are significant changes in weight, activity level, or lifestyle to ensure accurate energy needs.</p>
          </li>
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <ul className="space-y-4">
          <li className="mb-4">
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/" className="text-blue-600 font-bold block">Mifflin MD, St Jeor ST, et al. A new predictive equation for resting energy expenditure in healthy individuals.</a>
            <p className="text-slate-500">Journal of the American Dietetic Association, 1990.</p>
          </li>
          <li className="mb-4">
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6019055/" className="text-blue-600 font-bold block">Sarcopenia: European consensus on definition and diagnosis.</a>
            <p className="text-slate-500">Age and Ageing, 2010.</p>
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
      jsonLd={useFaqJsonLd([
        { question: "What is TDEE?", answer: "TDEE stands for Total Daily Energy Expenditure, which is the total number of calories you burn in a day, including all activities and bodily functions." },
        { question: "How accurate is the TDEE calculator?", answer: "The TDEE calculator provides an estimate based on standard equations. Individual variations such as metabolism and lifestyle can affect accuracy." },
        { question: "Can TDEE help with weight loss?", answer: "Yes, understanding your TDEE can help you create a calorie deficit for weight loss by consuming fewer calories than you expend." },
        { question: "Why does activity level matter?", answer: "Activity level affects TDEE because physical activities increase calorie expenditure, influencing the total energy required daily." },
        { question: "Is TDEE the same for everyone?", answer: "No, TDEE varies based on factors like age, gender, weight, height, and activity level, making it unique to each individual." },
        { question: "How often should I recalculate my TDEE?", answer: "Recalculate your TDEE whenever there are significant changes in weight, activity level, or lifestyle to ensure accurate energy needs." }
      ])}
      formula={{ title: "Formula", formula: "TDEE = BMR x Activity Level", variables: ["BMR: Basal Metabolic Rate", "Activity Level: Multiplier based on physical activity"] }}
      example={{ title: "Example", scenario: "A 30-year-old male, 70 kg, 175 cm, lightly active", steps: ["Calculate BMR", "Multiply by activity level"], result: "TDEE = 2500 kcal/day" }}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "❤️" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "💧" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "🥗" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "😴" }
      ]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "The Science" },
        { id: "factors", label: "Factors" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}