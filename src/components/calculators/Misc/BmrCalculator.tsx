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

export default function BmrCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper: Validate inputs
  const isValidInput = useMemo(() => {
    const ageNum = Number(inputs.age);
    const heightNum = Number(inputs.height);
    const weightNum = Number(inputs.weight);
    return (
      inputs.gender &&
      !isNaN(ageNum) && ageNum > 0 && ageNum < 120 &&
      !isNaN(heightNum) && heightNum > 30 && heightNum < 300 &&
      !isNaN(weightNum) && weightNum > 2 && weightNum < 700
    );
  }, [inputs]);

  // BMR calculation using Mifflin-St Jeor Equation (most accurate and widely recommended)
  // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5
  // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161
  const results = useMemo(() => {
    if (!isValidInput) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid inputs to calculate your BMR.",
        warning: null,
        formulaUsed: "Mifflin-St Jeor Equation",
      };
    }

    const age = Number(inputs.age);
    const height = Number(inputs.height);
    const weight = Number(inputs.weight);
    const gender = inputs.gender;

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Round to nearest whole number
    const roundedBmr = Math.round(bmr);

    return {
      value: `${roundedBmr} kcal/day`,
      label: "Your Basal Metabolic Rate",
      subtext:
        "This is the estimated number of calories your body needs at rest to maintain vital functions such as breathing, circulation, and cell production.",
      warning: null,
      formulaUsed: "Mifflin-St Jeor Equation",
    };
  }, [inputs, isValidInput]);

  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR)?",
      answer: "BMR is the number of calories your body burns at rest to maintain basic functions like breathing, circulation, and cell production. It represents your minimum daily calorie requirement without any physical activity.",
    },
    {
      question: "How does the BMR calculator determine my results?",
      answer: "The calculator uses the Mifflin-St Jeor equation, which factors in your age, weight, height, and sex to estimate how many calories you burn daily at rest. This method is more accurate than older formulas like the Harris-Benedict equation.",
    },
    {
      question: "Why is my BMR different from my TDEE (Total Daily Energy Expenditure)?",
      answer: "BMR only accounts for calories burned at rest, while TDEE includes additional calories burned through exercise and daily activities. Your TDEE is typically 1.2 to 1.9 times your BMR depending on activity level.",
    },
    {
      question: "Does BMR change as I age?",
      answer: "Yes, BMR typically decreases by 2-8% per decade after age 30 due to loss of muscle mass. This is why weight management becomes more challenging with age.",
    },
    {
      question: "Can I use this calculator if I'm very overweight or obese?",
      answer: "The standard BMR calculator works best for individuals within normal weight ranges; for obese individuals, it may overestimate calorie burn. Consider consulting a healthcare provider for personalized metabolic assessments.",
    },
    {
      question: "How accurate is this BMR calculator?",
      answer: "The Mifflin-St Jeor equation is accurate within ±10-20% for most people, making it one of the most reliable methods. Individual variations in metabolism can affect actual results.",
    },
    {
      question: "Should I eat exactly my BMR calories per day?",
      answer: "No, you should eat above your BMR to account for daily activities and exercise. Eating at or below your BMR can slow metabolism and cause muscle loss.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                min={1}
                max={120}
                placeholder="e.g., 30"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(v) => handleInputChange("gender", v)}
                value={inputs.gender}
                aria-label="Select gender"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    Male <MaleIcon />
                  </SelectItem>
                  <SelectItem value="female">
                    Female <FemaleIcon />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                min={30}
                max={300}
                placeholder="e.g., 170"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min={2}
                max={700}
                placeholder="e.g., 65"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            if (!isValidInput) {
              alert(
                "Please enter valid inputs for age, gender, height, and weight before calculating."
              );
            }
          }}
        >
          <Scale className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              gender: "",
              height: "",
              weight: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 max-w-md mx-auto">
              {results.subtext}
            </p>
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">
              Formula used: {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Basal Metabolic Rate (BMR) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The BMR Calculator estimates the number of calories your body burns at complete rest. This baseline metabolic rate is essential for understanding your nutrition needs and weight management goals.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your age, biological sex, height (in cm or inches), and current weight (in kg or lbs) into the calculator. The tool uses the Mifflin-St Jeor equation, the gold standard for BMR estimation, to compute your results instantly.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your result shows your daily resting calorie burn. To determine your actual daily needs, multiply your BMR by your activity level factor (1.2 for sedentary to 1.9 for very active). Use this number as your baseline for weight loss, maintenance, or gain strategies.</p>
        </div>
      </section>

      {/* TABLE: Average BMR by Age and Sex (in calories per day) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average BMR by Age and Sex (in calories per day)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated BMR ranges for sedentary adults based on typical weight and height.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Male BMR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Female BMR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,700-1,900 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,400-1,600 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30-40 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,650-1,850 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,350-1,550 cal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40-50 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,600-1,800 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,300-1,500 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50-60 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,550-1,750 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,250-1,450 cal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500-1,700 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,200-1,400 cal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values assume average weight (70kg/154lbs for males, 60kg/132lbs for females) and height (175cm/5'9" for males, 162cm/5'4" for females).</p>
      </section>

      {/* TABLE: Daily Calorie Intake by Activity Level */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Intake by Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Multiply your BMR by the activity factor below to find your total daily calorie needs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calorie Multiplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary (little to no exercise)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightly active (1-3 days/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.375</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately active (3-5 days/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.55</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very active (6-7 days/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.725</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extremely active (2x per day training)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">BMR × 1.9</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These multipliers represent the Harris-Benedict activity factors widely used in nutrition science.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh yourself consistently at the same time each day for the most accurate BMR calculation, as body weight fluctuates throughout the day.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Muscle tissue burns more calories at rest than fat tissue, so strength training increases your BMR over time.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your BMR periodically as you age, since it naturally declines; recalculate annually for ongoing accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine your BMR results with a food tracking app to ensure you're eating enough to support your metabolism and health goals.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Body Fat Percentage Incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Standard BMR calculators don't account for body composition; two people with identical stats but different muscle-to-fat ratios will have different actual metabolisms.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing BMR with TDEE</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people eat at their BMR calories, which is too restrictive; you must add activity calories on top of BMR for a sustainable diet.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Changes with Age and Weight Loss</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">BMR decreases as you lose weight and age, so recalculating every 10-20 pounds lost prevents overestimating your calorie needs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Metabolism is Fixed</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Severe calorie restriction, hormonal changes, and medical conditions can suppress BMR, making real-world results differ from calculations.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is Basal Metabolic Rate (BMR)?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMR is the number of calories your body burns at rest to maintain basic functions like breathing, circulation, and cell production. It represents your minimum daily calorie requirement without any physical activity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the BMR calculator determine my results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses the Mifflin-St Jeor equation, which factors in your age, weight, height, and sex to estimate how many calories you burn daily at rest. This method is more accurate than older formulas like the Harris-Benedict equation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is my BMR different from my TDEE (Total Daily Energy Expenditure)?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMR only accounts for calories burned at rest, while TDEE includes additional calories burned through exercise and daily activities. Your TDEE is typically 1.2 to 1.9 times your BMR depending on activity level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does BMR change as I age?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, BMR typically decreases by 2-8% per decade after age 30 due to loss of muscle mass. This is why weight management becomes more challenging with age.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator if I'm very overweight or obese?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard BMR calculator works best for individuals within normal weight ranges; for obese individuals, it may overestimate calorie burn. Consider consulting a healthcare provider for personalized metabolic assessments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this BMR calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Mifflin-St Jeor equation is accurate within ±10-20% for most people, making it one of the most reliable methods. Individual variations in metabolism can affect actual results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I eat exactly my BMR calories per day?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, you should eat above your BMR to account for daily activities and exercise. Eating at or below your BMR can slow metabolism and cause muscle loss.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://academic.oup.com/ajcn/article-abstract/51/2/241/4695477" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mifflin-St Jeor Equation - American Journal of Clinical Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The peer-reviewed study validating the Mifflin-St Jeor equation as the most accurate BMR prediction method for diverse populations.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/books/NBK557845/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Basal Metabolic Rate - National Institutes of Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive NIH resource explaining BMR physiology, measurement methods, and clinical applications in metabolism research.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/expert-answers/weight-loss-plateau/faq-20058124" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Weight Loss and Metabolic Adaptation - Mayo Clinic</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mayo Clinic guidance on how metabolism adapts during weight loss and strategies to maintain metabolic rate.</p>
          </li>
          <li>
            <a href="https://www.eatright.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Activity Factors and TDEE Calculation - Academy of Nutrition and Dietetics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional nutrition organization providing evidence-based standards for converting BMR to total daily energy expenditure using activity multipliers.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // Icons for gender select items (simple SVG inline for accessibility)
  function MaleIcon() {
    return <Male className="inline-block ml-1 w-4 h-4 text-blue-600" />;
  }
  function FemaleIcon() {
    return <Users className="inline-block ml-1 w-4 h-4 text-pink-600" />;
  }

  return (
    <CalculatorVerticalLayout
      title="Basal Metabolic Rate (BMR) Calculator"
      description="Calculate everyday BMR. Find out the minimum calories your body needs to function before adding any physical activity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5; For women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161",
        variables: [
          { symbol: "weight", description: "Your weight in kilograms" },
          { symbol: "height", description: "Your height in centimeters" },
          { symbol: "age", description: "Your age in years" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 35-year-old female who weighs 68 kg and is 165 cm tall wants to know her BMR.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input age as 35, select gender as female, height as 165 cm, and weight as 68 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Click 'Calculate' to compute BMR using the Mifflin-St Jeor Equation.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator returns a BMR of approximately 1460 kcal/day, indicating the calories needed at rest.",
          },
        ],
        result:
          "This means the woman requires about 1460 calories daily to maintain vital bodily functions at rest.",
      }}
      relatedCalculators={[
        {
          title: "Refrigerator/Freezer Safe Zone Time Window",
          url: "/everyday/refrigerator-freezer-safe-zone-time-window",
          icon: "💡",
        },
        {
          title: "Room Air Changes per Hour (ACH) Calculator",
          url: "/everyday/room-air-changes-ach",
          icon: "💡",
        },
        {
          title: "Coffee Urn Yield & Strength Calculator",
          url: "/everyday/coffee-urn-yield-strength",
          icon: "💡",
        },
        {
          title: "Buffet Serving Pan Capacity & Count",
          url: "/everyday/buffet-pan-capacity-count",
          icon: "💡",
        },
        {
          title: "Cleaning Dilution Ratio Calculator",
          url: "/everyday/cleaning-dilution-ratio",
          icon: "🏠",
        },
        {
          title: "Hydration Reminder Interval Planner",
          url: "/everyday/hydration-reminder-interval",
          icon: "💡",
        },
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