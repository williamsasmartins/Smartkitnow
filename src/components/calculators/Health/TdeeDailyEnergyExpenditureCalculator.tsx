import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  AlertCircle,
  Calculator,
  HelpCircle,
  BookOpen,
} from "lucide-react";
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

  // Calculate TDEE using Mifflin-St Jeor Equation + activity factor
  const results = useMemo(() => {
    const ageNum = Number(inputs.age);
    const weightNum = Number(inputs.weight);
    const activityNum = Number(inputs.activity);
    let heightCm = 0;

    if (
      !ageNum ||
      ageNum < 10 ||
      ageNum > 120 ||
      !weightNum ||
      weightNum <= 0 ||
      !activityNum
    ) {
      return { value: 0, label: "" };
    }

    if (unit === "metric") {
      const heightMetricNum = Number(inputs.heightMetric);
      if (!heightMetricNum || heightMetricNum <= 0) return { value: 0, label: "" };
      heightCm = heightMetricNum;
    } else {
      const ft = Number(inputs.heightFt);
      const inch = Number(inputs.heightIn);
      if (
        !ft ||
        ft < 0 ||
        !inch ||
        inch < 0 ||
        inch >= 12 ||
        (ft === 0 && inch === 0)
      )
        return { value: 0, label: "" };
      heightCm = ft * 30.48 + inch * 2.54;
    }

    // Mifflin-St Jeor BMR calculation
    // Male: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
    // Female: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
    let weightKg = weightNum;
    if (unit === "imperial") {
      weightKg = weightNum * 0.45359237;
    }

    let bmr = 0;
    if (inputs.gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const tdee = Math.round(bmr * activityNum);

    return {
      value: tdee,
      label:
        "Estimated Total Daily Energy Expenditure (calories/day) based on your inputs.",
    };
  }, [inputs, unit]);

  // FAQs for SEO and user help
  const faqs = [
    {
      question: "What is Total Daily Energy Expenditure (TDEE)?",
      answer:
        "TDEE is the total number of calories your body burns in a day, including all activities such as resting, working, exercising, and digesting food. It helps determine how many calories you need to maintain, lose, or gain weight.",
    },
    {
      question: "How accurate is the TDEE calculator?",
      answer:
        "This calculator uses the Mifflin-St Jeor equation, which is widely regarded as one of the most accurate formulas for estimating basal metabolic rate (BMR). However, individual variations such as muscle mass, metabolism, and lifestyle can affect accuracy.",
    },
    {
      question: "Why do I need to select my activity level?",
      answer:
        "Activity level adjusts your basal metabolic rate to account for calories burned through physical activity. Selecting the correct activity multiplier ensures a more personalized and accurate TDEE estimate.",
    },
    {
      question: "Can I use this calculator if I use imperial units?",
      answer:
        "Yes, you can switch between metric and imperial units. For imperial units, height is entered as feet and inches to improve accuracy and usability.",
    },
    {
      question: "How can I use my TDEE value?",
      answer:
        "Your TDEE value helps guide your daily calorie intake. To maintain weight, consume calories equal to your TDEE. To lose weight, consume fewer calories than your TDEE, and to gain weight, consume more.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // Reset inputs to defaults
  function onReset() {
    setInputs({
      age: "",
      gender: "male",
      weight: "",
      heightMetric: "",
      heightFt: "",
      heightIn: "",
      activity: "1.2",
    });
  }

  // Widget UI
  const widget = (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Label htmlFor="unit" className="min-w-[80px]">
          Units
        </Label>
        <Select
          value={unit}
          onValueChange={(val) => {
            setUnit(val);
            setInputs({
              age: "",
              gender: "male",
              weight: "",
              heightMetric: "",
              heightFt: "",
              heightIn: "",
              activity: "1.2",
            });
          }}
          name="unit"
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            name="age"
            type="number"
            min={10}
            max={120}
            value={inputs.age}
            onChange={onInputChange}
            placeholder="e.g. 30"
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            id="gender"
            name="gender"
            value={inputs.gender}
            onValueChange={(val) => setInputs((prev) => ({ ...prev, gender: val }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="weight">
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min={1}
            value={inputs.weight}
            onChange={onInputChange}
            placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
          />
        </div>

        {unit === "metric" ? (
          <div>
            <Label htmlFor="heightMetric">Height (cm)</Label>
            <Input
              id="heightMetric"
              name="heightMetric"
              type="number"
              min={30}
              max={300}
              value={inputs.heightMetric}
              onChange={onInputChange}
              placeholder="e.g. 175"
            />
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="heightFt">Height (ft)</Label>
              <Input
                id="heightFt"
                name="heightFt"
                type="number"
                min={0}
                max={8}
                value={inputs.heightFt}
                onChange={onInputChange}
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <Label htmlFor="heightIn">Height (inches)</Label>
              <Input
                id="heightIn"
                name="heightIn"
                type="number"
                min={0}
                max={11}
                value={inputs.heightIn}
                onChange={onInputChange}
                placeholder="e.g. 10"
              />
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <Label htmlFor="activity">Activity Level</Label>
          <Select
            id="activity"
            name="activity"
            value={inputs.activity}
            onValueChange={(val) => setInputs((prev) => ({ ...prev, activity: val }))}
          >
            <SelectTrigger>
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
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
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
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Result
              </p>
              <p className="text-4xl font-extrabold text-blue-900 dark:text-blue-50">
                {results.value} kcal/day
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                {results.label}
              </p>
            </CardContent>
          </Card>
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>Disclaimer: This is for informational purposes only.</p>
          </div>
        </div>
      ) : null}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The Total Daily Energy Expenditure (TDEE) calculator estimates the total
          number of calories your body burns in a day, factoring in your basal
          metabolic rate (BMR) and your physical activity level. To use this
          calculator, start by selecting your preferred unit system: metric (kilograms
          and centimeters) or imperial (pounds, feet, and inches). Enter your age,
          gender, weight, and height accordingly. Then, select your typical activity
          level from sedentary to extra active. Once all inputs are provided, the
          calculator will estimate your daily calorie needs to maintain your current
          weight. This information is valuable for planning diets, weight loss, or
          muscle gain programs. Remember, the calculator provides an estimate and
          individual needs may vary.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          The Science
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The TDEE calculation is based on the Mifflin-St Jeor equation, a widely
          accepted formula for estimating basal metabolic rate (BMR), which is the
          number of calories your body requires at rest to maintain vital functions
          such as breathing, circulation, and cell production. The equation differs
          slightly for males and females to account for physiological differences.
          Once BMR is calculated, it is multiplied by an activity factor that
          represents your daily physical activity level, ranging from sedentary to
          very active. This multiplier adjusts the calorie estimate to reflect energy
          expended during exercise, work, and other activities. The final TDEE value
          represents the total calories you burn in a day, providing a foundation for
          dietary planning. While the formula is robust, it is an estimate and may
          not capture individual metabolic variations.
        </p>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Factors Affecting Results
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Age:</strong> Metabolic rate generally decreases with age due to
            loss of muscle mass and hormonal changes.
          </li>
          <li>
            <strong>Gender:</strong> Men typically have higher muscle mass, leading to
            higher BMR compared to women.
          </li>
          <li>
            <strong>Body Composition:</strong> Muscle burns more calories than fat,
            so individuals with higher muscle mass have higher TDEE.
          </li>
          <li>
            <strong>Physical Activity Level:</strong> More active individuals burn
            more calories daily.
          </li>
          <li>
            <strong>Genetics and Metabolism:</strong> Some people naturally have
            faster or slower metabolisms, affecting calorie needs.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          FAQ
        </h2>
        <ul className="space-y-4">
          {faqs.map((item, i) => (
            <li key={i}>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {item.question}
              </h3>
              <p className="text-slate-700 dark:text-slate-300">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <ul className="space-y-4">
          <li className="mb-4">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/11883538/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              Scientific Reference
            </a>
            <p className="text-slate-500">
              Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new
              predictive equation for resting energy expenditure in healthy individuals.
              Am J Clin Nutr. 1990;51(2):241-7.
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
          "TDEE = BMR × Activity Factor, where BMR (Mifflin-St Jeor) = 10 × weight (kg) + 6.25 × height (cm) - 5 × age (years) + s (s = +5 for males, -161 for females)",
        variables: [
          { symbol: "weight", description: "Body weight in kilograms" },
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
          { symbol: "s", description: "Gender constant (+5 for males, -161 for females)" },
          { symbol: "Activity Factor", description: "Multiplier based on activity level" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate TDEE for a 30-year-old female, 65 kg, 170 cm tall, moderately active.",
        steps: [
          "Calculate BMR: 10 × 65 + 6.25 × 170 - 5 × 30 - 161 = 650 + 1062.5 - 150 - 161 = 1401.5 kcal",
          "Select activity factor for moderately active: 1.55",
          "Calculate TDEE: 1401.5 × 1.55 ≈ 2172 kcal/day",
        ],
        result: "Estimated TDEE is approximately 2172 calories per day.",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "❤️",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "💧",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "🥗",
        },
        {
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "😴",
        },
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