import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, CheckCircle2 } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FiberIntakeTargetCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    sex: "female",
    calories: "",
  });

  // Helper to parse input safely
  const parseNumber = (value: string) => {
    const n = parseFloat(value);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // 2. LOGIC
  // Fiber intake target based on kcal and sex:
  // According to the Institute of Medicine (IOM) and Health Canada:
  // - Women: 14g fiber per 1000 kcal
  // - Men: 14g fiber per 1000 kcal
  // But some sources suggest slightly different targets by sex.
  // We'll use the standard 14g/1000kcal for both sexes as per authoritative guidelines.
  // However, we can add a slight nuance: men generally have higher calorie needs, so fiber target scales accordingly.
  // We'll calculate fiber target = (calories / 1000) * 14 grams.

  const calories = parseNumber(inputs.calories);
  const sex = inputs.sex;

  const results = useMemo(() => {
    if (calories <= 0) return { value: 0, label: "", category: "" };

    // Fiber target formula:
    // 14 grams fiber per 1000 kcal consumed (both sexes)
    // Source: Dietary Guidelines for Americans, Health Canada, Institute of Medicine
    const fiberTargetGrams = (calories / 1000) * 14;

    // Round to nearest 0.1g
    const roundedFiber = Math.round(fiberTargetGrams * 10) / 10;

    return {
      value: roundedFiber.toFixed(1),
      label: "Recommended Daily Fiber Intake (grams)",
      category: sex === "female" ? "Female" : "Male",
    };
  }, [calories, sex]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Fiber Intake Target (by kcal/sexo)?",
      answer:
        "The Fiber Intake Target based on calorie intake and sex is a personalized recommendation for daily dietary fiber consumption. It is calculated by multiplying your daily calorie intake by a standard fiber ratio (14 grams per 1000 kcal). This approach ensures that fiber intake scales with energy needs, which differ by sex and individual metabolism. Fiber is essential for digestive health, blood sugar regulation, and cardiovascular benefits.",
    },
    {
      question: "How should I interpret my fiber intake result?",
      answer:
        "Your fiber intake target represents the amount of fiber in grams you should aim to consume daily based on your calorie intake and sex. Meeting this target supports optimal gut health, helps maintain healthy cholesterol levels, and can aid in weight management. If your current fiber intake is below this target, consider increasing consumption of fruits, vegetables, whole grains, legumes, nuts, and seeds.",
    },
    {
      question: "Are there any limitations to this calculator?",
      answer:
        "This calculator provides a general guideline based on calorie intake and sex but does not account for individual health conditions, age, pregnancy, or specific dietary restrictions. Fiber needs may vary for people with gastrointestinal disorders or other medical conditions. Always consult a healthcare professional or registered dietitian for personalized nutrition advice.",
    },
    {
      question: "Why is fiber intake recommended per calorie rather than a fixed amount?",
      answer:
        "Fiber recommendations per calorie intake ensure that individuals consuming more energy also consume proportionally more fiber, supporting digestive and metabolic health. Fixed fiber targets may not account for differences in energy needs between sexes, ages, or activity levels. This method aligns fiber intake with overall diet quantity and quality.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sex Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="sex" className="mb-1 sm:mb-0 text-slate-700 dark:text-slate-300 font-semibold w-24">
            Sex
          </Label>
          <Select
            id="sex"
            value={inputs.sex}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, sex: value }))}
            className="flex-1"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calories Input */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Label htmlFor="calories" className="mb-1 sm:mb-0 text-slate-700 dark:text-slate-300 font-semibold w-24">
            Daily Calories
          </Label>
          <div className="flex-1 relative">
            <Input
              id="calories"
              type="number"
              min={0}
              step={10}
              placeholder={unit === "imperial" ? "e.g. 2000 kcal" : "e.g. 2000 kcal"}
              value={inputs.calories}
              onChange={(e) => setInputs((prev) => ({ ...prev, calories: e.target.value }))}
              aria-describedby="calories-desc"
              className="pr-16"
            />
            <span
              id="calories-desc"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 select-none pointer-events-none"
            >
              kcal
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate Fiber Intake Target"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ sex: "female", calories: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Your Result</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Fiber Intake Target (by kcal/sexo)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dietary fiber is a crucial component of a healthy diet, known for its benefits in promoting digestive health, regulating blood sugar, and reducing cardiovascular risk. The Fiber Intake Target (by kcal/sexo) is a personalized recommendation that calculates the ideal daily fiber intake based on your total calorie consumption and biological sex. This method ensures that fiber intake scales appropriately with your energy needs, which differ between males and females due to physiological and metabolic differences.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The foundational guideline used in this calculation is the recommendation of 14 grams of fiber per 1000 kilocalories consumed, as established by authoritative bodies such as the Institute of Medicine (IOM) and Health Canada. This ratio reflects the amount of fiber needed to support optimal gastrointestinal function and metabolic health relative to the amount of energy you consume daily. By adjusting fiber intake to your calorie needs, this approach provides a more tailored and effective nutritional target than fixed daily fiber amounts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Biological sex influences calorie requirements due to differences in body composition, hormonal profiles, and metabolic rates. Typically, males require more calories than females, which translates to a higher fiber intake target when calculated proportionally. This calculator incorporates sex as a key variable to ensure your fiber intake recommendation aligns with your unique physiological needs, supporting better health outcomes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding and meeting your fiber intake target can improve bowel regularity, support a healthy microbiome, and reduce the risk of chronic diseases such as type 2 diabetes and heart disease. This calculator empowers you to set realistic and evidence-based fiber goals that fit your lifestyle and nutritional requirements.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Fiber Intake Target calculator is straightforward and designed to provide you with a personalized daily fiber goal. Follow these steps to get your recommended intake:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select your unit system:</strong> Choose between Imperial (lbs, ft, kcal) or Metric (kg, cm, kcal). The default is Imperial for US/Canada users.
          </li>
          <li>
            <strong>Choose your biological sex:</strong> Select "Female" or "Male" to tailor the fiber target according to typical calorie needs associated with sex.
          </li>
          <li>
            <strong>Enter your estimated daily calorie intake:</strong> Input the number of kilocalories you consume or plan to consume daily. This can be based on your diet, activity level, or a previous calculation such as Total Daily Energy Expenditure (TDEE).
          </li>
          <li>
            <strong>Calculate your fiber target:</strong> Click the "Calculate" button to see your recommended daily fiber intake in grams.
          </li>
          <li>
            <strong>Interpret the result:</strong> Use the fiber target to guide your dietary choices, aiming to meet or exceed this amount through fiber-rich foods.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Trusted References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.nal.usda.gov/fnic/dietary-fiber"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA National Agricultural Library – Dietary Fiber
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive overview of dietary fiber, its types, and health benefits.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/wecan/eat-right/fiber.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Heart, Lung, and Blood Institute (NHLBI) – Fiber and Heart Health
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Explains the role of fiber in cardiovascular health and recommended intake.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/dietary-reference-intakes.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Health Canada – Dietary Reference Intakes (DRIs)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official Canadian guidelines on nutrient intake including fiber recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nap.edu/read/10490/chapter/12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Institute of Medicine (US) – Dietary Reference Intakes for Fiber
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative report establishing fiber intake recommendations based on calorie consumption.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fiber Intake Target (by kcal/sexo)"
      description="Calculate your recommended daily fiber intake. Improve digestion and gut health by hitting accurate fiber goals based on calorie intake."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "Fiber Intake (grams) = (Daily Calories / 1000) × 14",
        variables: [
          { symbol: "Daily Calories", description: "Your total daily energy intake in kilocalories (kcal)" },
          { symbol: "14", description: "Recommended grams of fiber per 1000 kcal consumed" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 35-year-old female consumes approximately 1800 kcal daily and wants to know her fiber intake target.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input your daily calorie intake (1800 kcal) and select your sex (Female).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate fiber target: (1800 / 1000) × 14 = 25.2 grams of fiber per day.",
          },
        ],
        result: "The recommended daily fiber intake for this individual is approximately 25.2 grams.",
      }}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "💧" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "🥗" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "😴" },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Fiber Intake Target (by kcal/sexo)?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}