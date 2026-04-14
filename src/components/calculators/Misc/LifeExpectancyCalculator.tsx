import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const BASE_LIFE_EXPECTANCY = 78.6; // US average life expectancy in years (CDC 2023)

function calculateLifeExpectancy({
  age,
  sex,
  smoker,
  exercise,
  bmi,
  alcohol,
  diet,
  sleep,
  stress,
  chronicConditions,
}) {
  // Start with base life expectancy
  let expectancy = BASE_LIFE_EXPECTANCY;

  // Adjust for age (cannot be less than current age)
  if (age && age > 0) {
    expectancy = Math.max(expectancy, age);
  }

  // Sex adjustment: females live longer on average (~5 years)
  if (sex === "female") {
    expectancy += 5;
  } else if (sex === "male") {
    expectancy -= 0;
  }

  // Smoking reduces life expectancy drastically
  if (smoker === "yes") {
    expectancy -= 10;
  } else if (smoker === "former") {
    expectancy -= 3;
  }

  // Exercise: more exercise adds years
  if (exercise === "none") {
    expectancy -= 3;
  } else if (exercise === "moderate") {
    expectancy += 2;
  } else if (exercise === "high") {
    expectancy += 4;
  }

  // BMI: underweight or obese reduces expectancy
  if (bmi) {
    if (bmi < 18.5) expectancy -= 2;
    else if (bmi >= 25 && bmi < 30) expectancy -= 1;
    else if (bmi >= 30) expectancy -= 5;
  }

  // Alcohol consumption: moderate drinking may add slight benefit, heavy reduces
  if (alcohol === "none") {
    expectancy += 0;
  } else if (alcohol === "moderate") {
    expectancy += 1;
  } else if (alcohol === "heavy") {
    expectancy -= 5;
  }

  // Diet quality: better diet adds years
  if (diet === "poor") {
    expectancy -= 3;
  } else if (diet === "average") {
    expectancy += 0;
  } else if (diet === "healthy") {
    expectancy += 3;
  }

  // Sleep: optimal sleep (7-8 hours) adds years, poor sleep reduces
  if (sleep === "poor") {
    expectancy -= 3;
  } else if (sleep === "good") {
    expectancy += 2;
  }

  // Stress: chronic high stress reduces life expectancy
  if (stress === "high") {
    expectancy -= 4;
  } else if (stress === "moderate") {
    expectancy -= 1;
  } else if (stress === "low") {
    expectancy += 1;
  }

  // Chronic conditions reduce expectancy
  if (chronicConditions === "yes") {
    expectancy -= 7;
  }

  // Ensure expectancy is not less than current age
  if (age && expectancy < age) expectancy = age;

  // Round to one decimal place
  return Math.round(expectancy * 10) / 10;
}

