import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
// 👇 ATOMIC IMPORTS ONLY 👇
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, HelpCircle, BookOpen, AlertCircle, Calculator } from "lucide-react";
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
    activity: "1.2",
  });

  // Activity multipliers for TDEE calculation
  const activityLevels = [
    { label: "Sedentary (little or no exercise)", value: "1.2" },
    { label: "Lightly active (light exercise 1-3 days/week)", value: "1.375" },
    { label: "Moderately active (moderate exercise 3-5 days/week)", value: "1.55" },
    { label: "Very active (hard exercise 6-7 days/week)", value: "1.725" },
    { label: "Extra active (very hard exercise & physical job)", value: "1.9" },
  ];

  // Helper to parse inputs safely
  const parseNumber = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) || n <= 0 ? null : n;
  };

  // Calculate BMR using Mifflin-St Jeor Equation
  // Mifflin-St Jeor is considered more accurate than Harris-Benedict for modern populations
  // BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + s
  // s = +5 for males, -161 for females
  const calculateBMR = (weightKg: number, heightCm: number, age: number, gender: string) => {
    const s = gender === "male" ? 5 : -161;
    return 10 * weightKg + 6.25 * heightCm - 5 * age + s;
  };

  // Convert imperial height to cm
  const heightInCm = () => {
    if (unit === "imperial") {
      const ft = parseNumber(inputs.heightFt);
      const inch = parseNumber(inputs.heightIn);
      if (ft === null || inch === null) return null;
      return (ft * 12 + inch) * 2.54;
    } else {
      return parseNumber(inputs.heightMetric);
    }
  };

  // Convert weight to kg
  const weightInKg = () => {
    const w = parseNumber(inputs.weight);
    if (w === null) return null;
    if (unit === "imperial") {
      return w * 0.45359237; // lbs to kg
    }
    return w;
  };

  // Calculate TDEE = BMR * Activity Factor
  const results = useMemo(() => {
    const age = parseNumber(inputs.age);
    const weightKg = weightInKg();
    const heightCm = heightInCm();
    const activityFactor = parseFloat(inputs.activity);

    if (
      age === null ||
      weightKg === null ||
      heightCm === null ||
      isNaN(activityFactor) ||
      (inputs.gender !== "male" && inputs.gender !== "female")
    ) {
      return { value: 0, label: "Please enter valid inputs." };
    }

    // BMR calculation
    const bmr = calculateBMR(weightKg, heightCm, age, inputs.gender);

    // TDEE calculation
    const tdee = Math.round(bmr * activityFactor);

    return {
      value: tdee,
      label: `Your estimated Total Daily Energy Expenditure (TDEE) in calories.`,
    };
  }, [inputs, unit]);

  // 👇 WRITE DETAILED FAQS HERE 👇
  const faqs = [
    {
      question: "What is Total Daily Energy Expenditure (TDEE)?",
      answer:
        "TDEE represents the total number of calories your body burns in a day, including basal metabolic rate (BMR), physical activity, digestion, and other bodily functions. It is essential for understanding how many calories you need to maintain, lose, or gain weight. TDEE varies based on individual factors such as age, gender, weight, height, and activity level.",
    },
    {
      question: "Why is the Mifflin-St Jeor equation preferred over Harris-Benedict?",
      answer:
        "The Mifflin-St Jeor equation, developed in 1990, is considered more accurate for modern populations because it was derived from a more diverse and contemporary sample compared to the older Harris-Benedict formula from 1919. Studies have shown Mifflin-St Jeor better predicts resting metabolic rate (RMR) in healthy adults, making it the preferred choice for clinical and fitness settings.",
    },
    {
      question: "How does age affect metabolic rate and TDEE?",
      answer:
        "Metabolic rate typically declines by approximately 2% per decade after age 20, primarily due to sarcopenia—the loss of muscle mass with aging. Since muscle tissue is metabolically active, reduced muscle mass lowers basal metabolic rate (BMR), thus decreasing TDEE. This decline underscores the importance of strength training and maintaining muscle mass as we age.",
    },
    {
      question: "Why does gender influence TDEE calculations?",
      answer:
        "Biologically, males generally have higher muscle mass and lower body fat percentage compared to females, which increases their basal metabolic rate (BMR). Muscle tissue consumes more energy at rest than fat tissue, so males typically have a higher TDEE. Hormonal differences, such as testosterone levels, also contribute to these metabolic variations.",
    },
    {
      question: "How does physical activity level impact TDEE?",
      answer:
        "Physical activity significantly influences TDEE by increasing energy expenditure beyond basal metabolic needs. Activity multipliers account for different exercise intensities and frequencies, ranging from sedentary lifestyles to very active routines. Accurately estimating activity level is crucial for personalized calorie recommendations.",
    },
    {
      question: "Can factors like hormones or medications affect TDEE?",
      answer:
        "Yes, hormones such as thyroid hormones regulate metabolic rate, and imbalances (e.g., hypothyroidism) can lower TDEE. Certain medications, including beta-blockers or corticosteroids, may also alter metabolism or appetite. Pregnancy increases energy requirements due to fetal growth and physiological changes, necessitating adjusted TDEE estimates.",
    },
    {
      question: "Is TDEE a fixed number or does it change over time?",
      answer:
        "TDEE is dynamic and can change with variations in weight, muscle mass, age, activity level, and health status. For example, gaining muscle increases BMR and TDEE, while aging or inactivity decreases it. Regular reassessment ensures calorie recommendations remain accurate and effective.",
    },
    {
      question: "How accurate are TDEE calculators?",
      answer:
        "TDEE calculators provide estimates based on population averages and validated formulas but cannot account for all individual biological variations. Factors like genetics, body composition, and lifestyle nuances may cause deviations. They are best used as starting points, complemented by monitoring and adjusting based on real-world results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex gap-4 items-center">
        <Label htmlFor="unit" className="text-slate-700 dark:text-slate-300 font-semibold">
          Unit System:
        </Label>
        <Select
          value={unit}
          onValueChange={(val) => {
            setUnit(val);
            // Reset height inputs on unit change
            setInputs((prev) => ({
              ...prev,
              heightMetric: "",
              heightFt: "",
              heightIn: "",
              weight: "",
            }));
          }}
          id="unit"
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gender Select */}
      <div>
        <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300 font-semibold">
          Gender
        </Label>
        <Select
          value={inputs.gender}
          onValueChange={(val) => setInputs((prev) => ({ ...prev, gender: val }))}
          id="gender"
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Age Input */}
      <div>
        <Label htmlFor="age" className="text-slate-700 dark:text-slate-300 font-semibold">
          Age (years)
        </Label>
        <Input
          id="age"
          type="number"
          min={0}
          max={120}
          placeholder="e.g. 30"
          value={inputs.age}
          onChange={(e) => setInputs((prev) => ({ ...prev, age: e.target.value }))}
        />
      </div>

      {/* Weight Input */}
      <div>
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 font-semibold">
          Weight ({unit === "metric" ? "kg" : "lbs"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
        />
      </div>

      {/* Height Input */}
      {unit === "metric" ? (
        <div>
          <Label htmlFor="heightMetric" className="text-slate-700 dark:text-slate-300 font-semibold">
            Height (cm)
          </Label>
          <Input
            id="heightMetric"
            type="number"
            min={0}
            placeholder="e.g. 175"
            value={inputs.heightMetric}
            onChange={(e) => setInputs((prev) => ({ ...prev, heightMetric: e.target.value }))}
          />
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="heightFt" className="text-slate-700 dark:text-slate-300 font-semibold">
              Height (ft)
            </Label>
            <Input
              id="heightFt"
              type="number"
              min={0}
              placeholder="e.g. 5"
              value={inputs.heightFt}
              onChange={(e) => setInputs((prev) => ({ ...prev, heightFt: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="heightIn" className="text-slate-700 dark:text-slate-300 font-semibold">
              Height (in)
            </Label>
            <Input
              id="heightIn"
              type="number"
              min={0}
              max={11}
              placeholder="e.g. 10"
              value={inputs.heightIn}
              onChange={(e) => setInputs((prev) => ({ ...prev, heightIn: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* Activity Level Select */}
      <div>
        <Label htmlFor="activity" className="text-slate-700 dark:text-slate-300 font-semibold">
          Activity Level
        </Label>
        <Select
          value={inputs.activity}
          onValueChange={(val) => setInputs((prev) => ({ ...prev, activity: val }))}
          id="activity"
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {activityLevels.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              gender: "male",
              weight: "",
              heightMetric: "",
              heightFt: "",
              heightIn: "",
              activity: "1.2",
            })
          }
          className="flex-1 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
          type="button"
        >
          Reset
        </Button>
      </div>

      {results.value ? (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-blue-100">
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

  // EDITORIAL MUST BE RICH AND DETAILED
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          To estimate your Total Daily Energy Expenditure (TDEE), you need to provide several key inputs that reflect your personal characteristics and lifestyle. Start by selecting your preferred unit system: Metric (kilograms and centimeters) or Imperial (pounds, feet, and inches). Enter your age in years, as metabolic rate changes with age due to physiological factors. Choose your gender, which influences basal metabolic rate because of differences in muscle mass and hormonal profiles. Input your current weight and height accurately; these are critical for calculating your Basal Metabolic Rate (BMR), the energy your body requires at rest. Finally, select your typical activity level, ranging from sedentary to very active, to adjust your BMR to reflect daily energy expenditure from physical activities. After entering all data, click "Calculate" to see your estimated TDEE, which can guide your nutritional and fitness goals.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The Science</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in a day, encompassing basal metabolic rate (BMR), physical activity, and the thermic effect of food. The core of TDEE calculation is the BMR, which estimates the energy expended at rest to maintain vital bodily functions. Among various formulas, the Mifflin-St Jeor equation is widely regarded as the most accurate for contemporary populations. Developed in 1990, it improves upon the older Harris-Benedict formula (1919) by incorporating updated anthropometric data and better reflecting modern body compositions. The Mifflin-St Jeor formula calculates BMR using weight, height, age, and gender, with specific constants to adjust for sex differences.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The Harris-Benedict equation was the first widely used method to estimate BMR but tends to overestimate energy needs in some populations. The Mifflin-St Jeor equation's improved accuracy has made it the preferred choice in clinical and fitness settings. Once BMR is calculated, it is multiplied by an activity factor that accounts for physical activity levels, ranging from sedentary to very active lifestyles, to estimate TDEE. This approach provides a personalized estimate of daily caloric needs, essential for weight management and health optimization.
        </p>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Factors Affecting Results</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Age:</strong> Metabolic rate declines approximately 2% per decade after early adulthood, primarily due to sarcopenia, the age-related loss of muscle mass. Since muscle tissue is metabolically active, this reduction lowers basal metabolic rate and thus TDEE.
          </li>
          <li>
            <strong>Gender:</strong> Males typically have higher muscle mass and lower fat percentage than females, resulting in a higher basal metabolic rate. Hormonal differences, such as testosterone levels, also influence energy expenditure.
          </li>
          <li>
            <strong>Muscle Mass:</strong> Muscle tissue consumes more energy at rest than fat tissue. Individuals with greater lean body mass have higher BMR and TDEE.
          </li>
          <li>
            <strong>Pregnancy:</strong> Energy requirements increase during pregnancy to support fetal growth and maternal physiological changes, elevating TDEE.
          </li>
          <li>
            <strong>Hormones:</strong> Thyroid hormones regulate metabolism; hypothyroidism can reduce TDEE, while hyperthyroidism can increase it.
          </li>
          <li>
            <strong>Medications:</strong> Certain drugs, such as beta-blockers or corticosteroids, can alter metabolic rate or appetite, affecting TDEE.
          </li>
          <li>
            <strong>Physical Activity:</strong> The intensity, frequency, and duration of exercise significantly impact total energy expenditure.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
        <ul className="space-y-4">
          {faqs.map((item, i) => (
            <li key={i}>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.question}</h3>
              <p className="text-slate-700 dark:text-slate-300">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <ul className="space-y-4">
          <li className="mb-4">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/22289557/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals.
            </a>
            <p className="text-slate-500">
              The American Journal of Clinical Nutrition, 1990; 51(2):241-7.
            </p>
          </li>
          <li className="mb-4">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/5639954/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              Harris JA, Benedict FG. A biometric study of basal metabolism in man.
            </a>
            <p className="text-slate-500">
              Proceedings of the National Academy of Sciences, 1919; 4(12):370-3.
            </p>
          </li>
          <li className="mb-4">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              Speakman JR. The history and theory of the doubly labeled water technique.
            </a>
            <p className="text-slate-500">
              American Journal of Clinical Nutrition, 1998; 68(4):932-8.
            </p>
          </li>
          <li className="mb-4">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              Wolfe RR. The underappreciated role of muscle in health and disease.
            </a>
            <p className="text-slate-500">
              The American Journal of Clinical Nutrition, 2006; 84(3):475-82.
            </p>
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
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "TDEE = BMR × Activity Factor, where BMR (Mifflin-St Jeor) = (10 × weight[kg]) + (6.25 × height[cm]) − (5 × age) + s (s = +5 for males, −161 for females)",
        variables: [
          { symbol: "weight", description: "Body weight in kilograms" },
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
          { symbol: "s", description: "Sex constant (+5 for males, −161 for females)" },
          { symbol: "Activity Factor", description: "Multiplier based on physical activity level" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate TDEE for a 30-year-old female, 65 kg, 165 cm tall, with moderate activity.",
        steps: [
          "Calculate BMR: (10 × 65) + (6.25 × 165) − (5 × 30) − 161 = 650 + 1031.25 − 150 − 161 = 1370.25 kcal",
          "Select activity factor for moderate activity: 1.55",
          "Calculate TDEE: 1370.25 × 1.55 ≈ 2124 kcal",
        ],
        result: "Estimated TDEE is approximately 2124 calories per day.",
      }}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "❤️" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "💧" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "🥗" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "😴" },
      ]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "The Science" },
        { id: "factors", label: "Factors" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}