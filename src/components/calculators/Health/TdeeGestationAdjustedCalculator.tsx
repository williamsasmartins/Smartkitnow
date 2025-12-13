import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TdeeGestationAdjustedCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "", // lbs or kg
    heightFeet: "", // feet (imperial only)
    heightInches: "", // inches (imperial only)
    heightCm: "", // cm (metric only)
    age: "", // years
    activityLevel: "sedentary",
    trimester: "2", // 1, 2, or 3
  });

  // Activity multipliers based on common TDEE multipliers
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  // Gestational calorie increase per trimester (approximate)
  // Based on Health Canada and ACOG guidelines:
  // 1st trimester: no increase or minimal (~0 kcal)
  // 2nd trimester: +340 kcal/day
  // 3rd trimester: +452 kcal/day
  const trimesterCalories: Record<string, number> = {
    "1": 0,
    "2": 340,
    "3": 452,
  };

  // 2. LOGIC
  const results = useMemo(() => {
    // Validate inputs
    const weightNum = parseFloat(inputs.weight);
    const ageNum = parseInt(inputs.age);
    let heightCmNum = 0;

    if (
      !weightNum ||
      weightNum <= 0 ||
      !ageNum ||
      ageNum < 14 || // pregnancy usually from teens up
      ageNum > 50
    ) {
      return { value: 0, label: "Please enter valid weight and age", category: "" };
    }

    if (unit === "imperial") {
      const feetNum = parseInt(inputs.heightFeet);
      const inchesNum = parseInt(inputs.heightInches);
      if (
        !feetNum ||
        feetNum <= 0 ||
        feetNum > 8 ||
        inchesNum === undefined ||
        inchesNum < 0 ||
        inchesNum >= 12
      ) {
        return { value: 0, label: "Please enter valid height", category: "" };
      }
      heightCmNum = (feetNum * 12 + inchesNum) * 2.54;
    } else {
      const cmNum = parseFloat(inputs.heightCm);
      if (!cmNum || cmNum < 100 || cmNum > 250) {
        return { value: 0, label: "Please enter valid height", category: "" };
      }
      heightCmNum = cmNum;
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum * 0.45359237 : weightNum;

    // Mifflin-St Jeor Equation for BMR (women)
    // BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161
    const bmr = 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum - 161;

    // Activity multiplier
    const activityMultiplier = activityMultipliers[inputs.activityLevel] || 1.2;

    // Base TDEE before pregnancy adjustment
    const baseTDEE = bmr * activityMultiplier;

    // Add gestational calorie increase based on trimester
    const gestationalIncrease = trimesterCalories[inputs.trimester] || 0;

    // Final Gestational TDEE rounded to nearest kcal
    const gestationalTDEE = Math.round(baseTDEE + gestationalIncrease);

    return {
      value: gestationalTDEE,
      label: "Estimated Gestational TDEE (kcal/day)",
      category: `Trimester ${inputs.trimester}`,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is Gestational TDEE and why is it important?",
      answer:
        "Gestational Total Daily Energy Expenditure (TDEE) estimates the total calories a pregnant person needs daily, accounting for basal metabolism, physical activity, and the additional energy demands of pregnancy. Proper estimation helps ensure adequate nutrition for fetal growth and maternal health, reducing risks of complications such as low birth weight or excessive weight gain.",
    },
    {
      question: "How should I interpret my Gestational TDEE result?",
      answer:
        "The calculated Gestational TDEE represents an estimate of daily calorie needs during pregnancy for your specific trimester, activity level, and body metrics. It guides nutritional intake to support healthy fetal development and maternal well-being. However, individual needs may vary, so consult a healthcare provider for personalized advice.",
    },
    {
      question: "What are the limitations of this calculator?",
      answer:
        "This calculator provides an educational estimate based on population averages and standard formulas. It does not account for individual metabolic differences, pregnancy complications, or multiple gestations (twins, triplets). It should not replace professional medical or nutritional advice.",
    },
    {
      question: "Why does the calorie increase vary by trimester?",
      answer:
        "Energy requirements increase as pregnancy progresses due to fetal growth and maternal tissue development. The first trimester typically requires minimal additional calories, while the second and third trimesters see significant increases to support rapid fetal growth and prepare for lactation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(field: string, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  // Reset inputs to defaults
  function resetInputs() {
    setInputs({
      weight: "",
      heightFeet: "",
      heightInches: "",
      heightCm: "",
      age: "",
      activityLevel: "sedentary",
      trimester: "2",
    });
  }

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

        {/* Weight */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={1}
            max={1000}
            step="any"
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            className="max-w-xs"
          />
        </div>

        {/* Height */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={1}
                max={8}
                step={1}
                value={inputs.heightFeet}
                onChange={(e) => handleInputChange("heightFeet", e.target.value)}
                placeholder="5"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                step={1}
                value={inputs.heightInches}
                onChange={(e) => handleInputChange("heightInches", e.target.value)}
                placeholder="7"
              />
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={100}
              max={250}
              step="any"
              value={inputs.heightCm}
              onChange={(e) => handleInputChange("heightCm", e.target.value)}
              placeholder="e.g. 170"
              className="max-w-xs"
            />
          </div>
        )}

        {/* Age */}
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={14}
            max={50}
            step={1}
            value={inputs.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="e.g. 28"
            className="max-w-xs"
          />
        </div>

        {/* Activity Level */}
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            value={inputs.activityLevel}
            onValueChange={(val) => handleInputChange("activityLevel", val)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
              <SelectItem value="veryActive">Very active (very hard exercise & physical job)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trimester */}
        <div>
          <Label htmlFor="trimester" className="text-slate-700 dark:text-slate-300">
            Pregnancy Trimester
          </Label>
          <Select
            id="trimester"
            value={inputs.trimester}
            onValueChange={(val) => handleInputChange("trimester", val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Trimester (Weeks 1-12)</SelectItem>
              <SelectItem value="2">2nd Trimester (Weeks 13-26)</SelectItem>
              <SelectItem value="3">3rd Trimester (Weeks 27-40)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
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
          What is the Gestational TDEE (educational)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Gestational Total Daily Energy Expenditure (TDEE) refers to the total number of calories a pregnant person requires each day to maintain their own bodily functions, support physical activity, and provide the additional energy necessary for fetal growth and development. Unlike standard TDEE calculations, gestational TDEE accounts for the increased metabolic demands of pregnancy, which vary by trimester as the fetus grows and maternal tissues develop.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          During pregnancy, energy needs increase progressively, especially in the second and third trimesters. This increase supports the formation of the placenta, amniotic fluid, maternal fat stores, and the growing fetus. Accurately estimating gestational TDEE is crucial for ensuring adequate maternal nutrition, which can influence pregnancy outcomes such as birth weight, gestational age, and maternal health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses the Mifflin-St Jeor equation to estimate basal metabolic rate (BMR), adjusts for physical activity level, and then adds trimester-specific calorie increments recommended by leading health authorities. It is designed as an educational tool to help pregnant individuals and healthcare providers understand energy needs during pregnancy but should not replace personalized medical advice.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding gestational TDEE can help guide dietary planning to meet increased nutritional demands, prevent excessive or inadequate weight gain, and promote optimal health for both mother and baby. It is important to consider individual factors such as pre-pregnancy weight, metabolic health, and activity levels when interpreting results.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your Gestational TDEE, enter your current weight, height, age, activity level, and select your current pregnancy trimester. The calculator will use these inputs to estimate your daily calorie needs, including the additional energy required for your pregnancy stage.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight:</strong> Enter your current body weight. Use pounds if you selected Imperial units or kilograms for Metric.
          </li>
          <li>
            <strong>Height:</strong> Enter your height. For Imperial units, input feet and inches separately; for Metric, enter centimeters.
          </li>
          <li>
            <strong>Age:</strong> Enter your age in years. This helps adjust basal metabolic rate calculations.
          </li>
          <li>
            <strong>Activity Level:</strong> Select the option that best describes your typical daily physical activity, from sedentary to very active.
          </li>
          <li>
            <strong>Trimester:</strong> Choose your current pregnancy trimester to apply the appropriate calorie increase.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering all information, click "Calculate" to see your estimated Gestational TDEE. Use this number as a guide for daily calorie intake to support a healthy pregnancy.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Trusted References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American College of Obstetricians and Gynecologists (ACOG) - Nutrition During Pregnancy
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative guidelines on nutritional needs and calorie requirements during pregnancy.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/healthy-pregnancy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Health Canada - Healthy Pregnancy Nutrition
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Canadian government resource detailing dietary recommendations and energy needs for pregnant individuals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nal.usda.gov/fnic/dietary-reference-intakes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Academies of Sciences, Engineering, and Medicine - Dietary Reference Intakes
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive nutrient and energy intake recommendations including pregnancy-specific adjustments.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/24529832/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Institute of Medicine (US) - Weight Gain During Pregnancy: Reexamining the Guidelines (2009)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Evidence-based guidelines on energy needs and weight gain patterns during pregnancy.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Gestational TDEE (educational)"
      description="Estimate energy needs during pregnancy. Calculate adjusted TDEE to ensure adequate nutrition for fetal development and maternal health."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Gestational TDEE = (BMR × Activity Factor) + Trimester Calorie Increase",
        variables: [
          { symbol: "BMR", description: "Basal Metabolic Rate calculated by Mifflin-St Jeor equation" },
          { symbol: "Activity Factor", description: "Multiplier based on physical activity level" },
          { symbol: "Trimester Calorie Increase", description: "Additional calories required per trimester (0, 340, or 452 kcal)" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 28-year-old pregnant woman in her 2nd trimester weighs 150 lbs, is 5 ft 7 in tall, and has a moderately active lifestyle.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate BMR using Mifflin-St Jeor: BMR = (10 × 68.04 kg) + (6.25 × 170 cm) − (5 × 28) − 161 = 1460 kcal/day",
          },
          {
            label: "Step 2",
            explanation:
              "Multiply BMR by activity factor for moderate activity (1.55): 1460 × 1.55 = 2263 kcal/day",
          },
          {
            label: "Step 3",
            explanation:
              "Add 2nd trimester calorie increase (340 kcal): 2263 + 340 = 2603 kcal/day",
          },
        ],
        result: "Estimated Gestational TDEE is approximately 2603 kcal/day.",
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
        { id: "what-is", label: "What is Gestational TDEE (educational)?" },
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