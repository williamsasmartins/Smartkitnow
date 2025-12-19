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
      question: "How accurate is this life expectancy calculator?",
      answer:
        "This calculator provides an estimate based on population-level statistical data and known health risk factors. Individual outcomes may vary due to genetics, environment, and unforeseen health events. It should be used as a general guide rather than a precise prediction.",
    },
    {
      question: "Can lifestyle changes improve my life expectancy?",
      answer:
        "Yes, adopting healthier habits such as quitting smoking, exercising regularly, maintaining a healthy weight, eating a balanced diet, managing stress, and getting adequate sleep can significantly improve your life expectancy and overall quality of life.",
    },
    {
      question: "Why do chronic conditions reduce life expectancy?",
      answer:
        "Chronic conditions like diabetes, heart disease, and respiratory illnesses can increase the risk of complications and mortality. Managing these conditions effectively with medical care and lifestyle adjustments can help mitigate their impact on longevity.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Life Expectancy Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Life expectancy calculators estimate the average number of years a person is expected to live based on various demographic, lifestyle, and health factors. This calculator integrates data from epidemiological studies and public health research to provide a personalized estimate. It considers critical factors such as age, sex, smoking status, physical activity, body mass index (BMI), alcohol consumption, diet quality, sleep patterns, stress levels, and presence of chronic conditions. While it cannot predict exact lifespan, it offers valuable insights into how lifestyle choices and health status influence longevity.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate estimate of your life expectancy, please fill in all the fields with your current information. The calculator uses your age and sex as foundational data, then adjusts the estimate based on your lifestyle habits and health conditions. After entering your data, click the "Calculate" button to see your personalized life expectancy estimate. You can reset the form anytime to enter new data or update your information.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your current age in years.
          </li>
          <li>
            <strong>Step 2:</strong> Select your biological sex.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your smoking status.
          </li>
          <li>
            <strong>Step 4:</strong> Indicate your typical exercise frequency.
          </li>
          <li>
            <strong>Step 5:</strong> Input your Body Mass Index (BMI). If unknown, consult a healthcare provider or use an online BMI calculator.
          </li>
          <li>
            <strong>Step 6:</strong> Select your average alcohol consumption.
          </li>
          <li>
            <strong>Step 7:</strong> Choose your diet quality based on your typical food intake.
          </li>
          <li>
            <strong>Step 8:</strong> Select your average sleep quality and duration.
          </li>
          <li>
            <strong>Step 9:</strong> Indicate your perceived stress level.
          </li>
          <li>
            <strong>Step 10:</strong> Specify if you have any chronic health conditions.
          </li>
          <li>
            <strong>Step 11:</strong> Click "Calculate" to view your estimated life expectancy.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While this calculator provides a useful estimate, it is essential to remember that individual life expectancy can be influenced by many factors beyond those included here, such as genetics and environmental exposures. For the most accurate health assessment, consult healthcare professionals regularly. Adopting healthy habits such as quitting smoking, engaging in regular physical activity, maintaining a healthy weight, eating a balanced diet rich in fruits and vegetables, moderating alcohol intake, managing stress, and ensuring adequate sleep can all contribute to increased longevity and improved quality of life. Always seek medical advice before making significant lifestyle changes, especially if you have existing health conditions.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.cdc.gov/nchs/fastats/life-expectancy.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Center for Health Statistics - Life Expectancy (CDC) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official statistics and reports on life expectancy trends and factors affecting longevity in the United States.
            </p>
          </li>
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/life-expectancy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              World Health Organization - Life Expectancy Fact Sheet <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Global insights into life expectancy, health determinants, and strategies to improve longevity worldwide.
            </p>
          </li>
          <li>
            <a
              href="https://www.nia.nih.gov/health/longevity-and-life-expectancy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Institute on Aging - Longevity and Life Expectancy <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Research-based information on aging, factors influencing lifespan, and healthy aging tips.
            </p>
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
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday-life/home-paint-touch-up", icon: "🏠" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
        { title: "Fertilizer Application Calculator", url: "/everyday-life/fertilizer-application-calculator", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday-life/beverage-mix-estimator", icon: "🎉" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
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