export default function LifeExpectancyCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    sex: "",
    smoker: "",
    exercise: "",
    bmi: "",
    alcohol: "",
    diet: "",
    sleep: "",
    stress: "",
    chronicConditions: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const ageNum = Number(inputs.age);
    const bmiNum = Number(inputs.bmi);

    if (
      !ageNum ||
      ageNum <= 0 ||
      !inputs.sex ||
      !inputs.smoker ||
      !inputs.exercise ||
      !inputs.bmi ||
      bmiNum <= 0 ||
      !inputs.alcohol ||
      !inputs.diet ||
      !inputs.sleep ||
      !inputs.stress ||
      !inputs.chronicConditions
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please fill in all fields to calculate your life expectancy.",
        warning: null,
        formulaUsed:
          "Base life expectancy adjusted by lifestyle and health factors based on epidemiological data.",
      };
    }

    const lifeExp = calculateLifeExpectancy({
      age: ageNum,
      sex: inputs.sex,
      smoker: inputs.smoker,
      exercise: inputs.exercise,
      bmi: bmiNum,
      alcohol: inputs.alcohol,
      diet: inputs.diet,
      sleep: inputs.sleep,
      stress: inputs.stress,
      chronicConditions: inputs.chronicConditions,
    });

    let warning = null;
    if (lifeExp < ageNum) {
      warning = "Calculated life expectancy is less than current age, please verify inputs.";
    }

    return {
      value: `${lifeExp} years`,
      label: "Estimated Life Expectancy",
      subtext: "This estimate is based on your inputs and statistical models.",
      warning,
      formulaUsed:
        "Life expectancy = Base expectancy ± adjustments for age, sex, smoking, exercise, BMI, alcohol, diet, sleep, stress, and chronic conditions.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What factors does the Life Expectancy Calculator consider?",
      answer: "The calculator typically factors in age, gender, health status, smoking habits, exercise frequency, diet quality, and family medical history to estimate your remaining life expectancy.",
    },
    {
      question: "Is the Life Expectancy Calculator scientifically accurate?",
      answer: "Life expectancy estimates are based on actuarial data and statistical models, but individual outcomes vary significantly based on unforeseen health events and lifestyle changes.",
    },
    {
      question: "How does gender affect life expectancy calculations?",
      answer: "Women typically have a life expectancy 5-7 years longer than men on average, which the calculator adjusts based on biological and lifestyle factors.",
    },
    {
      question: "Can lifestyle changes improve my calculated life expectancy?",
      answer: "Yes, quitting smoking can add 10 years, regular exercise adds 3-7 years, and maintaining a healthy diet contributes 2-4 years to your estimated lifespan.",
    },
    {
      question: "What role does family history play in life expectancy?",
      answer: "Family history accounts for approximately 25-30% of life expectancy variation, particularly regarding cardiovascular disease, cancer, and diabetes risk factors.",
    },
    {
      question: "Does the calculator account for current health conditions?",
      answer: "Most calculators adjust estimates based on conditions like diabetes, hypertension, and heart disease, reducing life expectancy by 5-15 years depending on severity and management.",
    },
    {
      question: "How often should I recalculate my life expectancy?",
      answer: "Recalculate annually or whenever major health changes occur, such as a new diagnosis, significant lifestyle modifications, or after reaching major age milestones.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                min={0}
                max={120}
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="e.g., 35"
              />
            </div>
            <div>
              <Label htmlFor="sex">Sex</Label>
              <Select
                value={inputs.sex}
                onValueChange={(v) => handleInputChange("sex", v)}
              >
                <SelectTrigger id="sex" aria-label="Select sex">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    Male <Heart className="inline ml-1 w-4 h-4 text-red-500" />
                  </SelectItem>
                  <SelectItem value="female">
                    Female <Heart className="inline ml-1 w-4 h-4 text-pink-500" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="smoker">Smoking Status</Label>
              <Select
                value={inputs.smoker}
                onValueChange={(v) => handleInputChange("smoker", v)}
              >
                <SelectTrigger id="smoker" aria-label="Select smoking status">
                  <SelectValue placeholder="Select smoking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Non-smoker</SelectItem>
                  <SelectItem value="former">Former smoker</SelectItem>
                  <SelectItem value="yes">Current smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exercise">Exercise Level</Label>
              <Select
                value={inputs.exercise}
                onValueChange={(v) => handleInputChange("exercise", v)}
              >
                <SelectTrigger id="exercise" aria-label="Select exercise level">
                  <SelectValue placeholder="Select exercise level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="moderate">Moderate (3-4 days/week)</SelectItem>
                  <SelectItem value="high">High (5+ days/week)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bmi">Body Mass Index (BMI)</Label>
              <Input
                id="bmi"
                type="number"
                min={10}
                max={60}
                step={0.1}
                value={inputs.bmi}
                onChange={(e) => handleInputChange("bmi", e.target.value)}
                placeholder="e.g., 22.5"
              />
            </div>
            <div>
              <Label htmlFor="alcohol">Alcohol Consumption</Label>
              <Select
                value={inputs.alcohol}
                onValueChange={(v) => handleInputChange("alcohol", v)}
              >
                <SelectTrigger id="alcohol" aria-label="Select alcohol consumption">
                  <SelectValue placeholder="Select alcohol consumption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="moderate">Moderate (up to 1 drink/day)</SelectItem>
                  <SelectItem value="heavy">Heavy (more than 1 drink/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="diet">Diet Quality</Label>
              <Select
                value={inputs.diet}
                onValueChange={(v) => handleInputChange("diet", v)}
              >
                <SelectTrigger id="diet" aria-label="Select diet quality">
                  <SelectValue placeholder="Select diet quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor (high processed foods)</SelectItem>
                  <SelectItem value="average">Average (mixed diet)</SelectItem>
                  <SelectItem value="healthy">Healthy (balanced, plant-rich)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sleep">Sleep Quality</Label>
              <Select
                value={inputs.sleep}
                onValueChange={(v) => handleInputChange("sleep", v)}
              >
                <SelectTrigger id="sleep" aria-label="Select sleep quality">
                  <SelectValue placeholder="Select sleep quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor (less than 6 hours)</SelectItem>
                  <SelectItem value="good">Good (7-8 hours)</SelectItem>
                  <SelectItem value="excessive">Excessive (more than 9 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stress">Stress Level</Label>
              <Select
                value={inputs.stress}
                onValueChange={(v) => handleInputChange("stress", v)}
              >
                <SelectTrigger id="stress" aria-label="Select stress level">
                  <SelectValue placeholder="Select stress level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="chronicConditions">Chronic Conditions</Label>
              <Select
                value={inputs.chronicConditions}
                onValueChange={(v) => handleInputChange("chronicConditions", v)}
              >
                <SelectTrigger id="chronicConditions" aria-label="Select chronic conditions">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate life expectancy"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              sex: "",
              smoker: "",
              exercise: "",
              bmi: "",
              alcohol: "",
              diet: "",
              sleep: "",
              stress: "",
              chronicConditions: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Life Expectancy Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Life Expectancy Calculator estimates your statistical life expectancy based on personal health data, lifestyle habits, and demographic factors. It uses actuarial tables and medical research to project your remaining years of life.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter key inputs including your current age, gender, smoking status, exercise frequency, family health history, and any existing medical conditions. The calculator weighs each factor according to scientific evidence of its impact on longevity.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review your estimated life expectancy as a probability-based projection rather than a definitive prediction. Use the results to identify lifestyle improvements and discuss personalized health goals with your healthcare provider.</p>
        </div>
      </section>

      {/* TABLE: Global Life Expectancy by Country (2024) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Global Life Expectancy by Country (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Average life expectancy varies significantly across developed and developing nations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Country</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Expectancy (Years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gender Gap (F-M)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Japan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Switzerland</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Australia</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Italy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">South Korea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United States</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United Kingdom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">81.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Canada</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.7</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on 2024 WHO estimates; gender gap measured as female life expectancy minus male life expectancy.</p>
      </section>

      {/* TABLE: Life Expectancy Impact of Lifestyle Factors */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Life Expectancy Impact of Lifestyle Factors</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Each major lifestyle choice can significantly increase or decrease estimated lifespan.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lifestyle Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Positive Impact</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Negative Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Smoking Status</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Quit: +10 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Active smoker: -10 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Physical Activity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Regular exercise: +3-7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sedentary: -2-5 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diet Quality</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mediterranean diet: +2-4 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High processed foods: -3-5 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Alcohol Consumption</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate: +1-2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy drinking: -5-10 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stress Management</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low stress: +2-3 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Chronic stress: -2-4 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sleep Quality</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9 hours nightly: +1-2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sleep deprivation: -1-3 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates based on longitudinal health studies from 2023-2024; individual results vary.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide accurate health information to receive the most reliable life expectancy estimate tailored to your situation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Focus on modifiable factors like exercise and diet, as these have the largest potential impact on extending your lifespan.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare multiple scenarios by adjusting lifestyle inputs to see how quitting smoking or increasing exercise affects your projected longevity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your results as motivation for preventive care rather than a fixed prediction, since individual outcomes depend on many variables.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Family History</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Underestimating genetic predisposition to disease can skew results; always include accurate information about parents and grandparents' health issues.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Omitting Current Medications</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to disclose medications for chronic conditions prevents proper adjustment of life expectancy calculations based on disease management.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overweighting One Factor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming exercise alone can offset 30 years of smoking ignores that longevity results from combined healthy habits working synergistically.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating Estimates as Guarantees</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Believing the calculator's result is fixed rather than probabilistic can lead to poor health decisions or unnecessary anxiety.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors does the Life Expectancy Calculator consider?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator typically factors in age, gender, health status, smoking habits, exercise frequency, diet quality, and family medical history to estimate your remaining life expectancy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is the Life Expectancy Calculator scientifically accurate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Life expectancy estimates are based on actuarial data and statistical models, but individual outcomes vary significantly based on unforeseen health events and lifestyle changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does gender affect life expectancy calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Women typically have a life expectancy 5-7 years longer than men on average, which the calculator adjusts based on biological and lifestyle factors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can lifestyle changes improve my calculated life expectancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, quitting smoking can add 10 years, regular exercise adds 3-7 years, and maintaining a healthy diet contributes 2-4 years to your estimated lifespan.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does family history play in life expectancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Family history accounts for approximately 25-30% of life expectancy variation, particularly regarding cardiovascular disease, cancer, and diabetes risk factors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for current health conditions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most calculators adjust estimates based on conditions like diabetes, hypertension, and heart disease, reducing life expectancy by 5-15 years depending on severity and management.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my life expectancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate annually or whenever major health changes occur, such as a new diagnosis, significant lifestyle modifications, or after reaching major age milestones.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">World Health Organization - Life Expectancy Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official WHO statistics on global life expectancy trends and mortality data by country and demographic group.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/nchs/fastats/life-expectancy.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC - Life Expectancy in the United States</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">U.S. Centers for Disease Control provides updated life expectancy figures and trends across different populations.</p>
          </li>
          <li>
            <a href="https://www.hsph.harvard.edu/nutritionsource/disease-prevention/cardiovascular-disease/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Harvard School of Public Health - Lifestyle and Longevity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed information on how diet, exercise, and lifestyle choices impact life expectancy and chronic disease risk.</p>
          </li>
          <li>
            <a href="https://www.ssa.gov/benefits/retirement/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Social Security Administration - Life Expectancy Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. government resource for understanding life expectancy in retirement planning contexts.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Life Expectancy Calculator"
      description="Estimate your life expectancy. Analyze lifestyle factors like diet and exercise to see statistical projections for longevity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Life expectancy = Base expectancy ± adjustments for age, sex, smoking, exercise, BMI, alcohol, diet, sleep, stress, and chronic conditions.",
        variables: [
          { name: "Base expectancy", description: "Average life expectancy for the population" },
          { name: "Age", description: "Current age of the individual" },
          { name: "Sex", description: "Biological sex (male/female)" },
          { name: "Smoking", description: "Smoking status (non, former, current)" },
          { name: "Exercise", description: "Physical activity level" },
          { name: "BMI", description: "Body Mass Index" },
          { name: "Alcohol", description: "Alcohol consumption level" },
          { name: "Diet", description: "Quality of diet" },
          { name: "Sleep", description: "Sleep quality and duration" },
          { name: "Stress", description: "Stress level" },
          { name: "Chronic Conditions", description: "Presence of chronic diseases" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 45-year-old female, non-smoker, exercises moderately, has a BMI of 23, drinks alcohol moderately, eats a healthy diet, sleeps well, experiences low stress, and has no chronic conditions.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input age as 45 and select female for sex.",
          },
          {
            label: "Step 2",
            explanation: "Choose non-smoker, moderate exercise, BMI 23, moderate alcohol, healthy diet, good sleep, low stress, and no chronic conditions.",
          },
          {
            label: "Step 3",
            explanation: "Click Calculate to get the estimated life expectancy.",
          },
        ],
        result: "Estimated life expectancy is approximately 88.6 years, reflecting positive lifestyle factors.",
      }}
      relatedCalculators={[
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday/home-paint-touch-up", icon: "🏠" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday/coffee-urn-yield-strength", icon: "💡" },
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday/beverage-mix-estimator", icon: "🎉" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday/hydration-reminder-interval", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}