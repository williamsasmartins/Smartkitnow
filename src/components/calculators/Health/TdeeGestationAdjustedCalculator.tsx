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
      question: "What is gestational TDEE and why does it matter during pregnancy?",
      answer: "Gestational TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns daily while pregnant, including basal metabolic rate and activity level. It matters because adequate calorie intake supports fetal development, maintains maternal health, and helps prevent complications like gestational diabetes and preeclampsia. Consuming too few calories can restrict fetal growth, while excessive intake may lead to excessive weight gain and increased delivery complications.",
    },
    {
      question: "How many extra calories do I need during pregnancy?",
      answer: "The American College of Obstetricians and Gynecologists (ACOG) recommends adding approximately 340 extra calories per day during the second trimester and 450 extra calories per day during the third trimester. First trimester requires no additional calories beyond your pre-pregnancy needs. These estimates vary based on pre-pregnancy BMI, with underweight women potentially needing more and overweight women potentially needing fewer additional calories.",
    },
    {
      question: "How does pre-pregnancy BMI affect calorie requirements during pregnancy?",
      answer: "Pre-pregnancy BMI significantly influences total calorie needs and recommended weight gain. Underweight women (BMI &lt;18.5) typically need higher calorie intake and should gain 28–40 pounds total, normal weight women (BMI 18.5–24.9) should gain 25–35 pounds, overweight women (BMI 25–29.9) should gain 15–25 pounds, and obese women (BMI &gt;30) should gain 11–20 pounds. Your calculator uses your pre-pregnancy BMI to personalize energy expenditure estimates.",
    },
    {
      question: "What is the difference between TDEE and BMR in pregnancy?",
      answer: "Basal Metabolic Rate (BMR) is the number of calories your body burns at rest to maintain basic functions like breathing and circulation, which increases approximately 2–3% during pregnancy. TDEE includes BMR plus calories burned through daily activities and exercise. During pregnancy, TDEE is typically higher than BMR by 20–50% depending on activity level, making TDEE a more accurate measure for determining total daily calorie needs.",
    },
    {
      question: "Can I use a regular TDEE calculator during pregnancy?",
      answer: "No, regular TDEE calculators are not accurate for pregnant women because they don't account for the metabolic changes, fetal energy demands, and increased weight that occur during pregnancy. A gestational TDEE calculator adjusts formulas to include these pregnancy-specific factors, providing a more accurate estimate that supports both maternal and fetal health. Using a non-pregnancy calculator may result in significantly underestimating calorie needs.",
    },
    {
      question: "How does metabolism change during pregnancy?",
      answer: "Pregnancy increases your basal metabolic rate by 15–25% compared to pre-pregnancy levels, peaking in the third trimester as your body works to support fetal development and increased blood volume. This metabolic increase is driven by hormonal changes, increased organ activity, and the energy demands of the growing fetus and placenta. As a result, even sedentary pregnant women burn more calories than they did before pregnancy.",
    },
    {
      question: "What activity level should I select for accurate gestational TDEE results?",
      answer: "Select an activity level that reflects your typical daily routine: sedentary (little to no exercise), lightly active (exercise 1–3 days per week), moderately active (exercise 3–5 days per week), or very active (exercise 6–7 days per week). Be honest about your current activity level during pregnancy, as many women reduce intensity during later trimesters. Your selected activity level multiplies your BMR to estimate total daily calorie expenditure.",
    },
    {
      question: "Is this gestational TDEE calculator medically approved for pregnancy planning?",
      answer: "This calculator is an educational tool based on established formulas from ACOG and research studies, but it is not a substitute for personalized medical advice from your healthcare provider. Individual nutritional needs vary based on health history, multiple pregnancies, metabolic conditions, and other factors. Always consult your obstetrician or registered dietitian for personalized calorie and nutrition recommendations during pregnancy.",
    },
    {
      question: "What should I do if my gestational TDEE seems unusually high or low?",
      answer: "If your calculated TDEE seems off, verify that you entered accurate pre-pregnancy weight, current weight, height, and activity level. Factors like thyroid disorders, PCOS, or being pregnant with multiples can affect actual energy expenditure beyond standard calculations. Discuss unexpected results with your healthcare provider or a registered dietitian who can assess your individual metabolism and adjust recommendations accordingly.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Gestational TDEE Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This gestational TDEE calculator estimates your total daily energy expenditure while pregnant by accounting for metabolic changes, fetal energy demands, and trimester-specific calorie increases. Understanding your TDEE helps you consume adequate nutrition to support fetal development, maintain maternal health, and achieve appropriate weight gain during pregnancy. This calculator is educational and should complement, not replace, guidance from your healthcare provider.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your pre-pregnancy weight, current weight, height, age, and current trimester. Select your typical activity level honestly—sedentary, lightly active, moderately active, or very active—as this significantly affects your total energy needs. Your pre-pregnancy BMI is calculated automatically to personalize the energy expenditure estimate, since calorie needs vary based on whether you began pregnancy underweight, normal weight, overweight, or obese.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs your estimated TDEE, which already includes the recommended trimester-based calorie additions (340 additional calories in trimester 2, 450 in trimester 3). Compare this result to your actual daily intake to assess whether you're consuming enough to support both your health and fetal development. If your TDEE seems unusual or you have underlying metabolic conditions, consult a registered dietitian or your obstetrician for personalized recommendations.</p>
        </div>
      </section>

      {/* TABLE: Recommended Daily Calorie Intake by Trimester and Pre-Pregnancy BMI */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Daily Calorie Intake by Trimester and Pre-Pregnancy BMI</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the estimated daily calorie recommendations across pregnancy trimesters based on pre-pregnancy BMI category.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pre-Pregnancy BMI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1st Trimester</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2nd Trimester</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3rd Trimester</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Weight Gain (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Below 18.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 0 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 340 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 450 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18.5–24.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal Weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 0 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 340 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 450 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–35</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25.0–29.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 0 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 340 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 450 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30.0+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 0 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 340 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add 450 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11–20</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommendations based on 2009 ACOG guidelines; individual needs may vary.</p>
      </section>

      {/* TABLE: Metabolic Rate Changes During Pregnancy */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Metabolic Rate Changes During Pregnancy</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table illustrates how basal metabolic rate and total daily energy expenditure increase across each trimester.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pregnancy Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BMR Increase (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical TDEE Increase (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pre-pregnancy baseline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">First Trimester (0–12 weeks)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hormonal changes, blood volume increase</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Second Trimester (13–26 weeks)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fetal growth, placental development</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Third Trimester (27–40 weeks)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximum fetal demands, maternal organ enlargement</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Increases are relative to pre-pregnancy baseline; individual variation is significant.</p>
      </section>

      {/* TABLE: Calorie Expenditure by Activity Level During Pregnancy */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calorie Expenditure by Activity Level During Pregnancy</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated daily calorie burn multipliers applied to BMR across different activity levels.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BMR Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example Daily Calorie Burn (140 lb woman)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Little or no exercise</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2–1.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800–1,950 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightly Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 1–3 days/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.375–1.425</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,070–2,140 cal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 3–5 days/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.55–1.575</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,330–2,365 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 6–7 days/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.725–1.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,590–2,780 cal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multipliers applied to estimated BMR of 1,500 cal; actual values depend on individual metabolism.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your actual food intake for 3–5 days and compare it to your calculated gestational TDEE to identify whether you're meeting calorie goals; use a food tracking app for accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't attempt to diet or restrict calories during pregnancy—even if overweight pre-pregnancy, aim for appropriate trimester-based weight gain as undereating increases risk of preterm labor and low birth weight.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Recalculate your TDEE monthly as your weight changes, since total daily expenditure increases as you gain pregnancy weight, even if activity level stays the same.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Prioritize nutrient-dense calories from whole grains, lean proteins, healthy fats, and colorful fruits and vegetables rather than high-calorie, low-nutrient processed foods to meet both calorie and micronutrient needs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using pre-pregnancy TDEE throughout pregnancy</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your metabolism and calorie needs change significantly during pregnancy, especially in the second and third trimesters. Using your pre-pregnancy TDEE calculation ignores the additional 340–450 calories needed and can lead to undereating, which restricts fetal growth and increases pregnancy complications.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Entering inaccurate pre-pregnancy weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pre-pregnancy weight is essential for calculating your baseline BMR and determining appropriate weight gain ranges. If you don't remember your exact pre-pregnancy weight, use your weight from your first prenatal visit or ask your healthcare provider, as inaccurate entry skews the entire calculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating activity level</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many pregnant women overestimate their activity level, leading to inflated TDEE calculations and inadequate calorie consumption. Be honest about exercise frequency and intensity—many women reduce activity in the third trimester, so recalculate if your routine changes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring individual metabolic variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator provides estimates based on population averages, but your actual TDEE may differ due to thyroid disorders, PCOS, multiple pregnancy, or genetic factors. If your results don't align with how you feel or your weight gain pattern, consult your healthcare provider rather than relying solely on the calculator.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is gestational TDEE and why does it matter during pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gestational TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns daily while pregnant, including basal metabolic rate and activity level. It matters because adequate calorie intake supports fetal development, maintains maternal health, and helps prevent complications like gestational diabetes and preeclampsia. Consuming too few calories can restrict fetal growth, while excessive intake may lead to excessive weight gain and increased delivery complications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many extra calories do I need during pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The American College of Obstetricians and Gynecologists (ACOG) recommends adding approximately 340 extra calories per day during the second trimester and 450 extra calories per day during the third trimester. First trimester requires no additional calories beyond your pre-pregnancy needs. These estimates vary based on pre-pregnancy BMI, with underweight women potentially needing more and overweight women potentially needing fewer additional calories.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does pre-pregnancy BMI affect calorie requirements during pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pre-pregnancy BMI significantly influences total calorie needs and recommended weight gain. Underweight women (BMI &lt;18.5) typically need higher calorie intake and should gain 28–40 pounds total, normal weight women (BMI 18.5–24.9) should gain 25–35 pounds, overweight women (BMI 25–29.9) should gain 15–25 pounds, and obese women (BMI &gt;30) should gain 11–20 pounds. Your calculator uses your pre-pregnancy BMI to personalize energy expenditure estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between TDEE and BMR in pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Basal Metabolic Rate (BMR) is the number of calories your body burns at rest to maintain basic functions like breathing and circulation, which increases approximately 2–3% during pregnancy. TDEE includes BMR plus calories burned through daily activities and exercise. During pregnancy, TDEE is typically higher than BMR by 20–50% depending on activity level, making TDEE a more accurate measure for determining total daily calorie needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use a regular TDEE calculator during pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, regular TDEE calculators are not accurate for pregnant women because they don't account for the metabolic changes, fetal energy demands, and increased weight that occur during pregnancy. A gestational TDEE calculator adjusts formulas to include these pregnancy-specific factors, providing a more accurate estimate that supports both maternal and fetal health. Using a non-pregnancy calculator may result in significantly underestimating calorie needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does metabolism change during pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pregnancy increases your basal metabolic rate by 15–25% compared to pre-pregnancy levels, peaking in the third trimester as your body works to support fetal development and increased blood volume. This metabolic increase is driven by hormonal changes, increased organ activity, and the energy demands of the growing fetus and placenta. As a result, even sedentary pregnant women burn more calories than they did before pregnancy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activity level should I select for accurate gestational TDEE results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Select an activity level that reflects your typical daily routine: sedentary (little to no exercise), lightly active (exercise 1–3 days per week), moderately active (exercise 3–5 days per week), or very active (exercise 6–7 days per week). Be honest about your current activity level during pregnancy, as many women reduce intensity during later trimesters. Your selected activity level multiplies your BMR to estimate total daily calorie expenditure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is this gestational TDEE calculator medically approved for pregnancy planning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is an educational tool based on established formulas from ACOG and research studies, but it is not a substitute for personalized medical advice from your healthcare provider. Individual nutritional needs vary based on health history, multiple pregnancies, metabolic conditions, and other factors. Always consult your obstetrician or registered dietitian for personalized calorie and nutrition recommendations during pregnancy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my gestational TDEE seems unusually high or low?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your calculated TDEE seems off, verify that you entered accurate pre-pregnancy weight, current weight, height, and activity level. Factors like thyroid disorders, PCOS, or being pregnant with multiples can affect actual energy expenditure beyond standard calculations. Discuss unexpected results with your healthcare provider or a registered dietitian who can assess your individual metabolism and adjust recommendations accordingly.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.acog.org/pregnancy/nutrition-during-pregnancy" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American College of Obstetricians and Gynecologists (ACOG) - Nutrition During Pregnancy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official ACOG guidelines on recommended calorie intake, weight gain targets, and nutritional requirements across all trimesters of pregnancy.</p>
          </li>
          <li>
            <a href="https://ods.od.nih.gov/Life-Stages/Pregnancy-and-Lactation/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institutes of Health (NIH) - Pregnancy and Nutrient Needs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based information on micronutrient requirements, metabolic changes, and energy expenditure during pregnancy from the NIH Office of Dietary Supplements.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/reproductivehealth/maternalinfanthealth/pregnancy-nutrition.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC - Pregnancy Nutrition and Weight Gain</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CDC guidance on appropriate weight gain by pre-pregnancy BMI, calorie needs by trimester, and prevention of pregnancy-related complications through proper nutrition.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy-nutrition/art-20046955" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic - Pregnancy Diet: Focus on These Essential Nutrients</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive clinical resource on calorie requirements, nutrient priorities, and metabolic adjustments needed throughout pregnancy by trimester.</p>
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