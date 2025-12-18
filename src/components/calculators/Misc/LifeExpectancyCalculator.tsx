import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LifeExpectancyCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    smoking: "",
    alcohol: "",
    exercise: "",
    diet: "",
    bmi: "",
    sleep: "",
    stress: "",
    medicalConditions: "",
    socioeconomic: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper: parse float safely
  const parseNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? null : n;
  };

  // Life expectancy base values by gender (average global)
  const baseLifeExpectancy = {
    male: 72,
    female: 77,
    other: 74,
  };

  // Calculate modifiers based on inputs
  const results = useMemo(() => {
    // Extract inputs with parsing
    const age = parseNumber(inputs.age);
    const gender = inputs.gender || "other";
    const smoking = inputs.smoking || "never";
    const alcohol = inputs.alcohol || "none";
    const exercise = inputs.exercise || "none";
    const diet = inputs.diet || "average";
    const bmi = parseNumber(inputs.bmi);
    const sleep = parseNumber(inputs.sleep);
    const stress = inputs.stress || "low";
    const medicalConditions = inputs.medicalConditions || "none";
    const socioeconomic = inputs.socioeconomic || "average";

    if (age === null || age < 0 || age > 120) {
      return {
        value: null,
        label: "Please enter a valid age between 0 and 120.",
        subtext: null,
        warning: "Invalid age input.",
        formulaUsed: null,
      };
    }

    // Start with base life expectancy by gender
    let lifeExp = baseLifeExpectancy[gender];

    // Adjust for current age (subtract years already lived)
    lifeExp = lifeExp - age;
    if (lifeExp < 0) lifeExp = 0;

    // Smoking impact (years lost)
    const smokingImpact = {
      never: 0,
      former: 3,
      current: 10,
    };
    lifeExp -= smokingImpact[smoking];

    // Alcohol consumption impact (years lost or gained)
    // Moderate drinking may have slight benefit, heavy drinking reduces life expectancy
    const alcoholImpact = {
      none: 0,
      moderate: 1,
      heavy: 7,
    };
    lifeExp -= alcoholImpact[alcohol];

    // Exercise impact (years gained)
    const exerciseImpact = {
      none: -3,
      light: 2,
      moderate: 4,
      intense: 6,
    };
    lifeExp += exerciseImpact[exercise];

    // Diet impact (years gained or lost)
    const dietImpact = {
      poor: -4,
      average: 0,
      healthy: 5,
      vegan: 6,
    };
    lifeExp += dietImpact[diet];

    // BMI impact (optimal range 18.5-24.9)
    if (bmi !== null) {
      if (bmi < 18.5) lifeExp -= 3;
      else if (bmi >= 25 && bmi < 30) lifeExp -= 2;
      else if (bmi >= 30) lifeExp -= 7;
      else lifeExp += 1; // optimal BMI slight benefit
    }

    // Sleep impact (optimal 7-9 hours)
    if (sleep !== null) {
      if (sleep < 5) lifeExp -= 5;
      else if (sleep >= 5 && sleep < 7) lifeExp -= 2;
      else if (sleep >= 7 && sleep <= 9) lifeExp += 3;
      else if (sleep > 9) lifeExp -= 3;
    }

    // Stress impact
    const stressImpact = {
      low: 3,
      moderate: 0,
      high: -5,
    };
    lifeExp += stressImpact[stress];

    // Medical conditions impact
    const medicalImpact = {
      none: 0,
      mild: -3,
      moderate: -7,
      severe: -15,
    };
    lifeExp += medicalImpact[medicalConditions];

    // Socioeconomic status impact
    const socioeconomicImpact = {
      low: -5,
      average: 0,
      high: 4,
    };
    lifeExp += socioeconomicImpact[socioeconomic];

    // Clamp life expectancy to minimum 0
    if (lifeExp < 0) lifeExp = 0;

    // Round to 1 decimal place
    const finalLifeExp = Math.round(lifeExp * 10) / 10;

    // Compose label and subtext
    const label = `${finalLifeExp} years`;
    const subtext = `Estimated remaining life expectancy based on your inputs.`;

    // Formula summary
    const formulaUsed = `
      Base life expectancy by gender (${baseLifeExpectancy[gender]} years)
      - Age (${age} years lived)
      - Smoking impact (${smokingImpact[smoking]} years)
      - Alcohol impact (${alcoholImpact[alcohol]} years)
      + Exercise impact (${exerciseImpact[exercise]} years)
      + Diet impact (${dietImpact[diet]} years)
      +/- BMI impact
      +/- Sleep impact
      + Stress impact (${stressImpact[stress]} years)
      + Medical conditions impact (${medicalImpact[medicalConditions]} years)
      + Socioeconomic impact (${socioeconomicImpact[socioeconomic]} years)
    `;

    // Warning if inputs are extreme or missing
    let warning = null;
    if (age < 1) warning = "Life expectancy estimates for infants may vary significantly.";
    if (inputs.age === "") warning = "Please enter your age to get an accurate estimate.";

    return { value: label, label: "Remaining Life Expectancy", subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "What factors most significantly affect life expectancy?",
      answer:
        "Life expectancy is influenced by a combination of genetics, lifestyle choices, and environmental factors. Key lifestyle factors include smoking status, alcohol consumption, diet quality, physical activity, body mass index (BMI), sleep patterns, stress levels, and the presence of chronic medical conditions. Socioeconomic status also plays a crucial role by affecting access to healthcare, nutrition, and living conditions. This calculator integrates these factors to provide a personalized estimate.",
    },
    {
      question: "How accurate is this life expectancy calculator?",
      answer:
        "This calculator provides an estimate based on statistical averages and epidemiological research linking lifestyle factors to longevity. However, it cannot account for individual genetic predispositions, unforeseen health events, or environmental changes. It should be used as a general guide rather than a precise prediction. For personalized medical advice, consulting healthcare professionals is always recommended.",
    },
    {
      question: "Why does BMI affect life expectancy?",
      answer:
        "Body Mass Index (BMI) is a measure of body fat based on height and weight. Both underweight and obesity are associated with increased health risks such as cardiovascular disease, diabetes, and weakened immune function, which can reduce life expectancy. Maintaining a BMI within the healthy range (18.5-24.9) is linked to lower risk of chronic diseases and generally better health outcomes.",
    },
    {
      question: "Can lifestyle changes improve my life expectancy?",
      answer:
        "Yes, adopting healthier lifestyle habits such as quitting smoking, moderating alcohol intake, engaging in regular physical activity, eating a balanced diet, maintaining a healthy weight, managing stress, and getting adequate sleep can significantly improve life expectancy. Even small positive changes can have meaningful impacts on overall health and longevity over time.",
    },
    {
      question: "How does socioeconomic status influence longevity?",
      answer:
        "Socioeconomic status affects access to quality healthcare, nutritious food, safe living environments, education, and social support—all of which contribute to health outcomes. Higher socioeconomic status is generally associated with longer life expectancy due to better resources and reduced exposure to health risks. Conversely, lower socioeconomic status can increase vulnerability to chronic diseases and reduce lifespan.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="mb-1 flex items-center gap-1">
              Age <Calendar className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="age"
              type="number"
              min={0}
              max={120}
              placeholder="Enter your age"
              value={inputs.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="gender" className="mb-1 flex items-center gap-1">
              Gender <Users className="w-4 h-4 text-pink-600" />
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("gender", v)}
              value={inputs.gender}
              id="gender"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other / Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="smoking" className="mb-1 flex items-center gap-1">
              Smoking Status <Heart className="w-4 h-4 text-red-600" />
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("smoking", v)}
              value={inputs.smoking}
              id="smoking"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select smoking status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never Smoked</SelectItem>
                <SelectItem value="former">Former Smoker</SelectItem>
                <SelectItem value="current">Current Smoker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="alcohol" className="mb-1 flex items-center gap-1">
              Alcohol Consumption <Droplets className="w-4 h-4 text-purple-600" />
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("alcohol", v)}
              value={inputs.alcohol}
              id="alcohol"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alcohol consumption" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exercise" className="mb-1 flex items-center gap-1">
              Exercise Frequency <Activity className="w-4 h-4 text-green-600" />
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("exercise", v)}
              value={inputs.exercise}
              id="exercise"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exercise level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="light">Light (1-2 times/week)</SelectItem>
                <SelectItem value="moderate">Moderate (3-5 times/week)</SelectItem>
                <SelectItem value="intense">Intense (6+ times/week)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="diet" className="mb-1 flex items-center gap-1">
              Diet Quality <Utensils className="w-4 h-4 text-yellow-600" />
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("diet", v)}
              value={inputs.diet}
              id="diet"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diet quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bmi" className="mb-1 flex items-center gap-1">
              Body Mass Index (BMI) <Scale className="w-4 h-4 text-indigo-600" />
            </Label>
            <Input
              id="bmi"
              type="number"
              min={10}
              max={60}
              step={0.1}
              placeholder="e.g. 22.5"
              value={inputs.bmi}
              onChange={(e) => handleInputChange("bmi", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="sleep" className="mb-1 flex items-center gap-1">
              Average Sleep (hours/night) <Moon className="w-4 h-4 text-blue-700" />
            </Label>
            <Input
              id="sleep"
              type="number"
              min={0}
              max={24}
              step={0.1}
              placeholder="e.g. 7.5"
              value={inputs.sleep}
              onChange={(e) => handleInputChange("sleep", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="stress" className="mb-1 flex items-center gap-1">
              Stress Level <AlertTriangle className="w-4 h-4 text-red-500" />
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("stress", v)}
              value={inputs.stress}
              id="stress"
            >
              <SelectTrigger>
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
            <Label htmlFor="medicalConditions" className="mb-1 flex items-center gap-1">
              Medical Conditions <FlaskConical className="w-4 h-4 text-pink-600" />
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("medicalConditions", v)}
              value={inputs.medicalConditions}
              id="medicalConditions"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select medical condition severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="socioeconomic" className="mb-1 flex items-center gap-1">
              Socioeconomic Status <DollarSign className="w-4 h-4 text-green-700" />
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("socioeconomic", v)}
              value={inputs.socioeconomic}
              id="socioeconomic"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select socioeconomic status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No explicit calculation trigger needed; useMemo updates automatically
            if (!inputs.age) alert("Please enter your age to calculate life expectancy.");
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          type="button"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              gender: "",
              smoking: "",
              alcohol: "",
              exercise: "",
              diet: "",
              bmi: "",
              sleep: "",
              stress: "",
              medicalConditions: "",
              socioeconomic: "",
            })
          }
          className="flex-1 h-11"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold">{results.warning}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Life expectancy is a statistical measure indicating the average number of years a person can expect to live,
          based on various demographic, lifestyle, and health factors. It is not a fixed number but rather an estimate
          derived from population data and individual characteristics. Understanding life expectancy helps individuals
          make informed decisions about their health and lifestyle choices.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator integrates multiple factors such as age, gender, smoking habits, alcohol consumption, physical
          activity, diet, body mass index (BMI), sleep patterns, stress levels, medical conditions, and socioeconomic
          status to provide a personalized estimate of remaining life expectancy. Each factor contributes positively or
          negatively based on scientific research linking these variables to longevity outcomes.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate estimate of your remaining life expectancy, carefully input your personal and lifestyle
          information into the fields provided. Each input corresponds to a factor known to influence longevity. Follow
          the detailed steps below to complete the form and interpret your results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your current age in years. This is essential as the calculator estimates
            remaining years based on your current age.
          </li>
          <li>
            <strong>Step 2:</strong> Select your gender. This affects the base life expectancy used in calculations.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your smoking status. Smoking significantly reduces life expectancy, so
            accurate selection is important.
          </li>
          <li>
            <strong>Step 4:</strong> Indicate your alcohol consumption level. Moderate drinking may have slight benefits,
            while heavy drinking reduces longevity.
          </li>
          <li>
            <strong>Step 5:</strong> Select your exercise frequency. Regular physical activity is linked to longer life.
          </li>
          <li>
            <strong>Step 6:</strong> Choose your diet quality. Healthy diets contribute positively to lifespan.
          </li>
          <li>
            <strong>Step 7:</strong> Enter your Body Mass Index (BMI). This number reflects your weight relative to height
            and impacts health risks.
          </li>
          <li>
            <strong>Step 8:</strong> Input your average nightly sleep duration. Both insufficient and excessive sleep can
            affect longevity.
          </li>
          <li>
            <strong>Step 9:</strong> Select your stress level. Chronic stress negatively impacts health and lifespan.
          </li>
          <li>
            <strong>Step 10:</strong> Indicate the severity of any medical conditions you have. Chronic illnesses reduce
            life expectancy.
          </li>
          <li>
            <strong>Step 11:</strong> Choose your socioeconomic status. This influences access to healthcare and living
            conditions.
          </li>
          <li>
            <strong>Step 12:</strong> Click the <em>Calculate</em> button to view your estimated remaining life expectancy.
          </li>
          <li>
            <strong>Step 13:</strong> Review the result card for your personalized estimate and any warnings or notes.
          </li>
          <li>
            <strong>Step 14:</strong> Use the <em>Reset</em> button to clear all inputs and start a new calculation if
            desired.
          </li>
        </ul>
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
        formula: `
          Life Expectancy = Base Life Expectancy by Gender - Age Lived
          - Smoking Impact - Alcohol Impact + Exercise Impact + Diet Impact
          +/- BMI Impact +/- Sleep Impact + Stress Impact + Medical Conditions Impact + Socioeconomic Impact
        `,
        variables: [
          { symbol: "Base Life Expectancy", description: "Average life expectancy based on gender" },
          { symbol: "Age Lived", description: "Your current age in years" },
          { symbol: "Smoking Impact", description: "Years lost due to smoking habits" },
          { symbol: "Alcohol Impact", description: "Years lost or gained based on alcohol consumption" },
          { symbol: "Exercise Impact", description: "Years gained based on physical activity level" },
          { symbol: "Diet Impact", description: "Years gained or lost based on diet quality" },
          { symbol: "BMI Impact", description: "Adjustment based on body mass index" },
          { symbol: "Sleep Impact", description: "Adjustment based on average sleep duration" },
          { symbol: "Stress Impact", description: "Adjustment based on stress level" },
          { symbol: "Medical Conditions Impact", description: "Years lost due to chronic medical conditions" },
          { symbol: "Socioeconomic Impact", description: "Adjustment based on socioeconomic status" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Consider a 45-year-old female who is a former smoker, drinks alcohol moderately, exercises moderately, follows a healthy diet, has a BMI of 23, sleeps 7.5 hours per night, experiences moderate stress, has mild medical conditions, and has an average socioeconomic status.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Start with the base life expectancy for females, which is 77 years, then subtract her current age of 45 years, leaving 32 years.",
          },
          {
            label: "Step 2",
            explanation:
              "Subtract 3 years for former smoking, subtract 1 year for moderate alcohol consumption, add 4 years for moderate exercise, add 5 years for a healthy diet, add 1 year for optimal BMI, add 3 years for adequate sleep, add 0 years for moderate stress, subtract 3 years for mild medical conditions, and add 0 years for average socioeconomic status.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate the total adjustments: -3 -1 +4 +5 +1 +3 +0 -3 +0 = +6 years. Add this to the remaining 32 years to get an estimated 38 years of remaining life expectancy.",
          },
          {
            label: "Step 4",
            explanation: "Therefore, the estimated total life expectancy is 45 (current age) + 38 = 83 years.",
          },
        ],
        result: "Estimated remaining life expectancy: 38 years; Total life expectancy: 83 years.",
      }}
      relatedCalculators={[
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday-life/lawn-mowing-time-fuel", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Event Capacity Calculator", url: "/everyday-life/event-capacity-calculator", icon: "🎉" },
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}